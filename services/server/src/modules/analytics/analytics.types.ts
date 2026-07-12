export interface DashboardKPIs {
  vehicles: {
    total: number;
    active: number;
    available: number;
    onTrip: number;
    inShop: number;
    retired: number;
    utilization: number;
  };
  drivers: {
    total: number;
    available: number;
    onTrip: number;
    offDuty: number;
    suspended: number;
  };
  trips: {
    total: number;
    active: number;
    pending: number;
    completed: number;
    cancelled: number;
  };
  alerts: {
    expiringLicenses: number;
    expiringDocuments: number;
    vehiclesInMaintenance: number;
  };
}

export interface VehicleCostSummary {
  id: string;
  registration_number: string;
  model: string;
  acquisition_cost: number;
  total_maintenance_cost: number;
  total_fuel_cost: number;
  other_expenses: number;
  total_revenue: number;
  roi_percentage: number;
}

export interface FleetUtilizationData {
  total_active: number;
  available: number;
  on_trip: number;
  in_shop: number;
  utilization_percentage: number;
}