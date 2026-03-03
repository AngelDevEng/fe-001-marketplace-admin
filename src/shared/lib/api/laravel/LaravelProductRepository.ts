import { Product } from '@/features/seller/catalog/types';
import { IProductRepository, ProductFilters, CreateProductInput, UpdateProductInput } from '../contracts/IProductRepository';

export class LaravelProductRepository implements IProductRepository {
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

    async getProducts(filters?: ProductFilters): Promise<Product[]> {
        throw new Error('Laravel: Not implemented yet');
    }

    async getProductById(id: string): Promise<Product | null> {
        throw new Error('Laravel: Not implemented yet');
    }

    async createProduct(input: CreateProductInput): Promise<Product> {
        throw new Error('Laravel: Not implemented yet');
    }

    async updateProduct(id: string, input: UpdateProductInput): Promise<Product> {
        throw new Error('Laravel: Not implemented yet');
    }

    async deleteProduct(id: string): Promise<boolean> {
        throw new Error('Laravel: Not implemented yet');
    }

    async updateStock(id: string, quantity: number): Promise<Product> {
        throw new Error('Laravel: Not implemented yet');
    }
}
