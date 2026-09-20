import * as service from "./timetable.service.js";

const VALID_DAYS = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
];
const TIME_RE = /^([01]\d|2[0-3]):([0-5]\d)$/;

function validateBody(body, partial = false) {
  const { day, startTime, endTime, subject, learningSpaceId } = body;

  if (!partial) {
    if (!subject && !learningSpaceId) {
      return "subject or learningSpaceId is required.";
    }
    if (!VALID_DAYS.includes(day)) return "day must be a valid weekday name.";
    if (!TIME_RE.test(startTime)) return "startTime must be in HH:mm format.";
    if (!TIME_RE.test(endTime))   return "endTime must be in HH:mm format.";
  } else {
    if (day !== undefined && !VALID_DAYS.includes(day)) {
      return "day must be a valid weekday name.";
    }
    if (startTime !== undefined && !TIME_RE.test(startTime)) {
      return "startTime must be in HH:mm format.";
    }
    if (endTime !== undefined && !TIME_RE.test(endTime)) {
      return "endTime must be in HH:mm format.";
    }
  }

  const s = startTime ?? body.startTime;
  const e = endTime ?? body.endTime;
  if (s && e && TIME_RE.test(s) && TIME_RE.test(e) && s >= e) {
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
    const error = validateBody(req.body, false);
    if (error) return res.status(400).json({ error });

    const entry = await service.create(req.user.id, req.body);
    if (!entry) {
      return res.status(400).json({
        error: "Could not create schedule entry.",
      });
    }
    res.status(201).json(entry);
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const error = validateBody(req.body, true);
    if (error) return res.status(400).json({ error });

    const updated = await service.update(req.user.id, Number(req.params.id), req.body);
    if (!updated) {
      return res.status(404).json({
        error: "Schedule entry not found.",
      });
    }
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
