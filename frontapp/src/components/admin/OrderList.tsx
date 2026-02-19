'use client';

import React, { useEffect, useState } from 'react';
import { getOrders } from '@/lib/api';
import { Order } from '@/lib/types';

export default function OrderList() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const data = await getOrders();
                setOrders(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching orders:', err);
                setError('No se pudieron cargar los pedidos. Verifique la conexión con WordPress.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'processing': return 'bg-brand-sky/10 text-brand-sky border-brand-sky/20';
            case 'pending': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'cancelled': return 'bg-gray-50 text-gray-400 border-gray-100';
            case 'on-hold': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
            default: return 'bg-gray-50 text-gray-600 border-gray-100';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'completed': return 'Completado';
            case 'processing': return 'Procesando';
            case 'pending': return 'Pendiente';
            case 'cancelled': return 'Cancelado';
            case 'on-hold': return 'En Espera';
            default: return status;
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-3xl p-20 border border-gray-100 shadow-sm flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-brand-sky/20 border-t-brand-sky rounded-full animate-spin"></div>
                <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Sincronizando Pedidos...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-3xl p-20 border border-rose-100 shadow-sm flex flex-col items-center justify-center gap-4 text-center">
                <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 mb-2">
                    <i className="ph-bold ph-shopping-bag text-4xl"></i>
                </div>
                <h3 className="text-gray-900 font-black uppercase tracking-widest text-sm">Error de Pedidos</h3>
                <p className="text-gray-400 font-medium text-sm max-w-md">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-8 py-3 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-sky transition-all active:scale-95"
                >
                    Reintentar Conexión
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm transition-all hover:shadow-md">
            <div className="p-8 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
                <div>
                    <h3 className="text-gray-900 font-black uppercase tracking-widest text-xs">Ventas Recientes</h3>
                    <p className="text-gray-400 text-[10px] font-bold mt-1 uppercase">Sincronizado vía WooCommerce API</p>
                </div>
                <span className="px-4 py-1.5 bg-brand-sky/10 text-brand-sky rounded-full text-[10px] font-black uppercase tracking-widest">
                    {orders.length} Transacciones
                </span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50">
                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Orden</th>
                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Cliente</th>
                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Total</th>
                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Estado</th>
                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {orders.map((order) => (
                            <tr key={order.id} className="group hover:bg-gray-50/50 transition-colors">
                                <td className="px-8 py-5">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-black text-gray-900 leading-none">#{order.id}</span>
                                        <span className="text-[10px] text-gray-400 font-bold uppercase mt-1">
                                            {new Date(order.date_created).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-8 py-5">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-black text-gray-900 uppercase tracking-tight">
                                            {order.billing.first_name} {order.billing.last_name}
                                        </span>
                                        <span className="text-[10px] text-gray-400 font-bold uppercase">{order.billing.email}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-5">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-black text-gray-900">{order.currency === 'PEN' ? 'S/' : '$'} {order.total}</span>
                                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">
                                            {order.line_items.length} {order.line_items.length === 1 ? 'Producto' : 'Productos'}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-8 py-5">
                                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${getStatusColor(order.status)}`}>
                                        {getStatusLabel(order.status)}
                                    </span>
                                </td>
                                <td className="px-8 py-5 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button className="p-2 rounded-xl bg-gray-50 text-gray-400 hover:bg-brand-sky/10 hover:text-brand-sky transition-all active:scale-90">
                                            <i className="ph-bold ph-eye text-lg"></i>
                                        </button>
                                        <button className="p-2 rounded-xl bg-gray-50 text-gray-400 hover:bg-brand-sky/10 hover:text-brand-sky transition-all active:scale-90">
                                            <i className="ph-bold ph-printer text-lg"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {orders.length === 0 && (
                <div className="p-20 text-center">
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">No se encontraron pedidos recientes</p>
                </div>
            )}
        </div>
    );
}
