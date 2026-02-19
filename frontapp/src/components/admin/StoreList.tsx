'use client';

import React, { useEffect, useState } from 'react';
import { getStores } from '@/lib/api';
import { Store } from '@/lib/types/stores/store';

export default function StoreList() {
    const [stores, setStores] = useState<Store[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStores = async () => {
            try {
                setLoading(true);
                const data = await getStores();
                setStores(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching stores:', err);
                setError('No se pudieron cargar las tiendas. Verifique la conexión con WordPress.');
            } finally {
                setLoading(false);
            }
        };

        fetchStores();
    }, []);

    if (loading) {
        return (
            <div className="bg-white rounded-3xl p-20 border border-gray-100 shadow-sm flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-brand-sky/20 border-t-brand-sky rounded-full animate-spin"></div>
                <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Sincronizando con WordPress...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-3xl p-20 border border-rose-100 shadow-sm flex flex-col items-center justify-center gap-4 text-center">
                <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 mb-2">
                    <i className="ph-bold ph-warning-circle text-4xl"></i>
                </div>
                <h3 className="text-gray-900 font-black uppercase tracking-widest text-sm">Error de Conexión</h3>
                <p className="text-gray-400 font-medium text-sm max-w-md">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-8 py-3 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-sky transition-all active:scale-95"
                >
                    Reintentar Sincronización
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm transition-all hover:shadow-md">
            <div className="p-8 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
                <div>
                    <h3 className="text-gray-900 font-black uppercase tracking-widest text-xs">Listado de Tiendas</h3>
                    <p className="text-gray-400 text-[10px] font-bold mt-1 uppercase">Sincronizado vía Dokan API</p>
                </div>
                <span className="px-4 py-1.5 bg-brand-sky/10 text-brand-sky rounded-full text-[10px] font-black uppercase tracking-widest">
                    {stores.length} Tiendas Encontradas
                </span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50">
                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">ID</th>
                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Tienda</th>
                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Propietario</th>
                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Teléfono</th>
                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {stores.map((store) => (
                            <tr key={store.id} className="group hover:bg-gray-50/50 transition-colors">
                                <td className="px-8 py-5 text-xs font-black text-gray-400">#{store.id}</td>
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-brand-sky/10 flex items-center justify-center text-brand-sky group-hover:bg-brand-sky group-hover:text-white transition-all font-black text-xs uppercase">
                                            {store.store_name?.charAt(0) || 'T'}
                                        </div>
                                        <span className="text-sm font-black text-gray-900 uppercase tracking-tight">{store.store_name}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-5">
                                    <span className="text-xs font-bold text-gray-600">{store.first_name || 'Sin nombre'}</span>
                                </td>
                                <td className="px-8 py-5">
                                    <span className="text-xs font-mono text-gray-500">{store.phone || 'N/A'}</span>
                                </td>
                                <td className="px-8 py-5 text-right">
                                    <button className="p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:bg-brand-sky/10 hover:text-brand-sky transition-all active:scale-90">
                                        <i className="ph-bold ph-eye text-lg"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {stores.length === 0 && (
                <div className="p-20 text-center">
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">No hay tiendas registradas en WordPress</p>
                </div>
            )}
        </div>
    );
}
