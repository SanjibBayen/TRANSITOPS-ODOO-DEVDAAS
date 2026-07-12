import { supabaseAdmin } from '../../config/supabase';
import { ApiError } from '../../utils/ApiError';

export class TripService {
    async getAll(filters: any, user: any) {
        let query = supabaseAdmin.from('trips').select('*, vehicle:vehicles(*), driver:drivers(*)').order('created_at', { ascending: false });

        // Role-based filtering
        if (user.role === 'DRIVER') {
            const { data: driver } = await supabaseAdmin.from('drivers').select('id').eq('user_id', user.id).single();
            if (driver) query = query.eq('driver_id', driver.id);
        }

        if (filters.status) query = query.eq('status', filters.status);
        if (filters.vehicle_id) query = query.eq('vehicle_id', filters.vehicle_id);

        const { data, error } = await query;
        if (error) throw new ApiError(500, 'Failed to fetch trips');
        return data;
    }

    async getById(id: string) {
        const { data, error } = await supabaseAdmin
            .from('trips')
            .select('*, vehicle:vehicles(*), driver:drivers(*)')
            .eq('id', id)
            .single();

        if (error || !data) throw new ApiError(404, 'Trip not found');
        return data;
    }

    async create(tripData: any, userId: string) {
        // Validate vehicle
        const { data: vehicle } = await supabaseAdmin.from('vehicles').select('*').eq('id', tripData.vehicle_id).single();
        if (!vehicle) throw new ApiError(404, 'Vehicle not found');
        if (vehicle.status !== 'AVAILABLE') throw new ApiError(400, 'Vehicle is not available');
        if (tripData.cargo_weight > vehicle.max_load_capacity) {
            throw new ApiError(400, `Cargo weight exceeds vehicle capacity of ${vehicle.max_load_capacity}kg`);
        }

        // Validate driver
        const { data: driver } = await supabaseAdmin.from('drivers').select('*').eq('id', tripData.driver_id).single();
        if (!driver) throw new ApiError(404, 'Driver not found');
        if (driver.status === 'SUSPENDED') throw new ApiError(400, 'Driver is suspended');
        if (new Date(driver.license_expiry) < new Date()) throw new ApiError(400, 'Driver license has expired');

        const { data, error } = await supabaseAdmin.from('trips').insert({
            ...tripData,
            dispatched_by_id: userId,
            status: 'DRAFT',
        }).select().single();

        if (error) throw new ApiError(500, 'Failed to create trip');
        return data;
    }

    async updateStatus(id: string, status: string, userId: string) {
        const { data: trip } = await supabaseAdmin.from('trips').select('*').eq('id', id).single();
        if (!trip) throw new ApiError(404, 'Trip not found');

        // State machine validation
        const validTransitions: Record<string, string[]> = {
            DRAFT: ['DISPATCHED', 'CANCELLED'],
            DISPATCHED: ['IN_PROGRESS', 'CANCELLED'],
            IN_PROGRESS: ['COMPLETED', 'CANCELLED'],
            COMPLETED: [],
            CANCELLED: [],
        };

        if (!validTransitions[trip.status]?.includes(status)) {
            throw new ApiError(400, `Cannot transition from ${trip.status} to ${status}`);
        }

        // Handle dispatch
        if (status === 'DISPATCHED') {
            await supabaseAdmin.from('vehicles').update({ status: 'ON_TRIP' }).eq('id', trip.vehicle_id);
            await supabaseAdmin.from('drivers').update({ status: 'ON_TRIP' }).eq('id', trip.driver_id);
        }

        // Handle cancel
        if (status === 'CANCELLED' && trip.status === 'DISPATCHED') {
            await supabaseAdmin.from('vehicles').update({ status: 'AVAILABLE' }).eq('id', trip.vehicle_id);
            await supabaseAdmin.from('drivers').update({ status: 'AVAILABLE' }).eq('id', trip.driver_id);
        }

        const { data, error } = await supabaseAdmin.from('trips').update({
            status,
            ...(status === 'DISPATCHED' ? { actual_start_date: new Date().toISOString() } : {}),
        }).eq('id', id).select().single();

        if (error) throw new ApiError(500, 'Failed to update trip status');
        return data;
    }

    async completeTrip(id: string, completionData: any) {
        const { data: trip } = await supabaseAdmin.from('trips').select('*').eq('id', id).single();
        if (!trip) throw new ApiError(404, 'Trip not found');
        if (trip.status !== 'IN_PROGRESS') throw new ApiError(400, 'Trip must be in progress to complete');

        const actualDistance = completionData.end_odometer && trip.start_odometer
            ? completionData.end_odometer - trip.start_odometer
            : null;

        const { data, error } = await supabaseAdmin.from('trips').update({
            status: 'COMPLETED',
            end_odometer: completionData.end_odometer,
            actual_distance: actualDistance,
            actual_end_date: new Date().toISOString(),
            revenue: completionData.revenue || 0,
        }).eq('id', id).select().single();

        if (error) throw new ApiError(500, 'Failed to complete trip');

        // Restore vehicle and driver
        await supabaseAdmin.from('vehicles').update({ status: 'AVAILABLE' }).eq('id', trip.vehicle_id);
        await supabaseAdmin.from('drivers').update({ status: 'AVAILABLE' }).eq('id', trip.driver_id);

        return data;
    }
}