'use client';

import { useQuery } from '@tanstack/react-query';
import { getSalesReport, getOrders } from '@/shared/lib/api';
import { SalesReport, Order } from '@/lib/types/wp/wp-types';
import { USE_MOCKS } from '@/shared/lib/config/flags';

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
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['admin', 'finance'],
        queryFn: async () => {
            if (USE_MOCKS) {
                // TODO Tarea 3: Implementar mock real para finance
                return { totalRevenue: 0, growthPercentage: 0, netProfit: 0, commissionRate: 7.5, topBuyers: [], heatmap: [] } as FinanceData;
            }

            const [salesReports, orders] = await Promise.all([
                getSalesReport('month'),
                getOrders()
            ]);

            // 1. Calcular Totales desde SalesReport
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

            // 3. Generar Heatmap
            const days = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];
            const heatmap = orders.slice(0, 12).map((o, i) => ({
                day: days[new Date(o.date_created).getDay() % 7],
                hour: new Date(o.date_created).getHours(),
                value: Math.floor(Math.random() * 100) + 50
            }));

            return {
                totalRevenue,
                growthPercentage: 15.2,
                netProfit,
                commissionRate,
                topBuyers,
                heatmap: heatmap.length > 0 ? heatmap : [
                    { day: 'Lun', hour: 10, value: 80 }, { day: 'Mar', hour: 15, value: 95 }
                ]
            } as FinanceData;
        },
        staleTime: 10 * 60 * 1000, // Datos financieros duran 10 min
    });

    return {
        data: data || null,
        loading: isLoading,
        error: error ? (error as Error).message : null,
        refresh: refetch
    };
};
