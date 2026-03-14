import mongoose from "mongoose";

const queryHistorySchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true },
    prompt: { type: String, required: true },
    sql: { type: String },
    chartType: { type: String },
    title: { type: String },
    insight: { type: String },
    rowCount: { type: Number },
    error: { type: String },
  },
  { timestamps: true },
);

export default mongoose.model("QueryHistory", queryHistorySchema);
