export type UserRole = 'administrator' | 'seller' | 'customer' | 'logistics_operator';

export interface User {
    id: number;
    username: string;
    email: string;
    nicename: string;
    display_name: string;
    role: UserRole;
    avatar?: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

export interface LoginCredentials {
    username: string;
    password: string;
    rememberMe?: boolean;
}

export interface LoginResponse {
    success: boolean;
    message?: string;
    token?: string;
    user?: User;
    error?: string;
}

export interface RegisterCredentials {
    storeName: string;
    email: string;
    phone: string;
    password: string;
    ruc: string;
}

export interface RegisterResponse {
    success: boolean;
    message?: string;
    error?: string;
}
