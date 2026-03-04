import { IHomeRepository } from '../contracts/IHomeRepository';
import { BannersPub } from '@/types/public';

export class LaravelHomeRepository implements IHomeRepository {
    private getBaseUrl(): string {
        return process.env.NEXT_PUBLIC_LARAVEL_API_URL ?? 'http://localhost:8000/api';
    }

    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const baseUrl = this.getBaseUrl();

        const response = await fetch(`${baseUrl}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        if (!response.ok) {
            throw new Error(`Laravel API Error: ${response.status}`);
        }

        return response.json();
    }

    async getBannersPub(): Promise<BannersPub> {
        return this.request<BannersPub>('/home/banners-pub');
    }
}
