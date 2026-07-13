import React from 'react';
import { KpiCard } from './KpiCard';
import { KpiGrid } from './KpiGrid';
import { IndianRupee, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

export const FinancialAnalystDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#1b1c1c] dark:text-zinc-100">Financial Center</h1>
        <p className="text-xs text-gray-500 dark:text-zinc-400">Revenue and cost analysis</p>
      </div>

      <KpiGrid>
        <KpiCard title="Total Revenue" value="₹45,200" icon={<IndianRupee className="h-5 w-5" />} color="#10B981" />
        <KpiCard title="Fuel Cost" value="₹12,400" icon={<TrendingDown className="h-5 w-5" />} color="#F59E0B" />
        <KpiCard title="Maintenance" value="₹8,900" icon={<DollarSign className="h-5 w-5" />} color="#EF4444" />
        <KpiCard title="Avg ROI" value="18.5%" icon={<TrendingUp className="h-5 w-5" />} color="#3B82F6" />
      </KpiGrid>
    </div>
  );
};