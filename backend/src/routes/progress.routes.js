import express from "express";

import {
  getLearningSpaceProgress,
  getLearningSpaceProgressSummary,
  getProgressForUser,
} from "../controllers/progress.controller.js";

import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(requireAuth);

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