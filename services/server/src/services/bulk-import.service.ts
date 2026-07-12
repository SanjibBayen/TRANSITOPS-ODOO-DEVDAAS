import { supabaseAdmin } from '../config/supabase';
import { ApiError } from '../utils/ApiError';

export class BulkImportService {
  static async importVehiclesFromCSV(csvData: string): Promise<{ imported: number; errors: string[] }> {
    const lines = csvData.trim().split('\n');
    if (lines.length < 2) throw new ApiError(400, 'CSV must have header and at least one data row');

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/ /g, '_'));
    const requiredFields = ['registration_number', 'model', 'type', 'max_load_capacity'];
    
    const missingFields = requiredFields.filter(f => !headers.includes(f));
    if (missingFields.length > 0) {
      throw new ApiError(400, `Missing required fields: ${missingFields.join(', ')}`);
    }

    const errors: string[] = [];
    let imported = 0;

    for (let i = 1; i < lines.length; i++) {
      try {
        const values = lines[i].split(',').map(v => v.trim());
        const vehicle: any = {};
        headers.forEach((header, index) => {
          vehicle[header] = values[index] || null;
        });

        vehicle.max_load_capacity = parseFloat(vehicle.max_load_capacity);
        vehicle.acquisition_cost = vehicle.acquisition_cost ? parseFloat(vehicle.acquisition_cost) : null;
        vehicle.year = vehicle.year ? parseInt(vehicle.year) : null;

        const { error } = await supabaseAdmin.from('vehicles').insert(vehicle);
        if (error) {
          errors.push(`Row ${i}: ${error.message}`);
        } else {
          imported++;
        }
      } catch (err: any) {
        errors.push(`Row ${i}: ${err.message}`);
      }
    }

    return { imported, errors };
  }
}