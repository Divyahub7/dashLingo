import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { sendQuery } from "../api";
import ChartFactory from "../components/ChartFactory";
import InsightCard from "../components/InsightCard";
import LoadingSkeleton from "../components/LoadingSkeleton";

// Generate or retrieve session ID
const getSessionId = () => {
  let id = localStorage.getItem("dashLingo_sessionId");
  if (!id) {
    id = uuidv4();
    localStorage.setItem("dashLingo_sessionId", id);
  }
  return id;
};

export default function DashboardPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const sessionId = useRef(getSessionId());

  // Auto-run query if coming from HomePage
  useEffect(() => {
    if (location.state?.prompt) {
      handleQuery(location.state.prompt);
    }
  }, []);

  const handleQuery = async (queryPrompt) => {
    const q = queryPrompt || prompt;
    if (!q.trim()) return;

    setPrompt(q);
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await sendQuery(q, sessionId.current);

      if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
        setHistory((prev) => [{ prompt: q, ...data }, ...prev].slice(0, 10));
      }
    } catch (err) {
      setError(
        "Could not connect to server. Make sure the backend is running.",
      );
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleQuery();
  };

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Sidebar — query history */}
      <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col p-4 shrink-0">
        <button
          onClick={() => navigate("/")}
          className="text-blue-400 hover:text-blue-300 text-sm mb-6 text-left"
        >
          ← Back to home
        </button>
        <h2 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">
          Recent queries
        </h2>
        {history.length === 0 ? (
          <p className="text-gray-600 text-xs">No queries yet</p>
        ) : (
          <div className="flex flex-col gap-2">
            {history.map((h, i) => (
              <button
                key={i}
                onClick={() => handleQuery(h.prompt)}
                className="text-left text-xs text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg px-3 py-2 transition-colors line-clamp-2"
              >
                {h.prompt}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top input bar */}
        <div className="border-b border-gray-800 p-4 bg-gray-900">
          <div className="max-w-3xl mx-auto flex gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a follow-up question..."
              className="flex-1 bg-gray-800 text-white placeholder-gray-500 border border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={() => handleQuery()}
              disabled={loading || !prompt.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white text-sm font-medium px-5 py-3 rounded-xl transition-colors"
            >
              {loading ? "..." : "Ask →"}
            </button>
          </div>
        </div>

        {/* Chart area */}
        <div className="flex-1 p-6 max-w-4xl mx-auto w-full">
          {loading && <LoadingSkeleton />}

          {error && !loading && (
            <div className="bg-red-900/30 border border-red-700 rounded-xl p-5 text-red-300 text-sm">
              ⚠️ {error}
            </div>
          )}

          {result && !loading && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <ChartFactory
                chartType={result.chartType}
                data={result.data}
                xKey={result.xKey}
                yKey={result.yKey}
                title={result.title}
              />
              <InsightCard
                insight={result.insight}
                rowCount={result.rowCount}
                sql={result.sql}
              />
            </div>
          )}

          {!result && !loading && !error && (
            <div className="flex flex-col items-center justify-center h-full text-center py-20">
              <p className="text-gray-600 text-lg">
                Your chart will appear here
              </p>
              <p className="text-gray-700 text-sm mt-2">
                Type a question above to get started
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
