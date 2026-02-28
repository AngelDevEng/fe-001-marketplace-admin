import React from 'react';
import { SellerAnalytics, CatalogProduct, GeographicZone, AnalyticsKPI } from '@/features/admin/analytics/types';
import {
    ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, ResponsiveContainer, Cell,
    AreaChart, Area
} from 'recharts';
import { TrendingUp, Magnet, Filter as Funnel, Store as Storefront, Star, Skull, BarChart3, TrendingDown } from 'lucide-react';

export const KpiCard: React.FC<{ kpi: AnalyticsKPI }> = ({ kpi }) => {
    const MapIcon = (iconName: string) => {
        switch (iconName) {
            case 'ChartLineUp': return <TrendingUp className="w-8 h-8" />;
            case 'Magnet': return <Magnet className="w-8 h-8" />;
            case 'Funnel': return <Funnel className="w-8 h-8" />;
            case 'Storefront': return <Storefront className="w-8 h-8" />;
            default: return <BarChart3 className="w-8 h-8" />;
        }
    }

    return (
        <div className="bg-white p-6 border-l-4 border-indigo-500 transition-all hover:-translate-y-1 rounded-2xl shadow-sm font-industrial">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 bg-${kpi.color}-50 text-${kpi.color}-600 rounded-2xl`}>
                    {MapIcon(kpi.icon)}
                </div>
            </div>
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{kpi.label}</h3>
            <p className="text-2xl font-black text-gray-800 tracking-tighter">{kpi.val}</p>
        </div>
    );
}

// Scatter Chart: ROI vs Conversion (RF-10) using Recharts
export const ScatterPerformanceChart: React.FC<{ sellers: SellerAnalytics[] }> = ({ sellers }) => {

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-gray-900 text-white p-3 rounded-xl text-xs font-industrial">
                    <p className="font-bold mb-1 uppercase tracking-widest text-[#0ea5e9]">{data.nombre}</p>
                    <p>Conv: {data.conversion}% | ROI: {data.roi}%</p>
                    <p className={data.crecimiento > 0 ? 'text-emerald-400' : 'text-red-400'}>Crecimiento: {data.crecimiento}%</p>
                </div>
            );
        }
        return null;
    };

    return (
        <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis
                    dataKey="conversion"
                    type="number"
                    name="Conversión"
                    unit="%"
                    tick={{ fontSize: 10, fontWeight: 'bold', fill: '#9CA3AF' }}
                    axisLine={false}
                    tickLine={false}
                />
                <YAxis
                    dataKey="roi"
                    type="number"
                    name="ROI"
                    unit="%"
                    tick={{ fontSize: 10, fontWeight: 'bold', fill: '#9CA3AF' }}
                    axisLine={false}
                    tickLine={false}
                />
                <RTooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                <Scatter name="Vendedores" data={sellers}>
                    {sellers.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.crecimiento > 0 ? '#0ea5e9' : '#ef4444'} />
                    ))}
                </Scatter>
            </ScatterChart>
        </ResponsiveContainer>
    );
};

// Retention Area Chart using Recharts
export const RetentionLineChart: React.FC<{ retentionData: { mes: string; retencion: number }[] }> = ({ retentionData }) => {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={retentionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorRetencion" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <XAxis
                    dataKey="mes"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fontWeight: 'bold', fill: '#9CA3AF' }}
                />
                <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fontWeight: 'bold', fill: '#9CA3AF' }}
                    tickFormatter={(v) => `${v}%`}
                />
                <RTooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                    itemStyle={{ fontWeight: 'bold', color: '#6366f1' }}
                    formatter={(val: any) => [`${val}%`, 'Retención'] as any}
                />
                <Area type="monotone" dataKey="retencion" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRetencion)" />
            </AreaChart>
        </ResponsiveContainer>
    );
};


// Catalog Performance List (RF-10)
export const CatalogPerformanceList: React.FC<{ products: CatalogProduct[] }> = ({ products }) => (
    <div className="flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar font-industrial">
        {products.map(p => (
            <div key={p.id} className="flex items-center gap-4 group">
                <div className={`w-10 h-10 rounded-xl ${p.tipo === 'estrella' ? 'bg-amber-50 text-amber-500' : 'bg-gray-50 text-gray-400'} flex items-center justify-center`}>
                    {p.tipo === 'estrella' ? <Star className="w-5 h-5" /> : <Skull className="w-5 h-5" />}
                </div>
                <div className="flex-1">
                    <p className="text-xs font-black text-gray-800 leading-none mb-1 uppercase tracking-tight">{p.nombre}</p>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{p.ventas} Ventas Totales</p>
                </div>
                <div className="text-right">
                    <p className={`text-xs font-black ${p.tipo === 'estrella' ? 'text-emerald-500' : 'text-red-400'}`}>{p.rotacion}%</p>
                    <p className="text-[8px] font-black text-gray-300 uppercase">Rotación</p>
                </div>
            </div>
        ))}
    </div>
);

// Seller Leaderboard (RF-10)
export const SellerLeaderboard: React.FC<{ sellers: SellerAnalytics[] }> = ({ sellers }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-industrial">
        {sellers.map((v, idx) => (
            <div key={v.id} className="bg-white p-6 bg-gray-50/50 border-none rounded-2xl shadow-sm hover:scale-[1.02] transition-transform">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black text-gray-300">RANK #0{idx + 1}</span>
                    <span className="text-[10px] font-black text-sky-500 uppercase tracking-widest">{v.rubro}</span>
                </div>
                <p className="text-xs font-black text-gray-800 mb-4 truncate uppercase tracking-tight">{v.nombre}</p>
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase leading-none mb-1">ROI</p>
                        <p className="text-lg font-black text-gray-900">{v.roi}%</p>
                    </div>
                    <div>
                        {v.crecimiento > 0 ? <TrendingUp className="w-6 h-6 text-emerald-400" /> : <TrendingDown className="w-6 h-6 text-red-400" />}
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-bold text-gray-400 uppercase leading-none mb-1">Conv.</p>
                        <p className="text-lg font-black text-emerald-500">{v.conversion}%</p>
                    </div>
                </div>
            </div>
        ))}
    </div>
);

// Geographic Map Bars (RF-11)
export const GeographicMapBars: React.FC<{ zones: GeographicZone[] }> = ({ zones }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 font-industrial">
        {zones.map(z => (
            <div key={z.zona} className="flex flex-col gap-3">
                <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest truncate max-w-[70%]">{z.zona}</span>
                    <span className="text-xs font-black text-gray-800">{z.demanda} ped.</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full transition-all duration-1000" style={{ width: `${(z.demanda / 600 * 100)}%`, backgroundColor: z.color }}></div>
                </div>
            </div>
        ))}
    </div>
);

// Frequency Bars (RF-11)
export const FrequencyBars: React.FC<{ segments: { VIP: number; Recurrente: number; Ocasional: number } }> = ({ segments }) => {
    const list = [
        { label: 'Segmento VIP', val: segments.VIP, color: 'bg-sky-400', shadow: 'shadow-[0_0_10px_rgba(56,189,248,0.5)]' },
        { label: 'Segmento Recurrente', val: segments.Recurrente, color: 'bg-indigo-400', shadow: '' },
        { label: 'Segmento Ocasional', val: segments.Ocasional, color: 'bg-blue-400', shadow: '' }
    ];

    return (
        <div className="space-y-8 font-industrial">
            {list.map(s => (
                <div key={s.label} className="space-y-3">
                    <div className="flex justify-between items-end">
                        <span className="text-[10px] font-black text-sky-200 uppercase tracking-widest">{s.label}</span>
                        <span className="text-lg font-black text-white">{s.val} días prom</span>
                    </div>
                    <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className={`h-full ${s.color} ${s.shadow} transition-all duration-1000`} style={{ width: `${Math.max(10, 100 - (s.val / 60 * 100))}%` }}></div>
                    </div>
                </div>
            ))}
        </div>
    );
};
