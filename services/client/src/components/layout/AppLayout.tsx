import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Toaster } from 'sonner';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { sidebarCollapsed } = useSelector((state: RootState) => state.ui);

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-gray-50 dark:bg-zinc-950 transition-colors duration-300">
      <Header onLogout={() => {}} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className={`flex-1 overflow-y-auto bg-gray-50 dark:bg-zinc-950 p-4 sm:p-6 md:p-8 transition-all duration-300`}>
          {children}
        </main>
      </div>
      <Toaster richColors position="top-right" />
    </div>
  );
};