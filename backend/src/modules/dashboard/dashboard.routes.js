import express from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import * as controller from "./dashboard.controller.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", controller.summary);

export default router;
