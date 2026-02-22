'use client';

import React from 'react';
import { VoucherStatus, VoucherType } from '@/lib/types/seller/invoices';
import Icon from '@/components/ui/Icon';

interface InvoiceFiltersProps {
    search: string;
    status: VoucherStatus | 'ALL';
    type: VoucherType | 'ALL';
    onFilterChange: (filters: any) => void;
    onClear: () => void;
}

export default function InvoiceFilters({ search, status, type, onFilterChange, onClear }: InvoiceFiltersProps) {
    return (
        <div className="glass-card p-6 border-gray-100 animate-fadeIn">
            <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 space-y-2 w-full">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Búsqueda</label>
                    <div className="relative">
                        <Icon name="Search" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Serie, Número o Cliente..."
                            value={search}
                            onChange={(e) => onFilterChange({ search: e.target.value })}
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-700 focus:ring-2 focus:ring-emerald-500/20 transition-all font-mono outline-none"
                        />
                    </div>
                </div>

                <div className="w-full md:w-48 space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Estado SUNAT</label>
                    <select
                        value={status}
                        onChange={(e) => onFilterChange({ status: e.target.value })}
                        className="w-full p-3 bg-gray-50 border-none rounded-2xl text-[10px] font-black uppercase tracking-widest text-emerald-600 focus:ring-2 focus:ring-emerald-500/20 cursor-pointer outline-none"
                    >
                        <option value="ALL">Todos los Estados</option>
                        <option value="DRAFT">Borrador</option>
                        <option value="SENT_WAIT_CDR">Enviado</option>
                        <option value="ACCEPTED">Aceptado</option>
                        <option value="OBSERVED">Observado</option>
                        <option value="REJECTED">Rechazado</option>
                    </select>
                </div>

                <div className="w-full md:w-48 space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tipo de Comprobante</label>
                    <select
                        value={type}
                        onChange={(e) => onFilterChange({ type: e.target.value })}
                        className="w-full p-3 bg-gray-50 border-none rounded-2xl text-[10px] font-black uppercase tracking-widest text-emerald-600 focus:ring-2 focus:ring-emerald-500/20 cursor-pointer outline-none"
                    >
                        <option value="ALL">Todos los Tipos</option>
                        <option value="BOLETA">Boleta</option>
                        <option value="FACTURA">Factura</option>
                        <option value="NOTA_CREDITO">Nota de Crédito</option>
                    </select>
                </div>

                <button
                    onClick={onClear}
                    className="p-3 bg-gray-50 text-gray-500 rounded-2xl hover:bg-gray-100 transition-all shadow-sm active:scale-95 border border-gray-100"
                    title="Limpiar Filtros"
                >
                    <Icon name="RotateCcw" className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
