import express from "express";
import tempAuth from "../../middleware/tempAuth.js";
import * as controller from "./learningSpaces.controller.js";

const router = express.Router();

router.use(tempAuth);

router.get("/", controller.list);
router.post("/", controller.create);
router.get("/:id", controller.getOne);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

export default router;
