import React from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store, RootState } from './store/index.ts';
import { ThemeProvider } from './contexts/ThemeContext.tsx';
import { Toaster } from 'sonner';
import { Header } from './components/layout/Header.tsx';
import { Sidebar } from './components/layout/Sidebar.tsx';
import { ProtectedRoute } from './components/shared/ProtectedRoute.tsx';
import { logout } from './store/slices/authSlice.ts';

// Pages
import { Dashboard } from './pages/Dashboard.tsx';
import { Vehicles } from './pages/Vehicles.tsx';
import { Drivers } from './pages/Drivers.tsx';
import { Dispatch } from './pages/Dispatch.tsx';
import { Trips } from './pages/Trips.tsx';
import { Maintenance } from './pages/Maintenance.tsx';
import { Fuel } from './pages/Fuel.tsx';
import { Analytics } from './pages/Analytics.tsx';
import { Settings } from './pages/Settings.tsx';
import { Support } from './pages/Support.tsx';
import { Profile } from './pages/Profile.tsx';
import { Compliance } from './pages/Compliance.tsx';
import { LicenseExpiry } from './pages/LicenseExpiry.tsx';
import { Export } from './pages/Export.tsx';
import { useWebSocket } from './hooks/useWebSocket.ts';

function AppContent() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const activeTab = useSelector((state: RootState) => state.ui.activeTab);

  useWebSocket();

  const handleLogout = () => {
    dispatch(logout());
  };

  if (!isAuthenticated) {
    return <ProtectedRoute children={null} />;
  }

  // Active Tab View conditional router
  const renderActiveView = () => {
    const role = user?.role || 'Manager';

    // Route guards
    if (role === 'Driver') {
      switch (activeTab) {
        case 'dashboard': return <Dashboard />;
        case 'trips': return <Dispatch />;
        case 'profile': return <Profile />;
        case 'settings': return <Settings />;
        case 'support': return <Support />;
        default: return <Dashboard />;
      }
    }

    if (role === 'Safety Officer') {
      switch (activeTab) {
        case 'dashboard': return <Dashboard />;
        case 'drivers': return <Drivers />;
        case 'compliance': return <Compliance />;
        case 'license-expiry': return <LicenseExpiry />;
        case 'analytics': return <Analytics />;
        case 'settings': return <Settings />;
        case 'support': return <Support />;
        default: return <Dashboard />;
      }
    }

    if (role === 'Financial Analyst') {
      switch (activeTab) {
        case 'dashboard': return <Dashboard />;
        case 'fuel': return <Fuel />;
        case 'analytics': return <Analytics />;
        case 'export': return <Export />;
        case 'settings': return <Settings />;
        case 'support': return <Support />;
        default: return <Dashboard />;
      }
    }

    // Default Manager
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'fleet': return <Vehicles />;
      case 'drivers': return <Drivers />;
      case 'trips': return <Dispatch />;
      case 'maintenance': return <Maintenance />;
      case 'fuel': return <Fuel />;
      case 'analytics': return <Analytics />;
      case 'settings': return <Settings />;
      case 'support': return <Support />;
      case 'profile': return <Profile />;
      case 'compliance': return <Compliance />;
      case 'license-expiry': return <LicenseExpiry />;
      case 'export': return <Export />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-gray-50 dark:bg-zinc-950 transition-colors duration-300">
      {/* Top Header Navigation bar */}
      <Header onLogout={handleLogout} />

      {/* Main Bottom Shell */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Right Page View Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 md:p-8 no-scrollbar transition-colors duration-300">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Provider store={store}>
        <Toaster richColors position="top-right" />
        <AppContent />
      </Provider>
    </ThemeProvider>
  );
}

