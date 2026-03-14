export default function InsightCard({ insight, rowCount, sql }) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 mt-6">
      <div className="flex items-start gap-3">
        <span className="text-blue-400 text-xl mt-0.5">💡</span>
        <div className="flex-1">
          <p className="text-gray-200 text-sm leading-relaxed">{insight}</p>
          <p className="text-gray-500 text-xs mt-2">
            {rowCount} records analyzed
          </p>
        </div>
      </div>

      {/* SQL toggle */}
      <details className="mt-4">
        <summary className="text-gray-500 text-xs cursor-pointer hover:text-gray-400 select-none">
          View generated SQL
        </summary>
        <pre className="mt-2 text-xs text-green-400 bg-gray-900 rounded-lg p-3 overflow-x-auto">
          {sql}
        </pre>
      </details>
    </div>
  );
}
