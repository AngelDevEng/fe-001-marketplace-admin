'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { User } from '@/lib/types/auth';
import { getStores } from '@/lib/api';

export interface LoginCredentials {
    username: string;
    password: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    // Persistencia básica con localStorage
    useEffect(() => {
        const storedToken = localStorage.getItem('auth_token');
        const storedUser = localStorage.getItem('auth_user');

        if (storedToken && storedUser) {
            setToken(storedToken);
            try {
                setUser(JSON.parse(storedUser));
            } catch {
                localStorage.removeItem('auth_user');
                localStorage.removeItem('auth_token');
            }
        }
        setLoading(false);
    }, []);

    // Protección de Rutas
    useEffect(() => {
        if (!loading) {
            const isAuthPath = pathname === '/login';
            const isAdminPath = pathname.startsWith('/admin');
            const isSellerPath = pathname.startsWith('/seller');
            const isLogisticsPath = pathname.startsWith('/logistics');

            if (!token && (isAdminPath || isSellerPath || isLogisticsPath)) {
                router.push('/login');
            } else if (token && isAuthPath) {
                //ueado y va Si ya está log al login, redirigir según rol
                if (user?.role === 'administrator') {
                    router.push('/admin');
                } else if (user?.role === 'seller') {
                    router.push('/seller');
                } else if (user?.role === 'logistics_operator') {
                    router.push('/logistics');
                }
            }
        }
    }, [pathname, token, user, loading, router]);

    const login = async (credentials: any) => {
        setLoading(true);
        try {
            console.log("Iniciando validación de identidad...", credentials);
            await new Promise(resolve => setTimeout(resolve, 1500)); // Animación de carga

            let selectedUser: User;

            if (credentials.username === 'admin') {
                selectedUser = {
                    id: 1,
                    username: 'admin',
                    email: 'admin@lyrium.com',
                    nicename: 'Admin',
                    display_name: 'Administrador Maestro',
                    role: 'administrator'
                };
            } else if (credentials.username === 'logistics') {
                selectedUser = {
                    id: 999,
                    username: 'operador_logistico',
                    email: 'logistics@lyrium.com',
                    nicename: 'Operador Logístico',
                    display_name: 'Operador Logístico',
                    role: 'logistics_operator'
                };
            } else {
                // Lógica de "Bypass" por nombre de tienda para desarrollo
                try {
                    const stores = await getStores(credentials.username);
                    const matchingStore = stores.find(s =>
                        s.store_name.toLowerCase() === credentials.username.toLowerCase()
                    );

                    if (matchingStore) {
                        selectedUser = {
                            id: matchingStore.id,
                            username: matchingStore.store_name,
                            email: matchingStore.email || `${matchingStore.store_name.toLowerCase()}@test.com`,
                            nicename: matchingStore.store_name,
                            display_name: matchingStore.store_name,
                            role: 'seller'
                        };
                        console.log(`✅ Acceso concedido como vendedor: ${matchingStore.store_name} (ID: ${matchingStore.id})`);
                    } else {
                        // Fallback predeterminado si no se encuentra (para evitar errores de desarrollo)
                        selectedUser = {
                            id: 17,
                            username: 'vendedor_demo',
                            email: 'demo@test.com',
                            nicename: 'Vendedor Demo',
                            display_name: 'Tienda Demo Fisio Center',
                            role: 'seller'
                        };
                    }
                } catch (apiError) {
                    console.error("Error buscando tienda:", apiError);
                    // Fallback a Vendedor por defecto
                    selectedUser = {
                        id: 17,
                        username: 'vendedor_fisio',
                        email: 'fisio@test.com',
                        nicename: 'Fisio Center',
                        display_name: 'Fisio Center',
                        role: 'seller'
                    };
                }
            }

            const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

            setToken(mockToken);
            setUser(selectedUser);
            localStorage.setItem('auth_token', mockToken);
            localStorage.setItem('auth_user', JSON.stringify(selectedUser));

            if (selectedUser.role === 'administrator') {
                router.push('/admin');
            } else if (selectedUser.role === 'logistics_operator') {
                router.push('/logistics');
            } else {
                router.push('/seller');
            }
        } catch (error) {
            console.error("Error en login:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout }}>
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
