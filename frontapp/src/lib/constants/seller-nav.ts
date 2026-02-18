import { NavSection } from '@/lib/types/navigation';

export const sellerNavigation: NavSection[] = [
    {
        title: 'Principal',
        items: [
            {
                label: 'Dashboard',
                href: '/seller/dashboard',
                icon: 'LayoutDashboard',
            },
            {
                label: 'Mis Tiendas',
                href: '/seller/stores',
                icon: 'Store',
            },
        ],
    },
    {
        title: 'Productos',
        items: [
            {
                label: 'Mis Productos',
                href: '/seller/products',
                icon: 'Package',
            },
            {
                label: 'Agregar Producto',
                href: '/seller/products/new',
                icon: 'Plus',
            },
            {
                label: 'Inventario',
                href: '/seller/inventory',
                icon: 'Boxes',
            },
        ],
    },
    {
        title: 'Ventas',
        items: [
            {
                label: 'Pedidos',
                href: '/seller/orders',
                icon: 'ShoppingCart',
                badge: 5,
            },
            {
                label: 'Devoluciones',
                href: '/seller/returns',
                icon: 'RotateCcw',
            },
        ],
    },
    {
        title: 'Finanzas',
        items: [
            {
                label: 'Mis Ventas',
                href: '/seller/sales',
                icon: 'TrendingUp',
            },
            {
                label: 'Pagos',
                href: '/seller/payments',
                icon: 'CreditCard',
            },
            {
                label: 'Reportes',
                href: '/seller/reports',
                icon: 'FileText',
            },
        ],
    },
    {
        title: 'Marketing',
        items: [
            {
                label: 'Promociones',
                href: '/seller/promotions',
                icon: 'Tag',
            },
            {
                label: 'Cupones',
                href: '/seller/coupons',
                icon: 'Ticket',
            },
        ],
    },
    {
        title: 'Configuración',
        items: [
            {
                label: 'Mi Perfil',
                href: '/seller/profile',
                icon: 'User',
            },
            {
                label: 'Configuración',
                href: '/seller/settings',
                icon: 'Settings',
            },
        ],
    },
];
