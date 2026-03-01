'use client';

import ThemeToggle from '@/components/layout/shared/ThemeToggle';
import NotificationBell from '@/components/layout/shared/NotificationBell';
import UserMenu from '@/components/layout/shared/UserMenu';
import Breadcrumb from '@/components/layout/shared/Breadcrumb';
import { useAutoBreadcrumb } from '@/shared/hooks/useAutoBreadcrumb';

import { Menu } from 'lucide-react';

export default function LogisticsHeader({ onOpenMenu }: { onOpenMenu: () => void }) {
    const breadcrumbs = useAutoBreadcrumb();

    return (
        <header className="h-16 bg-white border-b border-violet-100 sticky top-0 z-50">
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
                        Panel del Operador Logístico
                    </span>
                    <Breadcrumb items={breadcrumbs} />
                </div>

                {/* Right: Quick Stats + Actions */}
                <div className="flex items-center gap-6">
                    <div className="h-6 w-px bg-gray-200" />
                    <div className="text-sm">
                        <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Envíos Hoy: </span>
                        <span className="font-black text-gray-900 tracking-tight">45</span>
                    </div>
                    <div className="text-sm">
                        <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Pendientes: </span>
                        <span className="font-black text-gray-900 tracking-tight">12</span>
                    </div>
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
