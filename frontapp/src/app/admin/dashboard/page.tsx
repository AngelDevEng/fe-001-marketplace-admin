import React from 'react';
import ModuleHeader from '@/components/layout/shared/ModuleHeader';
import StatsDashboard from '@/components/admin/StatsDashboard';
import SalesChart from '@/components/admin/SalesChart';
import RegionalDemandChart from '@/components/admin/RegionalDemandChart';
import CatalogPerformanceList from '@/components/admin/CatalogPerformanceList';

export default function DashboardPage() {
    return (
        <div className="px-8 pb-8 space-y-8">
            <ModuleHeader
                title="Dashboard Principal"
                subtitle="Vista general del ecosistema Lyrium"
                icon="ph-house"
            />

            <StatsDashboard />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="lg:col-span-1">
                    <SalesChart />
                </div>

                <div className="lg:col-span-1">
                    <RegionalDemandChart />

                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="lg:col-span-1">
                    <CatalogPerformanceList />
                </div>
            </div>
            <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm text-center">
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs italic">
                    Optimizando visualización de métricas avanzadas...
                </p>
            </div>
        </div >
    );
}
