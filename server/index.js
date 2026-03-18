import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import schemaRouter from "./routes/schema.js";
import queryRouter from "./routes/query.js";
import historyRouter from "./routes/history.js";
import uploadRoute from "./routes/uploads.js";
import mongoose from "mongoose";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
  }),
);
app.use(express.json());

// Routes
app.use("/api", schemaRouter);
app.use("/api", queryRouter);
app.use("/api", historyRouter);
app.use("/api", uploadRoute);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "DashLingo server running" });
});

// Connecting Mongodb
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    console.log("Starting server without MongoDB...");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  });
