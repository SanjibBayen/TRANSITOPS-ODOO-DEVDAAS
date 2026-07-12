import { supabaseAdmin } from '../../config/supabase';
import { ApiError } from '../../utils/ApiError';

export class VehicleService {
    async getAll(filters: any) {
        let query = supabaseAdmin.from('vehicles').select('*').order('created_at', { ascending: false });

        if (filters.status) query = query.eq('status', filters.status);
        if (filters.type) query = query.eq('type', filters.type);
        if (filters.region) query = query.eq('region', filters.region);
        if (filters.search) {
            query = query.or(`registration_number.ilike.%${filters.search}%,model.ilike.%${filters.search}%`);
        }

        const { data, error } = await query;
        if (error) throw new ApiError(500, 'Failed to fetch vehicles');
        return data;
    }

    async getById(id: string) {
        const { data, error } = await supabaseAdmin
            .from('vehicles')
            .select('*, trips(count), maintenances(count)')
            .eq('id', id)
            .single();

        if (error || !data) throw new ApiError(404, 'Vehicle not found');
        return data;
    }

    async getAvailable() {
        const { data, error } = await supabaseAdmin
            .from('vehicles')
            .select('*')
            .eq('status', 'AVAILABLE')
            .order('max_load_capacity', { ascending: true });

        if (error) throw new ApiError(500, 'Failed to fetch available vehicles');
        return data;
    }

    async getStats() {
        const { data, error } = await supabaseAdmin.from('vehicles').select('status');
        if (error) throw new ApiError(500, 'Failed to fetch vehicle stats');

        return {
            total: data.length,
            available: data.filter(v => v.status === 'AVAILABLE').length,
            onTrip: data.filter(v => v.status === 'ON_TRIP').length,
            inShop: data.filter(v => v.status === 'IN_SHOP').length,
            retired: data.filter(v => v.status === 'RETIRED').length,
        };
    }

    async create(vehicleData: any) {
        const { data: existing } = await supabaseAdmin
            .from('vehicles')
            .select('id')
            .eq('registration_number', vehicleData.registration_number)
            .single();

        if (existing) throw new ApiError(409, 'Vehicle with this registration number already exists');

        const { data, error } = await supabaseAdmin.from('vehicles').insert(vehicleData).select().single();
        if (error) throw new ApiError(500, 'Failed to create vehicle');
        return data;
    }

    async update(id: string, updateData: any) {
        const { data, error } = await supabaseAdmin.from('vehicles').update(updateData).eq('id', id).select().single();
        if (error) throw new ApiError(500, 'Failed to update vehicle');
        return data;
    }

    async updateStatus(id: string, status: string) {
        const { data: vehicle } = await supabaseAdmin.from('vehicles').select('status').eq('id', id).single();
        if (!vehicle) throw new ApiError(404, 'Vehicle not found');

        if (status === 'ON_TRIP' && vehicle.status !== 'AVAILABLE') {
            throw new ApiError(400, 'Only available vehicles can be put on trip');
        }
        if (status === 'RETIRED' && vehicle.status === 'ON_TRIP') {
            throw new ApiError(400, 'Cannot retire a vehicle on trip');
        }

        const { data, error } = await supabaseAdmin.from('vehicles').update({ status }).eq('id', id).select().single();
        if (error) throw new ApiError(500, 'Failed to update vehicle status');
        return data;
    }
}