'use client';

import React from 'react';
import { Ticket, TicketStatus, TicketType } from '@/features/seller/help/types';
import Icon from '@/components/ui/Icon';

interface TicketItemProps {
    ticket: Ticket;
    isActive: boolean;
    onClick: (id: number) => void;
}

const statusConfig: Record<TicketStatus, { label: string; class: string; border: string }> = {
    'abierto': { label: 'Abierto', class: 'bg-emerald-400 text-white', border: 'border-emerald-400' },
    'proceso': { label: 'En Proceso', class: 'bg-lime-400 text-white', border: 'border-lime-400' },
    'resuelto': { label: 'Resuelto', class: 'bg-sky-500 text-white', border: 'border-sky-500' },
    'cerrado': { label: 'Cerrado', class: 'bg-red-500 text-white', border: 'border-red-500' }
};

const categoryLabels: Record<TicketType, { label: string; color: string }> = {
    'tech': { label: 'Técnico', color: 'bg-blue-50 text-blue-600' },
    'admin': { label: 'Admin', color: 'bg-slate-50 text-slate-600' },
    'info': { label: 'Info', color: 'bg-sky-50 text-sky-600' },
    'comment': { label: 'Elogio', color: 'bg-emerald-50 text-emerald-600' },
    'followup': { label: 'Seguimiento', color: 'bg-amber-50 text-amber-600' },
    'payments': { label: 'Pagos', color: 'bg-rose-50 text-rose-600' },
    'documentation': { label: 'Trámites', color: 'bg-purple-50 text-purple-600' }
};

export default function TicketItem({ ticket, isActive, onClick }: TicketItemProps) {
    const status = statusConfig[ticket.status] || statusConfig.abierto;
    const cat = categoryLabels[ticket.type] || { label: 'Ticket', color: 'bg-gray-50 text-gray-500' };

    return (
        <div
            onClick={() => onClick(ticket.id)}
            className={`ticket-item glass-card p-5 border-l-4 hover:shadow-lg transition-all cursor-pointer group
                ${status.border}
                ${isActive ? '!bg-white !border-l-sky-700 !shadow-[0_10px_25px_-5px_rgba(3,105,161,0.1)]' : ''}`}
        >
            <div className="flex justify-between items-start mb-2">
                <span className={`text-[10px] font-black uppercase ${status.class.split(' ')[1]}`}>
                    #TK-{ticket.id_display}
                </span>
                <div className="flex gap-1">
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded-md text-[7px] font-black uppercase tracking-wider ${status.class}`}>
                        {status.label}
                    </span>
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded-md text-[7px] font-black uppercase tracking-wider ${cat.color}`}>
                        {cat.label}
                    </span>
                </div>
            </div>

            <h4 className={`font-black text-gray-800 text-sm group-hover:text-sky-500 transition-colors line-clamp-1
                ${isActive ? 'text-sky-600' : ''}`}>
                {ticket.titulo}
            </h4>
            <p className="text-[11px] text-gray-500 mt-1 line-clamp-1">{ticket.descripcion}</p>

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
                <span className="text-[9px] font-bold text-gray-400">{ticket.tiempo}</span>
                <div className="flex items-center gap-1 text-sky-500 font-bold text-[10px]">
                    <Icon name="MessageCircle" className="w-3 h-3" />
                    <span>{ticket.mensajes_count || 0}</span> Mensajes
                </div>
            </div>
        </div>
    );
}
