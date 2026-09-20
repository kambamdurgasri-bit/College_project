import prisma from "../../lib/prisma.js";
import { verifyPassword, updateUserPassword } from "../../services/auth.service.js";

export async function getProfile(userId) {
  const user = await prisma.users.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phoneNumber: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Get statistics for the profile
  const [spacesCount, attempts] = await Promise.all([
    prisma.learningSpaces.count({ where: { userId } }),
    prisma.quizAttempts.findMany({
      where: { userId },
      select: { score: true },
    }),
  ]);

  const quizzesTaken = attempts.length;
  const avgScore = quizzesTaken > 0
    ? Math.round(attempts.reduce((acc, curr) => acc + curr.score, 0) / quizzesTaken)
    : 0;

  return {
    ...user,
    fullName: user.name,
    phone: user.phoneNumber || "",
    gender: "Not Specified",
    university: "State University",
    branch: "Computer Science",
    department: "Computer Science & Engineering",
    about: "Dedicated learner working on skill development.",
    stats: {
      spacesCount,
      quizzesTaken,
      avgScore,
    },
  };
}

export async function updateProfile(userId, data) {
  const { fullName, name, phone, phoneNumber } = data;
  const newName = fullName || name;
  const newPhone = phone !== undefined ? phone : phoneNumber;

  const updatedUser = await prisma.users.update({
    where: { id: userId },
    data: {
      ...(newName && { name: newName }),
      ...(newPhone !== undefined && { phoneNumber: newPhone }),
    },
    select: {
      id: true,
      name: true,
      email: true,
      phoneNumber: true,
    },
  });

  return {
    ...updatedUser,
    fullName: updatedUser.name,
    phone: updatedUser.phoneNumber || "",
  };
}

export async function changePassword(userId, currentPassword, newPassword) {
  const user = await prisma.users.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const isValid = await verifyPassword(currentPassword, user.passwordHash);
  if (!isValid) {
    throw new Error("Current password is incorrect");
  }

  await updateUserPassword(userId, newPassword);
  return { message: "Password updated successfully" };
}
