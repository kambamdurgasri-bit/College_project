import express from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import * as controller from "./timetable.controller.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", controller.list);
router.get("/today", controller.today);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

export default router;
