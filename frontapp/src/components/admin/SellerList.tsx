'use client';

import React from 'react';
import { User, Mail, Phone, Store as StoreIcon, ExternalLink, ShieldCheck, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Seller } from '@/features/admin/sellers/types';
import Skeleton, { SkeletonRow } from '@/components/ui/Skeleton';

interface SellerListProps {
    sellers: Seller[];
    loading?: boolean;
    onResetPassword?: (id: number) => void;
}

export default function SellerList({ sellers, loading = false, onResetPassword }: SellerListProps) {
    const router = useRouter();

    if (loading) {
        return (
            <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm overflow-hidden">
                <div className="mb-8 flex justify-between items-center">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-3 w-32" />
                    </div>
                    <Skeleton className="h-8 w-40 rounded-full" />
                </div>
                <div className="space-y-4">
                    <SkeletonRow count={5} />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm transition-all hover:shadow-md">
            <div className="p-8 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
                <div>
                    <h3 className="text-gray-900 font-black uppercase tracking-widest text-xs">Gestión Estratégica de Vendedores</h3>
                    <p className="text-gray-400 text-[10px] font-bold mt-1 uppercase">Control centralizado de cuentas Dokan Pro</p>
                </div>
                <div className="flex gap-2">
                    <span className="px-4 py-1.5 bg-sky-50 text-sky-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-sky-100">
                        {sellers.length} Vendedores Activos
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
                        {sellers.map((vendor) => (
                            <tr key={vendor.id} className="group hover:bg-gray-50/50 transition-colors">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-400 group-hover:from-sky-500 group-hover:to-sky-600 group-hover:text-white transition-all shadow-sm">
                                            <User className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-gray-900 uppercase tracking-tight">
                                                {vendor.name}
                                            </p>
                                            <div className="flex flex-col gap-1 mt-1">
                                                <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase">
                                                    <Mail className="w-3 h-3 text-sky-400" />
                                                    {vendor.email}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-3 bg-gray-50/50 group-hover:bg-white p-3 rounded-2xl border border-transparent group-hover:border-gray-100 transition-all w-fit">
                                        <StoreIcon className="w-4 h-4 text-sky-500" />
                                        <span className="text-xs font-black text-gray-700 uppercase tracking-wide">
                                            {vendor.company}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${(vendor.status === 'ACTIVE' || vendor.status === 'activa') ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${(vendor.status === 'ACTIVE' || vendor.status === 'activa') ? 'text-emerald-600' : 'text-rose-600'}`}>
                                            {vendor.status}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <ShieldCheck className="w-3 h-3 text-emerald-500" />
                                            <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Activo</span>
                                        </div>
                                        {vendor.contractStatus === 'VENCIDO' && (
                                            <p className="text-[8px] text-rose-500 font-black uppercase animate-pulse">Contrato Vencido</p>
                                        )}
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => onResetPassword?.(vendor.id)}
                                            className="p-2.5 rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white transition-all shadow-sm"
                                            title="Forzar Cambio de Clave (RF-04)"
                                        >
                                            <Lock className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => router.push(`/admin/sellers/${vendor.id}`)}
                                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-sky-600 transition-all active:scale-95 shadow-lg shadow-sky-100 group-hover:shadow-sky-200"
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

            {sellers.length === 0 && (
                <div className="p-20 text-center">
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">No se encontraron vendedores registrados</p>
                </div>
            )}
        </div>
    );
}
