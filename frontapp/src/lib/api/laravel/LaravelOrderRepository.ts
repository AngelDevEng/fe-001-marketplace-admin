import { Order } from '@/lib/types/seller/sales';
import { IOrderRepository, OrderFilters, CreateOrderInput, UpdateOrderInput } from '../contracts/IOrderRepository';

export class LaravelOrderRepository implements IOrderRepository {
    private getBaseUrl(): string {
        return process.env.NEXT_PUBLIC_LARAVEL_API_URL ?? 'http://localhost:8000/api';
    }

    private async getAuthHeaders(): Promise<HeadersInit> {
        const token = await this.getToken();
        return token ? { Authorization: `Bearer ${token}` } : {};
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

    async getOrders(filters?: OrderFilters): Promise<Order[]> {
        throw new Error('Laravel: Not implemented yet');
    }

    async getOrderById(id: string): Promise<Order | null> {
        throw new Error('Laravel: Not implemented yet');
    }

    async createOrder(input: CreateOrderInput): Promise<Order> {
        throw new Error('Laravel: Not implemented yet');
    }

    async updateOrder(id: string, input: UpdateOrderInput): Promise<Order> {
        throw new Error('Laravel: Not implemented yet');
    }

    async deleteOrder(id: string): Promise<boolean> {
        throw new Error('Laravel: Not implemented yet');
    }

    async advanceOrderStep(id: string): Promise<Order> {
        throw new Error('Laravel: Not implemented yet');
    }
}
