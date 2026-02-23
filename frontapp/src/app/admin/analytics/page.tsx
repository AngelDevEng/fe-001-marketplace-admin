'use client';

import { useAnalytics } from '@/hooks/useAnalytics';
import ModuleHeader from '@/components/layout/shared/ModuleHeader';
import BaseButton from '@/components/ui/BaseButton';
import { AnalyticsModule } from '@/components/admin/analytics/AnalyticsModule';
import { Download, Share2, RefreshCw } from 'lucide-react';
import Skeleton from '@/components/ui/Skeleton';

export default function AnalyticsPage() {
    const { state, actions } = useAnalytics();
    const { loading } = state;

    return (
        <div className="space-y-8 animate-fadeIn font-industrial pb-20">
            <ModuleHeader
                title="Inteligencia de Negocio"
                subtitle="Analítica Avanzada de Vendedores y Comportamiento de Mercado (RF-10, RF-11)"
                icon="Activity"
                actions={
                    <div className="flex gap-3">
                        <BaseButton
                            onClick={() => actions.refresh()}
                            variant="ghost"
                            size="md"
                            className="bg-white border border-gray-100 shadow-sm"
                        >
                            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                        </BaseButton>
                        <BaseButton
                            variant="primary"
                            leftIcon="FileDown"
                            size="md"
                            className="shadow-xl shadow-indigo-100"
                        >
                            Generar Reporte Ejecutivo PDF
                        </BaseButton>
                    </div>
                }
            />

            {loading && !state.data ? (
                <div className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-28 rounded-[2rem]" />)}
                    </div>
                    <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
                        <Skeleton className="h-[500px] w-full rounded-3xl" />
                    </div>
                </div>
            ) : (
                <div className="animate-in slide-in-from-bottom-4 duration-500">
                    <AnalyticsModule state={state} actions={actions} />
                </div>
            )}
        </div>
    );
}
