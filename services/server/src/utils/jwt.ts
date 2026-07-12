import { supabaseAdmin } from '../config/supabase';
import { ApiError } from './ApiError';

export class JwtService {
  // Verify access token
  static async verifyAccessToken(token: string) {
    try {
      const { data, error } = await supabaseAdmin.auth.getUser(token);
      
      if (error || !data.user) {
        throw new ApiError(401, 'Invalid or expired token');
      }
      
      return {
        userId: data.user.id,
        email: data.user.email!,
        role: data.user.user_metadata?.role || 'DRIVER',
        name: data.user.user_metadata?.name || '',
      };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(401, 'Token verification failed');
    }
  }

  // Extract token from request
  static extractToken(authHeader: string | undefined): string {
    if (!authHeader) {
      throw new ApiError(401, 'No authorization header');
    }

    const parts = authHeader.split(' ');
    
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new ApiError(401, 'Invalid authorization format. Use: Bearer <token>');
    }

    return parts[1];
  }

  // Decode token without verification (for debugging)
  static decodeToken(token: string): any {
    try {
      const base64Payload = token.split('.')[1];
      const payload = Buffer.from(base64Payload, 'base64').toString('utf-8');
      return JSON.parse(payload);
    } catch {
      return null;
    }
  }

  // Check if token is expired
  static isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded?.exp) return true;
    return Date.now() >= decoded.exp * 1000;
  }

  // Get token expiry time
  static getTokenExpiry(token: string): Date | null {
    const decoded = this.decodeToken(token);
    if (!decoded?.exp) return null;
    return new Date(decoded.exp * 1000);
  }

  // Refresh session
  static async refreshSession(refreshToken: string) {
    try {
      const { data, error } = await supabaseAdmin.auth.refreshSession({
        refresh_token: refreshToken,
      });

      if (error) {
        throw new ApiError(401, 'Invalid refresh token');
      }

      return {
        accessToken: data.session!.access_token,
        refreshToken: data.session!.refresh_token,
        expiresAt: data.session!.expires_at,
        expiresIn: data.session!.expires_in,
      };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(401, 'Session refresh failed');
    }
  }

  // Revoke user sessions
  static async revokeAllSessions(userId: string) {
    const { error } = await supabaseAdmin.auth.admin.signOut(userId);
    if (error) throw new ApiError(500, 'Failed to revoke sessions');
  }
}