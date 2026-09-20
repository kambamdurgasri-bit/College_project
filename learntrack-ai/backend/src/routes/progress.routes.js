import express from "express";

import {
  getLearningSpaceProgress,
  getLearningSpaceProgressSummary,
  getProgressForUser,
} from "../controllers/progress.controller.js";

// === TEMP_AUTH_DISABLED_START ===
// import tempAuth from "../middleware/tempAuth.js";
// === TEMP_AUTH_DISABLED_END ===

const router = express.Router();

// === TEMP_AUTH_DISABLED_START === router.use(tempAuth) removed; progress routes are temporarily unauthenticated. === TEMP_AUTH_DISABLED_END ===

router.get("/", getProgressForUser);

router.get(
  "/learning-space/:learningSpaceId",
  getLearningSpaceProgress
);

router.get(
  "/learning-space/:learningSpaceId/summary",
  getLearningSpaceProgressSummary
);

export default router;