'use client';

import ThemeToggle from '@/components/layout/shared/ThemeToggle';
import NotificationBell from '@/components/layout/shared/NotificationBell';
import UserMenu from '@/components/layout/shared/UserMenu';
import Breadcrumb from '@/components/layout/shared/Breadcrumb';
import { useAutoBreadcrumb } from '@/hooks/useAutoBreadcrumb';
import { useApiConnection, ConnectionStatusPanel } from '@/hooks/useApiConnection';

import { Menu } from 'lucide-react';

export default function SellerHeader({ onOpenMenu }: { onOpenMenu: () => void }) {
    const breadcrumbs = useAutoBreadcrumb();
    const { status, checkConnection, isHealthy } = useApiConnection();

    return (
        <header className="h-16 bg-white border-b border-sky-100 sticky top-0 z-50">
            <div className="h-full px-6 flex items-center justify-between">
                {/* Left: Panel Indicator + Breadcrumb */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={onOpenMenu}
                        className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors"
                        aria-label="Open menu"
                    >
                        <Menu className="w-6 h-6 text-gray-600" />
                    </button>
                    <span className="hidden md:inline-block px-3 py-1 bg-sky-500 text-white text-xs font-bold uppercase rounded-full whitespace-nowrap">
                        Mi Panel del Vendedor
                    </span>
                    <div className="hidden sm:block">
                        <Breadcrumb items={breadcrumbs} />
                    </div>
                </div>

                {/* Right: Connection Status + Quick Stats + Actions */}
                <div className="flex items-center gap-4">
                    {/* Connection Status */}
                    <ConnectionStatusPanel status={status} onRefresh={checkConnection} />
                    
                    {/* Connection Health Indicator */}
                    <div className={`hidden lg:flex items-center gap-2 px-2 py-1 rounded-full ${
                        isHealthy ? 'bg-emerald-50' : 'bg-red-50'
                    }`}>
                        <div className={`w-2 h-2 rounded-full ${isHealthy ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                        <span className={`text-[10px] font-bold uppercase ${
                            isHealthy ? 'text-emerald-600' : 'text-red-600'
                        }`}>
                            {isHealthy ? 'API Activa' : 'API Offline'}
                        </span>
                    </div>

                    <div className="h-6 w-px bg-gray-200" />
                    
                    <div className="hidden lg:flex items-center gap-6">
                        <div className="text-sm">
                            <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Ventas del Mes: </span>
                            <span className="font-black text-gray-900 tracking-tight">S/ 4,560.00</span>
                        </div>
                        <div className="text-sm">
                            <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Pedidos Hoy: </span>
                            <span className="font-black text-gray-900 tracking-tight">08</span>
                        </div>
                    </div>
                    <div className="h-8 w-px bg-gray-200 mx-2 hidden sm:block" />
                    <ThemeToggle />
                    <NotificationBell />
                    <div className="h-8 w-px bg-gray-200 mx-2" />
                    <UserMenu />
                </div>
            </div>
        </header>
    );
}
