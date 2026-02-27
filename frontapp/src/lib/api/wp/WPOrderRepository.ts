import axios from 'axios';
import { Order, OrderStatus } from '@/lib/types/seller/sales';
import { IOrderRepository, OrderFilters, CreateOrderInput, UpdateOrderInput } from '../contracts/IOrderRepository';
import { API_CONFIG } from '@/lib/config/api';

const wcClient = axios.create({
    baseURL: API_CONFIG.wcApiUrl,
    headers: { 'Content-Type': 'application/json' },
});

export class WPOrderRepository implements IOrderRepository {
    private getAuthHeaders() {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        return token ? { Authorization: `Bearer ${token}` } : {};
    }

    async getOrders(filters?: OrderFilters): Promise<Order[]> {
        throw new Error('TODO Tarea 3: Conectar endpoint real de WooCommerce/Dokan');
    }

    async getOrderById(id: string): Promise<Order | null> {
        throw new Error('TODO Tarea 3: Conectar endpoint real');
    }

    async createOrder(input: CreateOrderInput): Promise<Order> {
        throw new Error('TODO Tarea 3: Conectar endpoint real');
    }

    async updateOrder(id: string, input: UpdateOrderInput): Promise<Order> {
        throw new Error('TODO Tarea 3: Conectar endpoint real');
    }

    async deleteOrder(id: string): Promise<boolean> {
        throw new Error('TODO Tarea 3: Conectar endpoint real');
    }

    async advanceOrderStep(id: string): Promise<Order> {
        throw new Error('TODO Tarea 3: Conectar endpoint real');
    }
}
