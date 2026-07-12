import { supabaseAdmin } from '../config/supabase';

interface AuditLogData {
  userId: string;
  action: string;
  entity: string;
  entityId: string;
  oldValue?: any;
  newValue?: any;
  ipAddress?: string;
  userAgent?: string;
}

export class AuditService {
  static async log(data: AuditLogData) {
    try {
      const { error } = await supabaseAdmin.from('audit_logs').insert({
        user_id: data.userId,
        action: data.action,
        entity: data.entity,
        entity_id: data.entityId,
        old_value: data.oldValue ? JSON.stringify(data.oldValue) : null,
        new_value: data.newValue ? JSON.stringify(data.newValue) : null,
        ip_address: data.ipAddress || null,
        user_agent: data.userAgent || null,
      });

      if (error) {
        console.error('Audit log error:', error.message);
      }
    } catch (err) {
      console.error('Audit log failed:', err);
    }
  }

  static async getLogs(entity: string, entityId: string) {
    const { data, error } = await supabaseAdmin
      .from('audit_logs')
      .select('*')
      .eq('entity', entity)
      .eq('entity_id', entityId)
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw error;
    return data;
  }

  static async getUserActivity(userId: string, limit: number = 50) {
    const { data, error } = await supabaseAdmin
      .from('audit_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  }

  static async getRecentActivity(limit: number = 20) {
    const { data, error } = await supabaseAdmin
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  }
}