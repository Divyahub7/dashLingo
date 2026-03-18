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
  "#f6339a",
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
            <Bar dataKey={yKey} fill="var(--chart)" radius={[4, 4, 0, 0]} />
          </BarChart>
        );

      case "line": {
        const categoryKey = Object.keys(data[0]).find(
          (k) => k !== xKey && k !== yKey && typeof data[0][k] === "string",
        );

        if (categoryKey) {
          const categories = [...new Set(data.map((d) => d[categoryKey]))];
          const pivoted = {};
          data.forEach((row) => {
            if (!pivoted[row[xKey]]) pivoted[row[xKey]] = { [xKey]: row[xKey] };
            pivoted[row[xKey]][row[categoryKey]] = row[yKey];
          });
          const pivotedData = Object.values(pivoted);

          return (
            <LineChart
              data={pivotedData}
              margin={{ top: 10, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey={xKey}
                tick={{ fill: "#9ca3af", fontSize: 12 }}
                angle={-35}
                textAnchor="end"
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
              {categories.map((cat, i) => (
                <Line
                  key={cat}
                  type="monotone"
                  dataKey={cat}
                  stroke={COLORS[i % COLORS.length]}
                  strokeWidth={2}
                  dot={{ fill: COLORS[i % COLORS.length], r: 4 }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          );
        }

        return (
          <LineChart {...commonProps}>
            {commonAxis}
            <Line
              type="monotone"
              dataKey={yKey}
              stroke="var(--chart-hover)"
              strokeWidth={2}
              dot={{ fill: "var(--chart-hover)", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        );
      }
      case "area":
        return (
          <AreaChart {...commonProps}>
            {commonAxis}
            <Area
              type="monotone"
              dataKey={yKey}
              stroke="var(--chart-hover)"
              fill="var(--chart)"
              fillOpacity={0.3}
              strokeWidth={2}
            />
          </AreaChart>
        );

      case "scatter": {
        // Recharts Scatter needs {x, y} format
        const scatterData = data.map((row) => ({
          x: Number(row[xKey]),
          y: Number(row[yKey]),
          ...row,
        }));

        return (
          <ScatterChart margin={{ top: 10, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              type="number"
              dataKey="x"
              name={xKey}
              tick={{ fill: "#9ca3af", fontSize: 11 }}
              label={{
                value: xKey,
                position: "insideBottom",
                offset: -10,
                fill: "#9ca3af",
              }}
              domain={["dataMin", "dataMax"]}
              ticks={scatterData.map((d) => d.x)}
            />
            <YAxis
              type="number"
              dataKey="y"
              name={yKey}
              tick={{ fill: "#9ca3af", fontSize: 11 }}
              label={{
                value: yKey,
                angle: -90,
                position: "insideLeft",
                fill: "#9ca3af",
              }}
              domain={["auto", "auto"]}
            />
            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "1px solid #374151",
                borderRadius: "8px",
                color: "#f9fafb",
              }}
              formatter={(value, name) => [value, name === "x" ? xKey : yKey]}
            />
            <Scatter
              data={scatterData}
              fill="var(--chart-hover)"
              fillOpacity={0.7}
            />
          </ScatterChart>
        );
      }

      case "pie": {
        // Remove the yKey column from legend — only show category names
        const pieData = data.map((entry, i) => ({
          ...entry,
          fill: COLORS[i % COLORS.length],
        }));

        return (
          <PieChart>
            <Pie
              data={pieData}
              dataKey={yKey}
              nameKey={xKey}
              cx="50%"
              cy="50%"
              outerRadius={140}
              label={({ name, percent }) =>
                percent > 0.02 ? `${name} ${(percent * 100).toFixed(0)}%` : ""
              }
              labelLine={false}
            >
              {pieData.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "1px solid #374151",
                borderRadius: "8px",
                color: "#f9fafb",
              }}
              formatter={(value, name) => [`${value}`, name]}
            />
            <Legend
              wrapperStyle={{ color: "#9ca3af" }}
              payload={pieData.map((entry, i) => ({
                value: entry[xKey],
                type: "square",
                id: entry[xKey],
                color: COLORS[i % COLORS.length],
              }))}
            />
          </PieChart>
        );
      }

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
