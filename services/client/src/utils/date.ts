/**
 * TransitOps - Date Utilities
 */

export const dateUtils = {
  /**
   * Format date to locale string
   */
  format(date: string | Date, format: 'short' | 'long' | 'iso' = 'short'): string {
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'N/A';

    switch (format) {
      case 'short':
        return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
      case 'long':
        return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
      case 'iso':
        return d.toISOString().split('T')[0];
      default:
        return d.toLocaleDateString('en-IN');
    }
  },

  /**
   * Format time only
   */
  formatTime(date: string | Date): string {
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'N/A';
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  },

  /**
   * Get relative time (e.g., "2 hours ago")
   */
  relativeTime(date: string | Date): string {
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'N/A';

    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 30) return this.format(date, 'short');
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  },

  /**
   * Check if date is expired
   */
  isExpired(date: string): boolean {
    return new Date(date) < new Date();
  },

  /**
   * Check if date is expiring within N days
   */
  isExpiringSoon(date: string, daysThreshold: number = 30): boolean {
    const expiry = new Date(date);
    const now = new Date();
    const threshold = new Date();
    threshold.setDate(threshold.getDate() + daysThreshold);
    return expiry > now && expiry < threshold;
  },

  /**
   * Get days remaining
   */
  daysRemaining(date: string): number {
    const now = new Date();
    const target = new Date(date);
    return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  },

  /**
   * Format date range
   */
  dateRange(start: string, end: string): string {
    return `${this.format(start, 'short')} - ${this.format(end, 'short')}`;
  },

  /**
   * Get current date as ISO string
   */
  today(): string {
    return new Date().toISOString().split('T')[0];
  },

  /**
   * Get date N days from now
   */
  daysFromNow(days: number): string {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  },
};