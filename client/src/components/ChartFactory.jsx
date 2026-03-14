import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#f97316",
  "#84cc16",
];

export default function ChartFactory({ chartType, data, xKey, yKey, title }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No data to display
      </div>
    );
  }

  const commonProps = {
    data,
    margin: { top: 10, right: 30, left: 20, bottom: 60 },
  };

  const commonAxis = (
    <>
      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
      <XAxis
        dataKey={xKey}
        tick={{ fill: "#9ca3af", fontSize: 11 }}
        angle={-35}
        textAnchor="end"
        interval={0}
        height={70}
      />
      <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} />
      <Tooltip
        contentStyle={{
          backgroundColor: "#1f2937",
          border: "1px solid #374151",
          borderRadius: "8px",
          color: "#f9fafb",
        }}
      />
      <Legend wrapperStyle={{ color: "#9ca3af", paddingTop: "20px" }} />
    </>
  );

  const renderChart = () => {
    switch (chartType) {
      case "bar":
        return (
          <BarChart {...commonProps}>
            {commonAxis}
            <Bar dataKey={yKey} fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        );

      case "line":
        return (
          <LineChart {...commonProps}>
            {commonAxis}
            <Line
              type="monotone"
              dataKey={yKey}
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: "#3b82f6", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        );

      case "area":
        return (
          <AreaChart {...commonProps}>
            {commonAxis}
            <Area
              type="monotone"
              dataKey={yKey}
              stroke="#3b82f6"
              fill="#1d4ed8"
              fillOpacity={0.3}
              strokeWidth={2}
            />
          </AreaChart>
        );

      case "scatter":
        return (
          <ScatterChart {...commonProps}>
            {commonAxis}
            <Scatter data={data} fill="#3b82f6">
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Scatter>
          </ScatterChart>
        );

      case "pie":
        return (
          <PieChart>
            <Pie
              data={data}
              dataKey={yKey}
              nameKey={xKey}
              cx="50%"
              cy="50%"
              outerRadius={140}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
              labelLine={true}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "1px solid #374151",
                borderRadius: "8px",
                color: "#f9fafb",
              }}
            />
            <Legend wrapperStyle={{ color: "#9ca3af" }} />
          </PieChart>
        );

      default:
        return (
          <BarChart {...commonProps}>
            {commonAxis}
            <Bar dataKey={yKey} fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        );
    }
  };

  return (
    <div className="w-full">
      {title && (
        <h2 className="text-white text-xl font-semibold mb-6">{title}</h2>
      )}
      <ResponsiveContainer width="100%" height={400}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
}
