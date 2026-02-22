'use client';

import React from 'react';
import ModuleHeader from '@/components/layout/shared/ModuleHeader';
import FinanceChart from './components/FinanceChart';
import { useToast } from '@/context/ToastContext';
import BaseLoading from '@/components/ui/BaseLoading';
import BaseStatCard from '@/components/ui/BaseStatCard';
import Icon from '@/components/ui/Icon';
import { useSellerFinance } from '@/hooks/useSellerFinance';

export default function FinancePage() {
    const {
        data,
        isLoading,
        activeTab,
        setActiveTab,
        filters,
        setFilters,
        applyFilters: hookApplyFilters,
        isVisible
    } = useSellerFinance();

    const { showToast } = useToast();

    const handleApplyFilters = async () => {
        const success = await hookApplyFilters();
        if (!success) {
            showToast('Selecciona un rango de fechas completo', 'info');
        } else {
            showToast('Datos sincronizados según el periodo seleccionado', 'success');
        }
    };

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
                onClick={handleApplyFilters}
                className="p-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition active:scale-95"
            >
                <Icon name="Search" className="w-4 h-4" />
            </button>
        </div>
    );

    if (isLoading && !data) {
        return <BaseLoading message="Sincronizando Finanzas..." fullPage />;
    }

    if (!data) return null;

    const tabs = [
        { id: 'all', label: 'Todos', icon: 'LayoutGrid' },
        { id: 'monetario', label: 'Monetario', icon: 'Banknote' },
        { id: 'logistica', label: 'Logística', icon: 'Truck' },
        { id: 'calidad', label: 'Calidad', icon: 'CheckCircle2' },
        { id: 'fidelizacion', label: 'Fidelización', icon: 'Users' },
        { id: 'servicio', label: 'Servicio', icon: 'MessageCircle' },
        { id: 'crecimiento', label: 'Crecimiento', icon: 'TrendingUp' },
        { id: 'inventario', label: 'Inventario', icon: 'Package' },
        { id: 'satisfaccion', label: 'Satisfacción', icon: 'Smile' }
    ];

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(val);
    };



    return (
        <div className="space-y-8 animate-fadeIn pb-12">
            <ModuleHeader
                title="Centro de Finanzas y Estadísticas"
                subtitle="Monitoreo en tiempo real de tus KPIs estratégicos"
                icon="PieChart"
                actions={headerActions}
            />

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-gray-100 pb-4 overflow-x-auto no-scrollbar">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-6 py-2.5 rounded-xl text-sm font-black whitespace-nowrap transition-all duration-300 flex items-center gap-2 ${activeTab === tab.id
                            ? 'bg-sky-500 text-white shadow-lg shadow-sky-100'
                            : 'text-gray-400 bg-white border border-gray-100 hover:bg-gray-50'
                            }`}
                    >
                        <Icon name={tab.icon as any} className="w-4 h-4" /> {tab.label}
                    </button>
                ))}
            </div>

            <div className="space-y-12">
                {/* 1. MONETARIO */}
                {isVisible('monetario') && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-1.5 h-6 bg-sky-500 rounded-full"></div>
                            <h2 className="text-lg font-black text-gray-800 uppercase tracking-tight">Análisis Monetario</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <BaseStatCard
                                label="Ingresos Brutos"
                                value={formatCurrency(data.ingresosBrutos.data.reduce((a, b) => a + b, 0))}
                                description="Total de ventas acumuladas"
                                icon="Banknote"
                                color="sky"
                                chart={<FinanceChart type="line" labels={data.ingresosBrutos.labels} data={data.ingresosBrutos.data} color="#0EA5E9" />}
                            />
                            <BaseStatCard
                                label="Ingresos Netos"
                                value={formatCurrency(data.ingresosNetos.data.reduce((a, b) => a + b, 0))}
                                description="Monto neto después de comisiones"
                                icon="LineChart"
                                color="emerald"
                                chart={<FinanceChart type="line" labels={data.ingresosNetos.labels} data={data.ingresosNetos.data} color="#10B981" />}
                            />
                            <CardProxPago data={data.chartProxPago} formatCurrency={formatCurrency} />

                            <BaseStatCard
                                label="ROI de Ventas"
                                value={data.ingresosBrutos.trend || '0%'}
                                description="Retorno sobre la inversión"
                                icon="TrendingUp"
                                color="sky"
                                chart={<FinanceChart type="line" labels={data.roi.labels} data={data.roi.data} color="#0EA5E9" />}
                            />
                            <BaseStatCard
                                label="Ventas Totales"
                                value={data.ventasTotales.data.reduce((a, b) => a + b, 0).toString()}
                                description="Número de transacciones"
                                icon="ShoppingCart"
                                color="emerald"
                                suffix="Ord."
                                chart={<FinanceChart type="bar" labels={data.ventasTotales.labels} data={data.ventasTotales.data} color="#10B981" />}
                            />
                            <BaseStatCard
                                label="Ticket Promedio"
                                value={formatCurrency(data.ingresosBrutos.data.reduce((a, b) => a + b, 0) / data.ventasTotales.data.reduce((a, b) => a + b, 0))}
                                description="Valor medio por pedido"
                                icon="Tag"
                                color="sky"
                                chart={<FinanceChart type="line" labels={data.ticketPromedio.labels} data={data.ticketPromedio.data} color="#0EA5E9" />}
                            />
                        </div>
                    </div>
                )}

                {/* 2. LOGÍSTICA */}
                {isVisible('logistica') && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-1.5 h-6 bg-sky-500 rounded-full"></div>
                            <h2 className="text-lg font-black text-gray-800 uppercase tracking-tight">Rendimiento Logístico</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <BaseStatCard
                                label="Lead Time Despacho"
                                value={`${data.leadTime.data[data.leadTime.data.length - 1]}h`}
                                description="Tiempo promedio desde pedido a despacho"
                                icon="Timer"
                                color="sky"
                                chart={<FinanceChart type="bar" labels={data.leadTime.labels} data={data.leadTime.data} color="#0EA5E9" />}
                            />
                        </div>
                    </div>
                )}

                {/* 3. CALIDAD */}
                {isVisible('calidad') && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-1.5 h-6 bg-emerald-400 rounded-full"></div>
                            <h2 className="text-lg font-black text-gray-800 uppercase tracking-tight">Control de Calidad</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="glass-card p-8 border-l-4 border-emerald-400 bg-white flex flex-col items-center rounded-[2.5rem]">
                                <div className="flex items-center justify-between w-full mb-6">
                                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Tasa de Defectuosos</span>
                                    <div className="bg-emerald-100 p-2 rounded-lg text-emerald-400"><Icon name="AlertOctagon" className="text-xl w-5 h-5" /></div>
                                </div>
                                <div className="w-full h-[200px]">
                                    <FinanceChart type="bar" labels={data.defectuosos.labels} data={data.defectuosos.data} color="#10B981" />
                                </div>
                                <p className="text-4xl font-black text-emerald-400 mt-6">{data.defectuosos.data[data.defectuosos.data.length - 1]}%</p>
                                <p className="text-xs text-gray-400 mt-2 font-bold uppercase tracking-widest">Productos con reportes de fallas</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* 4. FIDELIZACIÓN */}
                {isVisible('fidelizacion') && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-1.5 h-6 bg-sky-500 rounded-full"></div>
                            <h2 className="text-lg font-black text-gray-800 uppercase tracking-tight">Fidelización de Clientes</h2>
                        </div>

                        {/* Top Clientes Table */}
                        <div className="glass-card p-6 bg-white overflow-hidden rounded-[2.5rem] border border-gray-100 shadow-sm">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                                <div>
                                    <h3 className="text-xl font-black text-sky-500">Top Clientes</h3>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Ranking de rendimiento estratégico</p>
                                </div>
                                <select className="text-xs border-gray-100 bg-gray-50 rounded-xl focus:ring-sky-500 font-black uppercase px-4 py-2">
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
                                    <tbody>
                                        {[
                                            { name: 'Juan Delgado', initials: 'JD', category: 'Premium', metric: 'S/ 12,450.00', progress: 85 },
                                            { name: 'María Flores', initials: 'MF', category: 'Frecuente', metric: 'S/ 8,200.00', progress: 65 },
                                            { name: 'Agrícola Santa María', initials: 'AS', category: 'Corporativo', metric: 'S/ 25,100.00', progress: 95 }
                                        ].map((c) => (
                                            <tr key={c.name} className="border-b border-gray-50 hover:bg-sky-50/30 transition-all group">
                                                <td className="py-4 pl-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-600 font-black text-xs border border-sky-100 shadow-sm group-hover:scale-110 transition-transform">{c.initials}</div>
                                                        <div>
                                                            <p className="font-black text-gray-800 text-xs uppercase tracking-tight">{c.name}</p>
                                                            <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">{c.category}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 font-black text-gray-700 text-sm">{c.metric}</td>
                                                <td className="py-4 w-48">
                                                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                                        <div className="h-full bg-gradient-to-r from-sky-400 to-cyan-400 rounded-full" style={{ width: `${c.progress}%` }}></div>
                                                    </div>
                                                </td>
                                                <td className="py-4 text-right pr-4">
                                                    <button className="w-8 h-8 rounded-xl bg-gray-50 text-gray-300 hover:bg-sky-500 hover:text-white transition-all flex items-center justify-center">
                                                        <Icon name="Eye" className="font-bold w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="glass-card p-8 border-l-4 border-sky-500 bg-white md:col-span-2 rounded-[2.5rem]">
                                <div className="flex flex-col md:flex-row gap-8 items-center">
                                    <div className="md:w-1/3 space-y-4">
                                        <div className="flex items-center gap-2">
                                            <div className="bg-sky-100 p-2 rounded-lg text-sky-500"><Icon name="Users" className="text-xl w-5 h-5" /></div>
                                            <span className="text-xs font-black text-sky-500 uppercase tracking-widest">Customer LTV</span>
                                        </div>
                                        <h3 className="text-4xl font-black text-gray-800">{formatCurrency(data.ltv.data[data.ltv.data.length - 1])}</h3>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase leading-relaxed">Valor proyectado por cliente activo basado en su historial de compras y recurrencia.</p>
                                    </div>
                                    <div className="md:w-2/3 w-full h-[300px]">
                                        <FinanceChart type="line" labels={data.ltv.labels} data={data.ltv.data} color="#0EA5E9" height="300px" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 5. SERVICIO */}
                {isVisible('servicio') && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-1.5 h-6 bg-emerald-400 rounded-full"></div>
                            <h2 className="text-lg font-black text-gray-800 uppercase tracking-tight">Servicio al Cliente</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="glass-card p-8 border-l-4 border-emerald-400 bg-white flex flex-col items-center rounded-[2.5rem]">
                                <div className="flex items-center justify-between w-full mb-6">
                                    <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">Tiempo de Respuesta</span>
                                    <div className="bg-emerald-50 p-2 rounded-lg text-emerald-500"><Icon name="MessageCircle" className="text-xl w-5 h-5" /></div>
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
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-1.5 h-6 bg-rose-500 rounded-full"></div>
                            <h2 className="text-lg font-black text-gray-800 uppercase tracking-tight">Estrategia de Crecimiento</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="glass-card p-8 border-l-4 border-emerald-400 bg-white md:col-span-2 rounded-[2.5rem]">
                                <div className="flex flex-col md:flex-row gap-8 items-center">
                                    <div className="md:w-1/3 space-y-4">
                                        <div className="flex items-center gap-2">
                                            <div className="bg-emerald-50 p-2 rounded-lg text-emerald-500"><Icon name="PieChart" className="text-xl w-5 h-5" /></div>
                                            <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">Cuota de Mercado</span>
                                        </div>
                                        <h3 className="text-4xl font-black text-gray-800">{data.cuotaMercado.data[0]}%</h3>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase leading-relaxed">Participación de tus productos dentro de las categorías del marketplace.</p>
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
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-1.5 h-6 bg-sky-500 rounded-full"></div>
                            <h2 className="text-lg font-black text-gray-800 uppercase tracking-tight">Control de Inventario</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="glass-card p-8 border-l-4 border-sky-500 bg-white flex flex-col rounded-[2.5rem]">
                                <div className="flex items-center justify-between mb-6">
                                    <span className="text-xs font-black text-sky-500 uppercase tracking-widest">Rotación de Stock</span>
                                    <div className="bg-sky-50 p-2 rounded-lg text-sky-500"><Icon name="Package" className="text-xl w-5 h-5" /></div>
                                </div>
                                <div className="flex items-baseline gap-2 mb-4">
                                    <h3 className="text-4xl font-black text-gray-800">{data.stockRotacion.data[data.stockRotacion.data.length - 1].toFixed(1)}x</h3>
                                    <span className="text-xs text-gray-400 font-black uppercase tracking-widest">Veces/Mes</span>
                                </div>
                                <div className="w-full h-[200px]">
                                    <FinanceChart type="bar" labels={data.stockRotacion.labels} data={data.stockRotacion.data} color="#0EA5E9" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 8. SATISFACCIÓN */}
                {isVisible('satisfaccion') && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-1.5 h-6 bg-sky-500 rounded-full"></div>
                            <h2 className="text-lg font-black text-gray-800 uppercase tracking-tight">Experiencia del Cliente</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="glass-card p-8 border-l-4 border-sky-500 bg-white flex flex-col h-full justify-between text-center items-center rounded-[2.5rem]">
                                <span className="text-xs font-black text-sky-500 uppercase tracking-widest text-left w-full mb-8">Nivel Satisfacción (CSAT)</span>
                                <div className="bg-sky-50 w-24 h-24 rounded-full flex items-center justify-center mb-6">
                                    <Icon name="Smile" className="text-5xl text-sky-500 w-12 h-12" />
                                </div>
                                <div className="py-2">
                                    <div className="text-4xl text-sky-500 mb-2 flex justify-center gap-1">
                                        <Icon name="Star" className="fill-current w-4 h-4" />
                                        <Icon name="Star" className="fill-current w-4 h-4" />
                                        <Icon name="Star" className="fill-current w-4 h-4" />
                                        <Icon name="Star" className="fill-current w-4 h-4" />
                                        <Icon name="StarHalf" className="fill-current w-4 h-4" />
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

// ── Sub-componentes estandarizados ──

function CardProxPago({ data, formatCurrency }: { data: { labels: string[]; data: number[] }; formatCurrency: (val: number) => string }) {
    return (
        <div className="bg-white p-8 rounded-[2.5rem] border border-sky-100/50 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-full -mr-16 -mt-16 blur-2xl transition-all duration-700 group-hover:scale-150"></div>

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 bg-sky-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-sky-100 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                        <Icon name="CalendarCheck" className="text-2xl w-6 h-6" />
                    </div>
                </div>

                <div className="space-y-1">
                    <h3 className="text-4xl font-black text-gray-800 tracking-tighter leading-none">Recaudado</h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Próximo Pago</p>
                </div>

                <div className="relative flex items-center justify-center h-[200px] mt-6">
                    <FinanceChart type="doughnut" labels={data.labels} data={data.data} color="#0EA5E9" cutout="75%" />
                    <div className="absolute text-center mt-6">
                        <span className="text-sm font-black text-gray-800">{formatCurrency(data.data[0])}</span>
                    </div>
                </div>
                <p className="text-[9px] text-center text-gray-300 mt-4 font-black uppercase tracking-widest italic leading-none">Corte: Lunes a Miércoles</p>
            </div>
        </div>
    );
}
