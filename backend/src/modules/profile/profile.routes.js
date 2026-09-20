import express from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import * as controller from "./profile.controller.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", controller.getProfile);
router.put("/", controller.updateProfile);
router.post("/change-password", controller.changePassword);

export default router;
