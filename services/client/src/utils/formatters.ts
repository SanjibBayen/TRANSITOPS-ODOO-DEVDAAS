/**
 * TransitOps - Formatting Utilities
 */

export const formatters = {
  /**
   * Format currency (INR)
   */
  currency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  },

  /**
   * Format number with commas
   */
  number(value: number, decimals: number = 0): string {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  },

  /**
   * Format distance (km)
   */
  distance(km: number): string {
    if (km >= 1000) {
      return `${(km / 1000).toFixed(1)}k km`;
    }
    return `${km.toLocaleString('en-IN')} km`;
  },

  /**
   * Format weight (kg)
   */
  weight(kg: number): string {
    if (kg >= 1000) {
      return `${(kg / 1000).toFixed(1)} tons`;
    }
    return `${kg.toLocaleString('en-IN')} kg`;
  },

  /**
   * Format percentage
   */
  percentage(value: number): string {
    return `${Math.round(value)}%`;
  },

  /**
   * Format phone number (Indian)
   */
  phone(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
    }
    return phone;
  },

  /**
   * Format status label for display
   */
  statusLabel(status: string): string {
    const labels: Record<string, string> = {
      AVAILABLE: 'Available',
      ON_TRIP: 'On Trip',
      IN_SHOP: 'In Shop',
      RETIRED: 'Retired',
      DRAFT: 'Draft',
      DISPATCHED: 'Dispatched',
      IN_PROGRESS: 'In Progress',
      COMPLETED: 'Completed',
      CANCELLED: 'Cancelled',
      OFF_DUTY: 'Off Duty',
      SUSPENDED: 'Suspended',
      ACTIVE: 'Active',
      PENDING_VERIFICATION: 'Pending',
      VERIFIED: 'Verified',
      EXPIRED: 'Expired',
    };
    return labels[status] || status.replace(/_/g, ' ');
  },

  /**
   * Format status color class
   */
  statusColor(status: string): string {
    const colors: Record<string, string> = {
      AVAILABLE: 'green',
      ON_TRIP: 'blue',
      IN_SHOP: 'red',
      RETIRED: 'gray',
      DRAFT: 'gray',
      DISPATCHED: 'blue',
      IN_PROGRESS: 'amber',
      COMPLETED: 'green',
      CANCELLED: 'red',
      OFF_DUTY: 'amber',
      SUSPENDED: 'red',
      ACTIVE: 'green',
      PENDING_VERIFICATION: 'amber',
      VERIFIED: 'green',
      EXPIRED: 'red',
    };
    return colors[status] || 'gray';
  },

  /**
   * Truncate text
   */
  truncate(text: string, maxLength: number = 50): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
  },

  /**
   * Format vehicle registration number
   */
  registrationNumber(regNo: string): string {
    return regNo?.toUpperCase() || 'N/A';
  },

  /**
   * Capitalize first letter
   */
  capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  },
};