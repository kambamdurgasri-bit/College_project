import express from "express";
import tempAuth from "../../middleware/tempAuth.js";
import * as controller from "./analytics.controller.js";

const router = express.Router();

router.use(tempAuth);

router.get("/", controller.getAnalytics);

export default router;