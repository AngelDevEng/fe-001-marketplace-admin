export interface LogisticsModule {
    id: string;
    label: string;
    description: string;
    icon: string;
    href: string;
}

export const logisticsNavigation: LogisticsModule[] = [
    {
        id: 'tracker',
        label: 'Rastreador de Envíos',
        description: 'Gestión y seguimiento de pedidos asignados',
        icon: 'Truck',
        href: '/logistics'
    },
    {
        id: 'chat-vendors',
        label: 'Chat con Vendedores',
        description: 'Comunicación directa con vendedores',
        icon: 'Messages',
        href: '/logistics/chat-vendors'
    },
    {
        id: 'helpdesk',
        label: 'Mesa de Ayuda',
        description: 'Soporte y reportar incidencias',
        icon: 'Help',
        href: '/logistics/helpdesk'
    },
];
