import express from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import * as controller from "./learningSpaces.controller.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", controller.list);
router.post("/", controller.create);
router.get("/:id", controller.getOne);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

export default router;
