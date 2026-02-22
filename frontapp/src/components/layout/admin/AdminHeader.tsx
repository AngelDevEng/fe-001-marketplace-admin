import ThemeToggle from '@/components/layout/shared/ThemeToggle';
import NotificationBell from '@/components/layout/shared/NotificationBell';
import UserMenu from '@/components/layout/shared/UserMenu';

export default function AdminHeader() {
    return (
        <header className="h-16 bg-white border-b border-gray-200 fixed top-0 right-0 left-64 z-20">
            <div className="h-full px-6 flex items-center justify-between">
                {/* Quick Stats */}
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-sm text-gray-600">
                            Panel Administrador
                        </span>
                    </div>
                    <div className="h-6 w-px bg-gray-200" />
                    <div className="text-sm">
                        <span className="text-gray-600">Ventas hoy: </span>
                        <span className="font-semibold text-gray-900">$1,234.50</span>
                    </div>
                    <div className="text-sm">
                        <span className="text-gray-600">Pedidos: </span>
                        <span className="font-semibold text-gray-900">12</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <div className="h-8 w-px bg-gray-200 mx-2" />
                    <ThemeToggle />
                    <NotificationBell />
                    <div className="h-8 w-px bg-gray-200 mx-2" />
                    <UserMenu />
                </div>
            </div>
        </header>
    );
}
