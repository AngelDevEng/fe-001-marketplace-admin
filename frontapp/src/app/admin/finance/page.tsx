import React from 'react';
import ModuleHeader from '@/components/layout/shared/ModuleHeader';

export default function FinancePage() {
    return (
        <div className="px-8 pb-8">
            <ModuleHeader
                title="Finanzas & Estadísticas"
                subtitle="Monitor de Salud del Marketplace (RF-08)"
                icon="ph-chart-line-up"
            />
            <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm text-center">
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">
                    Contenido del módulo en migración...
                </p>
            </div>
        </div>
    );
}
