'use client';

import React from 'react';
import ModuleHeader from '@/components/layout/shared/ModuleHeader';
import { Receipt, TrendingDown, DollarSign, ArrowUpRight, Plus } from 'lucide-react';

export default function OperationalExpensesPage() {
    const expenses = [
        { id: 1, label: 'Hosting & Server (AWS)', amount: 450, category: 'Infraestructura', status: 'Pagado', trend: '+2%' },
        { id: 2, label: 'Soporte Nivel 2 (Outsourced)', amount: 1200, category: 'Operación', status: 'Pendiente', trend: '0%' },
        { id: 3, label: 'Marketing Digital (FB/IG)', amount: 3000, category: 'Crecimiento', status: 'Pagado', trend: '-5%' },
    ];

    return (
        <div className="px-8 pb-8 space-y-8 animate-fadeIn font-industrial">
            <ModuleHeader
                title="Auditoría de Gastos Operativos"
                subtitle="Control de Egresos vs Utilidad Neta (ROI Corporativo)"
                icon="FileText"
                actions={
                    <button className="px-6 py-3 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl font-industrial flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Registrar Gasto
                    </button>
                }
            />

            {/* KPI Row: Gasto vs Utilidad */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl">
                            <TrendingDown className="w-6 h-6" />
                        </div>
                        <span className="text-2xl font-black text-gray-900 tracking-tighter">S/ 4,650</span>
                    </div>
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Gasto Operativo Total</h3>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                            <ArrowUpRight className="w-6 h-6" />
                        </div>
                        <span className="text-2xl font-black text-gray-900 tracking-tighter">S/ 18,420</span>
                    </div>
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Utilidad Neta (Marketplace)</h3>
                </div>

                <div className="bg-indigo-900 p-8 rounded-[2.5rem] text-white shadow-xl shadow-indigo-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-white/10 rounded-2xl">
                            <DollarSign className="w-6 h-6 text-indigo-300" />
                        </div>
                        <span className="text-2xl font-black tracking-tighter">3.96x</span>
                    </div>
                    <h3 className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">Ratio de Eficiencia (ROI)</h3>
                </div>
            </div>

            {/* Expense List */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden">
                <div className="p-8 border-b border-gray-50 bg-gray-50/20">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Desglose de Egresos</h3>
                </div>
                <div className="divide-y divide-gray-50">
                    {expenses.map(exp => (
                        <div key={exp.id} className="p-6 flex items-center justify-between hover:bg-gray-50/50 transition-all">
                            <div className="flex items-center gap-6">
                                <div className="p-4 bg-gray-100 rounded-2xl text-gray-400">
                                    <Receipt className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-gray-900 uppercase tracking-tight">{exp.label}</p>
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{exp.category}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-black text-gray-900 tracking-tighter">S/ {exp.amount}</p>
                                <div className="flex items-center justify-end gap-2">
                                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-md ${exp.status === 'Pagado' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                        {exp.status}
                                    </span>
                                    <span className="text-[8px] font-black text-gray-400">{exp.trend}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
