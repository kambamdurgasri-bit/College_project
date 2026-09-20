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
    phone: user.phoneNumber || "Not provided",
    dob: "2002-05-15",
    gender: "Not Specified",
    university: "State University",
    branch: "Computer Science & Engineering",
    department: "B.Tech, CSE",
    learningLevel: "Intermediate",
    about: "Dedicated student tracking learning progress dynamically on LearnTrack AI.",
    avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(user.name)}&backgroundColor=F4F2FF`,
    quickStats,
    achievements,
    activityTimeline,
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

  return getProfile(updatedUser.id);
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
