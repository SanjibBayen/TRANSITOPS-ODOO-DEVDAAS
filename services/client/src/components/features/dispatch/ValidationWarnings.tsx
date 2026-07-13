import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ValidationWarningsProps {
  warnings: string[];
}

export const ValidationWarnings: React.FC<ValidationWarningsProps> = ({ warnings }) => (
  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
    <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-sm mb-2">
      <AlertTriangle className="h-4 w-4" /> Warnings
    </div>
    <ul className="space-y-1">
      {warnings.map((w, i) => <li key={i} className="text-xs text-amber-600 dark:text-amber-400">• {w}</li>)}
    </ul>
  </div>
);