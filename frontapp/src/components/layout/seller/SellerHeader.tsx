import ThemeToggle from '@/components/layout/shared/ThemeToggle';
import NotificationBell from '@/components/layout/shared/NotificationBell';
import UserMenu from '@/components/layout/shared/UserMenu';

export default function SellerHeader() {
    // Mock user data - replace with actual auth data
    const user = {
        name: 'Vendedor Usuario',
        email: 'vendedor@marketplace.com',
        role: 'seller' as const,
    };

    return (
        <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 fixed top-0 right-0 left-64 z-20">
            <div className="h-full px-6 flex items-center justify-between">
                {/* Quick Stats */}
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            Tienda activa
                        </span>
                    </div>
                    <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />
                    <div className="text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Ventas hoy: </span>
                        <span className="font-semibold text-gray-900 dark:text-white">$1,234.50</span>
                    </div>
                    <div className="text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Pedidos: </span>
                        <span className="font-semibold text-gray-900 dark:text-white">12</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors">
                        + Nuevo Producto
                    </button>
                    <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 mx-2" />
                    <ThemeToggle />
                    <NotificationBell />
                    <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 mx-2" />
                    <UserMenu user={user} />
                </div>
            </div>
        </header>
    );
}
