import React from 'react';
import { StatusBadge, ModalityBadge, KpiCard, ExpiryTrafficLight } from './ContractsUIComponents';
import { Contract } from '@/lib/types/admin/contracts';
import { ContractKPI } from '@/features/admin/contracts/types';
import { Search, Plus, ArrowRight, ChevronRight, FileText } from 'lucide-react';
import Skeleton from '@/components/ui/Skeleton';

interface ContratosModuleProps {
    state: {
        contracts: Contract[];
        kpis: ContractKPI[];
        loading: boolean;
        filters: Record<string, unknown>;
    };
    actions: Record<string, unknown>;
}

export const ContratosModule: React.FC<ContratosModuleProps> = ({ state, actions }) => {
    const { contracts, kpis, loading, filters } = state;

    if (loading && contracts.length === 0) {
        return (
            <div className="space-y-8 animate-fadeIn text-left font-industrial">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div key="contratos-kpi-skel-1" className="bg-white p-7 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-4">
                        <Skeleton className="h-4 w-24 rounded" />
                        <Skeleton className="h-10 w-16 rounded-lg" />
                    </div>
                    <div key="contratos-kpi-skel-2" className="bg-white p-7 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-4">
                        <Skeleton className="h-4 w-24 rounded" />
                        <Skeleton className="h-10 w-16 rounded-lg" />
                    </div>
                    <div key="contratos-kpi-skel-3" className="bg-white p-7 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-4">
                        <Skeleton className="h-4 w-24 rounded" />
                        <Skeleton className="h-10 w-16 rounded-lg" />
                    </div>
                    <div key="contratos-kpi-skel-4" className="bg-white p-7 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-4">
                        <Skeleton className="h-4 w-24 rounded" />
                        <Skeleton className="h-10 w-16 rounded-lg" />
                    </div>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                    <Skeleton className="w-full h-16 rounded-2xl" />
                </div>
                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden p-8">
                    <div className="space-y-6">
                        <div key="contratos-row-skel-1" className="flex gap-6 py-4 border-b border-gray-50 last:border-0 items-center">
                            <Skeleton className="h-10 w-20 rounded-xl" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-1/3 rounded" />
                                <Skeleton className="h-3 w-1/4 rounded" />
                            </div>
                            <Skeleton className="h-8 w-24 rounded-full" />
                        </div>
                        <div key="contratos-row-skel-2" className="flex gap-6 py-4 border-b border-gray-50 last:border-0 items-center">
                            <Skeleton className="h-10 w-20 rounded-xl" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-1/3 rounded" />
                                <Skeleton className="h-3 w-1/4 rounded" />
                            </div>
                            <Skeleton className="h-8 w-24 rounded-full" />
                        </div>
                        <div key="contratos-row-skel-3" className="flex gap-6 py-4 border-b border-gray-50 last:border-0 items-center">
                            <Skeleton className="h-10 w-20 rounded-xl" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-1/3 rounded" />
                                <Skeleton className="h-3 w-1/4 rounded" />
                            </div>
                            <Skeleton className="h-8 w-24 rounded-full" />
                        </div>
                        <div key="contratos-row-skel-4" className="flex gap-6 py-4 border-b border-gray-50 last:border-0 items-center">
                            <Skeleton className="h-10 w-20 rounded-xl" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-1/3 rounded" />
                                <Skeleton className="h-3 w-1/4 rounded" />
                            </div>
                            <Skeleton className="h-8 w-24 rounded-full" />
                        </div>
                        <div key="contratos-row-skel-5" className="flex gap-6 py-4 border-b border-gray-50 last:border-0 items-center">
                            <Skeleton className="h-10 w-20 rounded-xl" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-1/3 rounded" />
                                <Skeleton className="h-3 w-1/4 rounded" />
                            </div>
                            <Skeleton className="h-8 w-24 rounded-full" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fadeIn text-left font-industrial">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {kpis.map((kpi) => <KpiCard key={kpi.label} kpi={kpi} />)}
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <div className="flex flex-col md:flex-row gap-6 items-end">
                    <div className="flex-1 space-y-2 w-full">
                        <label htmlFor="contratos-search" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Radar de Contratos</label>
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                id="contratos-search"
                                type="text"
                                placeholder="Buscar por RUC, Empresa o Ticket ID..."
                                value={filters.query}
                                onChange={(e) => actions.setFilters({ ...filters, query: e.target.value })}
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-xs font-black focus:ring-2 focus:ring-indigo-500/10 placeholder:text-gray-400 font-industrial transition-all"
                            />
                        </div>
                    </div>

                    <div className="w-full md:w-48 space-y-2">
                        <label htmlFor="contratos-modality" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Modalidad</label>
                        <select
                            id="contratos-modality"
                            value={filters.modality}
                            onChange={(e) => actions.setFilters({ ...filters, modality: e.target.value })}
                            className="w-full px-4 py-4 bg-gray-50 border-none rounded-2xl text-[10px] font-black uppercase text-gray-700 font-industrial cursor-pointer"
                        >
                            <option value="ALL">Todo Tipo</option>
                            <option value="VIRTUAL">Virtual</option>
                            <option value="PHYSICAL">Presencial</option>
                        </select>
                    </div>

                    <div className="w-full md:w-48 space-y-2">
                        <label htmlFor="contratos-status" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Estatus</label>
                        <select
                            id="contratos-status"
                            value={filters.status}
                            onChange={(e) => actions.setFilters({ ...filters, status: e.target.value })}
                            className="w-full px-4 py-4 bg-gray-50 border-none rounded-2xl text-[10px] font-black uppercase text-gray-700 font-industrial cursor-pointer"
                        >
                            <option value="ALL">Cualquier Estatus</option>
                            <option value="ACTIVE">Vigentes</option>
                            <option value="PENDING">Pendientes</option>
                            <option value="EXPIRED">Vencidos</option>
                        </select>
                    </div>

                    <button
                        onClick={actions.createNew}
                        className="h-14 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 px-8 font-industrial group"
                    >
                        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                        <span className="text-xs font-black uppercase tracking-widest">Aperturar</span>
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                <th className="px-8 py-6">ID Contrato</th>
                                <th className="px-8 py-6">Entidad Vendedora</th>
                                <th className="px-8 py-6">Ventana de Vigencia</th>
                                <th className="px-8 py-6">Configuración</th>
                                <th className="px-8 py-6">Estatus</th>
                                <th className="px-8 py-6 text-right">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {contracts.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center justify-center opacity-40">
                                            <FileText className="w-12 h-12 mb-4 text-gray-300" />
                                            <p className="text-[10px] font-black uppercase tracking-widest">Búsqueda sin coincidencias legales</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                contracts.map((c: Contract) => (
                                    <tr
                                        key={c.id}
                                        onClick={() => actions.setSelectedContract(c)}
                                        className="hover:bg-indigo-50/20 transition-all group cursor-pointer"
                                    >
                                        <td className="px-8 py-6">
                                            <span className="text-xs font-black text-indigo-600 italic">#{c.id}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-xs font-black text-gray-800 uppercase tracking-tight">{c.company}</p>
                                            <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mt-0.5">RUC {c.ruc}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="space-y-1.5">
                                                <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase italic">
                                                    <span>{c.start}</span>
                                                    <ArrowRight className="w-3 h-3 text-gray-300" />
                                                    <span>{c.end || '---'}</span>
                                                </div>
                                                <ExpiryTrafficLight urgency={c.expiryUrgency} />
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="space-y-1">
                                                <ModalityBadge modality={c.modality} />
                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">{c.type}</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <StatusBadge status={c.status} />
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="inline-flex p-3 bg-gray-50 text-gray-300 group-hover:bg-indigo-600 group-hover:text-white rounded-2xl transition-all shadow-sm group-hover:shadow-indigo-100 group-hover:shadow-lg">
                                                <ChevronRight className="w-5 h-5" />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
