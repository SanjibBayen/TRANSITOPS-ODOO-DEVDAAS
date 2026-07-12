import { supabaseAdmin } from '../config/supabase';

export class NotificationService {
  static async create(data: {
    userId: string;
    title: string;
    message: string;
    type?: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
    link?: string;
  }) {
    try {
      const { data: notification, error } = await supabaseAdmin
        .from('notifications')
        .insert({
          user_id: data.userId,
          title: data.title,
          message: data.message,
          type: data.type || 'INFO',
          link: data.link || null,
        })
        .select()
        .single();

      if (error) throw error;
      return notification;
    } catch (error) {
      console.error('Notification creation failed:', error);
      return null;
    }
  }

  static async getUserNotifications(userId: string, unreadOnly: boolean = false) {
    let query = supabaseAdmin
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (unreadOnly) {
      query = query.eq('is_read', false);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  static async getUnreadCount(userId: string): Promise<number> {
    const { count, error } = await supabaseAdmin
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) return 0;
    return count || 0;
  }

  static async markAsRead(notificationId: string, userId: string) {
    const { error } = await supabaseAdmin
      .from('notifications')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('id', notificationId)
      .eq('user_id', userId);

    if (error) throw error;
  }

  static async markAllAsRead(userId: string) {
    const { error } = await supabaseAdmin
      .from('notifications')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) throw error;
  }

  static async deleteOldNotifications(daysOld: number = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const { error } = await supabaseAdmin
      .from('notifications')
      .delete()
      .lt('created_at', cutoffDate.toISOString())
      .eq('is_read', true);

    if (error) console.error('Failed to delete old notifications:', error);
  }

  // Pre-built notification templates
  static async notifyLicenseExpiring(
    safetyOfficerIds: string[],
    driverName: string,
    driverId: string,
    expiryDate: string,
    daysLeft: number
  ) {
    for (const officerId of safetyOfficerIds) {
      await this.create({
        userId: officerId,
        title: '⚠️ License Expiring Soon',
        message: `${driverName}'s license expires in ${daysLeft} days (${expiryDate})`,
        type: daysLeft <= 3 ? 'ERROR' : 'WARNING',
        link: `/drivers/${driverId}`,
      });
    }
  }

  static async notifyVehicleMaintenanceDue(
    fleetManagerIds: string[],
    vehicleReg: string,
    vehicleId: string
  ) {
    for (const managerId of fleetManagerIds) {
      await this.create({
        userId: managerId,
        title: '🔧 Maintenance Due',
        message: `Vehicle ${vehicleReg} is due for maintenance service`,
        type: 'WARNING',
        link: `/vehicles/${vehicleId}`,
      });
    }
  }

  static async notifyTripDispatched(
    driverUserId: string,
    tripNumber: string,
    tripId: string,
    source: string,
    destination: string
  ) {
    await this.create({
      userId: driverUserId,
      title: '🚛 Trip Dispatched',
      message: `Trip ${tripNumber} assigned: ${source} → ${destination}`,
      type: 'SUCCESS',
      link: `/trips/${tripId}`,
    });
  }

  static async notifyTripCompleted(
    fleetManagerIds: string[],
    tripNumber: string,
    revenue: number
  ) {
    for (const managerId of fleetManagerIds) {
      await this.create({
        userId: managerId,
        title: '✅ Trip Completed',
        message: `Trip ${tripNumber} completed. Revenue: ₹${revenue}`,
        type: 'SUCCESS',
        link: `/trips`,
      });
    }
  }

  static async notifyDocumentExpiring(
    fleetManagerIds: string[],
    vehicleReg: string,
    documentType: string,
    expiryDate: string
  ) {
    for (const managerId of fleetManagerIds) {
      await this.create({
        userId: managerId,
        title: '📄 Document Expiring',
        message: `${documentType} for ${vehicleReg} expires on ${expiryDate}`,
        type: 'WARNING',
        link: `/vehicles`,
      });
    }
  }
}