import React from 'react';
import { Phone, Mail, Award, MapPin, Calendar } from 'lucide-react';

interface DriverDetailPageProps {
  driver: any;
  onBack: () => void;
}

export const DriverDetailPage: React.FC<DriverDetailPageProps> = ({ driver, onBack }) => (
  <div className="space-y-4">
    <button onClick={onBack} className="text-xs text-[#714B67] font-bold hover:underline">← Back</button>
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#714B67] to-[#5a3b52] flex items-center justify-center text-white font-bold text-2xl">
          {driver?.name?.charAt(0)}
        </div>
        <div>
          <h2 className="text-lg font-bold">{driver?.name}</h2>
          <p className="text-xs text-gray-500">{driver?.status}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="flex items-center gap-2"><Phone className="h-3 w-3" />{driver?.phone}</div>
        {driver?.email && <div className="flex items-center gap-2"><Mail className="h-3 w-3" />{driver?.email}</div>}
        <div className="flex items-center gap-2"><Award className="h-3 w-3" />Safety: {driver?.safety_score}</div>
        <div className="flex items-center gap-2"><Calendar className="h-3 w-3" />License: {driver?.license_number}</div>
      </div>
    </div>
  </div>
);