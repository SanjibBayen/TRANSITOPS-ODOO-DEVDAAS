import React from 'react';
import { Settings as SettingsIcon, Shield, Sliders, Database, KeyRound, Bell } from 'lucide-react';

export const Settings: React.FC = () => {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-[#1b1c1c] dark:text-zinc-100 tracking-tight">
          System settings &amp; parameters
        </h1>
        <p className="text-xs font-semibold text-gray-500 dark:text-zinc-400">
          Configure API webhooks, regional hub defaults, safety capacity thresholds, and JWT expiry metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left sidebar card */}
        <div className="md:col-span-1 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-4.5 shadow-sm space-y-2">
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-bold bg-[#fdfafc] dark:bg-[#714B67]/20 text-[#714B67] border-l-4 border-[#714B67]">
            <Sliders className="h-4 w-4" />
            General Parameters
          </button>
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-bold text-gray-500 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-[#1b1c1c] dark:hover:text-white dark:text-zinc-100">
            <KeyRound className="h-4 w-4" />
            Security &amp; JWT
          </button>
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-bold text-gray-500 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-[#1b1c1c] dark:hover:text-white dark:text-zinc-100">
            <Database className="h-4 w-4" />
            Database Syncer
          </button>
        </div>

        {/* Right main body settings options */}
        <div className="md:col-span-2 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-5 shadow-sm space-y-6">
          <div className="space-y-4">
            <h2 className="text-xs font-black tracking-wider text-gray-500 dark:text-zinc-400 uppercase pb-2 border-b border-gray-200 dark:border-zinc-800">
              Fleet Safety Dispatch Rules
            </h2>
            
            <div className="flex items-center justify-between py-2">
              <div>
                <span className="block text-xs font-bold text-[#1b1c1c] dark:text-zinc-100">Strict Capacity Warning Validation</span>
                <span className="text-[10px] text-gray-500 dark:text-zinc-400 font-semibold">Block dispatches that exceed maximum manufacturer vehicle weight bounds.</span>
              </div>
              <input type="checkbox" defaultChecked className="rounded text-[#714B67] focus:ring-[#714B67] h-4.5 w-4.5" />
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <span className="block text-xs font-bold text-[#1b1c1c] dark:text-zinc-100">Active Biometric Attendance Verification</span>
                <span className="text-[10px] text-gray-500 dark:text-zinc-400 font-semibold">Requires drivers to swipe biometrics before route dispatch logs are initialized.</span>
              </div>
              <input type="checkbox" defaultChecked className="rounded text-[#714B67] focus:ring-[#714B67] h-4.5 w-4.5" />
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <span className="block text-xs font-bold text-[#1b1c1c] dark:text-zinc-100">Webhook Telematics Notification System</span>
                <span className="text-[10px] text-gray-500 dark:text-zinc-400 font-semibold">Dispatch Slack/Teams alert webhooks upon trip complete status changes.</span>
              </div>
              <input type="checkbox" className="rounded text-[#714B67] focus:ring-[#714B67] h-4.5 w-4.5" />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-zinc-800">
            <h2 className="text-xs font-black tracking-wider text-gray-500 dark:text-zinc-400 uppercase pb-2">
              TransitOps Integration Credentials
            </h2>
            <div className="space-y-2">
              <label className="block text-[9px] font-bold tracking-wider text-gray-500 dark:text-zinc-400 uppercase">Active OAuth Server Client ID</label>
              <input type="text" readOnly value="client_live_0493821049583204958" className="w-full rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 px-3.5 py-2 text-xs font-mono text-gray-500 dark:text-zinc-400 focus:outline-none" />
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
