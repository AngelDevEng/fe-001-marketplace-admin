'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Order, SalesKPI } from '@/lib/types/seller/sales';
import { MOCK_ORDERS, MOCK_KPIS } from '@/lib/mocks/mockSalesData';

export function useSellerSales() {
    const queryClient = useQueryClient();
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [filters, setFilters] = useState<{ dateStart: string | null; dateEnd: string | null }>({
        dateStart: null,
        dateEnd: null
    });

    // --- Query: Fetch Orders & KPIs ---
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['seller', 'sales', filters],
        queryFn: async () => {
            await new Promise(r => setTimeout(r, 1000));

            let filteredOrders = MOCK_ORDERS;
            if (filters.dateStart || filters.dateEnd) {
                filteredOrders = MOCK_ORDERS.filter(o => {
                    const oDate = new Date(o.fecha + 'T00:00:00');
                    const start = filters.dateStart ? new Date(filters.dateStart + 'T00:00:00') : null;
                    const end = filters.dateEnd ? new Date(filters.dateEnd + 'T00:00:00') : null;
                    if (start && oDate < start) return false;
                    if (end && oDate > end) return false;
                    return true;
                });
            }

            return {
                orders: filteredOrders as Order[],
                kpis: MOCK_KPIS as SalesKPI[]
            };
        },
        staleTime: 5 * 60 * 1000,
    });

    // --- Mutation: Advance Order Status ---
    const advanceStepMutation = useMutation({
        mutationFn: async (orderId: string) => {
            await new Promise(r => setTimeout(r, 800));
            return orderId;
        },
        onSuccess: (orderId) => {
            queryClient.setQueryData(['seller', 'sales', filters], (old: any) => {
                if (!old) return old;
                return {
                    ...old,
                    orders: old.orders.map((o: Order) =>
                        o.id === orderId ? { ...o, currentStep: Math.min(o.currentStep + 1, 5) } : o
                    )
                };
            });
        }
    });

    const selectedOrder = data?.orders.find(o => o.id === selectedOrderId) || null;

    return {
        orders: data?.orders || [],
        kpis: data?.kpis || [],
        isLoading,
        selectedOrder,
        setSelectedOrder: (order: Order | null) => setSelectedOrderId(order?.id || null),
        filters,
        updateFilters: (newFilters: { dateStart?: string | null; dateEnd?: string | null }) =>
            setFilters({ ...filters, ...newFilters }),
        clearFilters: () => setFilters({ dateStart: null, dateEnd: null }),
        advanceStep: (id: string) => advanceStepMutation.mutateAsync(id),
        isAdvancing: advanceStepMutation.isPending,
        refresh: refetch
    };
}
