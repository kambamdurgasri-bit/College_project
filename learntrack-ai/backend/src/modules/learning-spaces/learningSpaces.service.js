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

export function create(userId, name) {
  return prisma.learningSpaces.create({ data: { userId, name } });
}

export async function update(userId, id, data) {
  const existing = await getOwned(userId, id);
  if (!existing) return null;
  return prisma.learningSpaces.update({ where: { id }, data });
}

export async function remove(userId, id) {
  const existing = await getOwned(userId, id);
  if (!existing) return null;
  // Rely on FK constraints/cascade rules in the DB; if quizzes exist under
  // this space, decide with the team whether delete should cascade or be
  // blocked (Rule 10 — check relationships before changing behavior).
  await prisma.learningSpaces.delete({ where: { id } });
  return true;
}
