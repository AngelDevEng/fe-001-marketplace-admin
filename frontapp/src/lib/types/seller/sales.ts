export type OrderStatus = 'pendiente' | 'pagado' | 'en_proceso' | 'entregado' | 'cancelado';

export interface OrderItem {
    name: string;
    qty: number;
    price: number;
}

export interface ShippingInfo {
    direccion: string;
    carrier: string;
    tracking: string;
    costo: number;
}

export interface Order {
    id: string;
    fecha: string;
    cliente: string;
    dni: string;
    total: number;
    unidades: number;
    estado: OrderStatus;
    currentStep: number;
    metodo_pago: string;
    estado_pago: 'pendiente' | 'verificado';
    envio: ShippingInfo;
    items: OrderItem[];
}

export interface SalesKPI {
    label: string;
    count: number;
    status: string;
    icon: string;
    color: string;
}
