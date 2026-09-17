// OWNER: Madhavi. Replace with real profile/settings routes once you push.
import express from "express";
const router = express.Router();

router.use((req, res) => {
  res.status(501).json({ error: "Profile routes not implemented yet." });
});

export default router;
