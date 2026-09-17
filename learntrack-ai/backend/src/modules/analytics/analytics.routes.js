// OWNER: Madhavi. Replace with real analytics routes once you push.
import express from "express";
const router = express.Router();

router.use((req, res) => {
  res.status(501).json({ error: "Analytics routes not implemented yet." });
});

export default router;
