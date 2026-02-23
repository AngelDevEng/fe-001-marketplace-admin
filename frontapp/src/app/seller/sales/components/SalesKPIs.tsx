import React from 'react';
import { SalesKPI } from '@/lib/types/seller/sales';

interface SalesKPIsProps {
    kpis: SalesKPI[];
}

export default function SalesKPIs({ kpis }: SalesKPIsProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {kpis.map((kpi, index) => (
                <div
                    key={index}
                    className={`glass-card p-6 border-l-4 transition-all hover:translate-y-[-2px] rounded-[2rem] shadow-sm border border-gray-100 flex flex-col justify-between
                        ${kpi.status === 'Agencia' ? 'border-l-indigo-500 bg-gradient-to-br from-white to-indigo-50/20' :
                            kpi.status === 'Tránsito' ? 'border-l-cyan-500 bg-gradient-to-br from-white to-cyan-50/20' :
                                'border-l-sky-500 bg-gradient-to-br from-white to-sky-50/20'}`}
                >
                    <div className="flex justify-between items-center mb-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center 
                            ${kpi.status === 'Agencia' ? 'bg-indigo-100 text-indigo-600' :
                                kpi.status === 'Tránsito' ? 'bg-cyan-100 text-cyan-600' :
                                    'bg-sky-100 text-sky-600'}`}>
                            <i className={`ph ph-bold ${kpi.icon} text-xl`}></i>
                        </div>
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg
                            ${kpi.status === 'Agencia' ? 'text-indigo-500 bg-indigo-50' :
                                kpi.status === 'Tránsito' ? 'text-cyan-500 bg-cyan-50' :
                                    'text-sky-500 bg-sky-50'}`}>
                            {kpi.status}
                        </span>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">{kpi.label}</p>
                        <h4 className="text-2xl font-black text-gray-800">
                            {kpi.count} <span className="text-xs font-bold text-gray-400 ml-1">Ord.</span>
                        </h4>
                    </div>
                </div>
            ))}
        </div>
    );
}
