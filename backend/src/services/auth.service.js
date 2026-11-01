import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import prisma from "../lib/prisma.js";

const SALT_ROUNDS = 10;
const OTP_TTL_MS = 5 * 60 * 1000; // 5 minutes
const RESET_TOKEN_TTL_MS = 10 * 60 * 1000; // 10 minutes to complete password change after OTP

export async function findUserByEmail(email) {
  if (!email || typeof email !== "string") return null;
  const normalized = email.trim().toLowerCase();

  // Exact match first
  let user = await prisma.users.findUnique({
    where: { email: normalized },
  });

  if (!user) {
    // Case-insensitive fallback
    user = await prisma.users.findFirst({
      where: {
        email: {
          equals: normalized,
          mode: "insensitive",
        },
      },
    });
  }

  return user;
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
      name: name?.trim(),
      email: email?.trim().toLowerCase(),
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

function getOtpSecret() {
  return process.env.JWT_SECRET || process.env.OTP_SECRET || "learntrack-ai-otp-salt-secret-key-32chars";
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

/**
 * Generates a cryptographically secure random 6-digit OTP (100000 - 999999).
 */
export function generateOtp() {
  return String(crypto.randomInt(100000, 1000000));
}

/**
 * Computes an HMAC-SHA256 hash of email and OTP.
 * Storing only this hash ensures plaintext OTPs are never persisted.
 */
export function hashOtp(email, otp) {
  const cleanEmail = email.trim().toLowerCase();
  const cleanOtp = String(otp).trim();
  return crypto
    .createHmac("sha256", getOtpSecret())
    .update(`${cleanEmail}:${cleanOtp}`)
    .digest("hex");
}

/**
 * Computes an HMAC-SHA256 hash of a reset authorization token.
 */
export function hashResetToken(token) {
  return crypto
    .createHmac("sha256", getOtpSecret())
    .update(`reset_auth:${token.trim()}`)
    .digest("hex");
}

/**
 * Constant-time string equality check to protect against timing attacks.
 */
function safeCompare(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Creates and stores a hashed OTP for password reset with 5-minute expiry and 60-second cooldown.
 * Optimized with batched query to minimize cloud database latency.
 */
export async function createPasswordResetOtp(email) {
  const cleanEmail = email.trim().toLowerCase();

  // Single round-trip: fetch user and their latest reset record together
  let user = await prisma.users.findUnique({
    where: { email: cleanEmail },
    include: {
      passwordResets: {
        orderBy: { id: "desc" },
        take: 1,
      },
    },
  });

  if (!user) {
    // Case-insensitive fallback if needed
    user = await prisma.users.findFirst({
      where: {
        email: {
          equals: cleanEmail,
          mode: "insensitive",
        },
      },
      include: {
        passwordResets: {
          orderBy: { id: "desc" },
          take: 1,
        },
      },
    });
  }

  if (!user) {
    return { userFound: false };
  }

  // Check 60-second cooldown from existing pending request
  const existing = user.passwordResets?.[0];
  if (existing) {
    const parts = existing.token.split(":");
    const createdAt = parseInt(parts[3] || parts[2] || "0", 10);
    const elapsedSeconds = Math.floor((Date.now() - createdAt) / 1000);
    if (elapsedSeconds < 60 && elapsedSeconds >= 0) {
      const waitSeconds = 60 - elapsedSeconds;
      return {
        userFound: true,
        cooldown: true,
        waitSeconds,
        message: `Please wait ${waitSeconds} seconds before requesting a new OTP.`,
      };
    }
  }

  // Generate 6-digit cryptographically secure OTP
  const otp = generateOtp();
  const hashedOtp = hashOtp(cleanEmail, otp);
  const expiresAt = new Date(Date.now() + OTP_TTL_MS);

  // Store format: "otp:<hashedOtp>:<attempts>:<createdAt>"
  const tokenRecord = `otp:${hashedOtp}:0:${Date.now()}`;

  // Batch delete old tokens and insert new OTP in a single round-trip transaction
  await prisma.$transaction([
    prisma.passwordResets.deleteMany({ where: { userId: user.id } }),
    prisma.passwordResets.create({
      data: {
        userId: user.id,
        token: tokenRecord,
        expiresAt,
      },
    }),
  ]);

  return {
    userFound: true,
    user,
    otp,
    expiresAt,
  };
}

/**
 * Verifies a submitted OTP against the stored hash.
 * Enforces maximum 5 attempts and invalidates the OTP upon success,
 * generating a short-lived reset authorization token.
 */
export async function verifyPasswordResetOtp(email, submittedOtp) {
  if (!email || !submittedOtp) {
    return { success: false, status: 400, error: "Email and 6-digit OTP are required." };
  }

  const cleanEmail = email.trim().toLowerCase();
  const user = await findUserByEmail(cleanEmail);

  if (!user) {
    return { success: false, status: 400, error: "Invalid or expired OTP." };
  }

  const record = await prisma.passwordResets.findFirst({
    where: { userId: user.id },
    orderBy: { id: "desc" },
  });

  if (!record) {
    return { success: false, status: 400, error: "No active OTP request found. Please request a new OTP." };
  }

  // Check expiration
  if (new Date() > record.expiresAt) {
    await prisma.passwordResets.delete({ where: { id: record.id } });
    return { success: false, status: 400, error: "OTP has expired (valid for 5 minutes). Please request a new one." };
  }

  const parts = record.token.split(":");
  if (parts[0] !== "otp" || !parts[1]) {
    return { success: false, status: 400, error: "Invalid reset session. Please request a new OTP." };
  }

  const storedHashedOtp = parts[1];
  let attempts = parseInt(parts[2], 10) || 0;
  const createdAt = parts[3] || Date.now();

  // Check attempt limit
  if (attempts >= 5) {
    await prisma.passwordResets.delete({ where: { id: record.id } });
    return {
      success: false,
      status: 429,
      error: "Maximum verification attempts (5) exceeded. This OTP has been invalidated. Please request a new one.",
    };
  }

  // Check OTP match using constant-time comparison
  const calculatedHash = hashOtp(cleanEmail, submittedOtp.trim());
  const isMatch = safeCompare(storedHashedOtp, calculatedHash);

  if (!isMatch) {
    attempts += 1;
    if (attempts >= 5) {
      await prisma.passwordResets.delete({ where: { id: record.id } });
      return {
        success: false,
        status: 429,
        error: "Incorrect OTP. Maximum attempts exceeded. Please request a new OTP.",
      };
    }

    const updatedToken = `otp:${storedHashedOtp}:${attempts}:${createdAt}`;
    await prisma.passwordResets.update({
      where: { id: record.id },
      data: { token: updatedToken },
    });

    const remaining = 5 - attempts;
    return {
      success: false,
      status: 400,
      error: `Incorrect OTP. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining.`,
    };
  }

  // OTP verified! Invalidate the OTP and issue a secure server-side reset authorization token
  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedReset = hashResetToken(resetToken);
  const resetExpiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);

  await prisma.passwordResets.update({
    where: { id: record.id },
    data: {
      token: `reset:${hashedReset}:${Date.now()}`,
      expiresAt: resetExpiresAt,
    },
  });

  return {
    success: true,
    resetToken,
  };
}

/**
 * Resets user's password using the verified reset authorization token.
 * Hashes the new password and invalidates the reset token immediately.
 */
export async function resetUserPassword({ email, resetToken, newPassword }) {
  if (!email || !resetToken || !newPassword) {
    return { success: false, status: 400, error: "Email, reset token, and new password are required." };
  }

  if (newPassword.length < 8) {
    return { success: false, status: 400, error: "Password must be at least 8 characters long." };
  }

  const cleanEmail = email.trim().toLowerCase();
  const user = await findUserByEmail(cleanEmail);

  if (!user) {
    return { success: false, status: 400, error: "Invalid or expired reset session." };
  }

  const hashedReset = hashResetToken(resetToken.trim());
  const expectedPrefix = `reset:${hashedReset}:`;

  const record = await prisma.passwordResets.findFirst({
    where: {
      userId: user.id,
      token: {
        startsWith: expectedPrefix,
      },
    },
  });

  if (!record || new Date() > record.expiresAt) {
    if (record) {
      await prisma.passwordResets.delete({ where: { id: record.id } });
    }
    return { success: false, status: 400, error: "Reset authorization has expired or is invalid. Please start over." };
  }

  // Update password with bcrypt hash
  const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await prisma.users.update({
    where: { id: user.id },
    data: { passwordHash },
  });

  // Invalidate all reset tokens for this user to prevent replay
  await prisma.passwordResets.deleteMany({
    where: { userId: user.id },
  });

  return { success: true };
}

export async function updateUserPassword(userId, newPassword) {
  const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
  return prisma.users.update({
    where: { id: userId },
    data: { passwordHash },
  });
}
