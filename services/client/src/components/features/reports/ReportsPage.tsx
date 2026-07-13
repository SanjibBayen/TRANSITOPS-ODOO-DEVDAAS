import React, { useState } from 'react';
import { CostAnalysis } from './CostAnalysis';
import { VehicleROI } from './VehicleROI';
import { FleetUtilization } from './FleetUtilization';
import { ReportFilters } from './ReportFilters';
import { ExportButton } from './ExportButton';

export const ReportsPage: React.FC = () => {
  const [filters, setFilters] = useState({ period: 'this-month', type: 'all' });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#1b1c1c] dark:text-zinc-100">Reports & Analytics</h1>
          <p className="text-xs text-gray-500 dark:text-zinc-400">Financial reports, ROI analysis, and fleet insights</p>
        </div>
        <ExportButton />
      </div>
      <ReportFilters filters={filters} onChange={setFilters} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CostAnalysis />
        <VehicleROI />
      </div>
      <FleetUtilization />
    </div>
  );
};