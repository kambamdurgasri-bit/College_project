// Score semantics, in one place.
//
// `quiz_attempts.score` stores the NUMBER OF CORRECT ANSWERS, because that is
// what src/modules/quiz/quiz.service.js#submitAttempt writes (and what the quiz
// result screen shows). Every percentage shown to a user is therefore derived
// from the quiz's question count instead of being read straight out of `score`.
//
// Historical note: the old dev seed wrote percentages into `score`. Those rows
// were converted once by prisma/normalize-attempt-scores.js.

export function accuracyPercent(score, questionCount) {
  const total = Number(questionCount);
  if (!Number.isFinite(total) || total <= 0) return 0;
  const correct = Number(score) || 0;
  const percent = Math.round((correct / total) * 100);
  return Math.min(Math.max(percent, 0), 100);
}

// attempts: [{ score, questionCount }]
export function averageAccuracy(attempts) {
  if (!Array.isArray(attempts) || attempts.length === 0) return 0;
  const total = attempts.reduce(
    (sum, attempt) => sum + accuracyPercent(attempt.score, attempt.questionCount),
    0
  );
  return Math.round(total / attempts.length);
}
