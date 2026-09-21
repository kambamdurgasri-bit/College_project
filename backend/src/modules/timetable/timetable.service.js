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

// DB columns start_time / end_time are VARCHAR(5) — store plain "HH:mm".
function normalizeTime(timeStr) {
  if (typeof timeStr !== "string") return null;
  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})/);
  if (!match) return null;
  const hours = match[1].padStart(2, "0");
  return `${hours}:${match[2]}`;
}

const timetableInclude = {
  learningSpace: { select: { id: true, name: true, colorId: true, icon: true } },
};

function mapTimetableRecord(entry) {
  const space = entry.learningSpace ?? null;
  return {
    id: entry.id,
    userId: entry.userId,
    day: entry.day,
    subject: space?.name ?? entry.subject,
    startTime: formatTime(entry.startTime),
    endTime: formatTime(entry.endTime),
    learningSpaceId: entry.learningSpaceId ?? null,
    learningSpace: space
      ? { id: space.id, name: space.name, colorId: space.colorId, icon: space.icon }
      : null,
  };
}

export async function listForUser(userId) {
  const entries = await prisma.timetables.findMany({
    where: { userId },
    include: timetableInclude,
    orderBy: [{ day: "asc" }, { startTime: "asc" }],
  });
  return entries.map(mapTimetableRecord);
}

export async function listForToday(userId) {
  const entries = await prisma.timetables.findMany({
    where: { userId, day: todayName() },
    include: timetableInclude,
    orderBy: { startTime: "asc" },
  });
  return entries.map(mapTimetableRecord);
}

export async function getOwned(userId, id) {
  const entry = await prisma.timetables.findUnique({ where: { id } });
  if (!entry || entry.userId !== userId) return null;
  return entry;
}

async function resolveSubject(data) {
  if (data.subject && String(data.subject).trim()) {
    return String(data.subject).trim();
  }
  if (data.learningSpaceId) {
    const space = await prisma.learningSpaces.findUnique({
      where: { id: Number(data.learningSpaceId) },
      select: { name: true },
    });
    if (space) return space.name;
  }
  return null;
}

export async function create(userId, data) {
  // Normalize learningSpaceId once up-front: the frontend sends a Number, but
  // it can also arrive as a numeric string (or ""). An empty string must map
  // to undefined — passing "" into the DB write / JSON body is what produced
  // the `"gSpaceId":,"day"` "not valid JSON" 400 from body-parser.
  const rawSpaceId = data?.learningSpaceId;
  const spaceId =
    rawSpaceId === undefined || rawSpaceId === null || rawSpaceId === ""
      ? undefined
      : Number(rawSpaceId);
  if (spaceId !== undefined && (!Number.isInteger(spaceId) || spaceId <= 0)) {
    return null;
  }

  const payload = { ...data, learningSpaceId: spaceId };
  const subject = await resolveSubject(payload);
  if (!subject) return null;

  const startTime = normalizeTime(payload.startTime) ?? "09:00";
  const endTime = normalizeTime(payload.endTime) ?? "10:00";

  const entry = await prisma.timetables.create({
    data: {
      userId,
      day: payload.day,
      subject,
      startTime,
      endTime,
      ...(spaceId !== undefined ? { learningSpaceId: spaceId } : {}),
    },
    include: timetableInclude,
  });

  return mapTimetableRecord(entry);
}

export async function update(userId, id, data) {
  const existing = await getOwned(userId, id);
  if (!existing) return null;

  const subject = await resolveSubject(data);
  const startTime = data.startTime ? normalizeTime(data.startTime) : undefined;
  const endTime = data.endTime ? normalizeTime(data.endTime) : undefined;

  const updated = await prisma.timetables.update({
    where: { id },
    data: {
      ...(subject && { subject }),
      ...(data.day && { day: data.day }),
      ...(startTime && { startTime }),
      ...(endTime && { endTime }),
      ...(data.learningSpaceId !== undefined && {
        learningSpaceId: data.learningSpaceId
          ? Number(data.learningSpaceId)
          : null,
      }),
    },
    include: timetableInclude,
  });

  return mapTimetableRecord(updated);
}

export async function remove(userId, id) {
  const existing = await getOwned(userId, id);
  if (!existing) return null;
  await prisma.timetables.delete({ where: { id } });
  return true;
}
