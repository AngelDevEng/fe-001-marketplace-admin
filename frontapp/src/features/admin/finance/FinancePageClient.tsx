'use client';

import React from 'react';
import ModuleHeader from '@/components/layout/shared/ModuleHeader';
import BaseButton from '@/components/ui/BaseButton';
import Skeleton from '@/components/ui/Skeleton';
import { TopBuyersRanking, SalesHeatmap } from '@/components/admin/finance/FinanceCharts';
import { useFinance } from '@/features/admin/finance/hooks/useFinance';
import { RefreshCw, Download, PieChart, Trophy, TrendingUp, DollarSign } from 'lucide-react';
import { exportToCSV } from '@/shared/lib/utils/export';

const cardColorClasses: Record<string, string> = { emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100', indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100', blue: 'bg-blue-50 text-blue-600 border-blue-100' };

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface FinancePageClientProps { }
export function FinancePageClient(_props: FinancePageClientProps) {
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
        const csvData = [['Ingresos Totales', `S/ ${data.totalRevenue}`], ['Margen Comisión', `${data.commissionRate}%`], ['Utilidad Neta', `S/ ${data.netProfit}`], ['Crecimiento', `${data.growthPercentage}%`]];
        exportToCSV(headers, csvData, `reporte-financiero-${new Date().toISOString().split('T')[0]}.csv`);
    };

    return (
        <div className="space-y-8 animate-fadeIn font-industrial pb-20">
            <ModuleHeader title="Centro Financiero" subtitle="Métricas, estadísticas y reportes de revenue management" icon="DollarSign" actions={<div className="flex gap-2"><BaseButton onClick={() => refresh()} variant="ghost" leftIcon="RefreshCw" size="md"><RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /></BaseButton><BaseButton onClick={handleExport} variant="primary" leftIcon="Download" size="md">Exportar</BaseButton></div>} />
            {error && <div className="p-6 bg-rose-50 border border-rose-100 rounded-[2rem] text-rose-600 font-bold">{error}</div>}
            {loading ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">{[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-[2rem]" />)}</div> : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {stats.map((stat, i) => (<div key={i} className="bg-white p-7 rounded-[2.5rem] border border-gray-100 shadow-sm"><div className="flex items-center gap-4"><div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${cardColorClasses[stat.color]}`}><TrendingUp className="w-6 h-6" /></div><div><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p><p className="text-xl font-black text-gray-900">{stat.val}</p></div></div></div>))}
                    </div>
                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm"><h3 className="text-lg font-black text-gray-800 uppercase mb-6">Análisis de Ingresos</h3><p className="text-gray-400 text-sm">Gráfico de heatmap de ventas...</p></div>
                </>
            )}
        </div>
    );
}
