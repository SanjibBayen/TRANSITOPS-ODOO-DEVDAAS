import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const FuelEfficiencyChart: React.FC = () => {
  const data = [
    { date: 'Jan', efficiency: 5.2 },
    { date: 'Feb', efficiency: 5.5 },
    { date: 'Mar', efficiency: 5.1 },
    { date: 'Apr', efficiency: 5.8 },
    { date: 'May', efficiency: 5.4 },
    { date: 'Jun', efficiency: 6.0 },
  ];

  return (
    <div className="rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-4">
      <h3 className="text-sm font-bold mb-3">Fuel Efficiency Trend (km/L)</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <XAxis dataKey="date" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} />
          <Tooltip />
          <Line type="monotone" dataKey="efficiency" stroke="#714B67" strokeWidth={2} dot={{ fill: '#714B67' }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};