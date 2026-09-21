import express from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import * as controller from "./resources.controller.js";
import { uploadResourceFile } from "../../lib/storage.js";

const router = express.Router();
router.use(requireAuth);

router.get("/", controller.list);
router.post("/", uploadResourceFile.single("file"), controller.create);
router.get("/:id", controller.getOne);
router.delete("/:id", controller.remove);

export default router;
