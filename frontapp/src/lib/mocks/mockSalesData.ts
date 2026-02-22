import { Order, SalesKPI } from '@/lib/types/seller/sales';

export const MOCK_ORDERS: Order[] = [
    {
        id: 'PED-2024-001',
        fecha: '2024-03-15',
        cliente: 'Ana Martínez',
        dni: '76543210',
        total: 250.50,
        unidades: 3,
        estado: 'en_proceso',
        currentStep: 2,
        metodo_pago: 'Tarjeta de Crédito',
        estado_pago: 'verificado',
        envio: { direccion: 'Av. Siempre Viva 123, Lima', carrier: 'Olva Courier', tracking: 'TRK-123456789', costo: 15.00 },
        items: [
            { name: 'Producto A', qty: 2, price: 100.00 },
            { name: 'Producto B', qty: 1, price: 50.50 }
        ]
    },
    {
        id: 'PED-2024-002',
        fecha: '2024-03-16',
        cliente: 'Roberto Gómez',
        dni: '01234567',
        total: 89.90,
        unidades: 1,
        estado: 'pagado',
        currentStep: 1,
        metodo_pago: 'Yape',
        estado_pago: 'verificado',
        envio: { direccion: 'Calle Falsa 456, Arequipa', carrier: 'Shalom', tracking: 'SHL-987654321', costo: 10.00 },
        items: [
            { name: 'Producto C', qty: 1, price: 89.90 }
        ]
    },
    {
        id: 'PED-2024-003',
        fecha: '2024-03-17',
        cliente: 'Carmen Rojas',
        dni: '44556677',
        total: 450.00,
        unidades: 5,
        estado: 'pendiente',
        currentStep: 1,
        metodo_pago: 'Transferencia Bancaria',
        estado_pago: 'pendiente',
        envio: { direccion: 'Urb. Los Rosales Mz A Lt 5, Trujillo', carrier: 'Pendiente', tracking: '-', costo: 20.00 },
        items: [
            { name: 'Producto D', qty: 5, price: 90.00 }
        ]
    }
];

export const MOCK_KPIS: SalesKPI[] = [
    { label: 'Ingresos Mensuales', count: 45000, status: 'Total', icon: 'Finance', color: 'sky' },
    { label: 'Nuevos Pedidos', count: 12, status: 'Pendientes', icon: 'Sales', color: 'indigo' },
    { label: 'En Preparación', count: 5, status: 'Agencia', icon: 'Catalog', color: 'cyan' },
    { label: 'En Camino', count: 8, status: 'Tránsito', icon: 'Logistics', color: 'amber' },
    { label: 'Devoluciones', count: 1, status: 'Alerta', icon: 'RotateCcw', color: 'red' }
];
