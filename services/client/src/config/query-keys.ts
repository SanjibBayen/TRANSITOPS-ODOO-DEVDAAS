/**
 * TransitOps - React Query / Cache Keys
 * Used for consistent cache key management
 */

export const queryKeys = {
  // Auth
  auth: {
    me: ['auth', 'me'] as const,
    user: (id: string) => ['auth', 'user', id] as const,
  },

  // Vehicles
  vehicles: {
    all: ['vehicles'] as const,
    list: (filters?: any) => ['vehicles', 'list', filters] as const,
    detail: (id: string) => ['vehicles', 'detail', id] as const,
    available: ['vehicles', 'available'] as const,
    stats: ['vehicles', 'stats'] as const,
  },

  // Drivers
  drivers: {
    all: ['drivers'] as const,
    list: (filters?: any) => ['drivers', 'list', filters] as const,
    detail: (id: string) => ['drivers', 'detail', id] as const,
    available: ['drivers', 'available'] as const,
    expiringLicenses: ['drivers', 'expiring-licenses'] as const,
  },

  // Trips
  trips: {
    all: ['trips'] as const,
    list: (filters?: any) => ['trips', 'list', filters] as const,
    detail: (id: string) => ['trips', 'detail', id] as const,
  },

  // Dispatch
  dispatch: {
    resources: ['dispatch', 'resources'] as const,
  },

  // Maintenance
  maintenance: {
    all: ['maintenance'] as const,
    active: ['maintenance', 'active'] as const,
  },

  // Fuel
  fuel: {
    all: ['fuel'] as const,
  },

  // Expenses
  expenses: {
    all: ['expenses'] as const,
  },

  // Analytics
  analytics: {
    dashboard: ['analytics', 'dashboard'] as const,
    fleetUtilization: ['analytics', 'fleet-utilization'] as const,
    vehicleCosts: ['analytics', 'vehicle-costs'] as const,
    vehicleROI: ['analytics', 'vehicle-roi'] as const,
  },

  // Documents
  documents: {
    byVehicle: (vehicleId: string) => ['documents', 'vehicle', vehicleId] as const,
  },

  // Notifications
  notifications: {
    byUser: (userId: string) => ['notifications', 'user', userId] as const,
  },

  // Users
  users: {
    all: ['users'] as const,
    detail: (id: string) => ['users', 'detail', id] as const,
  },
};