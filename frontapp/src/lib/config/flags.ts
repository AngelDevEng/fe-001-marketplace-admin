export const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === 'true';

export const LARAVEL_API_URL = process.env.NEXT_PUBLIC_LARAVEL_API_URL ?? 'http://localhost:8000/api';

export type ApiBackend = 'wp' | 'laravel';
export const API_BACKEND: ApiBackend = (process.env.NEXT_PUBLIC_API_BACKEND as ApiBackend) || 'wp';
