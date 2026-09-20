import * as recommendationsService from "./recommendations.service.js";

export async function getRecommendations(req, res) {
  try {
    const data = await recommendationsService.getRecommendations(req.user.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
