export type ExpenseType = 'FUEL' | 'TOLL' | 'MAINTENANCE' | 'PERMIT' | 'INSURANCE' | 'REPAIR' | 'OTHER';

export interface Expense {
  id: string;
  vehicle_id: string;
  trip_id?: string;
  type: ExpenseType;
  amount: number;
  description?: string;
  date: string;
  receipt_url?: string;
  approved_by?: string;
  notes?: string;
  vehicle?: {
    registration_number: string;
    model: string;
  };
  created_at?: string;
  updated_at?: string;
}

export interface ExpenseInput {
  vehicle_id: string;
  type: ExpenseType;
  amount: number;
  trip_id?: string;
  description?: string;
  date?: string;
  notes?: string;
}

export interface ExpenseFilters {
  vehicle_id?: string;
  type?: ExpenseType;
  date_from?: string;
  date_to?: string;
}