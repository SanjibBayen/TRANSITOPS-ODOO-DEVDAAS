import { supabaseAdmin } from '../config/supabase';
import { EmailService } from '../config/email';
import { NotificationService } from './notification.service';


export class SchedulerService {
  // Check for expiring licenses
  static async checkExpiringLicenses(): Promise<void> {
    try {
      const sevenDaysFromNow = new Date();
      sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

      const { data: drivers } = await supabaseAdmin
        .from('drivers')
        .select('*')
        .lte('license_expiry', sevenDaysFromNow.toISOString().split('T')[0])
        .gt('license_expiry', new Date().toISOString().split('T')[0])
        .neq('status', 'SUSPENDED');

      if (!drivers) return;

      for (const driver of drivers) {
        const daysLeft = Math.ceil(
          (new Date(driver.license_expiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        );

        // Get safety officers
        const { data: safetyOfficers } = await supabaseAdmin
          .from('notifications')
          .select('user_id')
          .limit(1);

        if (driver.email) {
          await EmailService.sendLicenseExpiryReminder(
            driver.email,
            driver.name,
            driver.license_expiry,
            daysLeft
          );
        }

        console.log(`License expiry alert: ${driver.name} - ${daysLeft} days remaining`);
      }
    } catch (error) {
      console.error('License check error:', error);
    }
  }

  // Check for upcoming maintenance
  static async checkMaintenanceSchedule(): Promise<void> {
    try {
      const { data: vehicles } = await supabaseAdmin
        .from('vehicles')
        .select('*')
        .neq('status', 'RETIRED');

      if (!vehicles) return;

      const maintenanceInterval = 10000; // 10,000 km

      for (const vehicle of vehicles) {
        const { data: lastMaintenance } = await supabaseAdmin
          .from('maintenances')
          .select('start_odometer')
          .eq('vehicle_id', vehicle.id)
          .order('started_at', { ascending: false })
          .limit(1)
          .single();

        const lastOdometer = lastMaintenance?.start_odometer || 0;
        const kmSinceMaintenance = vehicle.current_odometer - lastOdometer;

        if (kmSinceMaintenance >= maintenanceInterval * 0.9) {
          console.log(`Maintenance due: ${vehicle.registration_number} - ${kmSinceMaintenance}km since last service`);
        }
      }
    } catch (error) {
      console.error('Maintenance check error:', error);
    }
  }

  // Run all checks
  static async runAllChecks(): Promise<void> {
    console.log('Running scheduled checks...');
    await this.checkExpiringLicenses();
    await this.checkMaintenanceSchedule();
    console.log('Scheduled checks complete');
  }
}