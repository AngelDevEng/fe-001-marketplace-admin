'use client';

import React, { useEffect, useState } from 'react';
import { getWithdrawals } from '@/lib/api';
import { Withdrawal } from '@/lib/types';

export default function WithdrawalList() {
    const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchWithdrawals = async () => {
            try {
                setLoading(true);
                const data = await getWithdrawals();
                setWithdrawals(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching withdrawals:', err);
                setError('No se pudieron cargar las solicitudes de retiro.');
            } finally {
                setLoading(false);
            }
        };

        fetchWithdrawals();
    }, []);

    const getStatusStyles = (status: number) => {
        switch (status) {
            case 1: return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 0: return 'bg-amber-50 text-amber-600 border-amber-100';
            case 2: return 'bg-rose-50 text-rose-600 border-rose-100';
            default: return 'bg-gray-50 text-gray-600 border-gray-100';
        }
    };

    const getStatusLabel = (status: number) => {
        switch (status) {
            case 1: return 'Completado';
            case 0: return 'Pendiente';
            case 2: return 'Cancelado';
            default: return 'Desconocido';
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-3xl p-20 border border-gray-100 shadow-sm flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-brand-sky/20 border-t-brand-sky rounded-full animate-spin"></div>
                <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Cargando Solicitudes...</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm transition-all hover:shadow-md">
            <div className="p-8 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
                <div>
                    <h3 className="text-gray-900 font-black uppercase tracking-widest text-xs">Solicitudes de Retiro (Cash-Out)</h3>
                    <p className="text-gray-400 text-[10px] font-bold mt-1 uppercase">Sincronizado vía Dokan API</p>
                </div>
                <span className="px-4 py-1.5 bg-brand-sky/10 text-brand-sky rounded-full text-[10px] font-black uppercase tracking-widest">
                    {withdrawals.length} Trámites
                </span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50">
                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">ID / Fecha</th>
                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Tienda</th>
                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Monto</th>
                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Método</th>
                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Estado</th>
                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {withdrawals.map((item) => (
                            <tr key={item.id} className="group hover:bg-gray-50/50 transition-colors">
                                <td className="px-8 py-5">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-black text-gray-900 leading-none">#{item.id}</span>
                                        <span className="text-[10px] text-gray-400 font-bold uppercase mt-1">
                                            {new Date(item.created).toLocaleDateString()}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-8 py-5">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-black text-gray-900 uppercase tracking-tight">
                                            {item.user_data?.store_name || `Vendedor #${item.user_id}`}
                                        </span>
                                        <span className="text-[10px] text-gray-400 font-bold uppercase">ID Usuario: {item.user_id}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-5">
                                    <span className="text-sm font-black text-gray-900 uppercase">S/ {item.amount}</span>
                                </td>
                                <td className="px-8 py-5">
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest bg-gray-100 px-2 py-1 rounded">
                                        {item.method}
                                    </span>
                                </td>
                                <td className="px-8 py-5">
                                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${getStatusStyles(item.status)}`}>
                                        {getStatusLabel(item.status)}
                                    </span>
                                </td>
                                <td className="px-8 py-5 text-right">
                                    <div className="flex items-center justify-end gap-2 text-gray-400">
                                        {item.status === 0 ? (
                                            <>
                                                <button className="p-2 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-all active:scale-90">
                                                    <i className="ph-bold ph-check text-lg"></i>
                                                </button>
                                                <button className="p-2 rounded-xl bg-gray-50 hover:bg-rose-50 hover:text-rose-500 transition-all active:scale-90">
                                                    <i className="ph-bold ph-x text-lg"></i>
                                                </button>
                                            </>
                                        ) : (
                                            <button className="p-2 rounded-xl bg-gray-50 hover:bg-brand-sky/10 hover:text-brand-sky transition-all active:scale-90">
                                                <i className="ph-bold ph-file-text text-lg"></i>
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {withdrawals.length === 0 && (
                <div className="p-20 text-center">
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">No hay solicitudes pendientes de liquidación</p>
                </div>
            )}
        </div>
    );
}
