import React from 'react';
import { Download, FileSpreadsheet, FileText } from 'lucide-react';
import { exportUtils } from '../../../utils/export';

export const ExportButton: React.FC = () => (
  <div className="flex items-center gap-2">
    <button onClick={exportUtils.exportVehiclesCSV} className="px-3 py-2 rounded-lg border border-gray-200 dark:border-zinc-700 text-xs font-bold flex items-center gap-1.5 hover:bg-gray-50 dark:hover:bg-zinc-800">
      <FileSpreadsheet className="h-3.5 w-3.5" /> CSV
    </button>
    <button onClick={exportUtils.exportVehiclesPDF} className="px-3 py-2 rounded-lg border border-gray-200 dark:border-zinc-700 text-xs font-bold flex items-center gap-1.5 hover:bg-gray-50 dark:hover:bg-zinc-800">
      <FileText className="h-3.5 w-3.5" /> PDF
    </button>
  </div>
);