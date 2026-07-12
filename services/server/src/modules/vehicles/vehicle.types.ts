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
  insurance_expiry?: string;
  permit_expiry?: string;
  pollution_expiry?: string;
}

export interface VehicleFilters {
  status?: string;
  type?: string;
  region?: string;
  search?: string;
  page?: number;
  limit?: number;
}