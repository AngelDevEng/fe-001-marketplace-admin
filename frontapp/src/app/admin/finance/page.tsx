'use client';

import React from 'react';
import ModuleHeader from '@/components/layout/shared/ModuleHeader';
import BaseButton from '@/components/ui/BaseButton';
import Skeleton from '@/components/ui/Skeleton';
import Icon from '@/components/ui/Icon';
import { TopBuyersRanking, SalesHeatmap } from '@/components/admin/finance/FinanceCharts';
import { useFinance } from '@/hooks/useFinance';
import { RefreshCw, Download, PieChart, Trophy, TrendingUp, DollarSign } from 'lucide-react';
import { exportToCSV } from '@/lib/utils/export';

const cardColorClasses: Record<string, string> = {
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
};

export default function FinancePage() {
    const [activeTab, setActiveTab] = React.useState<'dashboard' | 'ranking'>('dashboard');
    const { data, loading, error, refresh } = useFinance();

    const stats = [
        { label: 'Utilidad Bruta (Mes)', val: data?.totalRevenue ? `S/ ${data.totalRevenue.toLocaleString()}` : null, icon: 'TrendingUp', color: 'emerald' },
        { label: 'Margen de Comisión (avg)', val: data?.commissionRate ? `${data.commissionRate}%` : null, icon: 'PieChart', color: 'indigo' },
        { label: 'Utilidad Neta (Lyrium)', val: data?.netProfit ? `S/ ${data.netProfit.toLocaleString()}` : null, icon: 'DollarSign', color: 'emerald' },
        { label: 'Tasa de Crecimiento', val: data?.growthPercentage ? `+${data.growthPercentage}%` : null, icon: 'Zap', color: 'blue' }
    ];

    const handleExport = () => {
        if (!data) return;
        const headers = ['Métrica', 'Valor'];
        const csvData = [
            ['Ingresos Totales', `S/ ${data.totalRevenue}`],
            ['Margen Comisión', `${data.commissionRate}%`],
            ['Utilidad Neta', `S/ ${data.netProfit}`],
            ['Crecimiento', `${data.growthPercentage}%`]
        ];
        const dateStr = new Date().toISOString().split('T')[0];
        exportToCSV(headers, csvData, `reporte-financiero-${dateStr}.csv`);
    };

    return (
        <div className="space-y-8 animate-fadeIn font-industrial pb-20">
            <ModuleHeader
                title="Centro de Finanzas y Estadísticas"
                subtitle="Monitor de Salud del Marketplace y LTV (RF-07, RF-08)"
                icon="TrendingUp"
                actions={
                    <div className="flex gap-3">
                        <BaseButton
                            onClick={() => refresh()}
                            variant="ghost"
                            size="md"
                            className="bg-white border border-gray-100 shadow-sm"
                        >
                            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                        </BaseButton>
                        <BaseButton
                            onClick={handleExport}
                            variant="primary"
                            leftIcon="Download"
                            size="md"
                        >
                            Exportar Inteligencia
                        </BaseButton>
                    </div>
                }
            />

            {error && (
                <div className="p-6 bg-rose-50 border border-rose-100 rounded-[2rem] flex items-center justify-between text-rose-600 font-bold text-sm">
                    <div className="flex items-center gap-4">
                        <Icon name="AlertTriangle" className="w-5 h-5" />
                        {error}
                    </div>
                </div>
            )}

            {/* KPI ROW */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((s, i) => (
                    <div key={i} className="bg-white p-7 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                        <div className="flex items-center justify-between mb-4 relative z-10">
                            <div className={`p-4 ${cardColorClasses[s.color]} rounded-2xl flex items-center justify-center`}>
                                <Icon name={s.icon as any} className="w-6 h-6" />
                            </div>
                            <span className="text-2xl font-black text-gray-900 tracking-tighter">
                                {loading || !data ? <Skeleton className="h-8 w-24" /> : s.val}
                            </span>
                        </div>
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest relative z-10">{s.label}</h3>
                    </div>
                ))}
            </div>

            {loading || !data ? (
                <div className="space-y-10 animate-fadeIn">
                    <div className="flex bg-gray-100/50 p-2 rounded-[2.5rem] w-fit mx-auto border border-gray-50">
                        <Skeleton className="h-12 w-48 rounded-[2rem]" />
                        <Skeleton className="h-12 w-48 rounded-[2rem] ml-1" />
                    </div>
                    <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
                        <Skeleton className="w-full h-96 rounded-[2rem]" />
                    </div>
                </div>
            ) : (
                <>
                    {/* TAB NAVIGATION */}
                    <div className="flex bg-gray-100/80 p-1.5 rounded-[2.5rem] w-fit mx-auto border border-white/50 backdrop-blur-sm shadow-inner">
                        <button
                            className={`px-10 py-4 rounded-[2rem] text-xs font-black transition-all flex items-center gap-3 font-industrial uppercase tracking-widest ${activeTab === 'dashboard' ? 'bg-white shadow-lg text-indigo-600' : 'text-gray-400 hover:bg-white/50'}`}
                            onClick={() => setActiveTab('dashboard')}
                        >
                            <PieChart className="w-4 h-4" /> Dashboard de Salud
                        </button>
                        <button
                            className={`px-10 py-4 rounded-[2rem] text-xs font-black transition-all flex items-center gap-3 font-industrial uppercase tracking-widest ${activeTab === 'ranking' ? 'bg-white shadow-lg text-indigo-600' : 'text-gray-400 hover:bg-white/50'}`}
                            onClick={() => setActiveTab('ranking')}
                        >
                            <Trophy className="w-4 h-4" /> Ranking & CLV (RF-07)
                        </button>
                    </div>

                    {activeTab === 'dashboard' ? (
                        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl overflow-hidden relative">
                                <div className="flex items-center justify-between mb-10">
                                    <div>
                                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] leading-none mb-2">
                                            Análisis de Margen de Contribución
                                        </h3>
                                        <p className="text-2xl font-black text-gray-900 tracking-tighter uppercase italic">
                                            Salud Financiera Corporativa (RF-09)
                                        </p>
                                    </div>
                                    <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5" />
                                        <span className="text-xs font-black uppercase tracking-widest">Óptimo</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                                    <div className="space-y-8">
                                        <div className="space-y-4">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Distribución de Utilidad</p>
                                            <div className="h-6 w-full bg-gray-100 rounded-full overflow-hidden flex font-black text-[9px] text-white text-center shadow-inner">
                                                <div className="bg-indigo-600 h-full w-[70%] flex items-center justify-center border-r border-white/10">VENDEDORES (70%)</div>
                                                <div className="bg-emerald-500 h-full w-[22.5%] flex items-center justify-center border-r border-white/10">LYRIUM (22.5%)</div>
                                                <div className="bg-rose-500 h-full w-[7.5%] flex items-center justify-center">TAX (7.5%)</div>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-6">
                                            <div className="flex items-center gap-3">
                                                <span className="w-4 h-4 bg-indigo-600 rounded-lg shadow-sm"></span>
                                                <span className="text-[10px] font-black text-gray-800 uppercase tracking-widest">Payouts</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="w-4 h-4 bg-emerald-500 rounded-lg shadow-sm"></span>
                                                <span className="text-[10px] font-black text-gray-800 uppercase tracking-widest">Margen Lyrium</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="w-4 h-4 bg-rose-500 rounded-lg shadow-sm"></span>
                                                <span className="text-[10px] font-black text-gray-800 uppercase tracking-widest">Impuestos</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50/50 p-10 rounded-[2.5rem] border border-gray-100 relative group">
                                        <div className="absolute top-6 right-6 opacity-10 group-hover:rotate-12 transition-transform">
                                            <DollarSign className="w-16 h-16 text-gray-900" />
                                        </div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Proyección Trimestral Esperada</p>
                                        <p className="text-4xl font-black text-gray-900 tracking-tighter italic">S/ 73,800</p>
                                        <p className="text-[11px] font-medium text-gray-500 mt-4 leading-relaxed uppercase tracking-tight">
                                            Crecimiento esperado basado en el actual <span className="text-emerald-600 font-black">7.5% de comisión</span> sobre el GMV total del marketplace.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <SalesHeatmap data={data.heatmap} />
                        </div>
                    ) : (
                        <div className="animate-in slide-in-from-bottom-4 duration-500 pb-20">
                            <TopBuyersRanking buyers={data.topBuyers} />
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
