export default function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Chart skeleton */}
      <div className="bg-gray-800 rounded-xl p-6 mb-4">
        <div className="h-6 bg-gray-700 rounded w-1/3 mb-6"></div>
        <div className="flex items-end gap-3 h-48">
          {[60, 85, 45, 95, 70, 55, 80, 65, 90, 50].map((h, i) => (
            <div
              key={i}
              className="bg-gray-700 rounded-t flex-1"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>
      {/* Insight skeleton */}
      <div className="bg-gray-800 rounded-xl p-5">
        <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-700 rounded w-1/2"></div>
      </div>
    </div>
  );
}
