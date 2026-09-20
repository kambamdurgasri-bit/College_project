import express from "express";
import * as controller from "./timetable.controller.js";

const router = express.Router();

router.use((req, res, next) => {
  if (!req.user) {
    req.user = { id: parseInt(req.headers['x-user-id'] || 1, 10) };
  }
  next();
});

router.get("/", controller.list);
router.get("/today", controller.today);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

export default router;
