import { supabaseAdmin } from '../../config/supabase';

export class AnalyticsService {
    async getDashboard(user: any) {
        const [vehicles, drivers, trips, expiringLicenses] = await Promise.all([
            supabaseAdmin.from('vehicles').select('status'),
            supabaseAdmin.from('drivers').select('status'),
            supabaseAdmin.from('trips').select('status'),
            supabaseAdmin.from('drivers').select('*').lte('license_expiry', new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()),
        ]);

        const vehicleData = vehicles.data || [];
        const driverData = drivers.data || [];
        const tripData = trips.data || [];

        return {
            vehicles: {
                total: vehicleData.length,
                active: vehicleData.filter(v => v.status !== 'RETIRED').length,
                available: vehicleData.filter(v => v.status === 'AVAILABLE').length,
                onTrip: vehicleData.filter(v => v.status === 'ON_TRIP').length,
                inShop: vehicleData.filter(v => v.status === 'IN_SHOP').length,
                utilization: vehicleData.length > 0
                    ? Math.round((vehicleData.filter(v => v.status === 'ON_TRIP').length / vehicleData.filter(v => v.status !== 'RETIRED').length) * 100)
                    : 0,
            },
            drivers: {
                total: driverData.length,
                available: driverData.filter(d => d.status === 'AVAILABLE').length,
                onTrip: driverData.filter(d => d.status === 'ON_TRIP').length,
                offDuty: driverData.filter(d => d.status === 'OFF_DUTY').length,
                suspended: driverData.filter(d => d.status === 'SUSPENDED').length,
            },
            trips: {
                total: tripData.length,
                active: tripData.filter(t => t.status === 'IN_PROGRESS' || t.status === 'DISPATCHED').length,
                pending: tripData.filter(t => t.status === 'DRAFT').length,
                completed: tripData.filter(t => t.status === 'COMPLETED').length,
            },
            alerts: {
                expiringLicenses: expiringLicenses.data?.length || 0,
            },
        };
    }

    async getFleetUtilization() {
        const { data } = await supabaseAdmin.from('fleet_utilization_view').select('*').single();
        return data;
    }

    async getVehicleCosts() {
        const { data } = await supabaseAdmin.from('vehicle_cost_summary').select('*');
        return data;
    }

    async getVehicleROI() {
        const { data } = await supabaseAdmin.from('vehicle_cost_summary').select('*').order('roi_percentage', { ascending: false });
        return data;
    }
}