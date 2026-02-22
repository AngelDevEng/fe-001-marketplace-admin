import React from 'react';
import { Ticket, TicketStatus, Priority } from '@/lib/types/admin/helpdesk';
import { StatusBadge, PriorityDot, scrollbarClass, glassCardClass } from './HelpDeskShared';
import { Search, MessageSquare } from 'lucide-react';

interface TicketListProps {
    tickets: Ticket[];
    selectedId: number | null;
    onSelect: (id: number) => void;
    onFilterChange: (filters: { search?: string; status?: TicketStatus | ''; priority?: Priority | '' }) => void;
    filters: { search: string; status: TicketStatus | ''; priority: Priority | '' };
}

export const TicketList: React.FC<TicketListProps> = ({
    tickets, selectedId, onSelect, onFilterChange, filters
}) => {
    return (
        <div className="col-span-12 lg:col-span-5 space-y-6">
            <div className={`${glassCardClass} p-6 space-y-6`}>
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Buscar por #Ticket, Vendedor o Asunto..."
                        value={filters.search}
                        onChange={(e) => onFilterChange({ search: e.target.value })}
                        className="w-full pl-12 pr-6 py-4 bg-gray-50 border-none rounded-2xl text-xs font-medium focus:ring-2 focus:ring-sky-500/20 transition-all font-industrial"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <select
                        value={filters.status}
                        onChange={(e) => onFilterChange({ status: e.target.value as TicketStatus | '' })}
                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-[10px] font-black uppercase text-gray-500 tracking-wider font-industrial"
                    >
                        <option value="">Todos los Estados</option>
                        <option value="Abierto">Abierto</option>
                        <option value="En Proceso">En Proceso</option>
                        <option value="Cerrado">Cerrado</option>
                    </select>
                    <select
                        value={filters.priority}
                        onChange={(e) => onFilterChange({ priority: e.target.value as Priority | '' })}
                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-[10px] font-black uppercase text-gray-500 tracking-wider font-industrial"
                    >
                        <option value="">Todas las Prioridades</option>
                        <option value="Baja">Baja</option>
                        <option value="Media">Media</option>
                        <option value="Alta">Alta</option>
                        <option value="Crítica">Crítica</option>
                    </select>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between px-2 mb-2">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest font-industrial">{tickets.length} Casos</h3>
                </div>
                <div className={`space-y-4 max-h-[600px] ${scrollbarClass}`}>
                    {tickets.map((t) => (
                        <div
                            key={t.id}
                            onClick={() => onSelect(t.id)}
                            className={`bg-white p-6 rounded-[2rem] border transition-all cursor-pointer relative group ${selectedId === t.id ? 'border-sky-500/30 bg-sky-50/50' : 'border-gray-100 hover:border-sky-500/20 hover:shadow-xl'
                                }`}
                        >
                            {selectedId === t.id && (
                                <div className="absolute inset-y-8 left-0 w-1 bg-sky-500 rounded-r-full"></div>
                            )}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <PriorityDot priority={t.prioridad} />
                                    <span className="text-xs font-black text-gray-400 group-hover:text-sky-500 transition-colors tracking-tighter font-industrial">
                                        {t.numero}
                                    </span>
                                </div>
                                <StatusBadge status={t.estado} />
                            </div>
                            <h4 className="text-sm font-black text-gray-800 tracking-tight line-clamp-1 mb-2 group-hover:text-sky-600 transition-colors font-industrial uppercase">
                                {t.asunto}
                            </h4>
                            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-50/50">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-gray-900 leading-none mb-1 uppercase tracking-wider font-industrial">
                                        {t.vendedor.empresa}
                                    </span>
                                    <span className="text-[9px] font-bold text-gray-400 font-industrial">Prioridad: {t.prioridad}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-300">
                                    <div className="flex items-center gap-1">
                                        <MessageSquare className="w-4 h-4" />
                                        <span className="text-[10px] font-black font-industrial">{t.mensajes.length}</span>
                                    </div>
                                    {t.mensajes_sin_leer > 0 && (
                                        <div className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-pulse"></div>
                                    )}
                                    <span className="text-[9px] font-bold text-gray-400 font-industrial">{t.fecha_actualizacion}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {tickets.length === 0 && (
                        <div className="p-10 text-center text-gray-300 font-bold italic text-sm">
                            No se encontraron casos con los filtros aplicados
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
