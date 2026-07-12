import { supabaseAdmin } from '../../config/supabase';
import { ApiError } from '../../utils/ApiError';

export class ExpenseService {
    async getAll(filters: any) {
        let query = supabaseAdmin.from('expenses').select('*, vehicle:vehicles(*)').order('date', { ascending: false });
        if (filters.vehicle_id) query = query.eq('vehicle_id', filters.vehicle_id);
        if (filters.type) query = query.eq('type', filters.type);

        const { data, error } = await query;
        if (error) throw new ApiError(500, 'Failed to fetch expenses');
        return data;
    }

    async create(data: any) {
        const { data: expense, error } = await supabaseAdmin.from('expenses').insert(data).select().single();
        if (error) throw new ApiError(500, 'Failed to create expense');
        return expense;
    }
}