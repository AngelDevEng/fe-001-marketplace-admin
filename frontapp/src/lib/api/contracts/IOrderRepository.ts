import { Order, OrderStatus } from '@/lib/types/seller/sales';

export interface OrderFilters {
    status?: OrderStatus;
    dateStart?: string;
    dateEnd?: string;
    search?: string;
}

export interface CreateOrderInput {
    customerId: string;
    items: Array<{
        productId: string;
        quantity: number;
        price: number;
    }>;
    shippingAddress: string;
    paymentMethod: string;
}

export interface UpdateOrderInput {
    status?: OrderStatus;
    tracking?: string;
    notes?: string;
}

export interface IOrderRepository {
    getOrders(filters?: OrderFilters): Promise<Order[]>;
    getOrderById(id: string): Promise<Order | null>;
    createOrder(input: CreateOrderInput): Promise<Order>;
    updateOrder(id: string, input: UpdateOrderInput): Promise<Order>;
    deleteOrder(id: string): Promise<boolean>;
    advanceOrderStep(id: string): Promise<Order>;
}
