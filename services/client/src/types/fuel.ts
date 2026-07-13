export interface FuelLog {
  id: string;
  vehicle_id: string;
  trip_id?: string;
  liters: number;
  cost: number;
  price_per_liter?: number;
  odometer?: number;
  station?: string;
  date: string;
  receipt_url?: string;
  notes?: string;
  vehicle?: {
    registration_number: string;
    model: string;
  };
  created_at?: string;
}

export interface FuelLogInput {
  vehicle_id: string;
  liters: number;
  cost: number;
  trip_id?: string;
  odometer?: number;
  station?: string;
  date?: string;
  notes?: string;
}

export interface FuelStats {
  totalFuel: number;
  totalCost: number;
  averageEfficiency: number;
}