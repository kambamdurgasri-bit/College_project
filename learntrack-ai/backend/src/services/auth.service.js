import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { db } from '../../prisma/db.ts';

const SALT_ROUNDS = 10;
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

export async function findUserByEmail(email) {
  return db.orm.public.Users.where({ email }).first();
}

export async function createUser({ name, email, password, phoneNumber }) {
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  return db.orm.public.Users
    .select('id', 'name', 'email', 'phoneNumber')
    .create({ name, email, passwordHash, phoneNumber: phoneNumber ?? null });
}

export async function verifyPassword(plainPassword, passwordHash) {
  return bcrypt.compare(plainPassword, passwordHash);
}

export function generateToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

export async function createPasswordResetToken(userId) {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);
  await db.orm.public.PasswordResets.create({ userId, token, expiresAt });
  return token;
}

export async function findValidResetToken(token) {
  const record = await db.orm.public.PasswordResets.where({ token }).first();
  if (!record) return null;
  if (new Date(record.expiresAt) < new Date()) return null;
  return record;
}

export async function consumeResetToken(token) {
  await db.orm.public.PasswordResets.where({ token }).delete();
}

export async function updateUserPassword(userId, newPassword) {
  const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
  return db.orm.public.Users.where({ id: userId }).update({ passwordHash });
}
