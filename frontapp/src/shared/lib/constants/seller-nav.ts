export interface SellerModule {
    id: string;
    label: string;
    description: string;
    icon: string; // Phosphor icon class
    href: string;
    color?: string;
}

export const sellerNavigation: SellerModule[] = [
    {
        id: 'planes',
        label: 'Mi Plan',
        description: 'Gestiona tu suscripción y plan de servicios',
        icon: 'CreditCard',
        href: '/seller/planes'
    },
    {
        id: 'mis-datos',
        label: 'Mis Datos',
        description: 'Información de la cuenta y configuración del perfil',
        icon: 'User',
        href: '/seller/profile'
    },
    {
        id: 'mi-tienda',
        label: 'Mi Tienda',
        description: 'Personaliza tu escaparate público y presencia de marca',
        icon: 'Store',
        href: '/seller/store'
    },
    {
        id: 'catalogo',
        label: 'Mi Catálogo',
        description: 'Gestión integral de productos, categorías y existencias',
        icon: 'Catalog',
        href: '/seller/catalog'
    },
    {
        id: 'servicios',
        label: 'Mis Servicios',
        description: 'Gestión de prestaciones y reservas activas',
        icon: 'Services',
        href: '/seller/services'
    },
    {
        id: 'ventas',
        label: 'Mis Ventas',
        description: 'Monitoreo estratégico de transacciones y despachos',
        icon: 'Sales',
        href: '/seller/sales'
    },
    {
        id: 'agenda',
        label: 'Mi Agenda',
        description: 'Gestión cronológica de entregas y compromisos',
        icon: 'Calendar',
        href: '/seller/agenda'
    },
    {
        id: 'logistica',
        label: 'Mi Logística',
        description: 'Configuración estratégica de envíos y operadoras',
        icon: 'Logistics',
        href: '/seller/logistics'
    },
    {
        id: 'finanzas',
        label: 'Centro de Finanzas',
        description: 'Monitoreo en tiempo real de tus KPIs estratégicos y monetarios',
        icon: 'Finance',
        href: '/seller/finance'
    },
    {
        id: 'chat',
        label: 'Chat con Clientes',
        description: 'Comunicación directa y soporte en tiempo real',
        icon: 'Messages',
        href: '/seller/chat'
    },
    {
        id: 'ayuda',
        label: 'Mesa de Ayuda',
        description: 'Soporte técnico y gestión de incidencias',
        icon: 'Help',
        href: '/seller/help'
    },
    {
        id: 'facturacion',
        label: 'Mis Comprobantes',
        description: 'Gestión de facturación y documentos electrónicos',
        icon: 'Invoices',
        href: '/seller/invoices'
    }
];
