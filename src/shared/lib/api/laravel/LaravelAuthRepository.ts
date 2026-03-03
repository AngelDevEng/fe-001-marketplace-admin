import { User, LoginCredentials, LoginResponse, RegisterCredentials, RegisterResponse } from '@/lib/types/auth';
import { IAuthRepository } from '../contracts/IAuthRepository';

export class LaravelAuthRepository implements IAuthRepository {
    private getBaseUrl(): string {
        return process.env.NEXT_PUBLIC_LARAVEL_API_URL ?? 'http://localhost:8000/api';
    }

    private async getToken(): Promise<string | null> {
        try {
            const { cookies } = await import('next/headers');
            const cookieStore = await cookies();
            return cookieStore.get('laravel_token')?.value ?? null;
        } catch {
            return null;
        }
    }

    private async getAuthHeaders(): Promise<HeadersInit> {
        const token = await this.getToken();
        return token ? { Authorization: `Bearer ${token}` } : {};
    }

    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const baseUrl = this.getBaseUrl();
        const authHeaders = await this.getAuthHeaders();

        const response = await fetch(`${baseUrl}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...authHeaders,
                ...options.headers,
            },
        });

        if (!response.ok) {
            throw new Error(`Laravel API Error: ${response.status}`);
        }

        return response.json();
    }

    async login(credentials: LoginCredentials): Promise<LoginResponse> {
        try {
            const response = await fetch(`${this.getBaseUrl()}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: credentials.username,
                    password: credentials.password,
                }),
            });

            if (!response.ok) {
                return { success: false, error: 'Credenciales inválidas' };
            }

            const data = await response.json();
            return {
                success: true,
                token: data.token,
                user: data.user,
            };
        } catch (error) {
            return { success: false, error: 'Error de conexión' };
        }
    }

    async logout(): Promise<void> {
        throw new Error('Laravel: Not implemented yet');
    }

    async refreshToken(): Promise<{ token: string }> {
        throw new Error('Laravel: Not implemented yet');
    }

    async validateToken(): Promise<User | null> {
        throw new Error('Laravel: Not implemented yet');
    }

    async register(credentials: RegisterCredentials): Promise<RegisterResponse> {
        throw new Error('Laravel: Not implemented yet');
    }
}
