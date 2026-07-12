import React from 'react';
import { HelpCircle, Mail, Phone, BookOpen, Clock, FileQuestion } from 'lucide-react';

export const Support: React.FC = () => {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-[#1b1c1c] dark:text-zinc-100 tracking-tight">
          TransitOps Support Center
        </h1>
        <p className="text-xs font-semibold text-gray-500 dark:text-zinc-400">
          Need technical assistance? Access regional compliance helplines, telematics hardware desk, or submit diagnostic tickets.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Support Card 1: Helpline */}
        <div className="rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-5 shadow-sm space-y-4">
          <div className="h-10 w-10 bg-purple-50 text-[#714B67] rounded-xl flex items-center justify-center shrink-0">
            <Phone className="h-5.5 w-5.5" />
          </div>
          <div>
            <span className="block text-xs font-bold text-[#1b1c1c] dark:text-zinc-100">Emergency Route Helpline</span>
            <p className="text-[10px] text-gray-500 dark:text-zinc-400 mt-1 font-semibold leading-relaxed">
              24/7 dedicated telephone desk for active transit pilots facing vehicle failures, road blockades, or medical assistance.
            </p>
            <span className="block text-sm font-black text-[#714B67] mt-3.5">
              +91 1800 555 9800
            </span>
          </div>
        </div>

        {/* Support Card 2: Email Desk */}
        <div className="rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-5 shadow-sm space-y-4">
          <div className="h-10 w-10 bg-[#e6fcf5] text-[#006a68] rounded-xl flex items-center justify-center shrink-0">
            <Mail className="h-5.5 w-5.5" />
          </div>
          <div>
            <span className="block text-xs font-bold text-[#1b1c1c] dark:text-zinc-100">Diagnostic Ticket Desk</span>
            <p className="text-[10px] text-gray-500 dark:text-zinc-400 mt-1 font-semibold leading-relaxed">
              Submit hardware issues, GPS signal synchronization anomalies, or software portal bugs to our systems engineering team.
            </p>
            <span className="block text-sm font-black text-[#006a68] mt-3.5">
              operations-support@transitops.in
            </span>
          </div>
        </div>

        {/* Support Card 3: SLA Desk */}
        <div className="rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-5 shadow-sm space-y-4">
          <div className="h-10 w-10 bg-gray-50 dark:bg-zinc-900/50 text-gray-500 dark:text-zinc-400 rounded-xl flex items-center justify-center shrink-0">
            <Clock className="h-5.5 w-5.5" />
          </div>
          <div>
            <span className="block text-xs font-bold text-[#1b1c1c] dark:text-zinc-100">SLA Response Guarantees</span>
            <p className="text-[10px] text-gray-500 dark:text-zinc-400 mt-1 font-semibold leading-relaxed">
              - Severity 1 (Outage): &lt; 15 mins Response<br />
              - Severity 2 (Blocker): &lt; 2 hrs Response<br />
              - Severity 3 (Normal): &lt; 24 hrs Response
            </p>
            <span className="block text-[10px] font-black text-gray-500 dark:text-zinc-400 mt-3.5 uppercase tracking-wider">
              Service Desk active (GMT+5:30)
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};
