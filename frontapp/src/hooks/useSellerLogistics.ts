'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LogisticsConfig, GlobalLogisticsConfig, CityRate, Agency } from '@/lib/types/seller/logistics';
import { MOCK_LOGISTICS_CONFIG } from '@/lib/mocks/mockLogisticsData';
import { useToast } from '@/context/ToastContext';

export function useSellerLogistics() {
    const queryClient = useQueryClient();
    const { showToast } = useToast();
    const [isAddCityOpen, setIsAddCityOpen] = useState(false);
    const [isAddAgencyOpen, setIsAddAgencyOpen] = useState(false);
    const [selectedCityIndex, setSelectedCityIndex] = useState<number | null>(null);

    // --- Query: Fetch Logistics Config ---
    const { data: config, isLoading, refetch } = useQuery({
        queryKey: ['seller', 'logistics'],
        queryFn: async () => {
            await new Promise(r => setTimeout(r, 800));
            return { ...MOCK_LOGISTICS_CONFIG } as LogisticsConfig;
        },
        staleTime: 15 * 60 * 1000,
    });

    // --- Mutation: Update Everything ---
    const saveMutation = useMutation({
        mutationFn: async (newConfig: LogisticsConfig) => {
            await new Promise(r => setTimeout(r, 1200));
            return newConfig;
        },
        onSuccess: (data) => {
            queryClient.setQueryData(['seller', 'logistics'], data);
            showToast("Configuración logística sincronizada con éxito", "success");
        },
        onError: () => {
            showToast("Error al guardar la configuración logística", "error");
        }
    });

    const updateGlobalConfig = (updates: Partial<GlobalLogisticsConfig>) => {
        if (!config) return;
        const newConfig = { ...config, globalConfig: { ...config.globalConfig, ...updates } };
        queryClient.setQueryData(['seller', 'logistics'], newConfig);
    };

    const updateOperator = (key: keyof LogisticsConfig['operators'], enabled: boolean) => {
        if (!config) return;
        const newConfig = {
            ...config,
            operators: { ...config.operators, [key]: { ...config.operators[key], enabled } }
        };
        queryClient.setQueryData(['seller', 'logistics'], newConfig);
    };

    const addCityRate = (rate: CityRate) => {
        if (!config) return;
        const newConfig = { ...config, cityRates: [...config.cityRates, rate] };
        queryClient.setQueryData(['seller', 'logistics'], newConfig);
        setIsAddCityOpen(false);
    };

    const removeCityRate = (index: number) => {
        if (!config) return;
        const newRates = [...config.cityRates];
        newRates.splice(index, 1);
        const newConfig = { ...config, cityRates: newRates };
        queryClient.setQueryData(['seller', 'logistics'], newConfig);
    };

    const updateCityRateValue = (index: number, rate: number) => {
        if (!config) return;
        const newRates = [...config.cityRates];
        newRates[index] = { ...newRates[index], rate };
        const newConfig = { ...config, cityRates: newRates };
        queryClient.setQueryData(['seller', 'logistics'], newConfig);
    };

    const addAgency = (cityIndex: number, agency: Omit<Agency, 'id'>) => {
        if (!config) return;
        const newRates = [...config.cityRates];
        if (cityIndex < 0 || cityIndex >= newRates.length) return;
        const newAgency: Agency = { id: Date.now(), ...agency };
        newRates[cityIndex] = { ...newRates[cityIndex], agencies: [...newRates[cityIndex].agencies, newAgency] };
        const newConfig = { ...config, cityRates: newRates };
        queryClient.setQueryData(['seller', 'logistics'], newConfig);
        setIsAddAgencyOpen(false);
        setSelectedCityIndex(null);
    };

    const removeAgency = (cityIndex: number, agencyIndex: number) => {
        if (!config) return;
        const newRates = [...config.cityRates];
        if (cityIndex < 0 || cityIndex >= newRates.length) return;
        const newAgencies = [...newRates[cityIndex].agencies];
        newAgencies.splice(agencyIndex, 1);
        newRates[cityIndex] = { ...newRates[cityIndex], agencies: newAgencies };
        const newConfig = { ...config, cityRates: newRates };
        queryClient.setQueryData(['seller', 'logistics'], newConfig);
    };

    return {
        config: config || null,
        isLoading,
        isSaving: saveMutation.isPending,
        isAddCityOpen,
        setIsAddCityOpen,
        isAddAgencyOpen,
        setIsAddAgencyOpen,
        selectedCityIndex,
        setSelectedCityIndex,
        updateGlobalConfig,
        updateOperator,
        addCityRate,
        removeCityRate,
        updateCityRateValue,
        addAgency,
        removeAgency,
        saveConfig: () => { if (config) saveMutation.mutate(config); },
        refresh: refetch
    };
}
