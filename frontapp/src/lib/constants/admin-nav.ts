import { NavSection } from '@/lib/types/navigation';

export const adminNavigation: NavSection[] = [
    {
        title: 'Módulos de Gestión Central',
        items: [
            {
                label: '1. Módulo de Control de Vendedores',
                href: '/admin/sellers',
                icon: 'Users',
            },
            {
                label: '2. Módulo de Soporte',
                href: '/admin/helpdesk',
                icon: 'Help',
            },
            {
                label: '3. Módulo Centro de Finanzas y Estadísticas',
                href: '/admin/finance',
                icon: 'Sales',
            },
            {
                label: '4. Módulo de Analítica',
                href: '/admin/analytics',
                icon: 'Chart',
            },
            {
                label: '5. Módulo de Gestión Operativa',
                href: '/admin/operations',
                icon: 'Services',
            },
            {
                label: '6. Módulo de Gestión de Pagos',
                href: '/admin/payments',
                icon: 'Landmark',
            },
            {
                label: '7. Módulo de Contratación y Organización',
                href: '/admin/contracts',
                icon: 'Invoices',
            },
            {
                label: '8. Gestión de Categorías',
                href: '/admin/categories',
                icon: 'FolderTree',
            },
            {
                label: '9. Gestión de Inventario',
                href: '/admin/inventory',
                icon: 'Catalog',
            },
            {
                label: '10. Gestión de Puntuación',
                href: '/admin/reviews',
                icon: 'Star',
            },
        ],
    },
];
