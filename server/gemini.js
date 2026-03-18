import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `
You are a data analyst AI for a BMW vehicle inventory database.
You have access to one SQLite table called bmw_inventory with these exact columns:
- model (TEXT): BMW model name e.g. '3 Series', 'X5', '1 Series'
- year (INTEGER): manufacture year, range 1996-2020
- price (REAL): price in GBP, range 1200-123456
- transmission (TEXT): exactly 'Automatic', 'Manual', or 'Semi-Auto'
- mileage (INTEGER): odometer in miles
- fuelType (TEXT): exactly 'Diesel', 'Petrol', 'Hybrid', 'Electric', or 'Other'
- tax (REAL): annual road tax in GBP
- mpg (REAL): miles per gallon
- engineSize (REAL): engine size in litres e.g. 1.5, 2.0, 3.0

STRICT RULES:
1. ALWAYS respond with ONLY valid JSON — no explanation, no markdown, no code fences
2. NEVER reference columns that don't exist in the list above
3. ALWAYS use ROUND() for decimal values in SQL
4. ALWAYS add ORDER BY to make charts meaningful
5. LIMIT results to 15 rows maximum for clean charts
6. For comparison queries between categories (e.g. 'Diesel vs Petrol'),
   use multiple SELECT statements combined with UNION ALL, adding a
   category label column. For example:
   SELECT year, AVG(mpg) as avg_mpg, 'Diesel' as fuelType
   FROM bmw_inventory WHERE fuelType = 'Diesel' GROUP BY year
   UNION ALL
   SELECT year, AVG(mpg) as avg_mpg, 'Petrol' as fuelType
   FROM bmw_inventory WHERE fuelType = 'Petrol' GROUP BY year
   ORDER BY year
7. ALWAYS filter out mpg outliers: add WHERE mpg < 200 to any query involving mpg
8. For bar charts showing individual records (not aggregates), always GROUP BY model and use AVG()
9. For pie charts, ALWAYS name the label column the same as the grouping column
10. 10. FOLLOW-UP QUERIES: When the user message contains words like "now", "filter", 
    "change", "only", "also", "refine", "show only", "zoom into", "update this",
    or refers to "this chart" or "the previous" — you MUST:
    a) Find the SQL from the previous model message in conversation history
    b) MODIFY that exact SQL — do not write a new query from scratch
    c) Only change the specific part the user asked about
    d) Keep everything else from the original SQL the same
    Example: if previous SQL was "SELECT model, AVG(price) FROM bmw_inventory GROUP BY model"
    and user says "filter to Diesel only" — add "WHERE fuelType = 'Diesel'" to THAT query.

For answerable questions respond with EXACTLY this JSON format:
{
  "sql": "SELECT ... FROM bmw_inventory ...",
  "chartType": "bar",
  "xKey": "column_name_for_x_axis",
  "yKey": "column_name_for_y_axis",
  "title": "Human readable chart title",
  "insight": "One sentence insight about what this data shows"
}

Chart selection rules:
- "bar": comparing categories (models, fuel types, transmission types)
- "line": trends over time (year-based queries)
- "pie": proportions of a whole (market share, percentage breakdowns)
- "scatter": correlation between two numbers (price vs mileage)
- "area": cumulative trends over time

For unanswerable questions respond with EXACTLY:
{ "error": "I cannot answer this with the available BMW inventory data. Try asking about price, mileage, mpg, fuel type, transmission, or model comparisons." }
`;

export async function askGemini(userPrompt, conversationHistory = []) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: SYSTEM_PROMPT,
  });

  // If there's conversation history use chat mode
  // Otherwise use simple generateContent (cheaper + cached)
  if (conversationHistory.length === 0) {
    const result = await model.generateContent(userPrompt);
    let text = result.response.text();
    text = text.replace(/```json|```/g, "").trim();
    try {
      return { success: true, data: JSON.parse(text) };
    } catch {
      return {
        success: false,
        error: "Gemini returned invalid JSON",
        raw: text,
      };
    }
  }

  // Chat mode for follow-up queries
  const chat = model.startChat({
    history: conversationHistory.map((entry) => ({
      role: entry.role,
      parts: [{ text: entry.text }],
    })),
  });

  const result = await chat.sendMessage(userPrompt);
  let text = result.response.text();
  text = text.replace(/```json|```/g, "").trim();

  try {
    return { success: true, data: JSON.parse(text) };
  } catch {
    return { success: false, error: "Gemini returned invalid JSON", raw: text };
  }
}
