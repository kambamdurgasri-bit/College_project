import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import db from '../lib/db.js';

const SALT_ROUNDS = 10;
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

function normalizeUser(row) {
  if (!row) return null;
  return {
    ...row,
    passwordHash: row.password_hash ?? row.passwordHash,
    phoneNumber: row.phone_number ?? row.phoneNumber,
  };
}

export async function findUserByEmail(email) {
  const { rows } = await db.query(
    'SELECT * FROM users WHERE email = $1 LIMIT 1',
    [email]
  );
  return normalizeUser(rows[0]);
}

export async function createUser({ name, email, password, phoneNumber }) {
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const { rows } = await db.query(
    `INSERT INTO users (name, email, password_hash, phone_number)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, phone_number AS "phoneNumber"`,
    [name, email, passwordHash, phoneNumber ?? null]
  );

  const user = rows[0];
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phoneNumber: user.phoneNumber,
  };
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
  await db.query(
    'INSERT INTO password_resets (user_id, token, expires_at) VALUES ($1, $2, $3)',
    [userId, token, expiresAt]
  );
  return token;
}

export async function findValidResetToken(token) {
  const { rows } = await db.query(
    'SELECT * FROM password_resets WHERE token = $1 LIMIT 1',
    [token]
  );

  const record = rows[0];
  if (!record) return null;
  if (new Date(record.expires_at) < new Date()) return null;
  return record;
}

export async function consumeResetToken(token) {
  await db.query('DELETE FROM password_resets WHERE token = $1', [token]);
}

export async function updateUserPassword(userId, newPassword) {
  const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await db.query(
    'UPDATE users SET password_hash = $1 WHERE id = $2',
    [passwordHash, userId]
  );
}
