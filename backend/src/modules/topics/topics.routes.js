import express from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import * as topicsController from "./topics.controller.js";
import * as resourcesController from "../resources/resources.controller.js";
import { uploadResourceFile } from "../../lib/storage.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", topicsController.list);
router.post("/", topicsController.create);
router.get("/:id", topicsController.getOne);
router.put("/:id", topicsController.update);
router.delete("/:id", topicsController.remove);

// Topic-scoped resources: /api/topics/:topicId/resources
router.get("/:topicId/resources", resourcesController.listForTopic);
router.post(
  "/:topicId/resources",
  uploadResourceFile.single("file"),
  resourcesController.createForTopic
);

export default router;
