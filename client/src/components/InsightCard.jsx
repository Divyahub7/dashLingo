import { Lightbulb, Code2 } from "lucide-react";

export default function InsightCard({ insight, rowCount, sql }) {
  return (
    <div className="mt-6 grid grid-cols-1 gap-4">
      {/* Insight section */}
      <div className="flex items-start gap-4 bg-gradient(to_right,var(--chart)/0.15,var(--surface))]  border border-[var(--surface-border)] rounded-xl p-5">
        <div className="bg-[var(--chart-hover)] rounded-lg p-2 shrink-0">
          <Lightbulb size={18} color="white" />
        </div>
        <div className="flex-1">
          <p className="text-white text-base font-medium leading-relaxed">
            {insight}
          </p>
          <p className="text-[var(--text-muted)] text-sm mt-2">
            {rowCount} records analyzed
          </p>
        </div>
      </div>

      {/* SQL section */}
      <div className="border border-gray-700 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Code2 size={14} color="#4ade80" />
          <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">
            Generated SQL
          </p>
        </div>
        <pre className="text-green-400 text-sm leading-relaxed overflow-x-auto whitespace-pre-wrap break-words">
          {sql}
        </pre>
      </div>
    </div>
  );
}
