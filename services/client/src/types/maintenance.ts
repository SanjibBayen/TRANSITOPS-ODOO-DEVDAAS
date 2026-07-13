export type MaintenanceStatus = 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export interface Maintenance {
  id: string;
  vehicle_id: string;
  type: string;
  description?: string;
  service_center?: string;
  cost: number;
  start_odometer?: number;
  status: MaintenanceStatus;
  notes?: string;
  started_at: string;
  completed_at?: string;
  vehicle?: {
    registration_number: string;
    model: string;
  };
  created_at?: string;
  updated_at?: string;
}

export interface MaintenanceInput {
  vehicle_id: string;
  type: string;
  description?: string;
  service_center?: string;
  cost?: number;
  start_odometer?: number;
  notes?: string;
}

export interface MaintenanceFilters {
  vehicle_id?: string;
  status?: MaintenanceStatus;
}