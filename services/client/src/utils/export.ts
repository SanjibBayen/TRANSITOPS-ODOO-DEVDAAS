/**
 * TransitOps - Export Utilities
 */

import api from '../lib/axios';

export const exportUtils = {
  /**
   * Download CSV file
   */
  downloadCSV(data: any[], filename: string): void {
    if (!data.length) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map((row: any) => headers.map(h => `"${String(row[h] || '').replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  },

  /**
   * Export vehicles to CSV via API
   */
  async exportVehiclesCSV(): Promise<void> {
    window.open(`${api.defaults.baseURL}/analytics/export/vehicles/csv`, '_blank');
  },

  /**
   * Export trips to CSV via API
   */
  async exportTripsCSV(): Promise<void> {
    window.open(`${api.defaults.baseURL}/analytics/export/trips/csv`, '_blank');
  },

  /**
   * Export vehicles to PDF
   */
  exportVehiclesPDF(): void {
    window.open(`${api.defaults.baseURL}/analytics/export/vehicles/pdf`, '_blank');
  },

  /**
   * Export trips to PDF
   */
  exportTripsPDF(): void {
    window.open(`${api.defaults.baseURL}/analytics/export/trips/pdf`, '_blank');
  },

  /**
   * Generate filename with timestamp
   */
  generateFilename(prefix: string, extension: string): string {
    const date = new Date().toISOString().split('T')[0];
    return `${prefix}_${date}.${extension}`;
  },
};