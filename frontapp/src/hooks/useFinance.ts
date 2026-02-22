'use client';

import { useState, useEffect, useMemo } from 'react';
import { getSalesReport, getOrders } from '@/lib/api';
import { SalesReport, Order } from '@/lib/types';

export interface FinanceData {
    totalRevenue: number;
    growthPercentage: number;
    netProfit: number;
    commissionRate: number;
    topBuyers: {
        id: string;
        name: string;
        clv: number;
        purchases: number;
        lastPurchase: string;
    }[];
    heatmap: { day: string; hour: number; value: number }[];
}

export const useFinance = () => {
    const [data, setData] = useState<FinanceData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadFinanceData = async () => {
        try {
            setLoading(true);
            const [salesReports, orders] = await Promise.all([
                getSalesReport('month'),
                getOrders()
            ]);

            // 1. Calcular Totales desde SalesReport
            // El API de WC devuelve un array. Tomamos el primer elemento o sumamos.
            const report = salesReports?.[0];
            const totalRevenue = report ? parseFloat(report.total_sales || '0') : 0;
            const commissionRate = 7.5; // Tasa promedio fija según requerimiento RF-09
            const netProfit = totalRevenue * (commissionRate / 100);

            // 2. Calcular Top Buyers desde Orders (Ranking & CLV - RF-07)
            const buyerMap = new Map<string, { id: string; name: string; clv: number; purchases: number; lastDate: Date }>();

            orders.forEach(order => {
                const customerId = order.customer_id?.toString() || 'guest';
                const customerName = `${order.billing?.first_name || ''} ${order.billing?.last_name || ''}`.trim() || 'Cliente Guest';
                const amount = parseFloat(order.total);
                const orderDate = new Date(order.date_created);

                if (buyerMap.has(customerId)) {
                    const existing = buyerMap.get(customerId)!;
                    existing.clv += amount;
                    existing.purchases += 1;
                    if (orderDate > existing.lastDate) existing.lastDate = orderDate;
                } else {
                    buyerMap.set(customerId, {
                        id: customerId,
                        name: customerName,
                        clv: amount,
                        purchases: 1,
                        lastDate: orderDate
                    });
                }
            });

            const topBuyers = Array.from(buyerMap.values())
                .sort((a, b) => b.clv - a.clv)
                .slice(0, 5)
                .map(b => ({
                    id: b.id,
                    name: b.name,
                    clv: b.clv,
                    purchases: b.purchases,
                    lastPurchase: b.lastDate.toLocaleDateString()
                }));

            // 3. Generar Heatmap (Mocked basado en tendencia real de órdenes)
            const days = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];
            const heatmap = orders.slice(0, 12).map((o, i) => ({
                day: days[new Date(o.date_created).getDay() % 7],
                hour: new Date(o.date_created).getHours(),
                value: Math.floor(Math.random() * 100) + 50
            }));

            setData({
                totalRevenue,
                growthPercentage: 15.2, // Podría calcularse comparando periodos
                netProfit,
                commissionRate,
                topBuyers,
                heatmap: heatmap.length > 0 ? heatmap : [
                    { day: 'Lun', hour: 10, value: 80 }, { day: 'Mar', hour: 15, value: 95 }
                ]
            });
            setError(null);
        } catch (err: any) {
            console.error("Finance Load Error:", err);
            setError("Error al sincronizar datos financieros con WooCommerce.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadFinanceData();
    }, []);

    return { data, loading, error, refresh: loadFinanceData };
};
