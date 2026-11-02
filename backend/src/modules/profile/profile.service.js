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
      dob: true,
      gender: true,
      university: true,
      branch: true,
      department: true,
      about: true,
      avatar: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Get statistics for the profile directly from PostgreSQL tables
  const [spacesCount, attempts] = await Promise.all([
    prisma.learningSpaces.count({ where: { userId } }),
    prisma.quizAttempts.findMany({
      where: { userId },
      select: {
        score: true,
        attemptedAt: true,
        quiz: {
          select: {
            topic: true,
            learningSpace: {
              select: { name: true },
            },
          },
        },
      },
      orderBy: { attemptedAt: "desc" },
      take: 10,
    }),
  ]);

  const quizzesTaken = attempts.length;
  const avgScore = quizzesTaken > 0
    ? Math.round(attempts.reduce((acc, curr) => acc + curr.score, 0) / quizzesTaken)
    : 0;

  // Build dynamic stats
  const quickStats = [
    { label: "Learning Spaces", value: String(spacesCount), icon: "BookOpen", tint: "#6B59F8" },
    { label: "Completed Quizzes", value: String(quizzesTaken), icon: "CheckCircle2", tint: "#10B981" },
    { label: "Average Score", value: `${avgScore}%`, icon: "Target", tint: "#A89BFC" },
    { label: "Learning Streak", value: `${quizzesTaken > 0 ? Math.min(quizzesTaken * 2, 7) : 0} days`, icon: "Flame", tint: "#FF8F6B" },
    { label: "Study Hours", value: `${Math.round(quizzesTaken * 0.5)} hrs`, icon: "Clock", tint: "#6B59F8" },
  ];

  // Build dynamic achievements based on actual DB metrics
  const badges = [
    { name: "Getting Started", icon: "Award", tint: "#6B59F8" },
  ];
  if (quizzesTaken >= 1) badges.push({ name: "First Quiz Completed", icon: "Flame", tint: "#FF8F6B" });
  if (avgScore >= 70) badges.push({ name: "High Achiever", icon: "TrendingUp", tint: "#10B981" });
  if (spacesCount >= 1) badges.push({ name: "Space Creator", icon: "Sunrise", tint: "#A89BFC" });

  const achievements = {
    badges,
    certificates: [],
    milestones: [
      { name: `${quizzesTaken} Quizzes Attempted`, date: "Recent" },
      { name: `${spacesCount} Learning Spaces Created`, date: "Active" },
    ],
  };

  // Build dynamic recent activity timeline from user DB records
  const activityTimeline = attempts.map((att) => ({
    type: "quiz",
    icon: "FileCheck2",
    title: `Scored ${att.score}% on ${att.quiz?.learningSpace?.name || "Quiz"} - ${att.quiz?.topic || "Topic"}`,
    time: new Date(att.attemptedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  }));

  if (activityTimeline.length === 0) {
    activityTimeline.push({
      type: "profile",
      icon: "UserRound",
      title: "Joined LearnTrack AI platform",
      time: "Recently",
    });
  }

  return {
    ...user,
    fullName: user.name,
    phone: user.phoneNumber || "",
    phoneNumber: user.phoneNumber || "",
    dob: user.dob || "",
    gender: user.gender || "Not Specified",
    university: user.university || "",
    branch: user.branch || "",
    department: user.department || "",
    learningLevel: "Intermediate",
    about: user.about || "",
    avatar: user.avatar || `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(user.name)}&backgroundColor=F4F2FF`,
    quickStats,
    achievements,
    activityTimeline,
  };
}

export async function updateProfile(userId, data) {
  const {
    fullName,
    name,
    email,
    phone,
    phoneNumber,
    dob,
    gender,
    university,
    branch,
    department,
    about,
    avatar,
  } = data;

  const newName = fullName || name;
  const newPhone = phone !== undefined ? phone : phoneNumber;

  const updateFields = {};
  if (newName !== undefined) updateFields.name = newName;
  if (email !== undefined) updateFields.email = email;
  if (newPhone !== undefined) updateFields.phoneNumber = newPhone;
  if (dob !== undefined) updateFields.dob = dob;
  if (gender !== undefined) updateFields.gender = gender;
  if (university !== undefined) updateFields.university = university;
  if (branch !== undefined) updateFields.branch = branch;
  if (department !== undefined) updateFields.department = department;
  if (about !== undefined) updateFields.about = about;
  if (avatar !== undefined) updateFields.avatar = avatar;

  await prisma.users.update({
    where: { id: userId },
    data: updateFields,
  });

  return getProfile(userId);
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

export async function deleteAccount(userId) {
  // Cascading deletion to safely delete all user data
  await prisma.attemptAnswers.deleteMany({
    where: {
      quizAttempt: {
        userId,
      },
    },
  });

  await prisma.quizAttempts.deleteMany({
    where: { userId },
  });

  await prisma.progress.deleteMany({
    where: { userId },
  });

  await prisma.recommendations.deleteMany({
    where: { userId },
  });

  await prisma.timetables.deleteMany({
    where: { userId },
  });

  await prisma.resources.deleteMany({
    where: { learningSpace: { userId } },
  });

  await prisma.questions.deleteMany({
    where: {
      quiz: {
        learningSpace: {
          userId,
        },
      },
    },
  });

  await prisma.quizzes.deleteMany({
    where: {
      learningSpace: {
        userId,
      },
    },
  });

  await prisma.topics.deleteMany({
    where: {
      learningSpace: {
        userId,
      },
    },
  });

  await prisma.learningSpaces.deleteMany({
    where: { userId },
  });

  await prisma.passwordResets.deleteMany({
    where: { userId },
  });

  await prisma.users.delete({
    where: { id: userId },
  });

  return { success: true, message: "Account deleted successfully" };
}
