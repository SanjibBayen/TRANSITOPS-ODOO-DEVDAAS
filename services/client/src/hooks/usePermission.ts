import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { permissions } from '../utils/permissions';
import { UserRole } from '../types/user';

export const usePermission = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const role = (user?.role as UserRole) || undefined;

  const can = (permission: string): boolean => {
    return permissions.hasPermission(role, permission as any);
  };

  const canAny = (perms: string[]): boolean => {
    return permissions.hasAnyPermission(role, perms as any);
  };

  const canAll = (perms: string[]): boolean => {
    return permissions.hasAllPermissions(role, perms as any);
  };

  const canAccessTab = (tab: string): boolean => {
    return permissions.canAccess(role, tab);
  };

  const getAccessibleTabs = (): string[] => {
    return permissions.getAccessibleTabs(role || 'DRIVER');
  };

  return {
    role,
    can,
    canAny,
    canAll,
    canAccessTab,
    getAccessibleTabs,
    isFleetManager: role === 'FLEET_MANAGER',
    isDriver: role === 'DRIVER',
    isSafetyOfficer: role === 'SAFETY_OFFICER',
    isFinancialAnalyst: role === 'FINANCIAL_ANALYST',
  };
};