import { NavSection } from '@/lib/types/navigation';

export const adminNavigation: NavSection[] = [
    {
        title: 'Módulos de Gestión Central',
        items: [
            {
                label: 'Control de Vendedores',
                href: '/admin/sellers',
                icon: 'Users',
            },
            {
                label: 'Mesa de Ayuda',
                href: '/admin/helpdesk',
                icon: 'Help',
            },
            {
                label: 'Centro de Finanzas y Estadísticas',
                href: '/admin/finance',
                icon: 'Sales',
            },
            {
                label: 'Analítica',
                href: '/admin/analytics',
                icon: 'Chart',
            },
            {
                label: 'Gestión Operativa',
                href: '/admin/operations',
                icon: 'Services',
            },
            {
                label: 'Gestión de Pagos',
                href: '/admin/payments',
                icon: 'Landmark',
            },
            {
                label: 'Contratos',
                href: '/admin/contracts',
                icon: 'Invoices',
            },
            {
                label: 'Gestión de Categorías',
                href: '/admin/categories',
                icon: 'FolderTree',
            },
            {
                label: 'Gestión de Inventario',
                href: '/admin/inventory',
                icon: 'Catalog',
            },
            {
                label: 'Gestión de Puntuación',
                href: '/admin/reviews',
                icon: 'Star',
            },
        ],
    },
];
