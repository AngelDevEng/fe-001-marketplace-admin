export type UserRole = 'administrator' | 'seller' | 'customer';

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
