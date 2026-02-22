import { useState, useEffect } from 'react';
import { FinanceData } from '@/lib/types/seller/finance';
import { MOCK_FINANCE_DATA } from '@/lib/mocks/mockFinanceData';

export interface FinanceFilters {
    startDate: string;
    endDate: string;
}

export function useSellerFinance() {
    const [data, setData] = useState<FinanceData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [filters, setFiltersState] = useState<FinanceFilters>({
        startDate: '',
        endDate: ''
    });

    useEffect(() => {
        const fetchFinanceData = async () => {
            setIsLoading(true);
            await new Promise(r => setTimeout(r, 600)); // Simula llamada API
            setData(MOCK_FINANCE_DATA);
            setIsLoading(false);
        };
        fetchFinanceData();
    }, []);

    const setFilters = (startDate: string, endDate: string) => {
        setFiltersState({ startDate, endDate });
    };

    const applyFilters = async (): Promise<boolean> => {
        if (!filters.startDate || !filters.endDate) {
            return false;
        }

        setIsLoading(true);
        // Simular recálculo de KPIs basado en fechas
        await new Promise(r => setTimeout(r, 1000));
        setIsLoading(false);
        return true;
    };

    const isVisible = (tabId: string) => activeTab === 'all' || activeTab === tabId;

    return {
        data,
        isLoading,
        activeTab,
        setActiveTab,
        filters,
        setFilters,
        applyFilters,
        isVisible
    };
}
