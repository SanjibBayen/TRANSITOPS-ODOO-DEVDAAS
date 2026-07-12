export interface DispatchAssignment {
  trip_id: string;
  vehicle_id: string;
  driver_id: string;
}

export interface DispatchValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface AvailableResources {
  vehicles: any[];
  drivers: any[];
  pendingTrips: any[];
}

export interface DispatchConflict {
  type: 'VEHICLE_UNAVAILABLE' | 'DRIVER_UNAVAILABLE' | 'LICENSE_EXPIRED' | 'CAPACITY_EXCEEDED' | 'DRIVER_SUSPENDED';
  message: string;
  entityId: string;
}