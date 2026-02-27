'use client';

import { useAnalytics } from '@/hooks/useAnalytics';
import ModuleHeader from '@/components/layout/shared/ModuleHeader';
import BaseButton from '@/components/ui/BaseButton';
import { AnalyticsModule } from '@/components/admin/analytics/AnalyticsModule';
import { Download, RefreshCw } from 'lucide-react';

interface AnalyticsPageClientProps { /* TODO Tarea 3 */ }
export function AnalyticsPageClient(_props: AnalyticsPageClientProps) {
    const { state, actions } = useAnalytics();
    const { loading } = state;

    return (
        <div className="space-y-8 animate-fadeIn font-industrial pb-20">
            <ModuleHeader title="Inteligencia de Negocio" subtitle="Analítica Avanzada de Vendedores y Comportamiento de Mercado" icon="Activity" actions={<div className="flex gap-2"><BaseButton onClick={() => actions.refresh()} variant="ghost" leftIcon="RefreshCw" size="md"><RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /></BaseButton><BaseButton onClick={() => alert('Exportando...')} variant="primary" leftIcon="Download" size="md">Exportar</BaseButton></div>} />
            <AnalyticsModule state={state} actions={actions} />
        </div>
    );
}
