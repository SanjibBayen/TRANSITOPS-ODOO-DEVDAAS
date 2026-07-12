import { supabaseAdmin } from '../../config/supabase';
import { ApiError } from '../../utils/ApiError';

export class DriverService {
    async getAll(filters: any) {
        let query = supabaseAdmin.from('drivers').select('*').order('created_at', { ascending: false });

        if (filters.status) query = query.eq('status', filters.status);
        if (filters.search) query = query.or(`name.ilike.%${filters.search}%,license_number.ilike.%${filters.search}%`);

        const { data, error } = await query;
        if (error) throw new ApiError(500, 'Failed to fetch drivers');
        return data;
    }

    async getById(id: string) {
        const { data, error } = await supabaseAdmin
            .from('drivers')
            .select('*, trips(count)')
            .eq('id', id)
            .single();

        if (error || !data) throw new ApiError(404, 'Driver not found');
        return data;
    }

    async getAvailable() {
        const { data, error } = await supabaseAdmin
            .from('drivers')
            .select('*')
            .eq('status', 'AVAILABLE')
            .gt('license_expiry', new Date().toISOString())
            .order('safety_score', { ascending: false });

        if (error) throw new ApiError(500, 'Failed to fetch available drivers');
        return data;
    }

    async getExpiringLicenses() {
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

        const { data, error } = await supabaseAdmin
            .from('drivers')
            .select('*')
            .lte('license_expiry', thirtyDaysFromNow.toISOString())
            .order('license_expiry', { ascending: true });

        if (error) throw new ApiError(500, 'Failed to fetch expiring licenses');
        return data;
    }

    async create(driverData: any) {
        const { data: existing } = await supabaseAdmin
            .from('drivers')
            .select('id')
            .eq('license_number', driverData.license_number)
            .single();

        if (existing) throw new ApiError(409, 'Driver with this license number already exists');

        const { data, error } = await supabaseAdmin.from('drivers').insert(driverData).select().single();
        if (error) throw new ApiError(500, 'Failed to create driver');
        return data;
    }

    async update(id: string, updateData: any) {
        const { data, error } = await supabaseAdmin.from('drivers').update(updateData).eq('id', id).select().single();
        if (error) throw new ApiError(500, 'Failed to update driver');
        return data;
    }

    async updateStatus(id: string, status: string) {
        const { data: driver } = await supabaseAdmin.from('drivers').select('status').eq('id', id).single();
        if (!driver) throw new ApiError(404, 'Driver not found');

        if (status === 'ON_TRIP' && driver.status !== 'AVAILABLE') {
            throw new ApiError(400, 'Only available drivers can be put on trip');
        }

        const { data, error } = await supabaseAdmin.from('drivers').update({ status }).eq('id', id).select().single();
        if (error) throw new ApiError(500, 'Failed to update driver status');
        return data;
    }
}