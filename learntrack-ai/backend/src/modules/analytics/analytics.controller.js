import * as service from "./analytics.service.js";

export async function getAnalytics(req, res, next) {
  try {
    const analytics = await service.getAnalytics(req.user.id);

    return res.status(200).json(analytics);
  } catch (error) {
    next(error);
  }
}