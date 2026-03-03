'use client';

import React, { createContext, useContext, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { User } from '@/lib/types/auth';
import { loginAction, logoutAction } from '@/shared/lib/actions/auth';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;
    login: (credentials: { username: string; password: string }) => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const fetchSession = async (): Promise<{ authenticated: boolean; user: User | null }> => {
    const response = await fetch('/api/auth/session');
    if (!response.ok) {
        return { authenticated: false, user: null };
    }
    return response.json();
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const router = useRouter();
    const pathname = usePathname();
    const queryClient = useQueryClient();
    const [manualUser, setManualUser] = useState<User | null>(null);

    const { data: sessionData, isLoading } = useQuery({
        queryKey: ['auth-session'],
        queryFn: fetchSession,
        staleTime: 1000 * 60 * 5,
        retry: false,
    });

    const user = sessionData?.user || manualUser;
    const loading = isLoading;

    const handleRedirect = () => {
        if (loading) return;
        
        const isAuthPath = pathname === '/login';
        const isProtectedPath = pathname.startsWith('/admin') || pathname.startsWith('/seller') || pathname.startsWith('/logistics');

        if (!user && isProtectedPath) {
            router.push('/login');
        } else if (user && isAuthPath) {
            if (user.role === 'administrator') {
                router.push('/admin');
            } else if (user.role === 'seller') {
                router.push('/seller');
            } else if (user.role === 'logistics_operator') {
                router.push('/logistics');
            }
        }
    };

    handleRedirect();

    const login = async (credentials: { username: string; password: string }) => {
        try {
            const result = await loginAction(credentials);

            if (!result.success) {
                return { success: false, error: result.error };
            }

            setManualUser(result.user || null);
            queryClient.invalidateQueries({ queryKey: ['auth-session'] });

            if (result.user?.role === 'administrator') {
                router.push('/admin');
            } else if (result.user?.role === 'logistics_operator') {
                router.push('/logistics');
            } else {
                router.push('/seller');
            }

            return { success: true };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: 'Error de conexión' };
        }
    };

    const logout = async () => {
        try {
            await logoutAction();
        } catch {
            // Continue even if server action fails
        }
        setManualUser(null);
        queryClient.invalidateQueries({ queryKey: ['auth-session'] });
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            isAuthenticated: !!user,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
