import * as service from "./dashboard.service.js";

export async function summary(req, res, next) {
  try {
    res.json(await service.getSummary(req.user.id));
  } catch (err) {
    next(err);
  }
}
