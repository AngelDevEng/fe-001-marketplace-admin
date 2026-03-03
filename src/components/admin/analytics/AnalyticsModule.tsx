import React from 'react';
import {
    KpiCard,
    ScatterPerformanceChart,
    RetentionLineChart,
    CatalogPerformanceList,
    SellerLeaderboard,
    GeographicMapBars,
    FrequencyBars
} from './AnalyticsCharts';
import { AnalyticsKPI } from '@/features/admin/analytics/types';
import { Store, Users } from 'lucide-react';
import { SalesHeatmap } from '@/components/admin/finance/FinanceCharts';
import { MOCK_FINANCE_DATA } from '@/lib/mocks/financeData';
import Skeleton from '@/components/ui/Skeleton';

interface AnalyticsModuleProps {
    state: {
        data: any;
        loading: boolean;
        filters: Record<string, any>;
        activeTab: string;
        kpis: AnalyticsKPI[];
        topSellers: any[];
    };
    actions: Record<string, unknown>;
}

export const AnalyticsModule: React.FC<AnalyticsModuleProps> = ({ state, actions }) => {
    const { data, loading, filters, activeTab, kpis, topSellers } = state;

    if (loading || !data) {
        return (
            <div className="space-y-8 animate-fadeIn pb-20 font-industrial">
                {/* FILTROS SKELETON */}
                <Skeleton className="w-full h-32 rounded-[2.5rem]" />

                {/* KPI SKELETONS */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={`analytics-skel-${i}`} className="bg-white p-7 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-4">
                            <div className="flex justify-between items-center">
                                <Skeleton className="h-10 w-10 rounded-xl" />
                                <Skeleton className="h-8 w-16 rounded-md" />
                            </div>
                            <Skeleton className="h-4 w-24 rounded" />
                        </div>
                    ))}
                </div>

                {/* TABS SKELETON */}
                <div className="flex bg-gray-100/80 p-1.5 rounded-[2rem] w-fit mx-auto border border-white/50 backdrop-blur-sm shadow-inner mb-4">
                    <Skeleton className="h-12 w-48 rounded-[1.7rem]" />
                    <Skeleton className="h-12 w-48 rounded-[1.7rem] ml-1" />
                </div>

                {/* CONTENT SKELETON */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8">
                        <Skeleton className="w-full h-[500px] rounded-[2.5rem]" />
                    </div>
                    <div className="lg:col-span-4">
                        <Skeleton className="w-full h-[500px] rounded-[2.5rem]" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fadeIn pb-20 font-industrial">

            {/* FILTROS DE INTELIGENCIA (RF-11) */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-indigo-100/50 transition-all duration-700"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end relative z-10">
                    <div className="space-y-2">
                        <label htmlFor="analytics-period" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                            Periodo de Análisis Lógico
                        </label>
                        <select
                            id="analytics-period"
                            value={filters.period as string}
                            onChange={(e) => (actions.setFilters as Function)({ ...filters, period: e.target.value })}
                            className="w-full p-4 bg-gray-50 border-none rounded-2xl text-xs font-black text-gray-700 uppercase cursor-pointer"
                        >
                            <option value="TODAY">Día Actual (Today)</option>
                            <option value="LAST_24H">Últimas 24 Horas</option>
                            <option value="LAST_30">Últimos 30 días</option>
                            <option value="LAST_90">Últimos 90 días</option>
                            <option value="CAMPAÑA">Black Friday / Campaña Especial</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="analytics-rubro" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                            Aislar Sector Corporativo
                        </label>
                        <select
                            id="analytics-rubro"
                            value={filters.rubro as string}
                            onChange={(e) => (actions.setFilters as Function)({ ...filters, rubro: e.target.value })}
                            className="w-full p-4 bg-gray-50 border-none rounded-2xl text-xs font-black text-gray-700 uppercase cursor-pointer"
                        >
                            <option value="ALL">Totalidad del Mercado (Global)</option>
                            <option value="Insumos">Sector: Insumos Agrícolas</option>
                            <option value="Herramientas">Sector: Maquinaria y Herramientas</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* KEY INTELLIGENCE METRICS (RF-11) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpis.map((kpi: AnalyticsKPI) => <KpiCard key={kpi.label} kpi={kpi} />)}
            </div>

            {/* TABS DE ANALÍTICA PROFUNDA */}
            <div className="flex bg-gray-100/80 p-1.5 rounded-[2rem] w-fit mx-auto border border-white/50 backdrop-blur-sm shadow-inner mb-4">
                <button
                    className={`px-10 py-3.5 rounded-[1.7rem] text-xs font-black transition-all flex items-center gap-2 ${activeTab === 'vendedores' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:bg-white/50'
                        }`}
                    onClick={() => (actions.setActiveTab as Function)('vendedores')}
                >
                    <Store className="w-4 h-4" /> Rendimiento Oferta (Vendedores)
                </button>
                <button
                    className={`px-10 py-3.5 rounded-[1.7rem] text-xs font-black transition-all flex items-center gap-2 ${activeTab === 'clientes' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:bg-white/50'
                        }`}
                    onClick={() => (actions.setActiveTab as Function)('clientes')}
                >
                    <Users className="w-4 h-4" /> Comportamiento Demanda (Clientes)
                </button>
            </div>

            {/* TAB: VENDEDORES (RF-10) */}
            <div className={`transition-all duration-500 origin-top h-auto ${activeTab === 'vendedores' ? 'opacity-100 scale-y-100 flex-1 relative' : 'opacity-0 h-0 overflow-hidden scale-y-0 absolute'}`}>
                <div className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Gráfico Dispersión: ROI vs Conversión */}
                        <div className="lg:col-span-8 bg-white p-8 min-h-[500px] rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/40">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
                                        Rendimiento Estratégico Multivariante
                                    </h3>
                                    <p className="text-lg font-black text-gray-900 tracking-tight">
                                        Análisis de Dispersión (ROI vs Conversión)
                                    </p>
                                </div>
                                <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[9px] font-black rounded-lg border border-amber-100 uppercase animate-pulse">
                                    Motor Predictivo Activo
                                </span>
                            </div>
                            <div className="relative h-[350px]">
                                <ScatterPerformanceChart sellers={data.vendedoresAnalitica as any} />
                            </div>
                        </div>

                        {/* Productos Estrella vs Hueso */}
                        <div className="lg:col-span-4 bg-white p-8 flex flex-col overflow-hidden relative rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/40">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-8">
                                Rotación de Catálogo
                            </h3>
                            <CatalogPerformanceList products={data.catalogoRendimiento} />
                        </div>
                    </div>

                    {/* Comparativa de Rubro Leaderboard */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/40">
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-8">
                            Líderes de Mercado (Benchmark Operacional)
                        </h3>
                        {topSellers.length > 0 ? (
                            <SellerLeaderboard sellers={topSellers} />
                        ) : (
                            <div className="text-center py-10 font-bold text-gray-400 uppercase text-xs">No hay datos para la muestra con los filtros actuales.</div>
                        )}
                    </div>
                </div>
            </div>

            {/* TAB: CLIENTES (RF-11) */}
            <div className={`transition-all duration-500 origin-top h-auto ${activeTab === 'clientes' ? 'opacity-100 scale-y-100 flex-1' : 'opacity-0 h-0 overflow-hidden scale-y-0 absolute'}`}>
                <div className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Análisis Geográfico Map */}
                        <div className="lg:col-span-12 lg:row-start-2 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/40">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
                                        Radar Geográfico de Oportunidades
                                    </h3>
                                    <p className="text-lg font-black text-gray-900 tracking-tight">
                                        Concentración de Demanda Nacional
                                    </p>
                                </div>
                            </div>
                            <GeographicMapBars zones={data.comportamientoClientes.demografia} />
                        </div>

                        {/* Retención de Cohortes */}
                        <div className="lg:col-span-12 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/40">
                            <SalesHeatmap data={MOCK_FINANCE_DATA.heatmap} />
                        </div>

                        {/* Retención de Cohortes */}
                        <div className="lg:col-span-7 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/40">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-8">
                                Indice de Retención Temporal (LTV)
                            </h3>
                            <div className="relative h-[300px]">
                                <RetentionLineChart retentionData={data.comportamientoClientes.retencion_mensual} />
                            </div>
                        </div>

                        {/* Frecuencia de Compra Segmentada */}
                        <div className="lg:col-span-5 bg-sky-500 text-white p-8 border-none shadow-2xl shadow-sky-100 rounded-[2.5rem] relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/50 rounded-full -mr-16 -mt-16 blur-xl group-hover:bg-sky-400/50 transition-all duration-700"></div>
                            <h3 className="text-xs font-black text-white uppercase tracking-widest mb-8 relative z-10">
                                Elasticidad de Frecuencia (Días)
                            </h3>
                            <FrequencyBars segments={data.comportamientoClientes.frecuencia_segmentos} />
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};
