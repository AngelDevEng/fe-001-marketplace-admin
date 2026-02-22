import React from 'react';
import { ProvidersTab, ExpensesTab, CredentialsTab, AuditTab } from './OperationsTabs';
import { Provider } from '@/lib/types/admin/operations';

import { Users, TrendingUp, ShieldCheck, Terminal } from 'lucide-react';
import { OperationalKPI } from '@/lib/types/admin/operations';

interface GestionOperativaModuleProps {
    state: any;
    actions: any;
}

export const GestionOperativaModule: React.FC<GestionOperativaModuleProps> = ({ state, actions }) => {
    const { data, loading, activeTab, kpis, filteredProviders, filteredExpenses, totalInvestment, providerFilters } = state;

    if (loading || !data) {
        return <div className="p-20 text-center font-black animate-pulse text-indigo-500 uppercase tracking-widest font-industrial">Inicializando Gestión Operativa...</div>;
    }

    const MapIcon = (iconName: string) => {
        switch (iconName) {
            case 'UserCheck': return <Users className="w-8 h-8" />;
            case 'UserMinus': return <Users className="w-8 h-8" />;
            default: return <Users className="w-8 h-8" />;
        }
    }

    // Filtrar KPIs para mostrar solo los de proveedores
    const providerKpis = kpis.filter((k: any) => k.label.includes('Proveedores') || k.label.includes('Pausa'));

    return (
        <div className="space-y-6 pb-20">

            {/* Dashboard Stats (Proveedores RF-12) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpis.map((kpi: OperationalKPI, idx: number) => (
                    <div key={idx} className={`bg-white p-8 border-l-4 border-${kpi.color}-500 transition-all hover:scale-[1.02] rounded-[2rem] shadow-sm`}>
                        <div className="flex items-center justify-between mb-2">
                            <div className={`p-4 bg-${kpi.color}-50 text-${kpi.color}-600 rounded-2xl`}>
                                {MapIcon(kpi.icon)}
                            </div>
                            <span className="text-3xl font-black text-gray-800 font-industrial">{kpi.val}</span>
                        </div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest leading-none font-industrial">{kpi.label}</p>
                    </div>
                ))}
            </div>

            {/* Navigation Tabs (RF-12, RF-13) */}
            <div className="flex bg-gray-100/80 p-1.5 rounded-[2rem] w-fit mx-auto border border-white/50 backdrop-blur-sm shadow-inner mb-10">
                {[
                    { id: 'proveedores', label: 'Directorio', icon: <Users className="w-4 h-4" /> },
                    { id: 'gastos', label: 'Gestión de Gastos', icon: <TrendingUp className="w-4 h-4" /> },
                    { id: 'roles', label: 'Roles y Permisos', icon: <ShieldCheck className="w-4 h-4" /> },
                    { id: 'auditoria', label: 'Auditoría Técnica', icon: <Terminal className="w-4 h-4" /> },
                ].map(tab => (
                    <button
                        key={tab.id}
                        className={`px-8 py-3.5 rounded-[1.7rem] text-[10px] font-black transition-all flex items-center gap-2 font-industrial uppercase tracking-wider ${activeTab === tab.id ? 'bg-white shadow-md text-blue-600' : 'text-gray-400 hover:bg-white/50'
                            }`}
                        onClick={() => actions.setActiveTab(tab.id as any)}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Panels */}
            <div className="animate-in fade-in duration-500">
                {activeTab === 'proveedores' && (
                    <ProvidersTab
                        providers={filteredProviders}
                        filters={providerFilters}
                        onFilterChange={actions.setProviderFilters}
                        onNewProvider={() => actions.setSelectedProvider({} as Provider)}
                        onEditProvider={actions.setSelectedProvider}
                    />
                )}
                {activeTab === 'gastos' && (
                    <ExpensesTab
                        expenses={filteredExpenses}
                        totalInvestment={totalInvestment}
                    />
                )}
                {activeTab === 'roles' && (
                    <CredentialsTab
                        credentials={data.credenciales}
                        onNewRole={() => alert('Feature coming soon: New Role Creation (RF-13)')}
                        onEditRole={(role) => alert(`Editing permissions for: ${role}`)}
                        onDeactivateRole={(role) => alert(`Revoking access for: ${role}`)}
                    />
                )}
                {activeTab === 'auditoria' && (
                    <AuditTab logs={data.auditoria} />
                )}
            </div>

        </div>
    );
};
