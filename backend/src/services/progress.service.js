import prisma from "../lib/prisma.js";

const PERIOD_TYPES = ["DAILY", "WEEKLY", "MONTHLY"];

function getPeriodRange(periodType, date = new Date()) {
  const start = new Date(date);
  const end = new Date(date);

  start.setUTCHours(0, 0, 0, 0);

  if (periodType === "DAILY") {
    end.setTime(start.getTime());
    end.setUTCDate(end.getUTCDate() + 1);
    return { start, end };
  }

  if (periodType === "WEEKLY") {
    const day = start.getUTCDay();
    const diff = day === 0 ? -6 : 1 - day;

    start.setUTCDate(start.getUTCDate() + diff);

    end.setTime(start.getTime());
    end.setUTCDate(end.getUTCDate() + 7);

    return { start, end };
  }

  if (periodType === "MONTHLY") {
    start.setUTCDate(1);

    end.setTime(start.getTime());
    end.setUTCMonth(end.getUTCMonth() + 1);

    return { start, end };
  }

  throw new Error(`Invalid period type: ${periodType}`);
}

async function calculateProgress(
  userId,
  learningSpaceId,
  periodType,
  date = new Date()
) {
  if (!PERIOD_TYPES.includes(periodType)) {
    throw new Error("Invalid period type");
  }

  const { start, end } = getPeriodRange(periodType, date);

  const attempts = await prisma.quizAttempts.findMany({
    where: {
      userId,
      attemptedAt: {
        gte: start,
        lt: end,
      },
      quiz: {
        learningSpaceId,
      },
    },
    select: {
      score: true,
    },
  });

  const quizzesTaken = attempts.length;

  const averageScore =
    quizzesTaken === 0
      ? 0
      : Math.round(
          attempts.reduce((total, attempt) => total + attempt.score, 0) /
            quizzesTaken
        );

  return {
    userId,
    learningSpaceId,
    periodType,
    periodStart: start,
    progress: averageScore,
    averageScore,
    quizzesTaken,
  };
}

export async function getProgressForLearningSpace(
  userId,
  learningSpaceId,
  periodType
) {
  return calculateProgress(
    userId,
    learningSpaceId,
    periodType
  );
}

export async function getAllProgressForLearningSpace(
  userId,
  learningSpaceId
) {
  const [daily, weekly, monthly] = await Promise.all([
    calculateProgress(userId, learningSpaceId, "DAILY"),
    calculateProgress(userId, learningSpaceId, "WEEKLY"),
    calculateProgress(userId, learningSpaceId, "MONTHLY"),
  ]);

  return { daily, weekly, monthly };
}

export async function getUserProgress(userId) {
  const learningSpaces = await prisma.learningSpaces.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      id: "asc",
    },
  });

  const result = await Promise.all(
    learningSpaces.map(async (learningSpace) => {
      const progress = await getAllProgressForLearningSpace(
        userId,
        learningSpace.id
      );

      return {
        learningSpace,
        progress,
      };
    })
  );

  return result;
}