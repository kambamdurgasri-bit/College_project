import express from "express";
// === TEMP_AUTH_DISABLED_START ===
// import tempAuth from "../../middleware/tempAuth.js";
// === TEMP_AUTH_DISABLED_END ===
import * as controller from "./dashboard.controller.js";

const router = express.Router();

// === TEMP_AUTH_DISABLED_START === router.use(tempAuth) removed; dashboard routes are temporarily unauthenticated. === TEMP_AUTH_DISABLED_END ===

router.get("/", controller.summary);

export default router;
