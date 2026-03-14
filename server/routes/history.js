import express from "express";
import QueryHistory from "../models/QueryHistory.js";

const router = express.Router();

router.get("/history/:sessionId", async (req, res) => {
  try {
    const history = await QueryHistory.find({
      sessionId: req.params.sessionId,
    })
      .sort({ created: -1 })
      .limit(20);

    res.json(history);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch history" });
  }
});

export default router;
