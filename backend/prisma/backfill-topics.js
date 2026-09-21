// One-time backfill: turns the topics that already exist inside
// `quizzes.topic` (free text) into real `topics` rows and links each quiz to
// its topic via `quizzes.topic_id`.
//
// Safe to re-run: it only looks at quizzes that still have topic_id = NULL and
// it upserts topics on the (learning_space_id, name) unique key.
//
// Usage (from the backend/ folder):
//   node prisma/backfill-topics.js

import prisma from "../src/lib/prisma.js";

async function main() {
  console.log("🔁 Backfilling topics from existing quizzes...");

  const orphanQuizzes = await prisma.quizzes.findMany({
    where: { topicId: null },
    select: { id: true, learningSpaceId: true, topic: true },
    orderBy: { id: "asc" },
  });

  if (orphanQuizzes.length === 0) {
    console.log("✅ Nothing to do — every quiz already has a topic_id.");
    return;
  }

  // Group by space + topic name so each unique pair becomes a single topic row.
  const groups = new Map();
  for (const quiz of orphanQuizzes) {
    const key = `${quiz.learningSpaceId}::${quiz.topic}`;
    if (!groups.has(key)) {
      groups.set(key, { learningSpaceId: quiz.learningSpaceId, name: quiz.topic });
    }
  }

  let topicsCreated = 0;
  let topicsReused = 0;
  let quizzesLinked = 0;

  for (const { learningSpaceId, name } of groups.values()) {
    const existing = await prisma.topics.findUnique({
      where: { learningSpaceId_name: { learningSpaceId, name } },
      select: { id: true },
    });

    let topicId;
    if (existing) {
      topicId = existing.id;
      topicsReused += 1;
    } else {
      const created = await prisma.topics.create({
        data: { learningSpaceId, name },
        select: { id: true },
      });
      topicId = created.id;
      topicsCreated += 1;
    }

    const linked = await prisma.quizzes.updateMany({
      where: { learningSpaceId, topic: name, topicId: null },
      data: { topicId },
    });
    quizzesLinked += linked.count;
  }

  console.log(`   topics created : ${topicsCreated}`);
  console.log(`   topics reused  : ${topicsReused}`);
  console.log(`   quizzes linked : ${quizzesLinked}`);
  console.log("✅ Backfill complete.");
}

main()
  .catch((error) => {
    console.error("❌ Backfill failed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
