import * as service from "./dashboard.service.js";

export async function summary(req, res, next) {
  try {
    const userId = parseInt(req.user?.id || req.headers['x-user-id'] || 1, 10);
    res.json(await service.getSummary(userId));
  } catch (err) {
    next(err);
  }
}
