import { supabaseAdmin } from '../../config/supabase';
import { ApiError } from '../../utils/ApiError';

export class FuelService {
    async getAll(filters: any) {
        let query = supabaseAdmin.from('fuel_logs').select('*, vehicle:vehicles(*)').order('date', { ascending: false });
        if (filters.vehicle_id) query = query.eq('vehicle_id', filters.vehicle_id);
        if (filters.trip_id) query = query.eq('trip_id', filters.trip_id);

        const { data, error } = await query;
        if (error) throw new ApiError(500, 'Failed to fetch fuel logs');
        return data;
    }

    async create(data: any) {
        const { data: log, error } = await supabaseAdmin.from('fuel_logs').insert(data).select().single();
        if (error) throw new ApiError(500, 'Failed to create fuel log');
        return log;
    }
}