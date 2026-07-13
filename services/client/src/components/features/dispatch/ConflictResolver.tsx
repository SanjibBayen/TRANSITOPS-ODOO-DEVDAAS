import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ConflictResolverProps {
  conflicts: string[];
  onResolve: () => void;
}

export const ConflictResolver: React.FC<ConflictResolverProps> = ({ conflicts, onResolve }) => (
  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
    <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-bold text-sm mb-2">
      <AlertTriangle className="h-4 w-4" /> Validation Conflicts
    </div>
    <ul className="space-y-1 mb-3">
      {conflicts.map((c, i) => <li key={i} className="text-xs text-red-600 dark:text-red-400">• {c}</li>)}
    </ul>
    <button onClick={onResolve} className="text-xs text-red-600 underline">Dismiss</button>
  </div>
);