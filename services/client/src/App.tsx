import React, { useEffect, useState } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store, RootState, AppDispatch } from './store/index';
import { ThemeProvider } from './contexts/ThemeContext';
import { Toaster, toast } from 'sonner';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Login } from './pages/Login';
import { useWebSocket } from './hooks/useWebSocket';
import { fetchCurrentUser, logout } from './store/slices/authSlice';
import { Loader2, WifiOff } from 'lucide-react';

import { Dashboard } from './pages/Dashboard';
import { Vehicles } from './pages/Vehicles';
import { Drivers } from './pages/Drivers';
import { Dispatch } from './pages/Dispatch';
import { Trips } from './pages/Trips';
import { Maintenance } from './pages/Maintenance';
import { Fuel } from './pages/Fuel';
import { Analytics } from './pages/Analytics';
import { Settings } from './pages/Settings';
import { Support } from './pages/Support';
import { Profile } from './pages/Profile';
import { Compliance } from './pages/Compliance';
import { LicenseExpiry } from './pages/LicenseExpiry';
import { Export } from './pages/Export';

function AppContent() {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user, isLoading } = useSelector((state: RootState) => state.auth);
  const { activeTab } = useSelector((state: RootState) => state.ui);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isInitialized, setIsInitialized] = useState(false);

  useWebSocket();

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => {
      setIsOnline(false);
      toast.warning('You are offline.');
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
    
    if (token && !isAuthenticated) {
      dispatch(fetchCurrentUser())
        .unwrap()
        .catch(() => {
          localStorage.removeItem('access_token');
          sessionStorage.removeItem('access_token');
        })
        .finally(() => {
          setIsInitialized(true);
        });
    } else {
      setIsInitialized(true);
    }
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out');
  };

  if (!isInitialized) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gray-50 dark:bg-zinc-950 gap-4">
        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#714B67] to-[#5a3b52] flex items-center justify-center text-white font-black text-xl shadow-lg">
          T
        </div>
        <Loader2 className="h-6 w-6 animate-spin text-[#714B67]" />
        <p className="text-xs font-medium text-gray-500 dark:text-zinc-400">Loading TransitOps...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  const renderView = () => {
    const role = user?.role || 'FLEET_MANAGER';

    const views: Record<string, Record<string, React.ReactNode>> = {
      DRIVER: {
        dashboard: <Dashboard />,
        trips: <Trips />,
        fuel: <Fuel />,
        maintenance: <Maintenance />,
        profile: <Profile />,
        settings: <Settings />,
        support: <Support />,
      },
      SAFETY_OFFICER: {
        dashboard: <Dashboard />,
        drivers: <Drivers />,
        compliance: <Compliance />,
        'license-expiry': <LicenseExpiry />,
        trips: <Trips />,
        analytics: <Analytics />,
        profile: <Profile />,
        settings: <Settings />,
        support: <Support />,
      },
      FINANCIAL_ANALYST: {
        dashboard: <Dashboard />,
        fuel: <Fuel />,
        analytics: <Analytics />,
        export: <Export />,
        profile: <Profile />,
        settings: <Settings />,
        support: <Support />,
      },
      FLEET_MANAGER: {
        dashboard: <Dashboard />,
        fleet: <Vehicles />,
        drivers: <Drivers />,
        dispatch: <Dispatch />,
        trips: <Trips />,
        maintenance: <Maintenance />,
        fuel: <Fuel />,
        analytics: <Analytics />,
        compliance: <Compliance />,
        'license-expiry': <LicenseExpiry />,
        export: <Export />,
        profile: <Profile />,
        settings: <Settings />,
        support: <Support />,
      },
    };

    return views[role]?.[activeTab] || <Dashboard />;
  };

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-gray-50 dark:bg-zinc-950 transition-colors duration-300">
      {!isOnline && (
        <div className="flex items-center justify-center gap-2 bg-amber-500 px-4 py-1.5 text-xs font-bold text-white">
          <WifiOff className="h-3.5 w-3.5" /> Offline mode
        </div>
      )}
      <Header onLogout={handleLogout} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-zinc-950 p-4 sm:p-6 md:p-8 transition-colors duration-300">
          {renderView()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Provider store={store}>
        <Toaster richColors position="top-right" expand closeButton duration={4000} />
        <AppContent />
      </Provider>
    </ThemeProvider>
  );
}