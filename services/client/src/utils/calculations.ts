/**
 * TransitOps - Business Calculations
 */

export const calculations = {
  /**
   * Calculate fuel efficiency (km per liter)
   */
  fuelEfficiency(distanceKm: number, fuelLiters: number): number {
    if (fuelLiters <= 0) return 0;
    return Math.round((distanceKm / fuelLiters) * 100) / 100;
  },

  /**
   * Calculate cost per kilometer
   */
  costPerKm(totalCost: number, distanceKm: number): number {
    if (distanceKm <= 0) return 0;
    return Math.round((totalCost / distanceKm) * 100) / 100;
  },

  /**
   * Calculate vehicle ROI percentage
   * ROI = (Revenue - Maintenance - Fuel) / Acquisition Cost × 100
   */
  vehicleROI(revenue: number, maintenanceCost: number, fuelCost: number, acquisitionCost: number): number {
    if (acquisitionCost <= 0) return 0;
    return Math.round(((revenue - maintenanceCost - fuelCost) / acquisitionCost) * 10000) / 100;
  },

  /**
   * Calculate fleet utilization percentage
   */
  fleetUtilization(vehiclesOnTrip: number, totalActiveVehicles: number): number {
    if (totalActiveVehicles <= 0) return 0;
    return Math.round((vehiclesOnTrip / totalActiveVehicles) * 100);
  },

  /**
   * Calculate trip profit
   */
  tripProfit(revenue: number, expenses: number): number {
    return revenue - expenses;
  },

  /**
   * Calculate trip progress percentage
   */
  tripProgress(actualDistance: number, plannedDistance: number): number {
    if (plannedDistance <= 0) return 0;
    return Math.min(100, Math.round((actualDistance / plannedDistance) * 100));
  },

  /**
   * Calculate driver safety score (0-100)
   */
  safetyScore(totalTrips: number, incidents: number): number {
    if (totalTrips <= 0) return 100;
    const score = 100 - (incidents / totalTrips) * 20;
    return Math.max(0, Math.min(100, Math.round(score)));
  },

  /**
   * Calculate days until expiry
   */
  daysUntilExpiry(expiryDate: string): number {
    const now = new Date();
    const expiry = new Date(expiryDate);
    return Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  },

  /**
   * Format percentage for display
   */
  percentage(value: number, total: number): number {
    if (total <= 0) return 0;
    return Math.round((value / total) * 100);
  },

  /**
   * Calculate total expenses
   */
  totalExpenses(items: { amount: number }[]): number {
    return items.reduce((sum, item) => sum + item.amount, 0);
  },

  /**
   * Calculate average
   */
  average(values: number[]): number {
    if (values.length === 0) return 0;
    return Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 100) / 100;
  },
};