import { supabaseAdmin } from '../../config/supabase';
import { ApiError } from '../../utils/ApiError';

export class MaintenanceService {
    async getAll(filters: any) {
        let query = supabaseAdmin.from('maintenances').select('*, vehicle:vehicles(*)').order('created_at', { ascending: false });
        if (filters.vehicle_id) query = query.eq('vehicle_id', filters.vehicle_id);
        if (filters.status) query = query.eq('status', filters.status);

        const { data, error } = await query;
        if (error) throw new ApiError(500, 'Failed to fetch maintenance records');
        return data;
    }

    async getActive() {
        const { data, error } = await supabaseAdmin
            .from('maintenances')
            .select('*, vehicle:vehicles(*)')
            .eq('status', 'ACTIVE');

        if (error) throw new ApiError(500, 'Failed to fetch active maintenance');
        return data;
    }

    async create(data: any) {
        const { data: vehicle } = await supabaseAdmin.from('vehicles').select('status').eq('id', data.vehicle_id).single();
        if (!vehicle) throw new ApiError(404, 'Vehicle not found');
        if (vehicle.status === 'RETIRED') throw new ApiError(400, 'Cannot maintain retired vehicle');

        // Create maintenance and update vehicle status in transaction
        const { data: maintenance, error } = await supabaseAdmin.from('maintenances').insert(data).select().single();
        if (error) throw new ApiError(500, 'Failed to create maintenance record');

        await supabaseAdmin.from('vehicles').update({ status: 'IN_SHOP' }).eq('id', data.vehicle_id);

        return maintenance;
    }

    async complete(id: string) {
        const { data: maintenance } = await supabaseAdmin.from('maintenances').select('*').eq('id', id).single();
        if (!maintenance) throw new ApiError(404, 'Maintenance record not found');

        const { data, error } = await supabaseAdmin.from('maintenances').update({
            status: 'COMPLETED',
            completed_at: new Date().toISOString(),
        }).eq('id', id).select().single();

        if (error) throw new ApiError(500, 'Failed to complete maintenance');

        // Restore vehicle to available
        await supabaseAdmin.from('vehicles').update({ status: 'AVAILABLE' }).eq('id', maintenance.vehicle_id);

        return data;
    }
}