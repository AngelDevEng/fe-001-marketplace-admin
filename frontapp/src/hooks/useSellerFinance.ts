'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FinanceData } from '@/lib/types/seller/finance';
import { MOCK_FINANCE_DATA } from '@/lib/mocks/mockFinanceData';

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

    // --- Query: Fetch Finance Data ---
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['seller', 'finance', filters],
        queryFn: async () => {
            // Simulamos delay de red proporcional a la complejidad del reporte financiero
            await new Promise(r => setTimeout(r, 1000));
            return MOCK_FINANCE_DATA as FinanceData;
        },
        staleTime: 10 * 60 * 1000, // Datos financieros duran 10 min
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
            if (!filters.startDate || !filters.endDate) return false;
            await refetch();
            return true;
        },
        isVisible,
        refresh: refetch
    };
}
