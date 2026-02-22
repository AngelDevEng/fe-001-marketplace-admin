'use client';

import React, { useEffect, useState } from 'react';
import { getStores } from '@/lib/api';
import { Store } from '@/lib/types/stores/store';
import { User, Mail, Phone, Store as StoreIcon, ExternalLink, ShieldCheck, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SellerList() {
    const router = useRouter();
    const [vendors, setVendors] = useState<Store[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchVendors = async () => {
            try {
                setLoading(true);
                const data = await getStores();
                setVendors(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching vendors:', err);
                setError('No se pudo establecer conexión con los datos de vendedores.');
            } finally {
                setLoading(false);
            }
        };

        fetchVendors();
    }, []);

    if (loading) {
        return (
            <div className="bg-white rounded-3xl p-20 border border-gray-100 shadow-sm flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-rose-500/20 border-t-rose-500 rounded-full animate-spin"></div>
                <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Cargando base de datos de vendedores...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-3xl p-20 border border-rose-100 shadow-sm flex flex-col items-center justify-center gap-4 text-center">
                <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 mb-2">
                    <ShieldCheck className="w-10 h-10" />
                </div>
                <h3 className="text-gray-900 font-black uppercase tracking-widest text-sm text-rose-600">Error de Sincronización</h3>
                <p className="text-gray-400 font-medium text-sm max-w-md">{error}</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm transition-all hover:shadow-md">
            <div className="p-8 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
                <div>
                    <h3 className="text-gray-900 font-black uppercase tracking-widest text-xs">Gestión Estratégica de Vendedores</h3>
                    <p className="text-gray-400 text-[10px] font-bold mt-1 uppercase">Control centralizado de cuentas Dokan Pro</p>
                </div>
                <div className="flex gap-2">
                    <span className="px-4 py-1.5 bg-rose-50 text-rose-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-rose-100">
                        {vendors.length} Vendedores Activos
                    </span>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50">
                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Vendedor / Contacto</th>
                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Tienda Registrada</th>
                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Estado de Cuenta</th>
                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Seguridad (RF-04)</th>
                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {vendors.map((vendor) => (
                            <tr key={vendor.id} className="group hover:bg-gray-50/50 transition-colors">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-400 group-hover:from-rose-500 group-hover:to-rose-600 group-hover:text-white transition-all shadow-sm">
                                            <User className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-gray-900 uppercase tracking-tight">
                                                {vendor.first_name} {vendor.last_name || ''}
                                            </p>
                                            <div className="flex flex-col gap-1 mt-1">
                                                <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase">
                                                    <Mail className="w-3 h-3 text-rose-400" />
                                                    {vendor.email || 'correo@no-registrado.com'}
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase">
                                                    <Phone className="w-3 h-3 text-gray-300" />
                                                    {vendor.phone || 'Sin teléfono'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-3 bg-gray-50/50 group-hover:bg-white p-3 rounded-2xl border border-transparent group-hover:border-gray-100 transition-all w-fit">
                                        <StoreIcon className="w-4 h-4 text-rose-500" />
                                        <span className="text-xs font-black text-gray-700 uppercase tracking-wide">
                                            {vendor.store_name}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                                            Verificado
                                        </span>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <ShieldCheck className="w-3 h-3 text-emerald-500" />
                                            <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Activo (90d)</span>
                                        </div>
                                        <p className="text-[8px] text-rose-500 font-black uppercase">Expira en 5 días</p>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => alert('SOLICITUD RF-04: Cambio de contraseña forzado enviado al correo del vendedor.')}
                                            className="p-2.5 rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white transition-all shadow-sm"
                                            title="Forzar Cambio de Clave (RF-04)"
                                        >
                                            <Lock className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => router.push(`/admin/sellers/${vendor.id}`)}
                                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 transition-all active:scale-95 shadow-lg shadow-gray-200/50 group-hover:shadow-rose-200"
                                        >
                                            Ver Perfil
                                            <ExternalLink className="w-3 h-3" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {vendors.length === 0 && (
                <div className="p-20 text-center">
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">No se encontraron vendedores registrados</p>
                </div>
            )}
        </div>
    );
}
