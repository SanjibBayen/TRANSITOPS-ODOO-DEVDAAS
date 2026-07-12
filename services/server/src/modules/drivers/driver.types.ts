export interface DriverInput {
  name: string;
  email?: string;
  phone: string;
  license_number: string;
  license_category: string;
  license_expiry: string;
  date_of_birth?: string;
  blood_group?: string;
  address?: string;
  emergency_contact?: string;
}

export interface DriverFilters {
  status?: string;
  search?: string;
  license_expiring_soon?: boolean;
}