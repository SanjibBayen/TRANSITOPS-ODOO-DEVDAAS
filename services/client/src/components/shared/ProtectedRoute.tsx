import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Login } from '../../pages/Login';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated) {
    return <Login />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-100">Access Denied</h1>
          <p className="text-sm text-gray-500 dark:text-zinc-400 mt-2">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};