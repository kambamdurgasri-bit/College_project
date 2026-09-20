import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import prisma from "../lib/prisma.js";

const SALT_ROUNDS = 10;
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;

export async function findUserByEmail(email) {
  return prisma.users.findUnique({
    where: { email },
  });
}

export async function createUser({
  name,
  email,
  password,
  phoneNumber,
}) {
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  return prisma.users.create({
    data: {
      name,
      email,
      passwordHash,
      phoneNumber: phoneNumber ?? null,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phoneNumber: true,
    },
  });
}

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is missing in backend/.env");
  }
  return secret;
}

export async function verifyPassword(plainPassword, passwordHash) {
  if (!plainPassword || !passwordHash) return false;
  return bcrypt.compare(plainPassword, passwordHash);
}

export function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      sub: user.id,
      email: user.email,
    },
    getJwtSecret(),
    {
      expiresIn: "7d",
    }
  );
}

export function verifyToken(token) {
  return jwt.verify(token, getJwtSecret());
}

export async function createPasswordResetToken(userId) {
  const token = crypto.randomBytes(32).toString("hex");

  const expiresAt = new Date(
    Date.now() + RESET_TOKEN_TTL_MS
  );

  await prisma.passwordResets.create({
    data: {
      userId,
      token,
      expiresAt,
    },
  });

  return token;
}

export async function findValidResetToken(token) {
  const record = await prisma.passwordResets.findUnique({
    where: { token },
  });

  if (!record) {
    return null;
  }

  if (record.expiresAt < new Date()) {
    return null;
  }

  return record;
}

export async function consumeResetToken(token) {
  await prisma.passwordResets.delete({
    where: { token },
  });
}

export async function updateUserPassword(userId, newPassword) {
  const passwordHash = await bcrypt.hash(
    newPassword,
    SALT_ROUNDS
  );

  return prisma.users.update({
    where: { id: userId },
    data: { passwordHash },
  });
}