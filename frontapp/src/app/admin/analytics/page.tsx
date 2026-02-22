'use client';

import { useAnalytics } from '@/hooks/useAnalytics';
import ModuleHeader from '@/components/layout/shared/ModuleHeader';
import { AnalyticsModule } from '@/components/admin/analytics/AnalyticsModule';
import { Download, Share2 } from 'lucide-react';

export default function AnalyticsPage() {
    const { state, actions } = useAnalytics();

    return (
        <div className="space-y-6 animate-fadeIn font-industrial">
            <ModuleHeader
                title="Inteligencia de Negocio"
                subtitle="Analítica Avanzada de Vendedores y Comportamiento (RF-10, RF-11)"
                icon="PieChart"
                actions={
                    <div className="flex gap-2">
                        <button className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-indigo-600 transition-all shadow-sm group">
                            <Share2 className="w-4 h-4" />
                        </button>
                        <button className="px-6 py-3 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all flex items-center gap-2 shadow-xl shadow-indigo-100 font-industrial group">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse group-hover:scale-125 transition-all"></div>
                            Generar Reporte Ejecutivo PDF (RF-11)
                        </button>
                    </div>
                }
            />

            {/* Vista Principal Data Driven */}
            <AnalyticsModule state={state} actions={actions} />
        </div>
    );
}
