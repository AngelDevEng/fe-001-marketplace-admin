'use client';

import ThemeToggle from '@/components/layout/shared/ThemeToggle';
import NotificationBell from '@/components/layout/shared/NotificationBell';
import UserMenu from '@/components/layout/shared/UserMenu';

export default function SellerHeader() {
    return (
        <header className="h-16 bg-white border-b border-sky-100 sticky top-0 z-50">
            <div className="h-full px-6 flex items-center justify-between">
                {/* Quick Stats for Seller */}
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-sm font-black text-gray-600 uppercase tracking-widest">
                            Panel del Vendedor
                        </span>
                    </div>
                    <div className="h-6 w-px bg-gray-200" />
                    <div className="text-sm">
                        <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Ventas del Mes: </span>
                        <span className="font-black text-gray-900 tracking-tight">S/ 4,560.00</span>
                    </div>
                    <div className="text-sm">
                        <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Pedidos Hoy: </span>
                        <span className="font-black text-gray-900 tracking-tight">08</span>
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
