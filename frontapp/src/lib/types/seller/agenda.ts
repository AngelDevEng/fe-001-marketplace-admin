import { Appointment, Specialist } from './service';

export type EventType = 'order' | 'service';

export type OrderStatus = 'pagado' | 'pendiente' | 'en_proceso' | 'entregado';

export interface ShippingInfo {
    address: string;
    carrier: string;
    tracking: string;
}

export interface AgendaOrder {
    id: string;
    date: string; // ISO string like "2026-01-05T10:00:00"
    customer: string;
    dni: string;
    status: OrderStatus;
    currentStep: number;
    total: number;
    payment_method: string;
    shipping: ShippingInfo;
}

export interface AgendaEvent {
    id: string | number;
    type: EventType;
    date: string; // YYYY-MM-DD
    time: string; // HH:MM
    title: string;
    subtitle: string;
    status: string;
    originalData: AgendaOrder | Appointment;
    specialist?: Specialist;
}

export interface DayActivity {
    date: Date;
    events: AgendaEvent[];
}
