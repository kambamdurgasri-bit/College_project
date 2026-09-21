import prisma from "../../lib/prisma.js";
import { decorateTopic, topicIncludeFor } from "../../lib/topicShape.js";
import * as learningSpaces from "../learning-spaces/learningSpaces.service.js";
import { removeStoredFile } from "../../lib/storage.js";

const topicInclude = topicIncludeFor;

// --- Reads ----------------------------------------------------------------

export async function listForSpace(userId, learningSpaceId) {
  const space = await learningSpaces.getOwned(userId, learningSpaceId);
  if (!space) return null;

  const topics = await prisma.topics.findMany({
    where: { learningSpaceId },
    include: topicInclude(userId),
    orderBy: { id: "asc" },
  });

  return topics.map((topic) => decorateTopic(topic));
}

export async function getOwned(userId, topicId) {
  const topic = await prisma.topics.findUnique({
    where: { id: topicId },
    include: { learningSpace: { select: { id: true, userId: true, name: true } } },
  });
  if (!topic || topic.learningSpace.userId !== userId) return null;
  return topic;
}

export async function getOne(userId, topicId) {
  const owned = await getOwned(userId, topicId);
  if (!owned) return null;

  const topic = await prisma.topics.findUnique({
    where: { id: topicId },
    include: topicInclude(userId),
  });
  return decorateTopic(topic);
}

// --- Writes ---------------------------------------------------------------

export class TopicConflictError extends Error {
  constructor(name) {
    super(`A topic named "${name}" already exists in this learning space.`);
    this.name = "TopicConflictError";
    this.status = 409;
  }
}

export async function create(userId, { learningSpaceId, name, description }) {
  const space = await learningSpaces.getOwned(userId, learningSpaceId);
  if (!space) return null;

  const cleanName = String(name).trim();

  const duplicate = await prisma.topics.findUnique({
    where: { learningSpaceId_name: { learningSpaceId, name: cleanName } },
    select: { id: true },
  });
  if (duplicate) throw new TopicConflictError(cleanName);

  const topic = await prisma.topics.create({
    data: {
      learningSpaceId,
      name: cleanName,
      description: description?.trim() ? String(description).trim() : null,
    },
    include: topicInclude(userId),
  });

  return decorateTopic(topic);
}

export async function update(userId, topicId, data) {
  const owned = await getOwned(userId, topicId);
  if (!owned) return null;

  const cleanName =
    data.name !== undefined ? String(data.name).trim() : undefined;

  if (cleanName && cleanName !== owned.name) {
    const duplicate = await prisma.topics.findUnique({
      where: {
        learningSpaceId_name: {
          learningSpaceId: owned.learningSpaceId,
          name: cleanName,
        },
      },
      select: { id: true },
    });
    if (duplicate) throw new TopicConflictError(cleanName);
  }

  const topic = await prisma.topics.update({
    where: { id: topicId },
    data: {
      ...(cleanName && { name: cleanName }),
      ...(data.description !== undefined && {
        description: data.description?.trim() ? String(data.description).trim() : null,
      }),
    },
    include: topicInclude(userId),
  });

  // Keep the mirrored snapshot column on quizzes in step with the rename.
  if (cleanName && cleanName !== owned.name) {
    await prisma.quizzes.updateMany({
      where: { topicId },
      data: { topic: cleanName },
    });
  }

  return decorateTopic(topic);
}

export async function remove(userId, topicId) {
  const owned = await getOwned(userId, topicId);
  if (!owned) return null;

  const quizzes = await prisma.quizzes.findMany({
    where: { topicId },
    select: { id: true },
  });
  const quizIds = quizzes.map((quiz) => quiz.id);

  if (quizIds.length > 0) {
    const attempts = await prisma.quizAttempts.findMany({
      where: { quizId: { in: quizIds } },
      select: { quizAttemptId: true },
    });
    const attemptIds = attempts.map((attempt) => attempt.quizAttemptId);

    if (attemptIds.length > 0) {
      await prisma.attemptAnswers.deleteMany({
        where: { quizAttemptId: { in: attemptIds } },
      });
      await prisma.quizAttempts.deleteMany({
        where: { quizAttemptId: { in: attemptIds } },
      });
    }

    await prisma.questions.deleteMany({ where: { quizId: { in: quizIds } } });
    await prisma.quizzes.deleteMany({ where: { topicId } });
  }

  // Topic-scoped resources are removed with their files.
  const resources = await prisma.resources.findMany({
    where: { topicId },
    select: { id: true, filePath: true },
  });
  if (resources.length > 0) {
    await prisma.resources.deleteMany({ where: { topicId } });
    await Promise.all(resources.map((resource) => removeStoredFile(resource.filePath)));
  }

  await prisma.topics.delete({ where: { id: topicId } });
  return true;
}
