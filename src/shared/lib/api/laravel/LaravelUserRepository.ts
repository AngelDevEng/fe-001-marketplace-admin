import { User, UserRole } from '@/lib/types/auth';
import { IUserRepository, UserFilters, UpdateUserInput } from '../contracts/IUserRepository';

export class LaravelUserRepository implements IUserRepository {
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

    async getCurrentUser(): Promise<User | null> {
        throw new Error('Laravel: Not implemented yet');
    }

    async getUserById(id: number): Promise<User | null> {
        throw new Error('Laravel: Not implemented yet');
    }

    async getUsers(filters?: UserFilters): Promise<User[]> {
        throw new Error('Laravel: Not implemented yet');
    }

    async getUsersByRole(role: UserRole): Promise<User[]> {
        throw new Error('Laravel: Not implemented yet');
    }

    async updateUser(id: number, input: UpdateUserInput): Promise<User> {
        throw new Error('Laravel: Not implemented yet');
    }

    async deleteUser(id: number): Promise<boolean> {
        throw new Error('Laravel: Not implemented yet');
    }
}
