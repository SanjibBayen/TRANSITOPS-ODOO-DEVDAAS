import React from 'react';
import { Award } from 'lucide-react';

export const SafetyScore: React.FC<{ score: number }> = ({ score }) => {
  const color = score >= 90 ? 'text-green-600' : score >= 70 ? 'text-amber-600' : 'text-red-600';
  return <span className={`flex items-center gap-1 text-xs font-bold ${color}`}><Award className="h-3 w-3" />{score}/100</span>;
};