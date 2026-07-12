import { supabaseAdmin } from '../../config/supabase';
import { DispatchAssignment, DispatchValidationResult } from './dispatch.types';

export class DispatchValidator {
  static async validate(assignment: DispatchAssignment): Promise<DispatchValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    const [vehicle, driver, trip] = await Promise.all([
      supabaseAdmin.from('vehicles').select('*').eq('id', assignment.vehicle_id).single(),
      supabaseAdmin.from('drivers').select('*').eq('id', assignment.driver_id).single(),
      supabaseAdmin.from('trips').select('*').eq('id', assignment.trip_id).single(),
    ]);

    if (!vehicle.data) errors.push('Vehicle not found');
    if (!driver.data) errors.push('Driver not found');
    if (!trip.data) errors.push('Trip not found');

    if (vehicle.data) {
      if (vehicle.data.status === 'RETIRED') errors.push('Vehicle is retired');
      if (vehicle.data.status === 'IN_SHOP') errors.push('Vehicle is in maintenance');
      if (vehicle.data.status === 'ON_TRIP') errors.push('Vehicle is already on a trip');
      if (vehicle.data.status !== 'AVAILABLE') errors.push('Vehicle is not available');
      
      if (trip.data && trip.data.cargo_weight > vehicle.data.max_load_capacity) {
        errors.push(
          `Cargo weight (${trip.data.cargo_weight}kg) exceeds vehicle capacity (${vehicle.data.max_load_capacity}kg)`
        );
      }
    }

    if (driver.data) {
      if (driver.data.status === 'SUSPENDED') errors.push('Driver is suspended');
      if (driver.data.status === 'ON_TRIP') errors.push('Driver is already on a trip');
      if (driver.data.status !== 'AVAILABLE') errors.push('Driver is not available');
      
      if (driver.data.license_expiry) {
        const expiryDate = new Date(driver.data.license_expiry);
        const now = new Date();
        
        if (expiryDate < now) {
          errors.push('Driver license has expired');
        }
        
        const sevenDaysFromNow = new Date();
        sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
        
        if (expiryDate < sevenDaysFromNow && expiryDate > now) {
          const daysLeft = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          warnings.push(`Driver license expires in ${daysLeft} days`);
        }
      }
      
      if (driver.data.safety_score < 50) {
        warnings.push(`Driver has low safety score: ${driver.data.safety_score}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  static async getAvailableResources() {
    const [vehicles, drivers, pendingTrips] = await Promise.all([
      supabaseAdmin.from('vehicles').select('*').eq('status', 'AVAILABLE').order('max_load_capacity'),
      supabaseAdmin.from('drivers').select('*').eq('status', 'AVAILABLE').gt('license_expiry', new Date().toISOString()).order('safety_score', { ascending: false }),
      supabaseAdmin.from('trips').select('*').eq('status', 'DRAFT').order('created_at'),
    ]);

    return {
      vehicles: vehicles.data || [],
      drivers: drivers.data || [],
      pendingTrips: pendingTrips.data || [],
    };
  }
}