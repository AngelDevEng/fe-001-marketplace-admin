import { useState, useCallback, useEffect, useMemo } from 'react';
import { AnalyticsData, AnalyticsTab, AnalyticsFilters, SellerAnalytics } from '@/lib/types/admin/analytics';
import { MOCK_ANALYTICS_DATA } from '@/lib/mocks/analyticsData';

export const useAnalytics = () => {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<AnalyticsTab>('vendedores');

    const [filters, setFilters] = useState<AnalyticsFilters>({
        period: 'LAST_30',
        rubro: 'ALL'
    });

    const fetchAnalytics = useCallback(async () => {
        setLoading(true);
        try {
            // Simulamos API al endpoint nativo de wp-json/wc/v3/...
            // Idealmente esto se traducirá al endpoint real con Mappers de axios
            await new Promise(resolve => setTimeout(resolve, 800));

            // Simulación de Filtros (Solo para el Mock, en prod el backend hace esto)
            let filteredSellers = MOCK_ANALYTICS_DATA.vendedoresAnalitica;
            if (filters.rubro !== 'ALL') {
                filteredSellers = filteredSellers.filter(s => s.rubro === filters.rubro);
            }

            // Inyectar datos mock y aplicar el filtro leve
            setData({
                ...MOCK_ANALYTICS_DATA,
                vendedoresAnalitica: filteredSellers
            });
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Error calculando Big Data / WooCommerce Reports');
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchAnalytics();
    }, [fetchAnalytics]);

    const kpis = useMemo(() => {
        if (!data) return [];
        return [
            { label: 'Customer Lifetime Value (Promedio)', val: `S/ ${data.resumenGlobal.clv_promedio.toLocaleString()}`, color: 'indigo', icon: 'ChartLineUp' },
            { label: 'Tasa de Retención (Recurrencia)', val: `${data.resumenGlobal.tasa_retencion}%`, color: 'emerald', icon: 'Magnet' },
            { label: 'Conversión Media (Visita/Orden)', val: `${data.resumenGlobal.conversion_media}%`, color: 'sky', icon: 'Funnel' },
            { label: 'Frecuencia de Compra (Promedio)', val: `${data.resumenGlobal.frecuencia_compra} ped/mes`, color: 'amber', icon: 'Storefront' }
        ];
    }, [data]);

    const topSellers = useMemo(() => {
        if (!data) return [];
        return [...data.vendedoresAnalitica].sort((a, b) => b.roi - a.roi).slice(0, 4);
    }, [data]);

    return {
        state: {
            data,
            loading,
            error,
            activeTab,
            filters,
            kpis,
            topSellers
        },
        actions: {
            setActiveTab,
            setFilters
        }
    };
};
