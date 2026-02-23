'use client';

import React, { useEffect } from 'react';
import ModuleHeader from '@/components/layout/shared/ModuleHeader';
import { useSellerFinance } from '@/hooks/useSellerFinance';
import FinanceChart from './components/FinanceChart';

export default function FinancePage() {
    const {
        data,
        isLoading,
        filters,
        setFilters,
        applyFilters,
        activeTab,
        setActiveTab,
        isVisible
    } = useSellerFinance();

    const headerActions = (
        <div className="flex gap-2 bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20">
            <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters(e.target.value, filters.endDate)}
                className="text-xs bg-transparent border-none focus:ring-0 text-white placeholder-white/50 cursor-pointer"
            />
            <span className="text-white/30">|</span>
            <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters(filters.startDate, e.target.value)}
                className="text-xs bg-transparent border-none focus:ring-0 text-white placeholder-white/50 cursor-pointer"
            />
            <button
                onClick={applyFilters}
                className="p-2 bg-white/20 text-white rounded-xl hover:bg-white/30 transition active:scale-95"
            >
                <i className="ph ph-magnifying-glass"></i>
            </button>
        </div>
    );

    if (isLoading && !data) {
        return (
            <div className="p-20 flex flex-col items-center justify-center animate-pulse">
                <i className="ph ph-circle-notch animate-spin text-4xl text-indigo-500 mb-4"></i>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Sincronizando Finanzas...</p>
            </div>
        );
    }

    if (!data) return null;

    const tabs = [
        { id: 'all', label: 'Todos', icon: 'ph-squares-four' },
        { id: 'monetario', label: 'Monetario', icon: 'ph-money' },
        { id: 'logistica', label: 'Logística', icon: 'ph-truck' },
        { id: 'calidad', label: 'Calidad', icon: 'ph-check-circle' },
        { id: 'fidelizacion', label: 'Fidelización', icon: 'ph-users-four' },
        { id: 'servicio', label: 'Servicio', icon: 'ph-chat-circle-dots' },
        { id: 'crecimiento', label: 'Crecimiento', icon: 'ph-trend-up' },
        { id: 'inventario', label: 'Inventario', icon: 'ph-package' },
        { id: 'satisfaccion', label: 'Satisfacción', icon: 'ph-smiley' }
    ];

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(val);
    };

    return (
        <div className="space-y-8 animate-fadeIn pb-20 font-industrial">
            <ModuleHeader
                title="Centro de Finanzas"
                subtitle="Monitoreo en tiempo real de tus KPIs estratégicos"
                icon="ph-chart-pie"
                actions={headerActions}
            />

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 pb-4 overflow-x-auto no-scrollbar">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-6 py-3 rounded-2xl text-[10px] font-black whitespace-nowrap transition-all duration-300 flex items-center gap-2 uppercase tracking-widest ${activeTab === tab.id
                            ? 'bg-gray-900 text-white shadow-xl'
                            : 'text-gray-400 bg-white border border-gray-100 hover:bg-gray-50'
                            }`}
                    >
                        <i className={`ph ${tab.icon}`}></i> {tab.label}
                    </button>
                ))}
            </div>

            <div className="space-y-12">
                {/* 1. MONETARIO */}
                {isVisible('monetario') && (
                    <div className="space-y-6">
                        <SectionHeader label="Análisis Monetario" color="indigo" />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <KPIChartCard
                                title="Ingresos Brutos"
                                value={formatCurrency(data.ingresosBrutos.data.reduce((a, b) => a + b, 0))}
                                detail="Total de ventas acumuladas"
                                chart={<FinanceChart type="line" labels={data.ingresosBrutos.labels} data={data.ingresosBrutos.data} color="#6366F1" />}
                                color="indigo"
                            />
                            <KPIChartCard
                                title="Ingresos Netos"
                                value={formatCurrency(data.ingresosNetos.data.reduce((a, b) => a + b, 0))}
                                detail="Monto neto después de comisiones"
                                chart={<FinanceChart type="line" labels={data.ingresosNetos.labels} data={data.ingresosNetos.data} color="#10B981" />}
                                color="emerald"
                            />
                            <CardProxPago data={data.chartProxPago} formatCurrency={formatCurrency} />
                            <KPIChartCard
                                title="ROI de Ventas"
                                value={data.ingresosBrutos.trend || '0%'}
                                detail="Retorno sobre la inversión"
                                chart={<FinanceChart type="line" labels={data.roi.labels} data={data.roi.data} color="#6366F1" />}
                                color="indigo"
                            />
                            <KPIChartCard
                                title="Ventas Totales"
                                value={data.ventasTotales.data.reduce((a, b) => a + b, 0).toString()}
                                detail="Número de transacciones"
                                chart={<FinanceChart type="bar" labels={data.ventasTotales.labels} data={data.ventasTotales.data} color="#10B981" />}
                                color="emerald"
                            />
                            <KPIChartCard
                                title="Ticket Promedio"
                                value={formatCurrency(data.ingresosBrutos.data.reduce((a, b) => a + b, 0) / Math.max(1, data.ventasTotales.data.reduce((a, b) => a + b, 0)))}
                                detail="Valor medio por pedido"
                                chart={<FinanceChart type="line" labels={data.ticketPromedio.labels} data={data.ticketPromedio.data} color="#6366F1" />}
                                color="indigo"
                            />
                        </div>
                    </div>
                )}

                {/* 2. LOGÍSTICA */}
                {isVisible('logistica') && (
                    <div className="space-y-6">
                        <SectionHeader label="Rendimiento Logístico" color="sky" />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <KPIChartCard
                                title="Lead Time Despacho"
                                value={`${data.leadTime.data[data.leadTime.data.length - 1]}h`}
                                detail="Tiempo promedio desde pedido a despacho"
                                chart={<FinanceChart type="bar" labels={data.leadTime.labels} data={data.leadTime.data} color="#0EA5E9" />}
                                color="sky"
                            />
                        </div>
                    </div>
                )}

                {/* 3. CALIDAD */}
                {isVisible('calidad') && (
                    <div className="space-y-6">
                        <SectionHeader label="Control de Calidad" color="emerald" />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl flex flex-col items-center">
                                <div className="flex items-center justify-between w-full mb-6">
                                    <span className="text-xs font-black text-emerald-500 uppercase tracking-widest">Tasa de Defectuosos</span>
                                    <div className="bg-emerald-50 p-2 rounded-xl text-emerald-500"><i className="ph ph-warning-octagon text-xl"></i></div>
                                </div>
                                <div className="w-full h-[200px]">
                                    <FinanceChart type="bar" labels={data.defectuosos.labels} data={data.defectuosos.data} color="#10B981" />
                                </div>
                                <p className="text-4xl font-black text-emerald-500 mt-6">{data.defectuosos.data[data.defectuosos.data.length - 1]}%</p>
                                <p className="text-[10px] text-gray-400 mt-2 font-black uppercase tracking-widest">Productos con reportes de fallas</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* 4. FIDELIZACIÓN */}
                {isVisible('fidelizacion') && (
                    <div className="space-y-6">
                        <SectionHeader label="Fidelización de Clientes" color="indigo" />
                        <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                                <div>
                                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter italic">Top Clientes</h3>
                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Ranking de rendimiento estratégico</p>
                                </div>
                                <select className="text-[10px] border-gray-100 bg-gray-50 rounded-2xl font-black uppercase px-4 py-2 outline-none">
                                    <option>Total Gastado</option>
                                    <option>N° de Pedidos</option>
                                </select>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-50 uppercase text-[10px] font-black text-gray-400">
                                            <th className="pb-4 text-left pl-4">Cliente</th>
                                            <th className="pb-4 text-left">Métrica</th>
                                            <th className="pb-4 text-left">Progreso</th>
                                            <th className="pb-4 text-right pr-4">Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {[
                                            { name: 'Juan Delgado', initials: 'JD', category: 'Premium', metric: 'S/ 12,450.00', progress: 85 },
                                            { name: 'María Flores', initials: 'MF', category: 'Frecuente', metric: 'S/ 8,200.00', progress: 65 },
                                            { name: 'Agrícola Santa María', initials: 'AS', category: 'Corporativo', metric: 'S/ 25,100.00', progress: 95 }
                                        ].map((c) => (
                                            <tr key={c.name} className="hover:bg-indigo-50/30 transition-all group">
                                                <td className="py-4 pl-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-[1rem] bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-xs border border-indigo-100 shadow-sm group-hover:scale-110 transition-transform">{c.initials}</div>
                                                        <div>
                                                            <p className="font-black text-gray-800 text-xs uppercase tracking-tight">{c.name}</p>
                                                            <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">{c.category}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 font-black text-gray-700 text-sm">{c.metric}</td>
                                                <td className="py-4 w-48">
                                                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                                        <div className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full" style={{ width: `${c.progress}%` }}></div>
                                                    </div>
                                                </td>
                                                <td className="py-4 text-right pr-4">
                                                    <button className="w-8 h-8 rounded-xl bg-gray-50 text-gray-300 hover:bg-indigo-500 hover:text-white transition-all flex items-center justify-center">
                                                        <i className="ph ph-eye font-bold"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl md:col-span-2">
                                <div className="flex flex-col md:flex-row gap-8 items-center">
                                    <div className="md:w-1/3 space-y-4">
                                        <div className="flex items-center gap-2">
                                            <div className="bg-indigo-50 p-2 rounded-xl text-indigo-500"><i className="ph ph-users-four text-xl"></i></div>
                                            <span className="text-xs font-black text-indigo-500 uppercase tracking-widest">Customer LTV</span>
                                        </div>
                                        <h3 className="text-4xl font-black text-gray-800">{formatCurrency(data.ltv.data[data.ltv.data.length - 1])}</h3>
                                        <p className="text-[10px] text-gray-400 font-black uppercase leading-relaxed">Valor proyectado por cliente activo basado en su historial de compras y recurrencia.</p>
                                    </div>
                                    <div className="md:w-2/3 w-full h-[300px]">
                                        <FinanceChart type="line" labels={data.ltv.labels} data={data.ltv.data} color="#6366F1" height="300px" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 5. SERVICIO */}
                {isVisible('servicio') && (
                    <div className="space-y-6">
                        <SectionHeader label="Servicio al Cliente" color="emerald" />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl flex flex-col items-center">
                                <div className="flex items-center justify-between w-full mb-6">
                                    <span className="text-xs font-black text-emerald-500 uppercase tracking-widest">Tiempo de Respuesta</span>
                                    <div className="bg-emerald-50 p-2 rounded-xl text-emerald-500"><i className="ph ph-chat-circle-dots text-xl"></i></div>
                                </div>
                                <div className="relative flex items-center justify-center w-full h-[200px]">
                                    <FinanceChart type="line" labels={data.tiempoRespuesta.labels} data={data.tiempoRespuesta.data} color="#10B981" />
                                    <div className="absolute text-center mt-6">
                                        <span className="text-2xl font-black text-gray-800">{data.tiempoRespuesta.data[data.tiempoRespuesta.data.length - 1]} min</span>
                                    </div>
                                </div>
                                <p className="text-[10px] text-gray-400 mt-6 font-black uppercase tracking-widest">Promedio de respuesta en Chat</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* 6. CRECIMIENTO */}
                {isVisible('crecimiento') && (
                    <div className="space-y-6">
                        <SectionHeader label="Estrategia de Crecimiento" color="rose" />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl md:col-span-2">
                                <div className="flex flex-col md:flex-row gap-8 items-center">
                                    <div className="md:w-1/3 space-y-4">
                                        <div className="flex items-center gap-2">
                                            <div className="bg-emerald-50 p-2 rounded-xl text-emerald-500"><i className="ph ph-chart-pie-slice text-xl"></i></div>
                                            <span className="text-xs font-black text-emerald-500 uppercase tracking-widest">Cuota de Mercado</span>
                                        </div>
                                        <h3 className="text-4xl font-black text-gray-800">{data.cuotaMercado.data[0]}%</h3>
                                        <p className="text-[10px] text-gray-400 font-black uppercase leading-relaxed">Participación de tus productos dentro de las categorías del marketplace.</p>
                                    </div>
                                    <div className="md:w-2/3 w-full h-[300px]">
                                        <FinanceChart type="radar" labels={data.cuotaMercado.labels} data={data.cuotaMercado.data} color="#10B981" height="300px" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 7. INVENTARIO */}
                {isVisible('inventario') && (
                    <div className="space-y-6">
                        <SectionHeader label="Control de Inventario" color="indigo" />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl flex flex-col">
                                <div className="flex items-center justify-between mb-6">
                                    <span className="text-xs font-black text-indigo-500 uppercase tracking-widest">Rotación de Stock</span>
                                    <div className="bg-indigo-50 p-2 rounded-xl text-indigo-500"><i className="ph ph-package text-xl"></i></div>
                                </div>
                                <div className="flex items-baseline gap-2 mb-4">
                                    <h3 className="text-4xl font-black text-gray-800">{data.stockRotacion.data[data.stockRotacion.data.length - 1]?.toFixed(1) || 0}x</h3>
                                    <span className="text-xs text-gray-400 font-black uppercase tracking-widest">Veces/Mes</span>
                                </div>
                                <div className="w-full h-[200px]">
                                    <FinanceChart type="bar" labels={data.stockRotacion.labels} data={data.stockRotacion.data} color="#6366F1" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 8. SATISFACCIÓN */}
                {isVisible('satisfaccion') && (
                    <div className="space-y-6">
                        <SectionHeader label="Experiencia del Cliente" color="indigo" />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl flex flex-col h-full justify-between text-center items-center">
                                <span className="text-xs font-black text-indigo-500 uppercase tracking-widest text-left w-full mb-8">Nivel Satisfacción (CSAT)</span>
                                <div className="bg-indigo-50 w-24 h-24 rounded-[2rem] flex items-center justify-center mb-6 border border-indigo-100">
                                    <i className="ph ph-smiley text-5xl text-indigo-500"></i>
                                </div>
                                <div className="py-2">
                                    <div className="text-4xl text-amber-400 mb-2 flex justify-center gap-1">
                                        <i className="ph ph-star-fill"></i>
                                        <i className="ph ph-star-fill"></i>
                                        <i className="ph ph-star-fill"></i>
                                        <i className="ph ph-star-fill"></i>
                                        <i className="ph ph-star-half-fill"></i>
                                    </div>
                                    <span className="text-6xl font-black text-gray-800 tracking-tighter">4.5</span>
                                </div>
                                <p className="text-[10px] text-gray-400 mt-8 font-black uppercase tracking-widest">Basado en últimas reseñas y feedback directo</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function SectionHeader({ label, color }: { label: string, color: 'indigo' | 'sky' | 'emerald' | 'rose' }) {
    const bar = {
        indigo: 'bg-indigo-500',
        sky: 'bg-sky-500',
        emerald: 'bg-emerald-500',
        rose: 'bg-rose-500'
    }[color];
    return (
        <div className="flex items-center gap-3 mb-2">
            <div className={`w-1.5 h-6 ${bar} rounded-full`}></div>
            <h2 className="text-lg font-black text-gray-800 uppercase tracking-tighter italic">{label}</h2>
        </div>
    );
}

function KPIChartCard({ title, value, detail, chart, color }: { title: string, value: string, detail: string, chart: React.ReactNode, color: 'indigo' | 'sky' | 'emerald' }) {
    const accent = {
        indigo: { text: 'text-indigo-500', bg: 'bg-indigo-50', icon: 'ph-money', border: 'border-t-indigo-500' },
        sky: { text: 'text-sky-500', bg: 'bg-sky-50', icon: 'ph-money', border: 'border-t-sky-500' },
        emerald: { text: 'text-emerald-500', bg: 'bg-emerald-50', icon: 'ph-chart-line-up', border: 'border-t-emerald-500' },
    }[color];

    return (
        <div className={`bg-white p-6 border-t-4 ${accent.border} rounded-[2.5rem] border border-gray-100 shadow-xl flex flex-col h-full hover:shadow-2xl transition-all`}>
            <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-black uppercase tracking-widest ${accent.text}`}>{title}</span>
                <div className={`${accent.bg} p-2 rounded-[0.75rem] ${accent.text}`}>
                    <i className={`ph ${accent.icon} text-xl`}></i>
                </div>
            </div>
            <h3 className="text-4xl font-black text-gray-800">{value}</h3>
            <p className="text-[10px] text-gray-400 mb-4 font-black uppercase tracking-widest">{detail}</p>
            <div className="flex-1 min-h-[200px]">
                {chart}
            </div>
        </div>
    );
}

function CardProxPago({ data, formatCurrency }: { data: any, formatCurrency: any }) {
    if (!data) return null;
    return (
        <div className="bg-white p-6 border-t-4 border-t-indigo-500 rounded-[2.5rem] border border-gray-100 shadow-xl flex flex-col h-full hover:shadow-2xl transition-all">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Próximo Pago</span>
                    <h3 className="text-4xl font-black text-gray-800">Recaudado</h3>
                </div>
                <div className="bg-indigo-50 p-2 rounded-[0.75rem] text-indigo-500"><i className="ph ph-calendar-check text-xl"></i></div>
            </div>
            <div className="relative flex items-center justify-center h-[200px] mt-4">
                <FinanceChart type="doughnut" labels={data.labels} data={data.data} color="#6366F1" cutout="75%" />
                <div className="absolute text-center mt-6">
                    <span className="text-sm font-black text-gray-800">{formatCurrency(data.data[0])}</span>
                </div>
            </div>
            <p className="text-[10px] text-center text-gray-400 mt-2 font-black uppercase tracking-widest">Corte: Lunes a Miércoles</p>
        </div>
    );
}
