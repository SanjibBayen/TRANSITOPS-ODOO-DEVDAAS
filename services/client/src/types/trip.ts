export type TripStatus = 'DRAFT' | 'DISPATCHED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface Trip {
  id: string;
  trip_number: string;
  source: string;
  destination: string;
  cargo_type?: string;
  cargo_weight: number;
  planned_distance: number;
  actual_distance?: number;
  planned_start_date?: string;
  actual_start_date?: string;
  actual_end_date?: string;
  start_odometer?: number;
  end_odometer?: number;
  revenue?: number;
  expenses?: number;
  profit?: number;
  notes?: string;
  status: TripStatus;
  vehicle_id: string;
  driver_id: string;
  dispatched_by_id?: string;
  vehicle?: {
    id: string;
    registration_number: string;
    model: string;
  };
  driver?: {
    id: string;
    name: string;
  };
  created_at?: string;
  updated_at?: string;
}

export interface TripInput {
  source: string;
  destination: string;
  cargo_weight: number;
  planned_distance: number;
  cargo_type?: string;
  vehicle_id: string;
  driver_id: string;
  planned_start_date?: string;
  start_odometer?: number;
}

export interface TripCompletionData {
  end_odometer: number;
  revenue?: number;
  notes?: string;
}

export interface TripFilters {
  status?: TripStatus;
  vehicle_id?: string;
  driver_id?: string;
  search?: string;
}

export interface DispatchValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}