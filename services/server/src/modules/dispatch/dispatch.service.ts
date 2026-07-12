import { supabaseAdmin } from '../../config/supabase';
import { ApiError } from '../../utils/ApiError';

export class DispatchService {
    async getAvailableResources() {
        const [vehicles, drivers, pendingTrips] = await Promise.all([
            supabaseAdmin.from('vehicles').select('*').eq('status', 'AVAILABLE'),
            supabaseAdmin.from('drivers').select('*').eq('status', 'AVAILABLE').gt('license_expiry', new Date().toISOString()),
            supabaseAdmin.from('trips').select('*').eq('status', 'DRAFT'),
        ]);

        return {
            vehicles: vehicles.data || [],
            drivers: drivers.data || [],
            pendingTrips: pendingTrips.data || [],
        };
    }

    async validateDispatch(data: { trip_id: string; vehicle_id: string; driver_id: string }) {
        const errors: string[] = [];
        const warnings: string[] = [];

        const { data: vehicle } = await supabaseAdmin.from('vehicles').select('*').eq('id', data.vehicle_id).single();
        const { data: driver } = await supabaseAdmin.from('drivers').select('*').eq('id', data.driver_id).single();
        const { data: trip } = await supabaseAdmin.from('trips').select('*').eq('id', data.trip_id).single();

        if (!vehicle) errors.push('Vehicle not found');
        if (!driver) errors.push('Driver not found');
        if (!trip) errors.push('Trip not found');

        if (vehicle) {
            if (vehicle.status !== 'AVAILABLE') errors.push('Vehicle is not available');
            if (trip && trip.cargo_weight > vehicle.max_load_capacity) {
                errors.push(`Cargo weight (${trip.cargo_weight}kg) exceeds vehicle capacity (${vehicle.max_load_capacity}kg)`);
            }
        }

        if (driver) {
            if (driver.status === 'SUSPENDED') errors.push('Driver is suspended');
            if (driver.status !== 'AVAILABLE') errors.push('Driver is not available');
            if (new Date(driver.license_expiry) < new Date()) errors.push('Driver license has expired');

            const sevenDaysFromNow = new Date();
            sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
            if (new Date(driver.license_expiry) < sevenDaysFromNow) {
                warnings.push(`Driver license expires soon (${driver.license_expiry})`);
            }
        }

        return {
            valid: errors.length === 0,
            errors,
            warnings,
        };
    }

    async dispatchTrip(tripId: string, userId: string) {
        const { data: trip } = await supabaseAdmin.from('trips').select('*').eq('id', tripId).single();
        if (!trip) throw new ApiError(404, 'Trip not found');
        if (trip.status !== 'DRAFT') throw new ApiError(400, 'Only draft trips can be dispatched');

        // Validate
        const validation = await this.validateDispatch({
            trip_id: tripId,
            vehicle_id: trip.vehicle_id,
            driver_id: trip.driver_id,
        });

        if (!validation.valid) {
            throw new ApiError(400, 'Dispatch validation failed', validation.errors);
        }

        // Update trip status
        const { data, error } = await supabaseAdmin.from('trips').update({
            status: 'DISPATCHED',
            dispatched_by_id: userId,
            actual_start_date: new Date().toISOString(),
        }).eq('id', tripId).select().single();

        if (error) throw new ApiError(500, 'Failed to dispatch trip');

        // Update vehicle and driver status
        await supabaseAdmin.from('vehicles').update({ status: 'ON_TRIP' }).eq('id', trip.vehicle_id);
        await supabaseAdmin.from('drivers').update({ status: 'ON_TRIP' }).eq('id', trip.driver_id);

        return data;
    }
}