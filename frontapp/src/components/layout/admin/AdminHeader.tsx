import React from 'react';
import ThemeToggle from '@/components/layout/shared/ThemeToggle';
import NotificationBell from '@/components/layout/shared/NotificationBell';
import UserMenu from '@/components/layout/shared/UserMenu';

export default function AdminHeader() {
    return (
        <header className="bg-white shadow-sm sticky top-0 z-50 border-b-4 border-brand-sky h-[112px] flex items-center fixed right-0 left-64 transition-all">
            <div className="max-w-[1920px] w-full mx-auto flex items-center justify-between px-10">
                {/* 1. Lado Izquierdo: Logo */}
                <div className="flex items-center gap-3 active:scale-95 transition-transform cursor-pointer">
                    <div className="h-[70px] w-[200px] bg-gray-100 flex items-center justify-center rounded-lg border border-dashed border-gray-300 overflow-hidden relative group">
                        <span className="text-gray-400 text-xs font-bold uppercase tracking-widest group-hover:hidden">Logo Lyrium</span>
                        {/* 
                          Nota: Aquí iría la imagen <img src="/lyrium/frontend/img/logo.png" ... /> 
                          pero usamos un placeholder visual premium mientras se cargan los assets.
                        */}
                        <div className="absolute inset-0 bg-brand-gradient opacity-0 group-hover:opacity-10 transition-opacity" />
                    </div>
                </div>

                {/* 2. Centro: Espaciador flexible */}
                <div className="flex-1"></div>

                {/* 3. Lado Derecho: Acciones de Sesión */}
                <div className="flex items-center gap-6">
                    <ThemeToggle />
                    <button
                        className="flex items-center gap-3 px-6 py-3 bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all rounded-2xl active:scale-95 group font-black text-[11px] uppercase tracking-[0.2em] border border-rose-100 shadow-sm"
                        title="Cerrar sesión de administrador"
                    >
                        <span>Cerrar Sesión</span>
                        <i className="ph ph-bold ph-power text-xl transition-transform group-hover:rotate-12"></i>
                    </button>
                </div>
            </div>
        </header>
    );
}
