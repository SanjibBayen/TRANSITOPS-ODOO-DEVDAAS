import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { permissions } from '../../utils/permissions';

interface CanProps {
  permission: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const Can: React.FC<CanProps> = ({ permission, children, fallback = null }) => {
  const user = useSelector((state: RootState) => state.auth.user);

  if (permissions.hasPermission(user?.role as any, permission as any)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};