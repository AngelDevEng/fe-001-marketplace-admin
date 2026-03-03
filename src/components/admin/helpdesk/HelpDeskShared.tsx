import React from 'react';
import { Priority, TicketStatus } from '@/lib/types/admin/helpdesk';

export const StatusBadge: React.FC<{ status: TicketStatus }> = ({ status }) => {
    const classes: Record<TicketStatus, string> = {
        'Abierto': 'bg-emerald-500 text-white',
        'En Proceso': 'bg-amber-400 text-white',
        'Resuelto': 'bg-sky-500 text-white',
        'Cerrado': 'bg-red-500 text-white',
        'Reabierto': 'bg-cyan-600 text-white'
    };

    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[8px] font-extrabold uppercase tracking-wider ${classes[status] || 'bg-gray-400 text-white'}`}>
            {status}
        </span>
    );
};

export const PriorityDot: React.FC<{ priority: Priority }> = ({ priority }) => {
    const classes: Record<Priority, string> = {
        'Baja': 'bg-gray-300',
        'Media': 'bg-sky-400',
        'Alta': 'bg-amber-400',
        'Crítica': 'bg-red-500'
    };

    return <span className={`w-2.5 h-2.5 rounded-full ${classes[priority] || 'bg-gray-200'}`} />;
};

export const glassCardClass = "bg-white/40 backdrop-blur-md border border-gray-100/50 rounded-[2rem] shadow-sm";
export const scrollbarClass = "overflow-y-auto pr-2 custom-scrollbar";
