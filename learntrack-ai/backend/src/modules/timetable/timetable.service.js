import prisma from "../../lib/prisma.js";

const DAY_NAMES = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
];

export function todayName() {
  return DAY_NAMES[new Date().getDay()];
}

export function listForUser(userId) {
  return prisma.timetables.findMany({
    where: { userId },
    orderBy: [{ day: "asc" }, { startTime: "asc" }],
  });
}

export function listForToday(userId) {
  return prisma.timetables.findMany({
    where: { userId, day: todayName() },
    orderBy: { startTime: "asc" },
  });
}

export async function getOwned(userId, id) {
  const entry = await prisma.timetables.findUnique({ where: { id } });
  if (!entry || entry.userId !== userId) return null;
  return entry;
}

export function create(userId, data) {
  return prisma.timetables.create({
    data: {
      userId,
      day: data.day,
      subject: data.subject,
      startTime: data.startTime,
      endTime: data.endTime,
    },
  });
}

export async function update(userId, id, data) {
  const existing = await getOwned(userId, id);
  if (!existing) return null;
  return prisma.timetables.update({
    where: { id },
    data: {
      ...(data.day && { day: data.day }),
      ...(data.subject && { subject: data.subject }),
      ...(data.startTime && { startTime: data.startTime }),
      ...(data.endTime && { endTime: data.endTime }),
    },
  });
}

export async function remove(userId, id) {
  const existing = await getOwned(userId, id);
  if (!existing) return null;
  await prisma.timetables.delete({ where: { id } });
  return true;
}
