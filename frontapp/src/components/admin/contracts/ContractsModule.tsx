import React from 'react';
import { StatusBadge, ModalityBadge, KpiCard, ExpiryTrafficLight } from './ContractsUIComponents';
import { Contract } from '@/lib/types/admin/contracts';
import { Search, Plus, ArrowRight, ChevronRight } from 'lucide-react';
import Skeleton from '@/components/ui/Skeleton';

interface ContratosModuleProps {
    state: any;
    actions: any;
}

export const ContratosModule: React.FC<ContratosModuleProps> = ({ state, actions }) => {
    const { contracts, kpis, loading, error, filters } = state;

    if (loading && contracts.length === 0) {
        return (
            <div className="space-y-6 animate-fadeIn pb-20 text-left font-industrial">
                {/* KPI SKELETONS */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(idx => (
                        <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm space-y-4">
                            <Skeleton className="h-4 w-24 rounded" />
                            <Skeleton className="h-8 w-16 rounded-md" />
                        </div>
                    ))}
                </div>

                {/* FILTROS SKELETON */}
                <Skeleton className="w-full h-24 rounded-3xl" />

                {/* TABLA SKELETON */}
                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden p-6">
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5, 6].map(idx => (
                            <div key={idx} className="flex gap-4 py-4 border-b border-gray-50 last:border-0 items-center">
                                <Skeleton className="h-8 w-16 rounded" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-1/3 rounded" />
                                    <Skeleton className="h-2 w-1/4 rounded" />
                                </div>
                                <Skeleton className="h-4 w-32 rounded" />
                                <Skeleton className="h-8 w-24 rounded-full" />
                                <Skeleton className="h-8 w-8 rounded-xl" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fadeIn pb-20 text-left font-industrial">

            {/* KPI Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {kpis.map((kpi: any, idx: number) => <KpiCard key={idx} kpi={kpi} />)}
            </div>

            {/* FILTROS */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm mb-6">
                <div className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Búsqueda</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Empresa, RUC o Representante..."
                                value={filters.query}
                                onChange={(e) => actions.setFilters({ ...filters, query: e.target.value })}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/20 font-industrial"
                            />
                        </div>
                    </div>

                    <div className="w-full md:w-40 space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Modalidad</label>
                        <select
                            value={filters.modality}
                            onChange={(e) => actions.setFilters({ ...filters, modality: e.target.value as any })}
                            className="w-full p-2.5 bg-gray-50 border-none rounded-xl text-xs font-bold text-gray-700 font-industrial uppercase cursor-pointer"
                        >
                            <option value="ALL">Todas</option>
                            <option value="VIRTUAL">Virtual (Digital)</option>
                            <option value="PHYSICAL">Presencial (Físico)</option>
                        </select>
                    </div>

                    <div className="w-full md:w-40 space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Estado Legal</label>
                        <select
                            value={filters.status}
                            onChange={(e) => actions.setFilters({ ...filters, status: e.target.value as any })}
                            className="w-full p-2.5 bg-gray-50 border-none rounded-xl text-xs font-bold text-gray-700 font-industrial uppercase cursor-pointer"
                        >
                            <option value="ALL">Todos</option>
                            <option value="ACTIVE">Vigentes</option>
                            <option value="PENDING">Pendientes</option>
                            <option value="EXPIRED">Vencidos</option>
                        </select>
                    </div>

                    <button
                        onClick={actions.createNew}
                        className="p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 whitespace-nowrap px-4 font-industrial"
                    >
                        <Plus className="w-4 h-4 font-bold" /> <span className="text-xs font-black uppercase tracking-widest">Nuevo Contrato</span>
                    </button>
                </div>
            </div>

            {/* TABLA */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                <th className="px-6 py-5 whitespace-nowrap">ID Contrato</th>
                                <th className="px-6 py-5 whitespace-nowrap">Empresa / Vendedor</th>
                                <th className="px-6 py-5 whitespace-nowrap">Vigencia</th>
                                <th className="px-6 py-5 whitespace-nowrap">Modalidad</th>
                                <th className="px-6 py-5 whitespace-nowrap">Tipo</th>
                                <th className="px-6 py-5 whitespace-nowrap">Estado Legal</th>
                                <th className="px-6 py-5 text-right whitespace-nowrap">Gestión</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {contracts.map((c: Contract) => (
                                <tr
                                    key={c.id}
                                    onClick={() => actions.setSelectedContract(c)}
                                    className="hover:bg-gray-50/50 transition-colors group cursor-pointer"
                                >
                                    <td className="px-6 py-4 font-black text-xs text-gray-800 group-hover:text-indigo-600 transition-colors">{c.id}</td>
                                    <td className="px-6 py-4">
                                        <p className="text-xs font-bold text-gray-700 uppercase">{c.company}</p>
                                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">RUC: {c.ruc}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <p className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1">
                                                {c.start} <ArrowRight className="w-3 h-3 text-gray-300" /> {c.end}
                                            </p>
                                            <ExpiryTrafficLight urgency={c.expiryUrgency} />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <ModalityBadge modality={c.modality} />
                                    </td>
                                    <td className="px-6 py-4 text-xs font-medium text-gray-600 uppercase">{c.type}</td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={c.status} />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 text-gray-300 group-hover:text-indigo-600 group-hover:bg-indigo-50 rounded-xl transition-all">
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
};
