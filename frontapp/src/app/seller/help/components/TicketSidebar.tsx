'use client';

import React from 'react';
import { Ticket, TicketType } from '@/lib/types/seller/helpDesk';
import TicketItem from './TicketItem';
import Icon from '@/components/ui/Icon';

interface TicketSidebarProps {
    tickets: Ticket[];
    activeTicketId: number | null;
    filters: {
        search: string;
        category: TicketType | 'all' | 'critical' | 'tech-critical';
    };
    onSetFilters: (filters: any) => void;
    onSetActiveTicket: (id: number | null) => void;
    onNewTicket: () => void;
}

export default function TicketSidebar({ tickets, activeTicketId, filters, onSetFilters, onSetActiveTicket, onNewTicket }: TicketSidebarProps) {
    return (
        <div className="flex flex-col h-full bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
            {/* Search & Filter Header */}
            <div className="p-4 space-y-3 border-b border-gray-50">
                <div className="relative">
                    <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Buscar ticket o ID..."
                        value={filters.search}
                        onChange={(e) => onSetFilters({ search: e.target.value })}
                        className="w-full pl-10 pr-3 py-2 bg-gray-50 border-none rounded-xl text-xs font-bold text-gray-700 placeholder:text-gray-300 transition-all outline-none"
                    />
                </div>

                <div className="flex gap-2">
                    <select
                        value={filters.category}
                        onChange={(e: any) => onSetFilters({ category: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-50 border-none rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-600 cursor-pointer outline-none"
                    >
                        <option value="all">Todas las Categorías</option>
                        <option value="tech">Soporte Técnico</option>
                        <option value="payments">Pagos / Facturas</option>
                        <option value="documentation">Trámites</option>
                        <option value="critical">🆘 Críticos</option>
                    </select>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        {tickets.length} Ticket{tickets.length !== 1 ? 's' : ''}
                    </span>
                    <button
                        onClick={onNewTicket}
                        className="text-[10px] font-black text-sky-500 uppercase tracking-widest hover:text-sky-600 transition-all flex items-center gap-1 active:scale-95"
                    >
                        <Icon name="PlusCircle" className="font-bold w-3 h-3" />
                        Nuevo Ticket
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-2 no-scrollbar">
                {tickets.length === 0 ? (
                    <div className="py-10 text-center opacity-40">
                        <Icon name="FolderOpen" className="text-4xl mb-2 mx-auto block font-bold w-10 h-10" />
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em]">Sin resultados</p>
                    </div>
                ) : (
                    tickets.map(ticket => (
                        <TicketItem
                            key={ticket.id}
                            ticket={ticket}
                            isActive={activeTicketId === ticket.id}
                            onClick={onSetActiveTicket}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
