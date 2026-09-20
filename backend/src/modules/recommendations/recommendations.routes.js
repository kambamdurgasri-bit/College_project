import express from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import * as controller from "./recommendations.controller.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", controller.getRecommendations);

export default router;
