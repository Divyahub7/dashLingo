import express from "express";
import multer from "multer";
import fs from "fs";
import csv from "csv-parser";
import db from "../db/database.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    console.log(" Upload route hit");
    const filePath = req.file.path;

    let headers = [];
    let rows = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("headers", (h) => {
        headers = h;
      })
      .on("data", (data) => {
        rows.push(data);
      })
      .on("end", () => {
        const tableName = "table_" + Date.now();

        // create columns dynamically
        const columns = headers.map((h) => `"${h}" TEXT`).join(",");

        db.exec(`CREATE TABLE ${tableName} (${columns})`);

        // insert rows
        const placeholders = headers.map(() => "?").join(",");
        const stmt = db.prepare(
          `INSERT INTO ${tableName} VALUES (${placeholders})`,
        );

        rows.forEach((row) => {
          stmt.run(headers.map((h) => row[h]));
        });

        fs.unlinkSync(filePath); // cleanup

        res.json({ tableName, headers });
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
});

export default router;
