import express from "express";

import {
  getLearningSpaceProgress,
  getLearningSpaceProgressSummary,
  getProgressForUser,
} from "../controllers/progress.controller.js";

import tempAuth from "../middleware/tempAuth.js";

const router = express.Router();

router.use(tempAuth);

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