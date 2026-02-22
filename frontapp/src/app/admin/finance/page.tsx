'use client';

import React from 'react';
import ModuleHeader from '@/components/layout/shared/ModuleHeader';
import { TopBuyersRanking, SalesHeatmap } from '@/components/admin/finance/FinanceCharts';
import { useFinance } from '@/hooks/useFinance';
import { TrendingUp, DollarSign, PieChart, Info, Download, Trophy, AlertCircle, RefreshCw } from 'lucide-react';

const cardColorClasses: Record<string, string> = {
    emerald: 'bg-emerald-50 text-emerald-600',
    indigo: 'bg-indigo-50 text-indigo-600',
    blue: 'bg-blue-50 text-blue-600',
};

export default function FinancePage() {
    const [activeTab, setActiveTab] = React.useState<'dashboard' | 'ranking'>('dashboard');
    const { data, loading, error, refresh } = useFinance();

    if (loading) {
        return (
            <div className="flex items-center justify-center p-32">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                    <div className="text-center font-black animate-pulse uppercase tracking-[0.3em] text-emerald-600 text-[10px]">
                        Calculando Margenes & ROI real...
                    </div>
                </div>
            </div>
        );
    }

    if (!data) return null;

    const stats = [
        { label: 'Utilidad Bruta (Mes)', val: `S/ ${data.totalRevenue.toLocaleString()}`, icon: <TrendingUp />, color: 'emerald' },
        { label: 'Margen de Comisión (avg)', val: `${data.commissionRate}%`, icon: <PieChart />, color: 'indigo' },
        { label: 'Utilidad Neta (Lyrium)', val: `S/ ${data.netProfit.toLocaleString()}`, icon: <DollarSign />, color: 'emerald' },
        { label: 'Tasa de Crecimiento', val: `+${data.growthPercentage}%`, icon: <TrendingUp />, color: 'blue' }
    ];

    return (
        <div className="px-8 pb-20 space-y-8 animate-fadeIn font-industrial">
            <div className="flex justify-between items-start">
                <ModuleHeader
                    title="Centro de Finanzas y Estadísticas"
                    subtitle="Monitor de Salud del Marketplace y LTV (RF-07, RF-08)"
                    icon="TrendingUp"
                />
                <div className="flex gap-3 pt-6">
                    <button
                        onClick={() => refresh()}
                        className="p-3 bg-white border border-gray-100 text-gray-400 rounded-2xl hover:text-emerald-600 hover:border-emerald-100 transition-all shadow-sm"
                    >
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                        onClick={() => {
                            const headers = ['Metrica', 'Valor'];
                            const rows = [
                                headers,
                                ['Ingresos Totales', data.totalRevenue.toString()],
                                ['Margen Comision', data.commissionRate.toString()],
                                ['Utilidad Neta', data.netProfit.toString()],
                                ['Crecimiento', data.growthPercentage.toString()]
                            ];
                            const csv = rows.map(r => r.join(',')).join('\n');
                            const blob = new Blob([csv], { type: 'text/csv' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `reporte-financiero-${new Date().toISOString().split('T')[0]}.csv`;
                            a.click();
                        }}
                        className="flex items-center gap-3 px-6 py-3 bg-gray-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl active:scale-95"
                    >
                        <Download className="w-4 h-4" /> Exportar Reporte
                    </button>
                </div>
            </div>

            {error && (
                <div className="p-6 bg-rose-50 border border-rose-100 rounded-[2rem] flex items-center justify-between text-rose-600 font-bold text-sm">
                    <div className="flex items-center gap-4">
                        <AlertCircle className="w-5 h-5" />
                        {error}
                    </div>
                </div>
            )}

            {/* KPI ROW */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((s, i) => (
                    <div key={i} className="bg-white p-7 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                        <div className="flex items-center justify-between mb-4 relative z-10">
                            <div className={`p-3 ${cardColorClasses[s.color]} rounded-2xl`}>
                                {s.icon}
                            </div>
                            <span className="text-2xl font-black text-gray-900 tracking-tighter">{s.val}</span>
                        </div>
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest relative z-10">{s.label}</h3>
                    </div>
                ))}
            </div>

            {/* TAB NAVIGATION */}
            <div className="flex bg-gray-100/80 p-1.5 rounded-[2rem] w-fit mx-auto border border-white/50 backdrop-blur-sm shadow-inner">
                <button
                    className={`px-10 py-3.5 rounded-[1.7rem] text-xs font-black transition-all flex items-center gap-2 font-industrial uppercase tracking-wider ${activeTab === 'dashboard' ? 'bg-white shadow-md text-indigo-600' : 'text-gray-400 hover:bg-white/50'}`}
                    onClick={() => setActiveTab('dashboard')}
                >
                    <PieChart className="w-4 h-4" /> Dashboard de Salud
                </button>
                <button
                    className={`px-10 py-3.5 rounded-[1.7rem] text-xs font-black transition-all flex items-center gap-2 font-industrial uppercase tracking-wider ${activeTab === 'ranking' ? 'bg-white shadow-md text-indigo-600' : 'text-gray-400 hover:bg-white/50'}`}
                    onClick={() => setActiveTab('ranking')}
                >
                    <Trophy className="w-4 h-4" /> Ranking & CLV (RF-07)
                </button>
            </div>

            {activeTab === 'dashboard' ? (
                <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden relative">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
                                    Análisis de Margen de Contribución
                                </h3>
                                <p className="text-xl font-black text-gray-900 tracking-tight">
                                    Salud Financiera Corporativa (RF-09)
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-6">
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Distribución de Utilidad</p>
                                <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden flex font-black text-[8px] text-white text-center">
                                    <div className="bg-indigo-600 h-full w-[70%] flex items-center justify-center">VENDEDORES (70%)</div>
                                    <div className="bg-emerald-500 h-full w-[22.5%] flex items-center justify-center">LYRIUM (22.5%)</div>
                                    <div className="bg-rose-500 h-full w-[7.5%] flex items-center justify-center">TAX (7.5%)</div>
                                </div>
                                <div className="flex gap-6 mt-4">
                                    <div className="flex items-center gap-2">
                                        <span className="w-3 h-3 bg-indigo-600 rounded-full"></span>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Payouts</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-3 h-3 bg-emerald-500 rounded-full"></span>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Net Profit</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Proyección Trimestral</p>
                                <p className="text-2xl font-black text-gray-900 tracking-tighter italic">S/ 73,800</p>
                                <p className="text-[11px] font-medium text-gray-500 mt-2">Crecimiento esperado basado en el actual <span className="text-emerald-600 font-black">7.5% de comisión</span>.</p>
                            </div>
                        </div>
                    </div>
                    <SalesHeatmap data={data.heatmap} />
                </div>
            ) : (
                <div className="animate-in slide-in-from-bottom-4 duration-500">
                    <TopBuyersRanking buyers={data.topBuyers} />
                </div>
            )}

            {/* INFO FOOTER */}
            <div className="bg-indigo-900 p-8 rounded-[2.5rem] text-white flex flex-col md:flex-row items-center gap-6 relative overflow-hidden shadow-2xl shadow-indigo-200">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl">
                    <Info className="w-8 h-8 text-indigo-300" />
                </div>
                <div className="flex-1 text-center md:text-left">
                    <h4 className="text-sm font-black uppercase tracking-widest mb-1">Consistencia de Datos (RF-09)</h4>
                    <p className="text-xs text-indigo-200 font-medium">Todos los cálculos de ROI, Margen y Conversión están sincronizados mediante el motor centralizado del Backend para garantizar coherencia en ambos paneles.</p>
                </div>
            </div>
        </div>
    );
}
