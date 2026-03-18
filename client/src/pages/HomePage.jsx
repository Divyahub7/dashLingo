import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, BarChart2, TrendingUp, PieChart } from "lucide-react";
import { Link } from "react-router-dom";

const EXAMPLE_QUERIES = [
  {
    icon: <BarChart2 size={20} />,
    text: "Show me the average price of each model",
  },
  {
    icon: <TrendingUp size={20} />,
    text: "Compare average mpg of Diesel vs Petrol cars by year",
  },
  {
    icon: <PieChart size={20} />,
    text: "Show distribution of fuel types in the inventory",
  },
];

const FEATURES = [
  "Natural language queries",
  "Auto chart selection",
  "AI-generated insights",
  "SQL transparency",
  "Chat follow-up",
  "CSV upload",
];

export default function HomePage() {
  const [prompt, setPrompt] = useState("");
  const [focused, setFocused] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (!prompt.trim()) return;
    navigate("/dashboard", { state: { prompt } });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center shrink-0">
            <BarChart2 size={14} color="#09090b" strokeWidth={2.5} />
          </div>
          <span className="text-white text-base font-bold tracking-tight">
            DashLingo
          </span>
        </div>

        <Link to="/dashboard">
          <span className="text-zinc-400 text-sm">
            Conversational BI Dashboard
          </span>
        </Link>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20">
        {/* Badge */}
        <div className="mb-8 flex items-center gap-2 px-4 py-1.5 rounded-full border border-zinc-700 bg-zinc-900">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-zinc-300 text-sm font-medium">
            Powered by Gemini AI
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-center mb-4 text-6xl text-white font-bold tracking-tight leading-tight">
          Ask anything.
          <br />
          <span className="text-[oklch(65.6%_0.241_354.308)]">
            Get instant charts.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-center mb-10 max-w-lg text-zinc-300 text-lg leading-relaxed">
          generate plain english to useful insights...
        </p>

        {/* Input */}
        <div className="w-full max-w-2xl mb-6">
          <div
            className={`flex items-center rounded-2xl bg-zinc-900 transition-all duration-200 ${
              focused
                ? "ring-2 ring-blue-500 border border-blue-500"
                : "border border-zinc-700"
            }`}
          >
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="e.g. Show average price by model..."
              className="flex-1 bg-transparent outline-none text-white text-base px-5 py-4 placeholder:text-placeholder"
            />
            <button
              onClick={handleSubmit}
              disabled={!prompt.trim()}
              className={`m-2 px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all duration-150 ${
                prompt.trim()
                  ? "bg-primary hover:bg-primary-500 text-white cursor-pointer"
                  : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
              }`}
            >
              Ask <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Example queries */}
        <div className="w-full max-w-2xl mb-12">
          <p className="text-zinc-400 text-xs font-semibold uppercase tracking-widest mb-3">
            Try these
          </p>
          <div className="flex flex-col gap-2">
            {EXAMPLE_QUERIES.map((q, i) => (
              <button
                key={i}
                onClick={() => setPrompt(q.text)}
                className="flex items-center gap-5 px-5 py-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800 text-zinc-300 hover:text-white text-base text-left transition-all duration-150"
              >
                <span className="text-primary shrink-0">{q.icon}</span>
                {q.text}
              </button>
            ))}
          </div>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-2 justify-center">
          {FEATURES.map((f, i) => (
            <span
              key={i}
              className="px-3.5 py-2 rounded-full border border-zinc-700 bg-zinc-900 text-zinc-300 text-sm font-medium"
            >
              {f}
            </span>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="px-8 py-4 border-t border-zinc-800 flex items-center justify-center">
        <span className="text-zinc-500 text-xs">
          Upload any CSV · Ask any question · Get instant charts
        </span>
      </footer>
    </div>
  );
}
