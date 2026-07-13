export type VehicleStatus = 'AVAILABLE' | 'ON_TRIP' | 'IN_SHOP' | 'RETIRED';

export interface Vehicle {
  id: string;
  registration_number: string;
  model: string;
  type: string;
  brand?: string;
  year?: number;
  max_load_capacity: number;
  current_odometer: number;
  acquisition_cost: number;
  acquisition_date?: string;
  insurance_expiry?: string;
  permit_expiry?: string;
  pollution_expiry?: string;
  status: VehicleStatus;
  region?: string;
  color?: string;
  fuel_type?: string;
  image_url?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface VehicleInput {
  registration_number: string;
  model: string;
  type: string;
  max_load_capacity: number;
  acquisition_cost?: number;
  brand?: string;
  year?: number;
  region?: string;
  color?: string;
  fuel_type?: string;
  notes?: string;
}

export interface VehicleStats {
  total: number;
  available: number;
  onTrip: number;
  inShop: number;
  retired: number;
}

export interface VehicleFilters {
  status?: VehicleStatus;
  type?: string;
  region?: string;
  search?: string;
}