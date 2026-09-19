import express from "express";
import multer from "multer";
import tempAuth from "../../middleware/tempAuth.js";
import * as controller from "./quiz.controller.js";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
});

router.use(tempAuth);

// Static/more-specific routes must come before "/:id" so Express doesn't
// try to parse "history" as a quiz id.
router.get("/history", controller.history);
router.get("/attempts/:attemptId", controller.attemptReview);
router.post("/generate", controller.createAI);
router.post("/generate-from-pdf", upload.single("file"), controller.createAIFromPdf);

router.get("/", controller.listForLearningSpace);
router.post("/", controller.create);
router.get("/:id", controller.getForAttempt);
router.post("/:id/attempts", controller.submitAttempt);

export default router;