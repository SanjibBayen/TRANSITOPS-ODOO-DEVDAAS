import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path?: string;
  active?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  onNavigate?: (path: string) => void;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, onNavigate }) => {
  return (
    <nav className="flex items-center gap-1 text-xs mb-4">
      <button
        onClick={() => onNavigate?.('/dashboard')}
        className="flex items-center gap-1 text-gray-400 hover:text-[#714B67] transition-colors font-bold"
      >
        <Home className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Home</span>
      </button>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="h-3.5 w-3.5 text-gray-300 dark:text-zinc-600" />
          {item.active ? (
            <span className="text-[#714B67] dark:text-[#c48cb5] font-bold">{item.label}</span>
          ) : (
            <button
              onClick={() => item.path && onNavigate?.(item.path)}
              className="text-gray-500 dark:text-zinc-400 hover:text-[#714B67] dark:hover:text-zinc-300 font-bold transition-colors"
            >
              {item.label}
            </button>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};