import { supabaseAdmin } from '../../config/supabase';
import { ApiError } from '../../utils/ApiError';

export class AuthService {
    async signup(data: { email: string; password: string; name: string; role: string; phone?: string }) {
        const { data: authData, error } = await supabaseAdmin.auth.admin.createUser({
            email: data.email,
            password: data.password,
            email_confirm: true,
            user_metadata: {
                name: data.name,
                role: data.role,
                phone: data.phone,
            },
        });

        if (error) {
            if (error.message.includes('already been registered')) {
                throw new ApiError(409, 'Email already registered');
            }
            throw new ApiError(400, error.message);
        }

        // If role is DRIVER, create driver profile
        if (data.role === 'DRIVER') {
            await supabaseAdmin.from('drivers').insert({
                user_id: authData.user.id,
                name: data.name,
                email: data.email,
                phone: data.phone || '',
                license_number: 'PENDING',
                license_category: 'LMV',
                license_expiry: new Date().toISOString(),
            });
        }

        return {
            user: {
                id: authData.user.id,
                email: authData.user.email,
                name: data.name,
                role: data.role,
            },
        };
    }

    async login(data: { email: string; password: string }) {
        const { data: authData, error } = await supabaseAdmin.auth.signInWithPassword({
            email: data.email,
            password: data.password,
        });

        if (error) {
            throw new ApiError(401, 'Invalid email or password');
        }

        return {
            user: {
                id: authData.user.id,
                email: authData.user.email,
                name: authData.user.user_metadata?.name,
                role: authData.user.user_metadata?.role,
            },
            session: {
                access_token: authData.session.access_token,
                refresh_token: authData.session.refresh_token,
                expires_at: authData.session.expires_at,
            },
        };
    }

    async logout(userId: string) {
        await supabaseAdmin.auth.admin.signOut(userId);
    }

    async getMe(userId: string) {
        const res = await supabaseAdmin.auth.admin.getUserById(userId);
        const { data, error } = res;

        if (error || !data || !data.user) throw new ApiError(404, 'User not found');

        const user = data.user;
        return {
            id: user.id,
            email: user.email,
            name: user.user_metadata?.name,
            role: user.user_metadata?.role,
            phone: user.user_metadata?.phone,
        };
    }

    async refreshToken(refreshToken: string) {
        const { data, error } = await supabaseAdmin.auth.refreshSession({
            refresh_token: refreshToken,
        });

        if (error) throw new ApiError(401, 'Invalid refresh token');

        return {
            session: {
                access_token: data.session!.access_token,
                refresh_token: data.session!.refresh_token,
                expires_at: data.session!.expires_at,
            },
        };
    }
}