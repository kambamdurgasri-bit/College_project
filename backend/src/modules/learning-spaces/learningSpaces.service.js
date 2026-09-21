import prisma from "../../lib/prisma.js";
import { accuracyPercent, averageAccuracy } from "../../lib/score.js";
import { decorateTopic, topicIncludeFor } from "../../lib/topicShape.js";
import { removeStoredFile } from "../../lib/storage.js";
import { resourceInclude, shapeResource } from "../../lib/resourceShape.js";

// --- Shaping --------------------------------------------------------------

// Every card / banner / tab in the UI reads from this shape, which is always
// computed from real rows — no hardcoded colours, icons or topic counts.
function shapeSpace(space, { includeTopics = false } = {}) {
  const topics = (space.topics || []).map((topic) => decorateTopic(topic));

  const attempts = (space.quizzes || []).flatMap((quiz) => {
    const questionCount = quiz._count?.questions ?? 0;
    return (quiz.quizAttempts || []).map((attempt) => ({
      score: attempt.score,
      questionCount,
    }));
  });

  const completed = topics.filter((topic) => topic.status === "COMPLETED").length;
  const inProgress = topics.filter((topic) => topic.status === "IN_PROGRESS").length;

  const shaped = {
    id: space.id,
    userId: space.userId,
    name: space.name,
    colorId: space.colorId,
    icon: space.icon,
    topicsTotal: topics.length,
    topicsCompleted: completed,
    topicsInProgress: inProgress,
    topicsNotStarted: topics.length - completed - inProgress,
    quizzesCount: (space.quizzes || []).length,
    resourcesCount: space._count?.resources ?? 0,
    progress: averageAccuracy(attempts),
    status:
      topics.length > 0 && completed === topics.length ? "Completed" : "In Progress",
  };

  if (includeTopics) shaped.topics = topics;
  return shaped;
}

const spaceInclude = (userId) => ({
  topics: { include: topicIncludeFor(userId) },
  quizzes: {
    select: {
      id: true,
      topicId: true,
      topic: true,
      difficulty: true,
      quizType: true,
      _count: { select: { questions: true } },
      quizAttempts: {
        where: { userId },
        select: { score: true, attemptedAt: true },
      },
    },
  },
  _count: { select: { resources: true } },
});

// --- Reads ----------------------------------------------------------------

export async function listForUser(userId) {
  const spaces = await prisma.learningSpaces.findMany({
    where: { userId },
    include: spaceInclude(userId),
    orderBy: { id: "desc" },
  });

  return spaces.map((space) => shapeSpace(space));
}

// Space overview used by the details page: real topics, quizzes, resources and
// recent activity for this space only.
export async function getDetails(userId, id) {
  const space = await prisma.learningSpaces.findUnique({
    where: { id },
    include: spaceInclude(userId),
  });
  if (!space || space.userId !== userId) return null;

  const shaped = shapeSpace(space, { includeTopics: true });

  const quizzes = (space.quizzes || [])
    .map((quiz) => {
      const questionCount = quiz._count?.questions ?? 0;
      const attempts = [...(quiz.quizAttempts || [])].sort(
        (a, b) => new Date(b.attemptedAt) - new Date(a.attemptedAt)
      );
      const scores = attempts.map((attempt) =>
        accuracyPercent(attempt.score, questionCount)
      );

      return {
        id: quiz.id,
        topicId: quiz.topicId,
        topic: quiz.topic,
        difficulty: quiz.difficulty,
        quizType: quiz.quizType,
        questionsCount: questionCount,
        attemptsCount: attempts.length,
        latestScore: scores.length ? scores[0] : null,
        bestScore: scores.length ? Math.max(...scores) : null,
        lastAttemptAt: attempts.length ? attempts[0].attemptedAt : null,
      };
    })
    .sort((a, b) => b.id - a.id);

  const resources = await prisma.resources.findMany({
    where: { learningSpaceId: id },
    include: resourceInclude,
    orderBy: { id: "desc" },
  });

  const activity = (space.quizzes || [])
    .flatMap((quiz) => {
      const questionCount = quiz._count?.questions ?? 0;
      return (quiz.quizAttempts || []).map((attempt) => ({
        quizId: quiz.id,
        topic: quiz.topic,
        topicId: quiz.topicId,
        difficulty: quiz.difficulty,
        questionsCount: questionCount,
        score: accuracyPercent(attempt.score, questionCount),
        correctAnswers: attempt.score,
        attemptedAt: attempt.attemptedAt,
      }));
    })
    .sort((a, b) => new Date(b.attemptedAt) - new Date(a.attemptedAt))
    .slice(0, 20);

  return {
    ...shaped,
    quizzes,
    resources: resources.map(shapeResource),
    activity,
  };
}

export async function getOwned(userId, id) {
  const space = await prisma.learningSpaces.findUnique({ where: { id } });
  if (!space || space.userId !== userId) return null;
  return space;
}

export async function create(userId, data) {
  const space = await prisma.learningSpaces.create({
    data: {
      userId,
      name: data.name,
      colorId: data.colorId || "purple",
      icon: data.icon || "bot",
    },
  });

  // Read back through the shared shaper so the response carries the values that
  // were actually persisted rather than echoing the request body.
  return shapeSpace({ ...space, topics: [], quizzes: [], _count: { resources: 0 } });
}

export async function update(userId, id, data) {
  const existing = await getOwned(userId, id);
  if (!existing) return null;

  await prisma.learningSpaces.update({
    where: { id },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.colorId !== undefined && { colorId: data.colorId }),
      ...(data.icon !== undefined && { icon: data.icon }),
    },
  });

  return getDetails(userId, id);
}

export async function remove(userId, id) {
  const existing = await getOwned(userId, id);
  if (!existing) return null;

  // Clean up child records to satisfy database FK constraints before deleting space
  const quizzes = await prisma.quizzes.findMany({
    where: { learningSpaceId: id },
    select: { id: true },
  });
  const quizIds = quizzes.map((q) => q.id);

  if (quizIds.length > 0) {
    const attempts = await prisma.quizAttempts.findMany({
      where: { quizId: { in: quizIds } },
      select: { quizAttemptId: true },
    });
    const attemptIds = attempts.map((a) => a.quizAttemptId);

    if (attemptIds.length > 0) {
      await prisma.attemptAnswers.deleteMany({
        where: { quizAttemptId: { in: attemptIds } },
      });
      await prisma.quizAttempts.deleteMany({
        where: { quizAttemptId: { in: attemptIds } },
      });
    }

    await prisma.questions.deleteMany({
      where: { quizId: { in: quizIds } },
    });

    await prisma.quizzes.deleteMany({
      where: { learningSpaceId: id },
    });
  }

  // Uploaded resources live on disk as well as in the database.
  const resources = await prisma.resources.findMany({
    where: { learningSpaceId: id },
    select: { filePath: true },
  });
  await prisma.resources.deleteMany({ where: { learningSpaceId: id } });
  await Promise.all(resources.map((resource) => removeStoredFile(resource.filePath)));

  await prisma.topics.deleteMany({ where: { learningSpaceId: id } });

  await prisma.learningSpaces.delete({ where: { id } });
  return true;
}
