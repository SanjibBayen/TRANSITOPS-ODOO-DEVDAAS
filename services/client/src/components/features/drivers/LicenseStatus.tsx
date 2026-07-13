import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

export const LicenseStatus: React.FC<{ expiryDate: string }> = ({ expiryDate }) => {
  const daysLeft = Math.ceil((new Date(expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  
  if (daysLeft <= 0) return <span className="flex items-center gap-1 text-red-600 text-xs"><XCircle className="h-3 w-3" />Expired</span>;
  if (daysLeft <= 30) return <span className="flex items-center gap-1 text-amber-600 text-xs"><AlertTriangle className="h-3 w-3" />{daysLeft}d left</span>;
  return <span className="flex items-center gap-1 text-green-600 text-xs"><CheckCircle2 className="h-3 w-3" />Valid</span>;
};