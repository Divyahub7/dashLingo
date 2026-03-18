import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import html2canvas from "html2canvas";
import { Download } from "lucide-react";
import {
  AlertTriangle,
  Clock,
  Trash2,
  ArrowLeft,
  Send,
  BarChart2,
  Plus,
} from "lucide-react";
import { sendQuery } from "../api";
import ChartFactory from "../components/ChartFactory";
import InsightCard from "../components/InsightCard";
import LoadingSkeleton from "../components/LoadingSkeleton";

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
  const [conversation, setConversation] = useState([]);
  const chartRef = useRef(null);
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem("dashLingo_history");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const sessionId = useRef(getSessionId());
  const initialPromptRan = useRef(false);
  const inputRef = useRef(null);

  const handleQuery = useCallback(
    async (queryPrompt) => {
      const q = queryPrompt || prompt;
      if (!q.trim()) return;
      setPrompt("");
      setLoading(true);
      setError(null);
      setResult(null);
      try {
        const data = await sendQuery(q, sessionId.current, conversation);
        if (data.error) {
          setError(data.error);
        } else {
          setResult(data);
          setConversation((prev) => [
            ...prev,
            { role: "user", text: q },
            {
              role: "model",
              text: `I generated this response: ${JSON.stringify({
                sql: data.sql,
                chartType: data.chartType,
                xKey: data.xKey,
                yKey: data.yKey,
                title: data.title,
                insight: data.insight,
              })}. The SQL I used was: ${data.sql}`,
            },
          ]);
          setHistory((prev) => {
            if (prev.length > 0 && prev[0].prompt === q) return prev;
            const updated = [{ prompt: q, ...data }, ...prev].slice(0, 10);
            localStorage.setItem("dashLingo_history", JSON.stringify(updated));
            return updated;
          });
        }
      } catch {
        setError(
          "Could not connect to server. Make sure the backend is running.",
        );
      } finally {
        setLoading(false);
      }
    },
    [prompt, conversation],
  );

  const handleDownload = async () => {
    if (!chartRef.current) return;

    // temporarily force safe colors
    const originalBg = chartRef.current.style.backgroundColor;
    chartRef.current.style.backgroundColor = "#18181b"; // zinc-900 fallback

    try {
      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: "#18181b",
      });

      const link = document.createElement("a");
      link.download = `${result.title || "chart"}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (err) {
      console.error("Download failed:", err);
    }

    // restore original style
    chartRef.current.style.backgroundColor = originalBg;
  };

  useEffect(() => {
    if (location.state?.prompt && !initialPromptRan.current) {
      initialPromptRan.current = true;
      handleQuery(location.state.prompt);
      window.history.replaceState({}, "");
    }
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) handleQuery();
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("dashLingo_history");
  };

  const startNew = () => {
    setConversation([]);
    setResult(null);
    setError(null);
    setPrompt("");
    inputRef.current?.focus();
  };

  return (
    <div className="min-h-screen flex bg-zinc-950">
      {/* Sidebar */}
      <aside className="w-56 bg-zinc-900 border-r border-zinc-800 flex flex-col shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-2 px-4 py-5 border-b border-zinc-800">
          <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center shrink-0">
            <BarChart2 size={14} color="#09090b" strokeWidth={2.5} />
          </div>
          <span className="text-white text-sm font-bold tracking-tight">
            DashLingo
          </span>
        </div>

        {/* New chart button */}
        <div className="px-3 pt-4">
          <button
            onClick={startNew}
            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600 text-zinc-300 hover:text-white text-sm font-medium transition-all duration-150"
          >
            <Plus size={13} /> New chart
          </button>
        </div>

        {/* History */}
        <div className="flex-1 overflow-hidden flex flex-col px-3 pt-5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Clock size={18} className="text-zinc-500" />
              <span className="text-zinc-400 text-sm font-semibold uppercase tracking-widest">
                Recent searches
              </span>
            </div>
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                className="text-zinc-600 hover:text-red-400 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <p className="text-zinc-600 text-xs mt-2 mx-auto">No queries yet</p>
          ) : (
            <div className="flex flex-col gap-1 overflow-y-auto">
              {history.map((h, i) => (
                <button
                  key={i}
                  onClick={() => handleQuery(h.prompt)}
                  className="text-left px-2.5 py-2 rounded-lg bg-transparent hover:bg-zinc-800 text-zinc-400 hover:text-white text-xs leading-snug line-clamp-2 transition-all duration-150"
                >
                  {h.prompt}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Back */}
        <div className="px-4 py-4 border-t border-zinc-800">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-zinc-500 hover:text-white text-sm transition-colors"
          >
            <ArrowLeft size={12} /> Back to home
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col h-screen">
        {/* Scrollable chart area */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto">
            {loading && <LoadingSkeleton />}

            {error && !loading && (
              <div className="flex items-center gap-3 px-5 py-4 rounded-xl bg-red-950/40 border border-red-800 text-red-300 text-sm">
                <AlertTriangle size={16} className="shrink-0" />
                {error}
              </div>
            )}

            {result && !loading && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <button
                  onClick={handleDownload}
                  className="absolute top-8 right-10 p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600 transition-all"
                >
                  {" "}
                  <Download size={16} className="text-zinc-300" />
                </button>
                <div ref={chartRef}>
                  <ChartFactory
                    chartType={result.chartType}
                    data={result.data}
                    xKey={result.xKey}
                    yKey={result.yKey}
                    title={result.title}
                  />
                </div>
                <InsightCard
                  insight={result.insight}
                  rowCount={result.rowCount}
                  sql={result.sql}
                />
              </div>
            )}

            {!result && !loading && !error && (
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-5">
                  <BarChart2 size={28} className="text-primary" />
                </div>
                <p className="text-zinc-300 text-xl font-semibold mb-2">
                  Your chart will appear here
                </p>
                <p className="text-zinc-500 text-sm">
                  Type a question below to generate a dashboard...
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom input bar */}
        <div className="border-t border-zinc-800 bg-zinc-900/80 backdrop-blur px-6 py-4">
          {/* Conversation indicator */}
          {conversation.length > 0 && (
            <div className="max-w-4xl mx-auto flex items-center justify-between mb-3">
              <span className="text-zinc-400 text-xs">
                {Math.floor(conversation.length / 2)} exchange
                {conversation.length > 2 ? "s" : ""} · follow-up mode
              </span>
              <button
                onClick={startNew}
                className="text-sm text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-500 px-3 py-2 rounded-lg transition-all"
              >
                New chat +
              </button>
            </div>
          )}

          {/* Input row */}
          <div className="max-w-4xl mx-auto flex gap-3 items-center">
            <input
              ref={inputRef}
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                conversation.length > 0
                  ? "Follow up — 'Now filter to only Diesel cars'..."
                  : "Ask anything about your data..."
              }
              className="flex-1 bg-zinc-800 border border-zinc-700 focus:border-primary focus:ring-2 rounded-xl px-5 py-3 text-white text-sm placeholder:text-zinc-500 outline-none transition-all"
            />
            <button
              onClick={() => handleQuery()}
              disabled={loading || !prompt.trim()}
              className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-150 ${
                prompt.trim() && !loading
                  ? "bg-primary hover:bg-primary-hover cursor-pointer"
                  : "bg-zinc-800 cursor-not-allowed"
              }`}
            >
              {loading ? (
                <svg
                  className="animate-spin w-4 h-4 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeOpacity="0.3"
                    strokeWidth="3"
                  />
                  <path fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              ) : (
                <Send
                  size={15}
                  className={prompt.trim() ? "text-white" : "text-zinc-600"}
                />
              )}
            </button>
          </div>

          <p className="text-center text-zinc-600 text-xs mt-3">
            DashLingo · Ask any question · Get instant charts
          </p>
        </div>
      </div>
    </div>
  );
}
