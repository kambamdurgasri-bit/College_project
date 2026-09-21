// Pure shaping helpers for topic rows.
//
// Kept in lib/ (not in the topics module) because both the topics module and
// the learning-spaces module need them, and importing one module from the other
// would create a circular dependency.

import { accuracyPercent, averageAccuracy } from "./score.js";

// Prisma `include` used whenever a topic's live progress is needed.
export const topicIncludeFor = (userId) => ({
  quizzes: {
    select: {
      id: true,
      _count: { select: { questions: true } },
      quizAttempts: {
        where: { userId },
        select: { score: true, attemptedAt: true },
      },
    },
  },
  _count: { select: { resources: true } },
});

// Topics carry no status column — progress is derived from the attempts on
// their quizzes so it can never drift out of sync with real activity.
export function decorateTopic(topic) {
  const quizzes = topic.quizzes || [];

  const attempts = quizzes
    .flatMap((quiz) => {
      const questionCount = quiz._count?.questions ?? quiz.questions?.length ?? 0;
      return (quiz.quizAttempts || []).map((attempt) => ({
        score: attempt.score,
        questionCount,
        attemptedAt: attempt.attemptedAt,
      }));
    })
    .sort((a, b) => new Date(b.attemptedAt) - new Date(a.attemptedAt));

  const scores = attempts.map((attempt) =>
    accuracyPercent(attempt.score, attempt.questionCount)
  );

  const bestScore = scores.length ? Math.max(...scores) : null;
  const latestScore = scores.length ? scores[0] : null;

  return {
    id: topic.id,
    learningSpaceId: topic.learningSpaceId,
    name: topic.name,
    description: topic.description,
    createdAt: topic.createdAt,
    updatedAt: topic.updatedAt,
    quizzesCount: quizzes.length,
    questionsCount: quizzes.reduce(
      (sum, quiz) => sum + (quiz._count?.questions ?? quiz.questions?.length ?? 0),
      0
    ),
    resourcesCount: topic._count?.resources ?? topic.resources?.length ?? 0,
    attemptsCount: attempts.length,
    averageScore: averageAccuracy(attempts),
    latestScore,
    bestScore,
    lastAttemptAt: attempts.length ? attempts[0].attemptedAt : null,
    status:
      attempts.length === 0
        ? "NOT_STARTED"
        : bestScore >= 70
          ? "COMPLETED"
          : "IN_PROGRESS",
  };
}
