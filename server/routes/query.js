import express from "express";
import db from "../db/database.js";
import { askGemini } from "../gemini.js";
import QueryHistory from "../models/QueryHistory.js";

const router = express.Router();

// Simple in-memory cache
const queryCache = new Map();
const CACHE_MAX = 100;

const generateInsight = (rows, xKey, yKey, geminiInsight) => {
  if (!rows || rows.length === 0) return "No data found for this query.";
  const values = rows.map((r) => parseFloat(r[yKey])).filter((v) => !isNaN(v));
  if (values.length === 0) return geminiInsight;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const topRow = rows.find((r) => parseFloat(r[yKey]) === max);
  const bottomRow = rows.find((r) => parseFloat(r[yKey]) === min);
  const topLabel = topRow ? topRow[xKey] : null;
  const bottomLabel = bottomRow ? bottomRow[xKey] : null;
  if (topLabel && bottomLabel && topLabel !== bottomLabel) {
    return `${topLabel} leads with ${max.toFixed(1)} while ${bottomLabel} has the lowest at ${min.toFixed(1)}. Average across ${rows.length} records is ${avg.toFixed(1)}.`;
  }
  if (topLabel) {
    return `${topLabel} has the highest value at ${max.toFixed(1)}, with an average of ${avg.toFixed(1)} across ${rows.length} records.`;
  }
  return geminiInsight;
};

router.post("/query", async (req, res) => {
  const { prompt, sessionId } = req.body;

  if (!prompt || prompt.trim() === "") {
    return res.status(400).json({ error: "Prompt is required!" });
  }

  // Check cache first
  const cacheKey = prompt.trim().toLowerCase();
  if (queryCache.has(cacheKey)) {
    console.log("Cache hit — skipping Gemini call");
    return res.json(queryCache.get(cacheKey));
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

    const insight = generateInsight(
      rows,
      geminiData.xKey,
      geminiData.yKey,
      geminiData.insight,
    );

    await QueryHistory.create({
      sessionId: sessionId || "anonymous",
      prompt,
      sql: geminiData.sql,
      chartType: geminiData.chartType,
      title: geminiData.title,
      insight,
      rowCount: rows.length,
    });

    const responseData = {
      data: rows,
      chartType: geminiData.chartType,
      xKey: geminiData.xKey,
      yKey: geminiData.yKey,
      title: geminiData.title,
      insight,
      sql: geminiData.sql,
      rowCount: rows.length,
    };

    // Save to cache
    if (queryCache.size >= CACHE_MAX) {
      const firstKey = queryCache.keys().next().value;
      queryCache.delete(firstKey);
    }
    queryCache.set(cacheKey, responseData);

    res.json(responseData);
  } catch (err) {
    console.error("Query error:", err);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

export default router;
