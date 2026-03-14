import { useState } from "react";
import { useNavigate } from "react-router-dom";

const EXAMPLE_QUERIES = [
  "Show me the average price of each BMW model",
  "Compare average mpg of Diesel vs Petrol cars by year from 2016 to 2020",
  "Show top 5 most fuel efficient automatic cars under £20,000",
];

export default function HomePage() {
  const [prompt, setPrompt] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (!prompt.trim()) return;
    navigate("/dashboard", { state: { prompt } });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <div className="mb-8 text-center">
        <h1 className="text-5xl font-bold text-white mb-2">
          Dash<span className="text-blue-500">Lingo</span>
        </h1>
        <p className="text-gray-400 text-lg">
          Ask anything about BMW inventory. Get instant charts.
        </p>
      </div>

      {/* Input Box */}
      <div className="w-full max-w-2xl">
        <div className="flex gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. Show me average price by BMW model..."
            className="flex-1 bg-gray-800 text-white placeholder-gray-500 border border-gray-700 rounded-xl px-5 py-4 text-base focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <button
            onClick={handleSubmit}
            disabled={!prompt.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium px-6 py-4 rounded-xl transition-colors"
          >
            Ask →
          </button>
        </div>

        {/* Example queries */}
        <div className="mt-6">
          <p className="text-gray-500 text-sm mb-3">Try these:</p>
          <div className="flex flex-col gap-2">
            {EXAMPLE_QUERIES.map((q, i) => (
              <button
                key={i}
                onClick={() => setPrompt(q)}
                className="text-left text-sm text-gray-400 hover:text-blue-400 bg-gray-800 hover:bg-gray-750 border border-gray-700 hover:border-blue-500 rounded-lg px-4 py-3 transition-all"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <p className="mt-12 text-gray-600 text-sm">
        Powered by Gemini AI · BMW Vehicle Inventory · 10,782 records
      </p>
    </div>
  );
}
