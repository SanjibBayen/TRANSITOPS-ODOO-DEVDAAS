import { supabaseAdmin } from '../config/supabase';

export class ExportService {
  static async exportToCSV(data: any[], columns: string[]): Promise<string> {
    const header = columns.join(',');
    const rows = data.map(row => 
      columns.map(col => {
        const value = row[col] ?? '';
        return `"${String(value).replace(/"/g, '""')}"`;
      }).join(',')
    );
    return [header, ...rows].join('\n');
  }

  static async exportVehicles(filters?: any): Promise<string> {
    const { data } = await supabaseAdmin.from('vehicles').select('*');
    if (!data) return '';

    const columns = ['registration_number', 'model', 'type', 'status', 'max_load_capacity', 'current_odometer', 'acquisition_cost', 'region'];
    return this.exportToCSV(data, columns);
  }

  static async exportDrivers(filters?: any): Promise<string> {
    const { data } = await supabaseAdmin.from('drivers').select('*');
    if (!data) return '';

    const columns = ['name', 'phone', 'license_number', 'license_category', 'license_expiry', 'safety_score', 'status'];
    return this.exportToCSV(data, columns);
  }

  static async exportTrips(filters?: any): Promise<string> {
    let query = supabaseAdmin.from('trips').select('*, vehicle:vehicles(registration_number), driver:drivers(name)');
    if (filters?.status) query = query.eq('status', filters.status);
    
    const { data } = await query;
    if (!data) return '';

    const formatted = data.map((trip: any) => ({
      trip_number: trip.trip_number,
      source: trip.source,
      destination: trip.destination,
      vehicle: trip.vehicle?.registration_number,
      driver: trip.driver?.name,
      cargo_weight: trip.cargo_weight,
      status: trip.status,
      revenue: trip.revenue,
      profit: trip.profit,
    }));

    return this.exportToCSV(formatted, Object.keys(formatted[0] || {}));
  }
}