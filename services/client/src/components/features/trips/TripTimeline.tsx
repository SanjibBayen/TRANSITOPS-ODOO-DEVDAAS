import React from 'react';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

export const TripTimeline: React.FC<{ status: string }> = ({ status }) => {
  const steps = [
    { key: 'DRAFT', label: 'Created', icon: CheckCircle2 },
    { key: 'DISPATCHED', label: 'Dispatched', icon: status === 'DISPATCHED' || status === 'IN_PROGRESS' || status === 'COMPLETED' ? CheckCircle2 : Circle },
    { key: 'IN_PROGRESS', label: 'In Progress', icon: status === 'IN_PROGRESS' || status === 'COMPLETED' ? Clock : Circle },
    { key: 'COMPLETED', label: 'Completed', icon: status === 'COMPLETED' ? CheckCircle2 : Circle },
  ];

  const currentIndex = steps.findIndex(s => s.key === status);

  return (
    <div className="flex items-center gap-0">
      {steps.map((step, i) => (
        <React.Fragment key={step.key}>
          <div className={`flex flex-col items-center ${i <= currentIndex ? 'text-[#714B67]' : 'text-gray-300'}`}>
            <step.icon className="h-5 w-5" />
            <span className="text-[9px] font-bold mt-1">{step.label}</span>
          </div>
          {i < steps.length - 1 && <div className={`flex-1 h-0.5 mx-1 ${i < currentIndex ? 'bg-[#714B67]' : 'bg-gray-200'}`} />}
        </React.Fragment>
      ))}
    </div>
  );
};