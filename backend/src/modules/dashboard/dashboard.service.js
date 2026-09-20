import prisma from "../../lib/prisma.js";
import * as timetable from "../timetable/timetable.service.js";
import { getUserProgress } from "../../services/progress.service.js";

export async function getSummary(userId) {
  const [
    totalLearningSpaces,
    todaySchedule,
    totalQuizzes,
    quizStatistics,
    recentAttempts,
    progress,
  ] = await Promise.all([
    prisma.learningSpaces.count({
      where: { userId },
    }),

    timetable.listForToday(userId),

    prisma.quizzes.count({
      where: {
        learningSpace: {
          userId,
        },
      },
    }),

    prisma.quizAttempts.aggregate({
      where: { userId },
      _count: {
        _all: true,
      },
      _avg: {
        score: true,
      },
    }),

    prisma.quizAttempts.findMany({
      where: { userId },
      orderBy: {
        attemptedAt: "desc",
      },
      take: 5,
      select: {
        quizAttemptId: true,
        score: true,
        attemptedAt: true,
        quiz: {
          select: {
            topic: true,
            learningSpace: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    }),

    getUserProgress(userId),
  ]);

  const averageScore = Math.round(quizStatistics._avg.score ?? 0);

  const recentQuizResults = recentAttempts.map((attempt) => ({
    quizAttemptId: attempt.quizAttemptId,
    topic: attempt.quiz.topic,
    score: attempt.score,
    accuracy: attempt.score,
    attemptedAt: attempt.attemptedAt,
    learningSpaceId: attempt.quiz.learningSpace?.id ?? null,
    learningSpaceName: attempt.quiz.learningSpace?.name ?? null,
  }));

  return {
    totalLearningSpaces,
    todaySchedule,
    totalQuizzes,
    averageScore,
    progressPercentage: averageScore,
    progress,
    recentQuizResults,
  };
}