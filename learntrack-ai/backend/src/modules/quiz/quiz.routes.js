import express from "express";
import tempAuth from "../../middleware/tempAuth.js";
import * as controller from "./quiz.controller.js";

const router = express.Router();

router.use(tempAuth);

// Static/more-specific routes must come before "/:id" so Express doesn't
// try to parse "history" as a quiz id.
router.get("/history", controller.history);
router.get("/attempts/:attemptId", controller.attemptReview);
router.post("/generate", controller.createAI);

router.get("/", controller.listForLearningSpace);
router.post("/", controller.create);
router.get("/:id", controller.getForAttempt);
router.post("/:id/attempts", controller.submitAttempt);

export default router;