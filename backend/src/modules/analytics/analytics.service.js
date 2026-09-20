import prisma from "../../lib/prisma.js";
import { getUserProgress } from "../../services/progress.service.js";

export async function getAnalytics(userId) {
  const [progress, learningSpaces, quizStatistics, performanceTrend] =
    await Promise.all([
      getUserProgress(userId),

      prisma.learningSpaces.findMany({
        where: {
          userId,
        },
        select: {
          id: true,
          name: true,
          quizzes: {
            select: {
              id: true,
              topic: true,
              quizAttempts: {
                where: {
                  userId,
                },
                select: {
                  score: true,
                  attemptedAt: true,
                },
              },
            },
          },
        },
        orderBy: {
          id: "asc",
        },
      }),

      prisma.quizAttempts.aggregate({
        where: {
          userId,
        },
        _count: {
          _all: true,
        },
        _avg: {
          score: true,
        },
      }),

      prisma.quizAttempts.findMany({
        where: {
          userId,
        },
        select: {
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
        orderBy: {
          attemptedAt: "asc",
        },
      }),
    ]);

  const subjectPerformance = learningSpaces.map((learningSpace) => {
    const attempts = learningSpace.quizzes.flatMap(
      (quiz) => quiz.quizAttempts
    );

    const quizzesTaken = attempts.length;

    const averageScore =
      quizzesTaken === 0
        ? 0
        : Math.round(
            attempts.reduce((total, attempt) => total + attempt.score, 0) /
              quizzesTaken
          );

    return {
      learningSpaceId: learningSpace.id,
      learningSpaceName: learningSpace.name,
      quizzesTaken,
      averageScore,
    };
  });

  const trend = performanceTrend.map((attempt) => ({
    attemptedAt: attempt.attemptedAt,
    score: attempt.score,
    topic: attempt.quiz.topic,
    learningSpaceId: attempt.quiz.learningSpace.id,
    learningSpaceName: attempt.quiz.learningSpace.name,
  }));

  return {
    progress,
    subjectPerformance,
    quizStatistics: {
      totalAttempts: quizStatistics._count._all,
      averageScore: Math.round(quizStatistics._avg.score ?? 0),
    },
    performanceTrend: trend,
  };
}