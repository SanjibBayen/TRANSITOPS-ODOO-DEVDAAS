import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/index';
import { setActiveTab } from '../../store/slices/uiSlice';
import { 
  LayoutDashboard, Truck, Users, Map, Wrench, Droplet, BarChart3, 
  Settings, HelpCircle, PlusCircle, ShieldCheck, Calendar, Download, 
  User, ClipboardList, Bell, FileText, TrendingUp, ChevronLeft, ChevronRight
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const dispatch = useDispatch();
  const { activeTab, sidebarCollapsed, alerts } = useSelector((state: RootState) => state.ui);
  const { user } = useSelector((state: RootState) => state.auth);
  const [currentAlertIndex, setCurrentAlertIndex] = useState(0);

  const role = user?.role || 'FLEET_MANAGER';

  useEffect(() => {
    if (window.innerWidth < 640) {
      dispatch({ type: 'ui/setSidebarCollapsed', payload: true });
    }
  }, [dispatch]);

  useEffect(() => {
    if (alerts.length === 0) return;
    const interval = setInterval(() => {
      setCurrentAlertIndex((prev) => (prev + 1) % alerts.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [alerts]);

  const menuConfigs: Record<string, { id: string; label: string; icon: any }[]> = {
    DRIVER: [
      { id: 'dashboard', label: 'My Dashboard', icon: LayoutDashboard },
      { id: 'trips', label: 'My Trips', icon: Map },
      { id: 'fuel', label: 'Fuel Logs', icon: Droplet },
      { id: 'maintenance', label: 'Vehicle Issues', icon: Wrench },
      { id: 'documents', label: 'Documents', icon: FileText },
      { id: 'notifications', label: 'Notifications', icon: Bell },
      { id: 'profile', label: 'My Profile', icon: User },
    ],
    SAFETY_OFFICER: [
      { id: 'dashboard', label: 'Compliance Center', icon: LayoutDashboard },
      { id: 'drivers', label: 'Driver Records', icon: Users },
      { id: 'compliance', label: 'Compliance', icon: ShieldCheck },
      { id: 'license-expiry', label: 'License Tracking', icon: Calendar },
      { id: 'documents', label: 'Verify Documents', icon: FileText },
      { id: 'trips', label: 'Trip History', icon: Map },
      { id: 'analytics', label: 'Safety Reports', icon: TrendingUp },
      { id: 'notifications', label: 'Alerts', icon: Bell },
      { id: 'profile', label: 'Profile', icon: User },
    ],
    FINANCIAL_ANALYST: [
      { id: 'dashboard', label: 'Financial Dashboard', icon: LayoutDashboard },
      { id: 'expenses', label: 'All Expenses', icon: ClipboardList },
      { id: 'fuel', label: 'Fuel Costs', icon: Droplet },
      { id: 'analytics', label: 'Cost Analysis', icon: BarChart3 },
      { id: 'reports', label: 'Reports', icon: TrendingUp },
      { id: 'export', label: 'Export Data', icon: Download },
      { id: 'notifications', label: 'Notifications', icon: Bell },
      { id: 'profile', label: 'Profile', icon: User },
    ],
    FLEET_MANAGER: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'fleet', label: 'Vehicle Fleet', icon: Truck },
      { id: 'drivers', label: 'Drivers', icon: Users },
      { id: 'dispatch', label: 'Dispatch Board', icon: Map },
      { id: 'trips', label: 'All Trips', icon: ClipboardList },
      { id: 'maintenance', label: 'Maintenance', icon: Wrench },
      { id: 'fuel', label: 'Fuel & Expenses', icon: Droplet },
      { id: 'documents', label: 'Documents', icon: FileText },
      { id: 'analytics', label: 'Analytics', icon: BarChart3 },
      { id: 'reports', label: 'Reports', icon: TrendingUp },
      { id: 'compliance', label: 'Compliance', icon: ShieldCheck },
      { id: 'license-expiry', label: 'Licenses', icon: Calendar },
      { id: 'export', label: 'Export', icon: Download },
      { id: 'notifications', label: 'Notifications', icon: Bell },
    ],
  };

  const menuItems = menuConfigs[role] || menuConfigs.FLEET_MANAGER;

  const bottomItems = [
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'support', label: 'Help & Support', icon: HelpCircle },
    { id: 'profile', label: 'My Profile', icon: User },
  ];

  const roleLabel: Record<string, string> = {
    FLEET_MANAGER: 'Fleet Manager',
    DRIVER: 'Driver',
    SAFETY_OFFICER: 'Safety Officer',
    FINANCIAL_ANALYST: 'Financial Analyst',
  };

  return (
    <>
      {!sidebarCollapsed && (
        <div className="fixed inset-0 bg-black/50 z-20 sm:hidden" onClick={() => dispatch({ type: 'ui/toggleSidebar' })} />
      )}
      
      <aside className={`absolute sm:relative z-30 flex flex-col h-full border-r border-gray-200 dark:border-zinc-800 bg-[#f5f3f3] dark:bg-zinc-950 text-[#4d4847] dark:text-zinc-300 transition-all duration-300 ${
        sidebarCollapsed ? '-translate-x-full sm:translate-x-0 sm:w-16' : 'translate-x-0 w-64'
      }`}>
        
        {/* Collapse button - desktop only */}
        <button
          onClick={() => dispatch({ type: 'ui/toggleSidebar' })}
          className="hidden sm:flex absolute -right-3 top-20 h-6 w-6 items-center justify-center rounded-full bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 shadow-sm z-40"
        >
          {sidebarCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </button>

        {/* Header */}
        {!sidebarCollapsed && (
          <div className="flex flex-col border-b border-gray-200 dark:border-zinc-800 px-4 py-4 bg-gray-50 dark:bg-zinc-900/50">
            <span className="text-[10px] font-bold tracking-wider text-gray-500 dark:text-zinc-400 uppercase">TransitOps</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm font-extrabold text-[#1b1c1c] dark:text-zinc-100">{roleLabel[role] || role}</span>
              <span className="rounded bg-[#eae8e7] dark:bg-zinc-800 px-1.5 py-0.5 text-[9px] font-bold text-[#714B67] dark:text-purple-300 border border-[#d1c3ca] dark:border-zinc-700">v4.2</span>
            </div>
          </div>
        )}

        {/* Dispatch CTA */}
        {role === 'FLEET_MANAGER' && (
          <div className={`px-3 py-3 border-b border-gray-200 dark:border-zinc-800 ${sidebarCollapsed ? 'flex justify-center' : ''}`}>
            {sidebarCollapsed ? (
              <button onClick={() => dispatch(setActiveTab('dispatch'))} className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#714B67] text-white hover:bg-[#5e3b56] shadow-md transition-all" title="Dispatch">
                <PlusCircle className="h-5 w-5" />
              </button>
            ) : (
              <button onClick={() => dispatch(setActiveTab('dispatch'))} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#714B67] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#5e3b56] shadow-md transition-all">
                <PlusCircle className="h-4 w-4" /> Dispatch Trip
              </button>
            )}
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 space-y-0.5 px-3 py-3 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  dispatch(setActiveTab(item.id as any));
                  if (window.innerWidth < 640) dispatch({ type: 'ui/toggleSidebar' });
                }}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                  isActive 
                    ? 'bg-white dark:bg-zinc-800 text-[#714B67] dark:text-[#c48cb5] shadow-sm' 
                    : 'text-gray-600 dark:text-zinc-400 hover:bg-white/50 dark:hover:bg-zinc-800/50 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-[#714B67]' : 'text-gray-500 dark:text-zinc-500'}`} />
                {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="border-t border-gray-200 dark:border-zinc-800 px-3 py-2 space-y-0.5">
          {bottomItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => dispatch(setActiveTab(item.id as any))}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                  isActive 
                    ? 'bg-white dark:bg-zinc-800 text-[#714B67]' 
                    : 'text-gray-500 dark:text-zinc-400 hover:bg-white/50 dark:hover:bg-zinc-800/50 hover:text-gray-700 dark:hover:text-zinc-300'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </div>

        {/* Alert Ticker */}
        {alerts.length > 0 && !sidebarCollapsed && (
          <div className="border-t border-gray-200 dark:border-zinc-800 bg-[#eae8e7] dark:bg-zinc-950 p-2.5">
            <div className="h-6 overflow-hidden rounded-lg bg-white dark:bg-zinc-900 px-2 py-1 text-[9px] border border-[#d1c3ca] dark:border-zinc-800 flex items-center shadow-sm">
              <span className="font-bold text-[#b45309] dark:text-amber-500 mr-1.5 shrink-0">[{alerts[currentAlertIndex]?.type}]</span>
              <span className="truncate font-medium text-[#5d5856] dark:text-zinc-400">{alerts[currentAlertIndex]?.message}</span>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};