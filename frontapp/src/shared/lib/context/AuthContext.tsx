'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const initAuth = async () => {
            try {
                const response = await fetch('/api/auth/session');
                if (response.ok) {
                    const data = await response.json();
                    if (data.authenticated && data.user) {
                        setUser(data.user);
                    }
                }
            } catch {
                // No session, stay unauthenticated
            } finally {
                setLoading(false);
            }
        };
        initAuth();
    }, []);

    useEffect(() => {
        if (!loading) {
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
        }
    }, [pathname, user, loading, router]);

    const login = async (credentials: { username: string; password: string }) => {
        setLoading(true);
        try {
            const result = await loginAction(credentials);

            if (!result.success) {
                return { success: false, error: result.error };
            }

            setUser(result.user || null);

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
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await logoutAction();
        } catch {
            // Continue even if server action fails
        }
        setUser(null);
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
