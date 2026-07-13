/**
 * TransitOps - Application Constants
 */

export const APP_NAME = 'TransitOps';
export const APP_VERSION = '4.2';
export const APP_EDITION = 'Enterprise';

export const ROLES = {
  FLEET_MANAGER: 'FLEET_MANAGER' as const,
  DRIVER: 'DRIVER' as const,
  SAFETY_OFFICER: 'SAFETY_OFFICER' as const,
  FINANCIAL_ANALYST: 'FINANCIAL_ANALYST' as const,
};

export const ROLE_LABELS: Record<string, string> = {
  FLEET_MANAGER: 'Fleet Manager',
  DRIVER: 'Driver',
  SAFETY_OFFICER: 'Safety Officer',
  FINANCIAL_ANALYST: 'Financial Analyst',
};

export const VEHICLE_STATUS = {
  AVAILABLE: 'AVAILABLE',
  ON_TRIP: 'ON_TRIP',
  IN_SHOP: 'IN_SHOP',
  RETIRED: 'RETIRED',
} as const;

export const DRIVER_STATUS = {
  AVAILABLE: 'AVAILABLE',
  ON_TRIP: 'ON_TRIP',
  OFF_DUTY: 'OFF_DUTY',
  SUSPENDED: 'SUSPENDED',
} as const;

export const TRIP_STATUS = {
  DRAFT: 'DRAFT',
  DISPATCHED: 'DISPATCHED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

export const MAINTENANCE_STATUS = {
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

export const EXPENSE_TYPES = {
  FUEL: 'FUEL',
  TOLL: 'TOLL',
  MAINTENANCE: 'MAINTENANCE',
  PERMIT: 'PERMIT',
  INSURANCE: 'INSURANCE',
  REPAIR: 'REPAIR',
  OTHER: 'OTHER',
} as const;

export const DOCUMENT_TYPES = {
  REGISTRATION: 'REGISTRATION',
  INSURANCE: 'INSURANCE',
  PERMIT: 'PERMIT',
  POLLUTION: 'POLLUTION',
  LICENSE: 'LICENSE',
  MAINTENANCE_RECORD: 'MAINTENANCE_RECORD',
  OTHER: 'OTHER',
} as const;

export const DOCUMENT_STATUS = {
  ACTIVE: 'ACTIVE',
  EXPIRED: 'EXPIRED',
  PENDING_VERIFICATION: 'PENDING_VERIFICATION',
  VERIFIED: 'VERIFIED',
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
};

export const DATE_FORMAT = {
  SHORT: 'DD MMM YYYY',
  LONG: 'DD MMMM YYYY, hh:mm A',
  ISO: 'YYYY-MM-DD',
};

export const COLORS = {
  primary: '#714B67',
  primaryLight: '#5e3b56',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6',
  gray: '#6B7280',
  dark: '#111827',
  light: '#F9FAFB',
};