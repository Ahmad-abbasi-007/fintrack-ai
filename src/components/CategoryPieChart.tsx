"use client";

import { formatCurrency } from "@/lib/currency";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { CategoryStat } from "@/lib/stats";
import { CHART_COLORS } from "@/lib/stats";

export default function CategoryPieChart({
  data,
  title,
}: {
  data: CategoryStat[];
  title: string;
}) {
  if (data.length === 0) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <p className="text-gray-500 text-sm text-center py-10">
          No data yet
        </p>
      </div>
    );
  }

  const chartData = data.map((d) => ({
    name: d.category,
    value: Number(d.amount.toFixed(2)),
  }));

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={3}
            >
              {chartData.map((_, i) => (
                <Cell
                  key={i}
                  fill={CHART_COLORS[i % CHART_COLORS.length]}
                  stroke="#0f172a"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#111827",
                border: "1px solid #374151",
                borderRadius: "8px",
                color: "#fff",
              }}
              formatter={(value) => formatCurrency(value)}
            />
            <Legend
              wrapperStyle={{ fontSize: "12px", color: "#9ca3af" }}
              iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}