import prisma from "../../lib/prisma.js";

export function listForUser(userId) {
  return prisma.learningSpaces.findMany({
    where: { userId },
    include: { _count: { select: { quizzes: true } } },
    orderBy: { id: "desc" },
  });
}

export async function getOwned(userId, id) {
  const space = await prisma.learningSpaces.findUnique({ where: { id } });
  if (!space || space.userId !== userId) return null;
  return space;
}

export function create(userId, data) {
  return prisma.learningSpaces.create({
    data: {
      userId,
      name: data.name,
      colorId: data.colorId ?? "purple",
      icon: data.icon ?? "bot",
    },
  });
}

export async function update(userId, id, data) {
  const existing = await getOwned(userId, id);
  if (!existing) return null;
  return prisma.learningSpaces.update({ where: { id }, data });
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

  await prisma.progress.deleteMany({ where: { learningSpaceId: id } });
  await prisma.learningSpaces.delete({ where: { id } });
  return true;
}
