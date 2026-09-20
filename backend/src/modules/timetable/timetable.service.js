import prisma from "../../lib/prisma.js";

const DAY_NAMES = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
];

export function todayName() {
  return DAY_NAMES[new Date().getDay()];
}

function formatTime(val) {
  if (!val) return "09:00";
  if (typeof val === "string") return val.substring(0, 5);
  if (val instanceof Date) {
    const hours = String(val.getUTCHours()).padStart(2, "0");
    const minutes = String(val.getUTCMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  }
  return String(val);
}

function parseTimeToIso(timeStr) {
  if (!timeStr) return "1970-01-01T09:00:00.000Z";
  if (typeof timeStr === "string" && /^([01]\d|2[0-3]):([0-5]\d)$/.test(timeStr)) {
    return `1970-01-01T${timeStr}:00.000Z`;
  }
  return String(timeStr);
}

function mapTimetableRecord(entry) {
  const startTime = formatTime(entry.startTime);
  const endTime = formatTime(entry.endTime);
  return {
    id: entry.id,
    userId: entry.userId,
    day: entry.day,
    subject: entry.subject,
    startTime,
    endTime,
    learningSpace: {
      id: entry.id,
      name: entry.subject,
      colorId: "purple",
    },
  };
}

export async function listForUser(userId) {
  const entries = await prisma.timetables.findMany({
    where: { userId },
    orderBy: [{ day: "asc" }, { startTime: "asc" }],
  });
  return entries.map(mapTimetableRecord);
}

export async function listForToday(userId) {
  const entries = await prisma.timetables.findMany({
    where: { userId, day: todayName() },
    orderBy: { startTime: "asc" },
  });
  return entries.map(mapTimetableRecord);
}

export async function getOwned(userId, id) {
  const entry = await prisma.timetables.findUnique({ where: { id } });
  if (!entry || entry.userId !== userId) return null;
  return entry;
}

export async function create(userId, data) {
  let subjectName = data.subject || data.name;

  if (!subjectName && data.learningSpaceId) {
    const space = await prisma.learningSpaces.findUnique({
      where: { id: Number(data.learningSpaceId) },
      select: { name: true },
    });
    if (space) subjectName = space.name;
  }

  if (!subjectName) subjectName = "General Subject";

  const entry = await prisma.timetables.create({
    data: {
      userId,
      day: data.day,
      subject: subjectName,
      startTime: parseTimeToIso(data.startTime),
      endTime: parseTimeToIso(data.endTime),
    },
  });

  return mapTimetableRecord(entry);
}

export async function update(userId, id, data) {
  const existing = await getOwned(userId, id);
  if (!existing) return null;

  let subjectName = data.subject || data.name;
  if (!subjectName && data.learningSpaceId) {
    const space = await prisma.learningSpaces.findUnique({
      where: { id: Number(data.learningSpaceId) },
      select: { name: true },
    });
    if (space) subjectName = space.name;
  }

  const updated = await prisma.timetables.update({
    where: { id },
    data: {
      ...(subjectName && { subject: subjectName }),
      ...(data.day && { day: data.day }),
      ...(data.startTime && { startTime: parseTimeToIso(data.startTime) }),
      ...(data.endTime && { endTime: parseTimeToIso(data.endTime) }),
    },
  });

  return mapTimetableRecord(updated);
}

export async function remove(userId, id) {
  const existing = await getOwned(userId, id);
  if (!existing) return null;
  await prisma.timetables.delete({ where: { id } });
  return true;
}
