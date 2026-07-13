/**
 * TransitOps - Permission & RBAC Utilities
 */

import { UserRole } from '../types/user';

type Permission = 
  | 'vehicles:view' | 'vehicles:create' | 'vehicles:edit' | 'vehicles:delete'
  | 'drivers:view' | 'drivers:create' | 'drivers:edit' | 'drivers:suspend'
  | 'trips:view' | 'trips:create' | 'trips:dispatch' | 'trips:complete'
  | 'maintenance:view' | 'maintenance:create' | 'maintenance:complete'
  | 'fuel:view' | 'fuel:create'
  | 'expenses:view' | 'expenses:create'
  | 'analytics:view' | 'analytics:export'
  | 'documents:view' | 'documents:upload' | 'documents:verify'
  | 'dispatch:view' | 'dispatch:assign'
  | 'users:view' | 'users:manage'
  | 'settings:view' | 'settings:edit';

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  FLEET_MANAGER: [
    'vehicles:view', 'vehicles:create', 'vehicles:edit', 'vehicles:delete',
    'drivers:view', 'drivers:create', 'drivers:edit', 'drivers:suspend',
    'trips:view', 'trips:create', 'trips:dispatch', 'trips:complete',
    'maintenance:view', 'maintenance:create', 'maintenance:complete',
    'fuel:view', 'fuel:create',
    'expenses:view', 'expenses:create',
    'analytics:view', 'analytics:export',
    'documents:view', 'documents:upload', 'documents:verify',
    'dispatch:view', 'dispatch:assign',
    'users:view', 'users:manage',
    'settings:view', 'settings:edit',
  ],
  DRIVER: [
    'trips:view', 'trips:complete',
    'fuel:view', 'fuel:create',
    'vehicles:view',
    'documents:view',
  ],
  SAFETY_OFFICER: [
    'drivers:view', 'drivers:edit', 'drivers:suspend',
    'vehicles:view',
    'trips:view',
    'documents:view', 'documents:verify',
    'analytics:view',
  ],
  FINANCIAL_ANALYST: [
    'expenses:view',
    'fuel:view',
    'analytics:view', 'analytics:export',
    'trips:view',
    'vehicles:view',
    'drivers:view',
  ],
};

export const permissions = {
  /**
   * Check if role has a specific permission
   */
  hasPermission(role: UserRole | string | undefined, permission: Permission): boolean {
    if (!role) return false;
    return ROLE_PERMISSIONS[role as UserRole]?.includes(permission) || false;
  },

  /**
   * Check if role has any of the given permissions
   */
  hasAnyPermission(role: UserRole | string | undefined, permissions: Permission[]): boolean {
    if (!role) return false;
    return permissions.some(p => ROLE_PERMISSIONS[role as UserRole]?.includes(p));
  },

  /**
   * Check if role has all of the given permissions
   */
  hasAllPermissions(role: UserRole | string | undefined, permissions: Permission[]): boolean {
    if (!role) return false;
    return permissions.every(p => ROLE_PERMISSIONS[role as UserRole]?.includes(p));
  },

  /**
   * Get all permissions for a role
   */
  getPermissions(role: UserRole): Permission[] {
    return ROLE_PERMISSIONS[role] || [];
  },

  /**
   * Get accessible sidebar tabs for a role
   */
  getAccessibleTabs(role: UserRole): string[] {
    const tabMap: Record<string, Permission> = {
      dashboard: 'analytics:view',
      fleet: 'vehicles:view',
      drivers: 'drivers:view',
      dispatch: 'dispatch:view',
      trips: 'trips:view',
      maintenance: 'maintenance:view',
      fuel: 'fuel:view',
      expenses: 'expenses:view',
      analytics: 'analytics:view',
      documents: 'documents:view',
    };

    return Object.entries(tabMap)
      .filter(([_, perm]) => this.hasPermission(role, perm))
      .map(([tab]) => tab);
  },

  /**
   * Check if user can access a specific page/tab
   */
  canAccess(role: UserRole | undefined, tab: string): boolean {
    const tabMap: Record<string, Permission> = {
      dashboard: 'analytics:view',
      fleet: 'vehicles:view',
      drivers: 'drivers:view',
      dispatch: 'dispatch:view',
      trips: 'trips:view',
      maintenance: 'maintenance:view',
      fuel: 'fuel:view',
      expenses: 'expenses:view',
      analytics: 'analytics:view',
      documents: 'documents:view',
      settings: 'settings:view',
    };

    const permission = tabMap[tab];
    if (!permission) return true; // Allow unknown tabs
    return this.hasPermission(role, permission);
  },
};