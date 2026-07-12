import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/index.ts';
import { setActiveTab } from '../../store/slices/uiSlice.ts';
import { 
  LayoutDashboard, 
  Truck, 
  Users, 
  Map, 
  Wrench, 
  Droplet, 
  BarChart3, 
  Settings, 
  HelpCircle,
  PlusCircle,
  ShieldCheck,
  Calendar,
  Download,
  User
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const dispatch = useDispatch();
  const { activeTab, sidebarCollapsed, alerts } = useSelector((state: RootState) => state.ui);
  const { user } = useSelector((state: RootState) => state.auth);
  const [currentAlertIndex, setCurrentAlertIndex] = useState(0);

  const role = user?.role || 'Manager';

  // Cycle alerts every 6 seconds in the ticker
  useEffect(() => {
    if (alerts.length === 0) return;
    const interval = setInterval(() => {
      setCurrentAlertIndex((prevIndex) => (prevIndex + 1) % alerts.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [alerts]);

  // Generate menu items based on role permissions (TASK 7)
  const getMenuItems = () => {
    switch (role) {
      case 'Driver':
        return [
          { id: 'dashboard', label: 'Driver Dashboard', icon: LayoutDashboard },
          { id: 'trips', label: 'My Assigned Trips', icon: Map },
          { id: 'profile', label: 'My Profile', icon: User },
        ];
      case 'Safety Officer':
        return [
          { id: 'dashboard', label: 'Safety Dashboard', icon: LayoutDashboard },
          { id: 'drivers', label: 'Driver Safety', icon: Users },
          { id: 'compliance', label: 'Compliance Reports', icon: ShieldCheck },
          { id: 'license-expiry', label: 'License Expirations', icon: Calendar },
          { id: 'analytics', label: 'Reports', icon: BarChart3 },
        ];
      case 'Financial Analyst':
        return [
          { id: 'dashboard', label: 'Financial Dashboard', icon: LayoutDashboard },
          { id: 'fuel', label: 'Fuel & Expenses', icon: Droplet },
          { id: 'analytics', label: 'Reports & Analytics', icon: BarChart3 },
          { id: 'export', label: 'Export Ledger', icon: Download },
        ];
      case 'Manager':
      default:
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'fleet', label: 'Fleet Registry', icon: Truck },
          { id: 'drivers', label: 'Drivers Registry', icon: Users },
          { id: 'trips', label: 'Trips Dispatch', icon: Map },
          { id: 'maintenance', label: 'Maintenance Log', icon: Wrench },
          { id: 'fuel', label: 'Fuel & Expenses', icon: Droplet },
          { id: 'analytics', label: 'Analytics & Reports', icon: BarChart3 },
        ];
    }
  };

  const menuItems = getMenuItems();

  const bottomItems = [
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'support', label: 'Support Center', icon: HelpCircle },
  ] as const;

  return (
    <aside 
      className={`relative flex flex-col border-r border-gray-200 bg-[#f5f3f3] dark:bg-zinc-950 text-[#4d4847] dark:text-zinc-300 transition-all duration-300 ease-in-out ${
        sidebarCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Fleet Profile / Subtitle Header block */}
      {!sidebarCollapsed && (
        <div className="flex flex-col border-b border-gray-200 dark:border-zinc-800 px-4 py-4.5 bg-gray-50 dark:bg-zinc-900/50">
          <span className="text-xs font-bold tracking-wider text-gray-500 dark:text-zinc-400 uppercase">
            TransitOps Fleet Control
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm font-extrabold text-[#1b1c1c] dark:text-zinc-100">
              {role === 'Manager' ? 'Enterprise Admin' : `${role} Portal`}
            </span>
            <span className="rounded bg-[#eae8e7] dark:bg-zinc-800 px-1.5 py-0.5 text-[9px] font-bold text-[#714B67] dark:text-purple-300 border border-[#d1c3ca] dark:border-zinc-700">
              v4.2
            </span>
          </div>
        </div>
      )}

      {/* Primary Dispatch CTA Button (only for Fleet Manager or Driver if allowed, hide if other) */}
      {role === 'Manager' && (
        <div className={`px-3 py-4 border-b border-gray-200 dark:border-zinc-800 ${sidebarCollapsed ? 'flex justify-center' : ''}`}>
          {sidebarCollapsed ? (
            <button 
              onClick={() => dispatch(setActiveTab('trips'))}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#714B67] text-white hover:bg-[#5e3b56] shadow-md transition-all duration-200"
              title="Dispatch Trip"
            >
              <PlusCircle className="h-5 w-5" />
            </button>
          ) : (
            <button 
              onClick={() => dispatch(setActiveTab('trips'))}
              className="flex w-full items-center justify-center gap-2 rounded bg-[#714B67] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#5e3b56] shadow transition-all duration-200 cursor-pointer"
            >
              <PlusCircle className="h-4.5 w-4.5" />
              Dispatch New Trip
            </button>
          )}
        </div>
      )}

      {/* Main Navigation Items */}
      <nav className="flex-1 space-y-1.5 px-2 py-4 overflow-y-auto no-scrollbar">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => dispatch(setActiveTab(item.id as any))}
              className={`flex w-full items-center gap-3 rounded px-3 py-2.5 text-xs font-bold tracking-wide transition-all relative ${
                isActive 
                  ? 'bg-white dark:bg-zinc-900 text-[#1b1c1c] dark:text-zinc-100 shadow-xs font-extrabold' 
                  : 'text-[#5d5856] dark:text-zinc-400 hover:bg-[#eae8e7] dark:hover:bg-zinc-800 hover:text-[#1b1c1c] dark:text-zinc-400 dark:hover:text-white'
              }`}
            >
              {/* Left active line accent */}
              {isActive && (
                <div className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-md bg-[#714B67]" />
              )}
              <Icon className={`h-4.5 w-4.5 shrink-0 ${isActive ? 'text-[#714B67]' : 'text-gray-500 dark:text-zinc-400'}`} />
              {!sidebarCollapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Bottom links: Settings & Support */}
      <div className="space-y-1 px-2 py-3 border-t border-gray-200 dark:border-zinc-800">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => dispatch(setActiveTab(item.id))}
              className={`flex w-full items-center gap-3 rounded px-3 py-2 text-xs font-semibold transition-all ${
                isActive 
                  ? 'bg-white dark:bg-zinc-900 text-[#1b1c1c] dark:text-zinc-100 shadow-xs font-extrabold' 
                  : 'text-gray-500 dark:text-zinc-400 hover:bg-[#eae8e7] dark:hover:bg-zinc-800 hover:text-[#1b1c1c] dark:text-zinc-400 dark:hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!sidebarCollapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </div>

      {/* Sticky Bottom System Alert Banner & pulsate status */}
      <div className="border-t border-gray-200 bg-[#eae8e7] dark:bg-zinc-950 p-2.5 flex flex-col justify-center">
        <div className="flex items-center gap-2">
          {/* Pulsating green dot */}
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]"></span>
          </div>
          {!sidebarCollapsed ? (
            <span className="text-[9px] font-extrabold text-[#006a68] dark:text-[#34d399] tracking-widest uppercase flex items-center gap-1">
              SYSTEM ONLINE
            </span>
          ) : (
            <span className="text-[8px] font-black text-[#006a68] dark:text-[#34d399] uppercase">SYS</span>
          )}
        </div>
        
        {/* Ticker of alerts (visible when expanded) */}
        {!sidebarCollapsed && alerts.length > 0 && (
          <div className="mt-1.5 h-6 overflow-hidden rounded bg-white dark:bg-zinc-900 px-2 py-1 text-[9px] border border-[#d1c3ca] dark:border-zinc-800 flex items-center text-[#5d5856] dark:text-zinc-400">
            <div className="truncate w-full font-medium select-none animate-fade-in">
              <span className="font-extrabold text-[#b45309] dark:text-amber-400 mr-1">
                [{alerts[currentAlertIndex]?.type}]
              </span>
              {alerts[currentAlertIndex]?.message}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
