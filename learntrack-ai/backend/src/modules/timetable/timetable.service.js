import prisma from "../../lib/prisma.js";

const DAY_NAMES = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
];

export function todayName() {
  return DAY_NAMES[new Date().getDay()];
}

// Always include the linked learning space so the frontend gets
// { id, name, colorId } without a second round-trip.
const INCLUDE_SPACE = {
  learningSpace: {
    select: { id: true, name: true, colorId: true },
  },
};

export function listForUser(userId) {
  return prisma.timetables.findMany({
    where: { userId },
    include: INCLUDE_SPACE,
    orderBy: [{ day: "asc" }, { startTime: "asc" }],
  });
}

export function listForToday(userId) {
  return prisma.timetables.findMany({
    where: { userId, day: todayName() },
    include: INCLUDE_SPACE,
    orderBy: { startTime: "asc" },
  });
}

export async function getOwned(userId, id) {
  const entry = await prisma.timetables.findUnique({ where: { id } });
  if (!entry || entry.userId !== userId) return null;
  return entry;
}

// Verifies a learning space exists and belongs to the user.
// Returns the space record, or null if not found / not owned.
async function resolveSpace(userId, learningSpaceId) {
  const space = await prisma.learningSpaces.findUnique({
    where: { id: learningSpaceId },
    select: { id: true, name: true, userId: true, colorId: true },
  });
  if (!space || space.userId !== userId) return null;
  return space;
}

export async function create(userId, data) {
  const space = await resolveSpace(userId, data.learningSpaceId);
  if (!space) return null; // caller returns 400

  return prisma.timetables.create({
    data: {
      userId,
      day: data.day,
      subject: space.name,       // keep subject in sync for backward compat
      startTime: data.startTime,
      endTime: data.endTime,
      learningSpaceId: space.id,
    },
    include: INCLUDE_SPACE,
  });
}

export async function update(userId, id, data) {
  const existing = await getOwned(userId, id);
  if (!existing) return null;

  let spaceUpdate = {};
  if (data.learningSpaceId !== undefined) {
    const space = await resolveSpace(userId, data.learningSpaceId);
    if (!space) return null; // caller returns 404
    spaceUpdate = { learningSpaceId: space.id, subject: space.name };
  }

  return prisma.timetables.update({
    where: { id },
    data: {
      ...spaceUpdate,
      ...(data.day && { day: data.day }),
      ...(data.startTime && { startTime: data.startTime }),
      ...(data.endTime && { endTime: data.endTime }),
    },
    include: INCLUDE_SPACE,
  });
}

export async function remove(userId, id) {
  const existing = await getOwned(userId, id);
  if (!existing) return null;
  await prisma.timetables.delete({ where: { id } });
  return true;
}
