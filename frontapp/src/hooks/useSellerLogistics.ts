import { useState, useEffect } from 'react';
import { LogisticsConfig, GlobalLogisticsConfig, CityRate, Agency } from '@/lib/types/seller/logistics';
import { MOCK_LOGISTICS_CONFIG } from '@/lib/mocks/mockLogisticsData';

export function useSellerLogistics() {
    const [config, setConfig] = useState<LogisticsConfig | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [isAddCityOpen, setIsAddCityOpen] = useState(false);
    const [isAddAgencyOpen, setIsAddAgencyOpen] = useState(false);
    const [selectedCityIndex, setSelectedCityIndex] = useState<number | null>(null);

    useEffect(() => {
        const loadConfig = async () => {
            setIsLoading(true);
            await new Promise(r => setTimeout(r, 500)); // Simula llamada API
            setConfig({ ...MOCK_LOGISTICS_CONFIG });
            setIsLoading(false);
        };
        loadConfig();
    }, []);

    const updateGlobalConfig = (updates: Partial<GlobalLogisticsConfig>) => {
        if (!config) return;
        setConfig({ ...config, globalConfig: { ...config.globalConfig, ...updates } });
    };

    const updateOperator = (key: keyof LogisticsConfig['operators'], enabled: boolean) => {
        if (!config) return;
        setConfig({
            ...config,
            operators: { ...config.operators, [key]: { ...config.operators[key], enabled } }
        });
    };

    const addCityRate = (rate: CityRate) => {
        if (!config) return;
        setConfig({ ...config, cityRates: [...config.cityRates, rate] });
    };

    const removeCityRate = (index: number) => {
        if (!config) return;
        const newRates = [...config.cityRates];
        newRates.splice(index, 1);
        setConfig({ ...config, cityRates: newRates });
    };

    const updateCityRateValue = (index: number, rate: number) => {
        if (!config) return;
        const newRates = [...config.cityRates];
        newRates[index] = { ...newRates[index], rate };
        setConfig({ ...config, cityRates: newRates });
    };

    const addAgency = (cityIndex: number, agency: Omit<Agency, 'id'>) => {
        if (!config) return;
        const newRates = [...config.cityRates];
        if (cityIndex < 0 || cityIndex >= newRates.length) return;
        const newAgency: Agency = { id: Date.now(), ...agency };
        newRates[cityIndex] = { ...newRates[cityIndex], agencies: [...newRates[cityIndex].agencies, newAgency] };
        setConfig({ ...config, cityRates: newRates });
    };

    const removeAgency = (cityIndex: number, agencyIndex: number) => {
        if (!config) return;
        const newRates = [...config.cityRates];
        if (cityIndex < 0 || cityIndex >= newRates.length) return;
        const newAgencies = [...newRates[cityIndex].agencies];
        newAgencies.splice(agencyIndex, 1);
        newRates[cityIndex] = { ...newRates[cityIndex], agencies: newAgencies };
        setConfig({ ...config, cityRates: newRates });
    };

    const saveConfig = async () => {
        console.log('Saved logistics config:', config);
        // TODO: integrar con API real
    };

    return {
        config,
        isLoading,
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
        saveConfig
    };
}
