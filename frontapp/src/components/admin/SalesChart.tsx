'use client';

import React, { useEffect, useState } from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { getSalesReport } from '@/lib/api';

export default function SalesChart() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const fetchChartData = async () => {
            try {
                setLoading(true);
                let reports = await getSalesReport('month');
                let mainReport = reports[0];

                // Si el reporte mensual está vacío o no tiene ventas reales, intentamos con el anual
                if (!mainReport || !mainReport.totals || Object.entries(mainReport.totals).every(([_, v]: [any, any]) => v.sales === "0.00")) {
                    reports = await getSalesReport('year');
                    mainReport = reports[0];
                }

                if (mainReport && mainReport.totals) {
                    // Convertir el objeto totals a un array para recharts y ordenar por fecha
                    const chartData = Object.entries(mainReport.totals)
                        .map(([date, values]: [string, any]) => ({
                            name: new Date(date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
                            ventas: parseFloat(values.sales),
                            pedidos: values.orders,
                            originalDate: date
                        }))
                        .sort((a, b) => new Date(a.originalDate).getTime() - new Date(b.originalDate).getTime());

                    setData(chartData);
                }
            } catch (error) {
                console.error('Error fetching chart data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchChartData();
    }, []);

    if (loading || !mounted) {
        return (
            <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm h-[400px] flex flex-col items-center justify-center gap-4">
                <div className="w-10 h-10 border-4 border-brand-sky/20 border-t-brand-sky rounded-full animate-spin"></div>
                <p className="text-gray-400 font-black uppercase tracking-widest text-[9px]">Sincronizando gráficas...</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm h-[400px] group transition-all hover:shadow-md flex flex-col">
            <div className="flex items-center justify-between mb-8 shrink-0">
                <div>
                    <h3 className="text-gray-900 font-black uppercase tracking-widest text-xs">Tendencias de Venta</h3>
                    <p className="text-gray-400 text-[10px] font-bold mt-1 uppercase">Sincronizado con WooCommerce</p>
                </div>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-brand-sky shadow-lg shadow-brand-sky/20"></div>
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Ventas (S/)</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 w-full min-h-0 relative">
                <ResponsiveContainer width="99%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#00A3FF" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#00A3FF" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 9, fontWeight: 800, fill: '#94A3B8' }}
                            dy={10}
                            minTickGap={30}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 9, fontWeight: 800, fill: '#94A3B8' }}
                        />
                        <Tooltip
                            contentStyle={{
                                borderRadius: '16px',
                                border: 'none',
                                boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                                fontSize: '10px',
                                fontWeight: 900,
                                textTransform: 'uppercase'
                            }}
                            cursor={{ stroke: '#00A3FF', strokeWidth: 1, strokeDasharray: '4 4' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="ventas"
                            stroke="#00A3FF"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorSales)"
                            animationDuration={1500}
                        />
                    </AreaChart>
                </ResponsiveContainer>

                {data.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-[1px]">
                        <p className="text-gray-400 font-black uppercase tracking-widest text-[9px]">Sin datos transaccionales en este periodo</p>
                    </div>
                )}
            </div>
        </div>
    );
}
