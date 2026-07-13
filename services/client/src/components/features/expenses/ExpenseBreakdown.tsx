import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export const ExpenseBreakdown: React.FC = () => {
  const data = [
    { name: 'Fuel', value: 45, color: '#F59E0B' },
    { name: 'Toll', value: 25, color: '#3B82F6' },
    { name: 'Maintenance', value: 20, color: '#EF4444' },
    { name: 'Other', value: 10, color: '#6B7280' },
  ];

  return (
    <div className="rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-4">
      <h3 className="text-sm font-bold mb-3">Cost Breakdown</h3>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
            {data.map((entry, index) => <Cell key={index} fill={entry.color} />)}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex justify-center gap-4 mt-3">
        {data.map(d => <div key={d.name} className="flex items-center gap-1 text-[10px] font-bold"><span className="h-2 w-2 rounded-full" style={{background: d.color}} />{d.name}</div>)}
      </div>
    </div>
  );
};