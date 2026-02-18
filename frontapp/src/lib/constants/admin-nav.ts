import { NavSection } from '@/lib/types/navigation';

export const adminNavigation: NavSection[] = [
    {
        title: 'Principal',
        items: [
            {
                label: 'Dashboard',
                href: '/admin/dashboard',
                icon: 'LayoutDashboard',
            },
            {
                label: 'Análisis',
                href: '/admin/analytics',
                icon: 'BarChart3',
            },
        ],
    },
    {
        title: 'Gestión de Tiendas',
        items: [
            {
                label: 'Todas las Tiendas',
                href: '/admin/stores',
                icon: 'Store',
                badge: 'new',
            },
            {
                label: 'Vendedores',
                href: '/admin/sellers',
                icon: 'Users',
            },
            {
                label: 'Categorías',
                href: '/admin/categories',
                icon: 'FolderTree',
            },
        ],
    },
    {
        title: 'Productos',
        items: [
            {
                label: 'Todos los Productos',
                href: '/admin/products',
                icon: 'Package',
            },
            {
                label: 'Inventario',
                href: '/admin/inventory',
                icon: 'Boxes',
            },
            {
                label: 'Revisiones',
                href: '/admin/reviews',
                icon: 'Star',
            },
        ],
    },
    {
        title: 'Pedidos',
        items: [
            {
                label: 'Todos los Pedidos',
                href: '/admin/orders',
                icon: 'ShoppingCart',
                badge: 12,
            },
            {
                label: 'Devoluciones',
                href: '/admin/returns',
                icon: 'RotateCcw',
            },
            {
                label: 'Envíos',
                href: '/admin/shipments',
                icon: 'Truck',
            },
        ],
    },
    {
        title: 'Finanzas',
        items: [
            {
                label: 'Transacciones',
                href: '/admin/transactions',
                icon: 'CreditCard',
            },
            {
                label: 'Comisiones',
                href: '/admin/commissions',
                icon: 'Percent',
            },
            {
                label: 'Reportes',
                href: '/admin/reports',
                icon: 'FileText',
            },
        ],
    },
    {
        title: 'Configuración',
        items: [
            {
                label: 'General',
                href: '/admin/settings',
                icon: 'Settings',
            },
            {
                label: 'Usuarios',
                href: '/admin/users',
                icon: 'UserCog',
            },
            {
                label: 'Seguridad',
                href: '/admin/security',
                icon: 'Shield',
            },
        ],
    },
];
