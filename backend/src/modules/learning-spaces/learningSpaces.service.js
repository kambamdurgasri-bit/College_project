import prisma from "../../lib/prisma.js";

export async function listForUser(userId) {
  const spaces = await prisma.learningSpaces.findMany({
    where: { userId },
    include: {
      quizzes: {
        include: {
          quizAttempts: {
            where: { userId },
            select: { score: true },
          },
        },
      },
    },
    orderBy: { id: "desc" },
  });

  return spaces.map((space) => {
    const totalQuizzes = space.quizzes.length;
    let totalScore = 0;
    let totalAttempts = 0;

    space.quizzes.forEach((q) => {
      q.quizAttempts.forEach((att) => {
        totalScore += att.score;
        totalAttempts += 1;
      });
    });

    const avgScore = totalAttempts > 0 ? Math.round(totalScore / totalAttempts) : 0;

    return {
      id: space.id,
      name: space.name,
      userId: space.userId,
      colorId: "purple",
      icon: "bot",
      topicsTotal: totalQuizzes || 1,
      topicsCompleted: totalQuizzes > 0 && avgScore >= 70 ? totalQuizzes : 0,
      topicsInProgress: totalQuizzes > 0 && avgScore < 70 ? totalQuizzes : 0,
      progress: avgScore,
      status: avgScore >= 70 ? "Completed" : "In Progress",
    };
  });
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
    },
  });

  return {
    id: space.id,
    name: space.name,
    userId: space.userId,
    colorId: data.colorId || "purple",
    icon: data.icon || "bot",
    topicsTotal: 0,
    topicsCompleted: 0,
    topicsInProgress: 0,
    progress: 0,
    status: "In Progress",
  };
}

export async function update(userId, id, data) {
  const existing = await getOwned(userId, id);
  if (!existing) return null;

  const space = await prisma.learningSpaces.update({
    where: { id },
    data: {
      ...(data.name && { name: data.name }),
    },
  });

  return {
    id: space.id,
    name: space.name,
    userId: space.userId,
    colorId: data.colorId || "purple",
    icon: data.icon || "bot",
    status: "In Progress",
  };
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

  await prisma.learningSpaces.delete({ where: { id } });
  return true;
}
