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

export interface TripFilters {
  status?: string;
  vehicle_id?: string;
  driver_id?: string;
  date_from?: string;
  date_to?: string;
}

export interface TripCompletionData {
  end_odometer: number;
  revenue?: number;
  notes?: string;
}