/**
 * TransitOps - API Configuration
 */

const API_URL = import.meta.env.VITE_API_URL ;
const WS_URL = import.meta.env.VITE_WS_URL;

export const apiConfig = {
  baseURL: API_URL,
  wsURL: WS_URL,
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000,
  
  endpoints: {
    // Auth
    auth: {
      login: '/auth/login',
      signup: '/auth/signup',
      logout: '/auth/logout',
      me: '/auth/me',
      refreshToken: '/auth/refresh-token',
    },

    // Vehicles
    vehicles: {
      list: '/vehicles',
      detail: (id: string) => `/vehicles/${id}`,
      available: '/vehicles/available',
      stats: '/vehicles/stats',
      status: (id: string) => `/vehicles/${id}/status`,
      bulkImport: '/vehicles/bulk-import',
    },

    // Drivers
    drivers: {
      list: '/drivers',
      detail: (id: string) => `/drivers/${id}`,
      available: '/drivers/available',
      expiringLicenses: '/drivers/expiring-licenses',
      status: (id: string) => `/drivers/${id}/status`,
    },

    // Trips
    trips: {
      list: '/trips',
      detail: (id: string) => `/trips/${id}`,
      status: (id: string) => `/trips/${id}/status`,
      complete: (id: string) => `/trips/${id}/complete`,
    },

    // Dispatch
    dispatch: {
      availableResources: '/dispatch/available-resources',
      validate: '/dispatch/validate',
      dispatch: (tripId: string) => `/dispatch/dispatch/${tripId}`,
    },

    // Maintenance
    maintenance: {
      list: '/maintenance',
      active: '/maintenance/active',
      complete: (id: string) => `/maintenance/${id}/complete`,
    },

    // Fuel
    fuel: {
      list: '/fuel',
    },

    // Expenses
    expenses: {
      list: '/expenses',
    },

    // Documents
    documents: {
      byVehicle: (vehicleId: string) => `/documents/vehicle/${vehicleId}`,
      upload: '/documents/upload',
      verify: (id: string) => `/documents/${id}/verify`,
      delete: (id: string) => `/documents/${id}`,
    },

    // Analytics
    analytics: {
      dashboard: '/analytics/dashboard',
      fleetUtilization: '/analytics/fleet-utilization',
      vehicleCosts: '/analytics/vehicle-costs',
      vehicleROI: '/analytics/vehicle-roi',
      exportVehiclesCSV: '/analytics/export/vehicles/csv',
      exportVehiclesPDF: '/analytics/export/vehicles/pdf',
      exportTripsCSV: '/analytics/export/trips/csv',
      exportTripsPDF: '/analytics/export/trips/pdf',
    },

    // Users
    users: {
      list: '/users',
      detail: (id: string) => `/users/${id}`,
      notifications: (id: string) => `/users/${id}/notifications`,
      markRead: (userId: string, notifId: string) => `/users/${userId}/notifications/${notifId}/read`,
      readAll: (id: string) => `/users/${id}/notifications/read-all`,
      deactivate: (id: string) => `/users/${id}/deactivate`,
      activate: (id: string) => `/users/${id}/activate`,
    },
  },
};