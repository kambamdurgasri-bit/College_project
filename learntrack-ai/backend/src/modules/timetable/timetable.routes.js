import express from "express";
import tempAuth from "../../middleware/tempAuth.js";
import * as controller from "./timetable.controller.js";

const router = express.Router();

router.use(tempAuth);

router.get("/", controller.list);
router.get("/today", controller.today);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

export default router;
