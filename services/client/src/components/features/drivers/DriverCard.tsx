import React from 'react';
import { Phone, Mail, Award } from 'lucide-react';

interface DriverCardProps {
  driver: {
    id: string;
    name: string;
    phone: string;
    email?: string;
    license_number: string;
    safety_score: number;
    status: string;
  };
  onClick?: () => void;
}

export const DriverCard: React.FC<DriverCardProps> = ({ driver, onClick }) => (
  <div onClick={onClick} className="rounded-xl bg-white dark:bg-zinc-900 p-4 border border-gray-200 dark:border-zinc-800 shadow-sm cursor-pointer hover:shadow-md transition-all">
    <div className="flex items-center gap-3 mb-3">
      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#714B67] to-[#5a3b52] flex items-center justify-center text-white font-bold text-sm">
        {driver.name.charAt(0)}
      </div>
      <div>
        <h4 className="text-sm font-bold">{driver.name}</h4>
        <div className="flex items-center gap-1 text-[10px] text-gray-500">
          <Phone className="h-3 w-3" />{driver.phone}
        </div>
      </div>
    </div>
    <div className="flex items-center justify-between text-xs">
      <span className="text-gray-500">{driver.license_number}</span>
      <span className="flex items-center gap-1 font-bold text-[#714B67]"><Award className="h-3 w-3" />{driver.safety_score}</span>
    </div>
  </div>
);