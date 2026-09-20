import express from "express";
import multer from "multer";
import * as controller from "./quiz.controller.js";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
});

router.use((req, res, next) => {
  if (!req.user) {
    req.user = { id: parseInt(req.headers['x-user-id'] || 1, 10) };
  }
  next();
});

router.get("/history", controller.history);
router.get("/attempts/:attemptId", controller.attemptReview);
router.post("/generate", controller.createAI);
router.post("/generate-from-pdf", upload.single("file"), controller.createAIFromPdf);

router.get("/", controller.listForLearningSpace);
router.post("/", controller.create);
router.get("/:id", controller.getForAttempt);
router.post("/:id/attempts", controller.submitAttempt);

export default router;
