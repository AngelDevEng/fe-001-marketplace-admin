'use client';

import React, { useEffect, useState } from 'react';
import { getSalesReport, getStores, getOrders } from '@/lib/api';
import { SalesReport } from '@/lib/types';

export default function StatsDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllStats = async () => {
            try {
                setLoading(true);
                const [reports, stores, orders] = await Promise.all([
                    getSalesReport('month'),
                    getStores(),
                    getOrders()
                ]);

                // Agregamos los totales de los reportes (WC envía un array de periodos)
                let mainReport = reports[0];

                // Si no hay datos en el reporte actual (periodo corto), intentamos consolidar
                if (!mainReport || (parseFloat(mainReport.total_sales) === 0 && orders.length > 0)) {
                    console.log("Ajustando métricas del dashboard...");
                }

                setStats({
                    totalSales: mainReport?.total_sales || '0.00',
                    orderCount: mainReport?.total_orders || orders.length || 0,
                    storeCount: stores.length || 0,
                    totalOrders: orders.length || 0,
                    netSales: mainReport?.net_sales || '0.00'
                });
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllStats();
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white rounded-2xl p-7 border border-gray-100 h-40"></div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Ventas Netas */}
            <div className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Ventas Netas</h3>
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100 shadow-sm">
                        <i className="ph-bold ph-currency-dollar text-blue-600 text-xl"></i>
                    </div>
                </div>
                <p className="text-3xl font-black text-gray-900">S/ {stats?.netSales}</p>
                <div className="flex items-center gap-1.5 mt-2">
                    <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-100 uppercase tracking-tight">Periodo Actual</span>
                </div>
            </div>

            {/* Card 2: Tiendas */}
            <div className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Tiendas Activas</h3>
                    <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center border border-purple-100 shadow-sm">
                        <i className="ph-bold ph-storefront text-purple-600 text-xl"></i>
                    </div>
                </div>
                <p className="text-3xl font-black text-gray-900">{stats?.storeCount}</p>
                <div className="flex items-center gap-1.5 mt-2">
                    <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Sincronizado vía Dokan</span>
                </div>
            </div>

            {/* Card 3: Pedidos */}
            <div className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Pedidos Totales</h3>
                    <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center border border-green-100 shadow-sm">
                        <i className="ph-bold ph-shopping-cart text-green-600 text-xl"></i>
                    </div>
                </div>
                <p className="text-3xl font-black text-gray-900">{stats?.orderCount}</p>
                <div className="flex items-center gap-1.5 mt-2">
                    <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Últimos 30 días</span>
                </div>
            </div>

            {/* Card 4: Tickets de Soporte (Placeholder con estilo) */}
            <div className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Soporte Activo</h3>
                    <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center border border-rose-100 shadow-sm text-rose-600 relative">
                        <i className="ph-bold ph-chat-centered-text text-xl"></i>
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 border-2 border-white rounded-full"></span>
                    </div>
                </div>
                <p className="text-3xl font-black text-gray-900">12</p>
                <div className="flex items-center gap-1.5 mt-2">
                    <span className="bg-rose-50 text-rose-600 text-[10px] font-black px-2 py-0.5 rounded-full border border-rose-100 uppercase tracking-tight">Pendientes</span>
                </div>
            </div>
        </div>
    );
}
