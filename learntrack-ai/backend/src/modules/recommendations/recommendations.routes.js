// OWNER: Madhavi. Replace with real recommendation routes once you push.
import express from "express";
const router = express.Router();

router.use((req, res) => {
  res.status(501).json({ error: "Recommendation routes not implemented yet." });
});

export default router;
