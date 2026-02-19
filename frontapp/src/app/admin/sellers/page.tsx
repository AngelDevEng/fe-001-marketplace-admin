import React from 'react';
import ModuleHeader from '@/components/layout/shared/ModuleHeader';

export default function SellersPage() {
    return (
        <div className="px-8 pb-8">
            <ModuleHeader
                title="Control de Vendedores"
                subtitle="Gestión y supervisión estratégica de vendedores"
                icon="ph-users-three"
            />

            {/* Stats Cards (Mantenemos los que ya diseñamos que se ven premium) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Card 1: Sales */}
                <div className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">
                            Total Ventas
                        </h3>
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100 shadow-sm">
                            <i className="ph-bold ph-currency-dollar text-blue-600 text-xl"></i>
                        </div>
                    </div>
                    <p className="text-3xl font-black text-gray-900">$45,231.89</p>
                    <div className="flex items-center gap-1.5 mt-2">
                        <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-100 uppercase tracking-wider">+20.1%</span>
                        <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">vs mes pasado</span>
                    </div>
                </div>

                {/* Card 2: Shops */}
                <div className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">
                            Tiendas Activas
                        </h3>
                        <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center border border-purple-100 shadow-sm">
                            <i className="ph-bold ph-storefront text-purple-600 text-xl"></i>
                        </div>
                    </div>
                    <p className="text-3xl font-black text-gray-900">+2,350</p>
                    <div className="flex items-center gap-1.5 mt-2">
                        <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-100 uppercase tracking-wider">+180 nuevas</span>
                        <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">este mes</span>
                    </div>
                </div>

                {/* Card 3: Orders */}
                <div className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">
                            Pedidos Totales
                        </h3>
                        <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center border border-green-100 shadow-sm">
                            <i className="ph-bold ph-shopping-cart text-green-600 text-xl"></i>
                        </div>
                    </div>
                    <p className="text-3xl font-black text-gray-900">+12,234</p>
                    <div className="flex items-center gap-1.5 mt-2">
                        <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-100 uppercase tracking-wider">+19%</span>
                        <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">vs mes pasado</span>
                    </div>
                </div>

                {/* Card 4: Sellers */}
                <div className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 blur-3xl -mr-10 -mt-10"></div>

                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">
                            Vendedores
                        </h3>
                        <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center border border-rose-100 shadow-sm text-rose-600 relative">
                            <i className="ph-bold ph-users text-xl"></i>
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 border-2 border-white rounded-full"></span>
                        </div>
                    </div>
                    <p className="text-3xl font-black text-gray-900">573</p>
                    <div className="flex items-center gap-1.5 mt-2">
                        <span className="bg-rose-50 text-rose-600 text-[10px] font-black px-2 py-0.5 rounded-full border border-rose-100 uppercase tracking-wider">3 ALERTAS</span>
                        <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">pendientes revisión</span>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs (Simulación de la paridad con el original) */}
            <div className="flex flex-wrap gap-2 border-b border-gray-100 py-5 pb-6 mb-8 overflow-x-auto no-scrollbar scroll-smooth">
                {['Notificaciones', 'Gestión de Vendedores', 'Moderación de Publicaciones', 'Auditoría Forense'].map((tab, idx) => (
                    <button
                        key={tab}
                        className={`px-8 py-4 rounded-2xl text-[11px] font-black transition-all flex items-center gap-2 relative ${idx === 1 ? 'bg-white shadow-xl shadow-gray-200/50 text-brand-sky border border-gray-100' : 'text-gray-400 hover:bg-white/50'
                            }`}
                    >
                        <i className={`ph-bold ${['ph-bell-ringing', 'ph-users', 'ph-check-circle', 'ph-shield-check'][idx]} text-lg`}></i>
                        <span className="uppercase tracking-widest">{tab}</span>
                        {idx === 0 && (
                            <span className="absolute -top-1 -right-1 px-2 py-0.5 bg-rose-500 text-white rounded-full text-[9px] font-black">
                                4
                            </span>
                        )}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm text-center">
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">
                    Contenido del módulo en migración...
                </p>
            </div>
        </div>
    );
}
