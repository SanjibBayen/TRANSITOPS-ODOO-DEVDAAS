export class AnalyticsCalculations {
  static fuelEfficiency(totalDistance: number, totalFuel: number): number {
    if (totalFuel === 0) return 0;
    return Number((totalDistance / totalFuel).toFixed(2));
  }

  static costPerKm(totalCost: number, totalDistance: number): number {
    if (totalDistance === 0) return 0;
    return Number((totalCost / totalDistance).toFixed(2));
  }

  static vehicleROI(revenue: number, maintenanceCost: number, fuelCost: number, acquisitionCost: number): number {
    if (acquisitionCost === 0) return 0;
    return Number((((revenue - maintenanceCost - fuelCost) / acquisitionCost) * 100).toFixed(2));
  }

  static fleetUtilization(vehiclesOnTrip: number, totalActiveVehicles: number): number {
    if (totalActiveVehicles === 0) return 0;
    return Number(((vehiclesOnTrip / totalActiveVehicles) * 100).toFixed(2));
  }

  static driverUtilization(tripsCompleted: number, workingDays: number): number {
    if (workingDays === 0) return 0;
    return Number(((tripsCompleted / workingDays) * 100).toFixed(2));
  }

  static revenuePerKm(totalRevenue: number, totalDistance: number): number {
    if (totalDistance === 0) return 0;
    return Number((totalRevenue / totalDistance).toFixed(2));
  }

  static maintenanceCostRatio(maintenanceCost: number, totalCost: number): number {
    if (totalCost === 0) return 0;
    return Number(((maintenanceCost / totalCost) * 100).toFixed(2));
  }
}