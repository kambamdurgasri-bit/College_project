import {
  getProgressForLearningSpace,
  getAllProgressForLearningSpace,
  getUserProgress,
} from "../services/progress.service.js";

export async function getLearningSpaceProgress(req, res) {
  try {
    const userId = Number(req.user.id);
    const learningSpaceId = Number(req.params.learningSpaceId);
    const periodType = String(req.query.period || "WEEKLY").toUpperCase();

    if (!Number.isInteger(learningSpaceId)) {
      return res.status(400).json({
        message: "Invalid learning space ID",
      });
    }

    if (!["DAILY", "WEEKLY", "MONTHLY"].includes(periodType)) {
      return res.status(400).json({
        message: "Invalid period. Use DAILY, WEEKLY, or MONTHLY.",
      });
    }

    const progress = await getProgressForLearningSpace(
      userId,
      learningSpaceId,
      periodType
    );

    return res.status(200).json({
      progress,
    });
  } catch (error) {
    console.error("Get learning space progress error:", error);

    return res.status(500).json({
      message: "Failed to get learning space progress",
    });
  }
}

export async function getLearningSpaceProgressSummary(req, res) {
  try {
    const userId = Number(req.user.id);
    const learningSpaceId = Number(req.params.learningSpaceId);

    if (!Number.isInteger(learningSpaceId)) {
      return res.status(400).json({
        message: "Invalid learning space ID",
      });
    }

    const progress = await getAllProgressForLearningSpace(
      userId,
      learningSpaceId
    );

    return res.status(200).json({
      progress,
    });
  } catch (error) {
    console.error("Get progress summary error:", error);

    return res.status(500).json({
      message: "Failed to get progress summary",
    });
  }
}

export async function getProgressForUser(req, res) {
  try {
    const userId = Number(req.user.id);

    const progress = await getUserProgress(userId);

    return res.status(200).json({
      progress,
    });
  } catch (error) {
    console.error("Get user progress error:", error);

    return res.status(500).json({
      message: "Failed to get user progress",
    });
  }
}