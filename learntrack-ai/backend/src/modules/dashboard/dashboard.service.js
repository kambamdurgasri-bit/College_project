import prisma from "../../lib/prisma.js";
import * as timetable from "../timetable/timetable.service.js";

export async function getSummary(userId) {
  const [totalLearningSpaces, todaySchedule, totalQuizzes, recentAttempts] = await Promise.all([
    prisma.learningSpaces.count({ where: { userId } }),
    timetable.listForToday(userId),
    prisma.quizzes.count({ where: { learningSpace: { userId } } }),
    prisma.quizAttempts.findMany({
      where: { userId },
      include: { quiz: true, attemptAnswers: true },
      orderBy: { attemptedAt: "desc" },
      take: 5,
    }),
  ]);

  const recentQuizResults = recentAttempts.map((a) => {
    const totalQuestions = a.attemptAnswers.length;
    return {
      quizAttemptId: a.quizAttemptId,
      topic: a.quiz.topic,
      score: a.score,
      totalQuestions,
      accuracy: totalQuestions > 0 ? Math.round((a.score / totalQuestions) * 100) : 0,
      attemptedAt: a.attemptedAt,
    };
  });

  const averageScore = recentQuizResults.length
    ? Math.round(
        recentQuizResults.reduce((sum, r) => sum + r.accuracy, 0) / recentQuizResults.length
      )
    : 0;

  // NOTE: "progressPercentage" here is a simple placeholder derived from
  // recent quiz accuracy, since there's no Progress/ProgressSnapshot table
  // yet (that belongs to Madhavi's Analytics module — Rule 15). Swap this
  // out once that table/service exists rather than keeping two competing
  // definitions of "progress".
  const progressPercentage = averageScore;

  // Recommendations belong to Madhavi's module — this dashboard only reads
  // the latest one, it never writes to that table.
  const latestRecommendation = await prisma.recommendations.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return {
    totalLearningSpaces,
    todaySchedule,
    totalQuizzes,
    averageScore,
    progressPercentage,
    recentQuizResults,
    recommendationPreview: latestRecommendation
      ? { type: latestRecommendation.recommendationType, text: latestRecommendation.recommendation }
      : null,
  };
}
