import ThemeToggle from '@/components/layout/shared/ThemeToggle';
import NotificationBell from '@/components/layout/shared/NotificationBell';
import UserMenu from '@/components/layout/shared/UserMenu';

export default function AdminHeader() {
    // Mock user data - replace with actual auth data
    const user = {
        name: 'Admin Usuario',
        email: 'admin@marketplace.com',
        role: 'admin' as const,
    };

    return (
        <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 fixed top-0 right-0 left-64 z-20">
            <div className="h-full px-6 flex items-center justify-between">
                {/* Search Bar */}
                <div className="flex-1 max-w-2xl">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="search"
                            placeholder="Buscar productos, pedidos, vendedores..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 ml-6">
                    <ThemeToggle />
                    <NotificationBell />
                    <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 mx-2" />
                    <UserMenu user={user} />
                </div>
            </div>
        </header>
    );
}
