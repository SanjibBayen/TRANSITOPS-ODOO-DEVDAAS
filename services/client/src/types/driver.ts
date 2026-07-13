export type DriverStatus = 'AVAILABLE' | 'ON_TRIP' | 'OFF_DUTY' | 'SUSPENDED';

export interface Driver {
  id: string;
  user_id?: string;
  name: string;
  email?: string;
  phone: string;
  license_number: string;
  license_category: string;
  license_expiry: string;
  license_image_url?: string;
  date_of_birth?: string;
  blood_group?: string;
  address?: string;
  emergency_contact?: string;
  safety_score: number;
  total_trips: number;
  total_distance: number;
  joining_date?: string;
  status: DriverStatus;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DriverInput {
  name: string;
  phone: string;
  license_number: string;
  license_category: string;
  license_expiry: string;
  email?: string;
  date_of_birth?: string;
  blood_group?: string;
  address?: string;
  emergency_contact?: string;
}

export interface DriverStats {
  total: number;
  available: number;
  onTrip: number;
  offDuty: number;
  suspended: number;
}