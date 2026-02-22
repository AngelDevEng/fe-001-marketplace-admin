import { useState, useEffect } from 'react';
import { Order, SalesKPI } from '@/lib/types/seller/sales';
import { MOCK_ORDERS, MOCK_KPIS } from '@/lib/mocks/mockSalesData';

export function useSellerSales() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [kpis, setKpis] = useState<SalesKPI[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const [filters, setFiltersState] = useState<{ dateStart: string | null; dateEnd: string | null }>({
        dateStart: null,
        dateEnd: null
    });

    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoading(true);
            await new Promise(r => setTimeout(r, 800)); // Simulate API loading

            setOrders(MOCK_ORDERS);
            setKpis(MOCK_KPIS);
            setIsLoading(false);
        };

        fetchInitialData();
    }, []);

    const filteredOrders = orders.filter(o => {
        if (!filters.dateStart && !filters.dateEnd) return true;
        const oDate = new Date(o.fecha + 'T00:00:00');
        const start = filters.dateStart ? new Date(filters.dateStart + 'T00:00:00') : null;
        const end = filters.dateEnd ? new Date(filters.dateEnd + 'T00:00:00') : null;
        if (start && oDate < start) return false;
        if (end && oDate > end) return false;
        return true;
    });

    const advanceStep = async (orderId: string) => {
        await new Promise(r => setTimeout(r, 600)); // simulate api
        setOrders(orders.map(o => {
            if (o.id === orderId && o.currentStep < 5) {
                return { ...o, currentStep: o.currentStep + 1 };
            }
            return o;
        }));
    };

    const updateFilters = (newFilters: { dateStart?: string; dateEnd?: string }) => {
        setFiltersState({ ...filters, ...newFilters });
    };

    const clearFilters = () => setFiltersState({ dateStart: null, dateEnd: null });

    return {
        orders: filteredOrders,
        kpis,
        isLoading,
        selectedOrder,
        setSelectedOrder,
        filters,
        updateFilters,
        clearFilters,
        advanceStep
    };
}
