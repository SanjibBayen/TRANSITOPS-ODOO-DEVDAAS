import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {Icon && <Icon className="h-12 w-12 text-gray-300 dark:text-zinc-600 mb-4" />}
      <h3 className="text-sm font-bold text-gray-900 dark:text-zinc-100">{title}</h3>
      {description && <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1 max-w-sm">{description}</p>}
      {action && (
        <button onClick={action.onClick} className="mt-4 px-4 py-2 rounded-xl bg-[#714B67] text-white text-xs font-bold hover:bg-[#5e3b56] transition-all">
          {action.label}
        </button>
      )}
    </div>
  );
};