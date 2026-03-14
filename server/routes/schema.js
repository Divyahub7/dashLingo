import express from "express";
import db from "../db/database.js";

const router = express.Router();

router.get("/schema", (req, res) => {
  const tables = db
    .prepare(`SELECT name FROM sqlite_master WHERE type='table'`)
    .all();

  const schema = {};
  for (const { name } of tables) {
    const cols = db.prepare(`PRAGMA table_info(${name})`).all();
    schema[name] = cols.map((c) => ({ name: c.name, type: c.type }));
  }

  res.json(schema);
});

export default router;
