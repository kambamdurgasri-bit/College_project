import prisma from '../../lib/prisma.js';

export async function getSummary(userId) {
  const [spaces, quizzes, attempts, schedules] = await Promise.all([
    prisma.learningSpaces.count({ where: { userId } }),
    prisma.quizzes.count({ where: { learningSpace: { userId } } }),
    prisma.quizAttempts.findMany({
      where: { userId },
      orderBy: { attemptedAt: 'desc' },
      take: 5,
      include: { quiz: { select: { topic: true } } },
    }),
    prisma.timetables.findMany({
      where: { userId },
    }),
  ]);

  const avgScore = attempts.length
    ? Math.round(attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length)
    : 0;

  return {
    totalLearningSpaces: spaces,
    todaySchedule: schedules,
    totalQuizzes: quizzes,
    averageScore: avgScore,
    progressPercentage: avgScore,
    recentQuizResults: attempts.map(a => ({
      quizAttemptId: a.quizAttemptId,
      topic: a.quiz.topic,
      score: a.score,
      totalQuestions: 3,
      accuracy: a.score,
      attemptedAt: a.attemptedAt,
    })),
    recommendationPreview: { type: 'STUDY', text: 'Keep learning!' },
  };
}
