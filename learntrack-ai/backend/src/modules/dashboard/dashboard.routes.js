import express from "express";
import tempAuth from "../../middleware/tempAuth.js";
import * as controller from "./dashboard.controller.js";

const router = express.Router();

router.use(tempAuth);

router.get("/", controller.summary);

export default router;
