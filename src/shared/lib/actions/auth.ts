'use server';

import { cookies } from 'next/headers';
import { api } from '@/shared/lib/api';
import { LoginCredentials } from '@/lib/types/auth';

export async function loginAction(credentials: LoginCredentials) {
    const result = await api.auth.login(credentials);

    if (!result.success || !result.token) {
        return { success: false, error: result.error || 'Login failed' };
    }

    const cookieStore = await cookies();

    cookieStore.set('auth_token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/'
    });

    cookieStore.set('user_role', result.user?.role || 'customer', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/'
    });

    cookieStore.set('user_id', result.user?.id.toString() || '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/'
    });

    return { success: true, user: result.user };
}

export async function logoutAction() {
    const cookieStore = await cookies();

    cookieStore.delete('auth_token');
    cookieStore.delete('user_role');
    cookieStore.delete('user_id');
    cookieStore.delete('wp_session');
    cookieStore.delete('user_id');

    return { success: true };
}

export async function getSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    const role = cookieStore.get('user_role')?.value;
    const userId = cookieStore.get('user_id')?.value;

    if (!token) {
        return { authenticated: false, user: null, role: null };
    }

    try {
        const user = await api.auth.validateToken();
        return {
            authenticated: true,
            user,
            role: role || user?.role || null
        };
    } catch {
        return { authenticated: false, user: null, role: null };
    }
}
