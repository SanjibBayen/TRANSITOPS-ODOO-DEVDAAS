import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export const CostAnalysis: React.FC = () => {
  const data = [
    { category: "Fuel", cost: 45000, color: "#F59E0B" },
    { category: "Maintenance", cost: 28000, color: "#EF4444" },
    { category: "Tolls", cost: 15000, color: "#3B82F6" },
    { category: "Permits", cost: 8000, color: "#10B981" },
    { category: "Insurance", cost: 22000, color: "#8B5CF6" },
  ];

  return (
    <div className="rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-4">
      <h3 className="text-sm font-bold mb-3">Cost Analysis</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis dataKey="category" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} />
          <Tooltip
            formatter={(value: any) => {
              const v = Array.isArray(value) ? value[0] : value;
              return v !== undefined && v !== null
                ? `₹${Number(v).toLocaleString()}`
                : "";
            }}
          />
          <Bar dataKey="cost" fill="#714B67" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
