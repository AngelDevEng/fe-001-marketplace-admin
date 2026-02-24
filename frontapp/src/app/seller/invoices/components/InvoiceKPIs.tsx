'use client';

import React from 'react';
import { InvoiceKPIs } from '@/lib/types/seller/invoices';
import Icon from '@/components/ui/Icon';

interface InvoiceKPIsProps {
    kpis: InvoiceKPIs | null;
}

export default function InvoiceKPIsDisplay({ kpis }: InvoiceKPIsProps) {
    if (!kpis) return null;

    const items = [
        {
            label: 'Total Facturado',
            value: `S/ ${kpis.totalFacturado.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            icon: 'DollarSign',
            color: 'emerald',
            badge: 'Mes Actual'
        },
        {
            label: 'Tasa de Éxito',
            value: `${kpis.successRate.toFixed(1)}%`,
            icon: 'CheckCircle2',
            color: 'sky',
            badge: 'Sync Rate'
        },
        {
            label: 'Pendientes',
            value: kpis.pendingCount.toString(),
            icon: 'Clock',
            color: 'amber',
            badge: 'Waiting'
        },
        {
            label: 'Rechazados',
            value: kpis.rejectedCount.toString(),
            icon: 'XCircle',
            color: 'red',
            badge: 'Error'
        }
    ];

    const colorVariants: Record<string, string> = {
        emerald: 'border-emerald-500 from-emerald-50/20 to-emerald-100/10 text-emerald-600 bg-emerald-100',
        sky: 'border-sky-500 from-sky-50/20 to-sky-100/10 text-sky-600 bg-sky-100',
        amber: 'border-amber-500 from-amber-50/20 to-amber-100/10 text-amber-600 bg-amber-100',
        red: 'border-red-500 from-red-50/20 to-red-100/10 text-red-600 bg-red-100'
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item, idx) => (
                <div key={idx} className={`glass-card p-6 border-l-4 bg-gradient-to-br transition-all hover:scale-[1.02] ${colorVariants[item.color].split(' ')[0]} ${colorVariants[item.color].split(' ').slice(1, 3).join(' ')}`}>
                    <div className="flex justify-between items-center mb-4">
                        <div className={`w-10 h-10 ${colorVariants[item.color].split(' ')[4]} rounded-xl flex items-center justify-center ${colorVariants[item.color].split(' ')[3]}`}>
                            <Icon name={item.icon} className="w-5 h-5" />
                        </div>
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${colorVariants[item.color].split(' ')[3]} bg-white/50 backdrop-blur-sm`}>
                            {item.badge}
                        </span>
                    </div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">{item.label}</p>
                    <h4 className="text-2xl font-black text-gray-800">{item.value}</h4>
                </div>
            ))}
        </div>
    );
}
