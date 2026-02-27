'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FinanceData } from '@/lib/types/seller/finance';
import { MOCK_FINANCE_DATA } from '@/lib/mocks/mockFinanceData';
import { api } from '@/lib/api';
import { USE_MOCKS } from '@/lib/config/flags';

export interface FinanceFilters {
    startDate: string;
    endDate: string;
}

export function useSellerFinance() {
    const [activeTab, setActiveTab] = useState('all');
    const [filters, setFiltersState] = useState<FinanceFilters>({
        startDate: '',
        endDate: ''
    });

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['seller', 'finance', filters],
        queryFn: async () => {
            if (USE_MOCKS) {
                return MOCK_FINANCE_DATA as FinanceData;
            }

            try {
                const orders = await api.orders.getOrders();
                return { orders } as unknown as FinanceData;
            } catch (e) {
                console.warn('FALLBACK: Finance data pendiente de implementar');
                return MOCK_FINANCE_DATA as FinanceData;
            }
        },
        staleTime: 10 * 60 * 1000,
    });

    const setFilters = (startDate: string, endDate: string) => {
        setFiltersState({ startDate, endDate });
    };

    const isVisible = (tabId: string) => activeTab === 'all' || activeTab === tabId;

    return {
        data: data || null,
        isLoading,
        activeTab,
        setActiveTab,
        filters,
        setFilters,
        applyFilters: async () => {
            await refetch();
            return true;
        },
        isVisible
    };
}
