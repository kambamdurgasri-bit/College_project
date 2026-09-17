import * as service from "./timetable.service.js";

const VALID_DAYS = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
];
const TIME_RE = /^([01]\d|2[0-3]):([0-5]\d)$/;

function validate(body, { partial } = {}) {
  const { day, subject, startTime, endTime } = body;
  if (!partial || day !== undefined) {
    if (!VALID_DAYS.includes(day)) return "day must be a valid weekday name.";
  }
  if (!partial || subject !== undefined) {
    if (!subject || !String(subject).trim()) return "subject is required.";
  }
  if (!partial || startTime !== undefined) {
    if (!TIME_RE.test(startTime)) return "startTime must be in HH:mm format.";
  }
  if (!partial || endTime !== undefined) {
    if (!TIME_RE.test(endTime)) return "endTime must be in HH:mm format.";
  }
  if (startTime && endTime && TIME_RE.test(startTime) && TIME_RE.test(endTime) && startTime >= endTime) {
    return "startTime must be before endTime.";
  }
  return null;
}

export async function list(req, res, next) {
  try {
    res.json(await service.listForUser(req.user.id));
  } catch (err) {
    next(err);
  }
}

export async function today(req, res, next) {
  try {
    res.json(await service.listForToday(req.user.id));
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const error = validate(req.body);
    if (error) return res.status(400).json({ error });
    const entry = await service.create(req.user.id, req.body);
    res.status(201).json(entry);
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const error = validate(req.body, { partial: true });
    if (error) return res.status(400).json({ error });
    const updated = await service.update(req.user.id, Number(req.params.id), req.body);
    if (!updated) return res.status(404).json({ error: "Schedule entry not found." });
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    const deleted = await service.remove(req.user.id, Number(req.params.id));
    if (!deleted) return res.status(404).json({ error: "Schedule entry not found." });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
