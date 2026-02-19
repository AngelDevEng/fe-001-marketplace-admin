import { NavSection } from '@/lib/types/navigation';

export const adminNavigation: NavSection[] = [
    {
        title: 'Principal',
        items: [
            {
                label: 'Dashboard',
                href: '/admin/dashboard',
                icon: 'ph-house',
            },
            {
                label: 'Análisis',
                href: '/admin/analytics',
                icon: 'ph-chart-pie-slice',
            },
        ],
    },
    {
        title: 'Gestión de Tiendas',
        items: [
            {
                label: 'Todas las Tiendas',
                href: '/admin/stores',
                icon: 'ph-storefront',
                badge: 'new',
            },
            {
                label: 'Vendedores',
                href: '/admin/sellers',
                icon: 'ph-users-three',
            },
            {
                label: 'Categorías',
                href: '/admin/categories',
                icon: 'ph-folder-star',
            },
        ],
    },
    {
        title: 'Productos',
        items: [
            {
                label: 'Todos los Productos',
                href: '/admin/products',
                icon: 'ph-package',
            },
            {
                label: 'Inventario',
                href: '/admin/inventory',
                icon: 'ph-hash',
            },
            {
                label: 'Revisiones',
                href: '/admin/reviews',
                icon: 'ph-star',
            },
        ],
    },
    {
        title: 'Pedidos & Finanzas',
        items: [
            {
                label: 'Pedidos',
                href: '/admin/orders',
                icon: 'ph-shopping-cart',
                badge: 12,
            },
            {
                label: 'Pagos',
                href: '/admin/payments',
                icon: 'ph-money',
            },
            {
                label: 'Contratos',
                href: '/admin/contracts',
                icon: 'ph-file-text',
            },
        ],
    },
    {
        title: 'Soporte & Operaciones',
        items: [
            {
                label: 'Mesa de Ayuda',
                href: '/admin/helpdesk',
                icon: 'ph-chat-centered-text',
            },
            {
                label: 'Gestión Operativa',
                href: '/admin/operations',
                icon: 'ph-briefcase',
            },
        ],
    },
];
