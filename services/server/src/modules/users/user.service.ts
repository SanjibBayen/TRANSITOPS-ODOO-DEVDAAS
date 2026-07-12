import { supabaseAdmin } from '../../config/supabase';
import { ApiError } from '../../utils/ApiError';
import { Sanitize } from '../../utils/sanitize';
// @ts-ignore: some repository setups place services outside TS project scope
import { AuditService } from '../../services/audit.service';

export class UserService {
  async getAll() {
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();

    if (error) throw new ApiError(500, 'Failed to fetch users');

    return users.map((user: any) => ({
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name || '',
      role: user.user_metadata?.role || 'DRIVER',
      phone: user.user_metadata?.phone || '',
      lastSignIn: user.last_sign_in_at,
      createdAt: user.created_at,
      isActive: !user.banned_until,
    }));
  }

  async getById(id: string) {
    const { data: { user }, error } = await supabaseAdmin.auth.admin.getUserById(id);

    if (error || !user) throw new ApiError(404, 'User not found');

    return {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name || '',
      role: user.user_metadata?.role || 'DRIVER',
      phone: user.user_metadata?.phone || '',
      lastSignIn: user.last_sign_in_at,
      createdAt: user.created_at,
    };
  }

  async update(id: string, data: any) {
    const sanitized = Sanitize.object(data);

    const { data: { user }, error } = await supabaseAdmin.auth.admin.updateUserById(id, {
      user_metadata: sanitized,
    });

    if (error) throw new ApiError(500, 'Failed to update user');

    await AuditService.log({
      userId: id,
      action: 'UPDATE_USER',
      entity: 'users',
      entityId: id,
      newValue: sanitized,
      ipAddress: '',
      userAgent: '',
    });

    return user;
  }

  async deactivate(id: string) {
    const { error } = await supabaseAdmin.auth.admin.updateUserById(id, {
      ban_duration: '876600h', // 100 years
    });

    if (error) throw new ApiError(500, 'Failed to deactivate user');

    await AuditService.log({
      userId: id,
      action: 'DEACTIVATE_USER',
      entity: 'users',
      entityId: id,
      ipAddress: '',
      userAgent: '',
    });
  }

  async activate(id: string) {
    const { error } = await supabaseAdmin.auth.admin.updateUserById(id, {
      ban_duration: '0h',
    });

    if (error) throw new ApiError(500, 'Failed to activate user');

    await AuditService.log({
      userId: id,
      action: 'ACTIVATE_USER',
      entity: 'users',
      entityId: id,
      ipAddress: '',
      userAgent: '',
    });
  }
}