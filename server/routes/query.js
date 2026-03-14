import express from "express";
import db from "../db/database.js";
import { askGemini } from "../gemini.js";
import QueryHistory from "../models/QueryHistory.js";

const router = express.Router();

router.post("/query", async (req, res) => {
  const { prompt, sessionId } = req.body;

  if (!prompt || prompt.trim() === "") {
    return res.json(400).json({ error: "Prompt is required!" });
  }

  try {
    const geminiResponse = await askGemini(prompt);

    if (!geminiResponse.success) {
      return res.status(500).json({ error: geminiResponse.error });
    }

    const geminiData = geminiResponse.data;

    if (geminiData.error) {
      await QueryHistory.create({
        sessionId: sessionId || "anonymous",
        prompt,
        error: geminiData.error,
      });
      return res.status(200).json({ error: geminiData.error });
    }

    let rows;
    try {
      rows = db.prepare(geminiData.sql).all();
    } catch (sqlError) {
      return res.status(200).json({
        error: `Could not run the generated query: ${sqlError.message}`,
      });
    }

    await QueryHistory.create({
      sessionId: sessionId || "anonymous",
      prompt,
      sql: geminiData.sql,
      chartType: geminiData.chartType,
      title: geminiData.title,
      insight: geminiData.insight,
      rowCount: rows.length,
    });

    res.json({
      data: rows,
      chartType: geminiData.chartType,
      xKey: geminiData.xKey,
      yKey: geminiData.yKey,
      title: geminiData.title,
      insight: geminiData.insight,
      sql: geminiData.sql,
      rowCount: rows.length,
    });
  } catch (err) {
    console.error("Query error:", err);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

export default router;
