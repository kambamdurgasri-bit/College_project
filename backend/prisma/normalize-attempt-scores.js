// One-time data fix: `quiz_attempts.score` is meant to hold the NUMBER OF
// CORRECT ANSWERS (that is what the grader writes and what the quiz result
// screen shows). The original dev seed instead wrote percentages, so its rows
// claim e.g. "70 correct" on a 3-question quiz.
//
// A stored value greater than the quiz's question count is provably impossible
// as a correct-answer count, so those rows are converted:
//     new_score = round(score * question_count / 100)
// Anything else is left untouched.
//
// Usage (from the backend/ folder):
//   node prisma/normalize-attempt-scores.js           # dry run, prints the plan
//   node prisma/normalize-attempt-scores.js --apply   # writes the changes

import prisma from "../src/lib/prisma.js";

const APPLY = process.argv.includes("--apply");

async function main() {
  const rows = await prisma.$queryRawUnsafe(`
    SELECT qa.quiz_attempt_id AS attempt_id,
           qa.user_id,
           qa.score,
           (SELECT COUNT(*)::int FROM questions q WHERE q.quiz_id = qa.quiz_id) AS question_count
    FROM quiz_attempts qa
    ORDER BY qa.quiz_attempt_id
  `);

  const fixable = rows.filter(
    (row) => row.question_count > 0 && row.score > row.question_count
  );

  console.log(`Scanned ${rows.length} attempt(s); ${fixable.length} to convert.`);

  for (const row of fixable) {
    const converted = Math.round((row.score * row.question_count) / 100);
    console.log(
      `   attempt ${row.attempt_id} (user ${row.user_id}): ${row.score} -> ${converted} of ${row.question_count}`
    );
  }

  if (fixable.length === 0) {
    console.log("✅ Nothing to convert — all scores are already answer counts.");
    return;
  }

  if (!APPLY) {
    console.log("");
    console.log("Dry run only. Re-run with --apply to write these changes.");
    return;
  }

  for (const row of fixable) {
    const converted = Math.round((row.score * row.question_count) / 100);
    await prisma.quizAttempts.update({
      where: { quizAttemptId: row.attempt_id },
      data: { score: converted },
    });
  }

  console.log(`✅ Converted ${fixable.length} attempt score(s).`);
}

main()
  .catch((error) => {
    console.error("❌ Normalization failed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
