import React from 'react';

interface KpiGridProps {
  children: React.ReactNode;
  columns?: number;
}

export const KpiGrid: React.FC<KpiGridProps> = ({ children, columns = 4 }) => (
  <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${columns} gap-4`}>
    {children}
  </div>
);