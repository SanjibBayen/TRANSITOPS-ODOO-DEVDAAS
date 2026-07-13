/**
 * TransitOps - Route Configuration
 */

export const routes = {
  // Public
  login: '/login',
  signup: '/signup',
  forgotPassword: '/forgot-password',

  // Dashboard
  dashboard: '/dashboard',

  // Fleet Management
  vehicles: '/vehicles',
  vehicleDetail: (id: string) => `/vehicles/${id}`,
  vehicleNew: '/vehicles/new',
  vehicleEdit: (id: string) => `/vehicles/${id}/edit`,

  // Driver Management
  drivers: '/drivers',
  driverDetail: (id: string) => `/drivers/${id}`,

  // Dispatch
  dispatch: '/dispatch',

  // Trips
  trips: '/trips',
  tripDetail: (id: string) => `/trips/${id}`,

  // Maintenance
  maintenance: '/maintenance',

  // Fuel
  fuel: '/fuel',

  // Expenses
  expenses: '/expenses',

  // Documents
  documents: '/documents',

  // Analytics
  analytics: '/analytics',

  // Reports
  reports: '/reports',

  // Compliance
  compliance: '/compliance',
  licenseExpiry: '/license-expiry',

  // Export
  export: '/export',

  // Notifications
  notifications: '/notifications',

  // Profile
  profile: '/profile',
  settings: '/settings',

  // Support
  support: '/support',
} as const;

export const publicRoutes = [
  routes.login,
  routes.signup,
  routes.forgotPassword,
];

export const protectedRoutes = [
  routes.dashboard,
  routes.vehicles,
  routes.drivers,
  routes.dispatch,
  routes.trips,
  routes.maintenance,
  routes.fuel,
  routes.expenses,
  routes.documents,
  routes.analytics,
  routes.reports,
  routes.compliance,
  routes.licenseExpiry,
  routes.export,
  routes.notifications,
  routes.profile,
  routes.settings,
  routes.support,
];

export const roleRoutes: Record<string, string[]> = {
  FLEET_MANAGER: [
    routes.dashboard,
    routes.vehicles,
    routes.drivers,
    routes.dispatch,
    routes.trips,
    routes.maintenance,
    routes.fuel,
    routes.expenses,
    routes.documents,
    routes.analytics,
    routes.reports,
    routes.compliance,
    routes.licenseExpiry,
    routes.export,
    routes.notifications,
    routes.profile,
    routes.settings,
    routes.support,
  ],
  DRIVER: [
    routes.dashboard,
    routes.trips,
    routes.fuel,
    routes.maintenance,
    routes.documents,
    routes.notifications,
    routes.profile,
    routes.settings,
    routes.support,
  ],
  SAFETY_OFFICER: [
    routes.dashboard,
    routes.drivers,
    routes.trips,
    routes.compliance,
    routes.licenseExpiry,
    routes.documents,
    routes.analytics,
    routes.notifications,
    routes.profile,
    routes.settings,
    routes.support,
  ],
  FINANCIAL_ANALYST: [
    routes.dashboard,
    routes.expenses,
    routes.fuel,
    routes.analytics,
    routes.reports,
    routes.export,
    routes.notifications,
    routes.profile,
    routes.settings,
    routes.support,
  ],
};