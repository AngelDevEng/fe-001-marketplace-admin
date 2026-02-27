'use client';

import React from 'react';
import Icon from '@/components/ui/Icon';

export interface Ticket {
  id: string;
  subject: string;
  status: string;
  priority?: string;
  updatedAt: string;
}

export interface HelpdeskFeatures {
  showPriority?: boolean;
  showStats?: boolean;
  canCloseTicket?: boolean;
}

interface TicketListProps {
  tickets: Ticket[];
  selectedId?: string;
  onSelect: (id: string) => void;
  features?: HelpdeskFeatures;
  loading?: boolean;
}

const defaultFeatures: HelpdeskFeatures = {
  showPriority: true,
  canCloseTicket: false,
};

const accentColorMap = {
  emerald: {
    activeBg: 'bg-emerald-50/50',
    hoverBg: 'hover:bg-emerald-50/30',
    indicator: 'bg-emerald-500',
    statusColors: {
      open: 'bg-rose-100 text-rose-600',
      in_progress: 'bg-amber-100 text-amber-600',
      resolved: 'bg-emerald-100 text-emerald-600',
      closed: 'bg-gray-100 text-gray-600',
    }
  },
  violet: {
    activeBg: 'bg-violet-50/50',
    hoverBg: 'hover:bg-violet-50/30',
    indicator: 'bg-violet-500',
    statusColors: {
      open: 'bg-rose-100 text-rose-600',
      in_progress: 'bg-amber-100 text-amber-600',
      resolved: 'bg-emerald-100 text-emerald-600',
      closed: 'bg-gray-100 text-gray-600',
    }
  },
  sky: {
    activeBg: 'bg-sky-50/50',
    hoverBg: 'hover:bg-sky-50/30',
    indicator: 'bg-sky-500',
    statusColors: {
      open: 'bg-rose-100 text-rose-600',
      in_progress: 'bg-amber-100 text-amber-600',
      resolved: 'bg-emerald-100 text-emerald-600',
      closed: 'bg-gray-100 text-gray-600',
    }
  },
};

const statusLabels: Record<string, string> = {
  open: 'Abierto',
  in_progress: 'En Proceso',
  resolved: 'Resuelto',
  closed: 'Cerrado',
};

const priorityColors: Record<string, string> = {
  urgent: 'text-rose-500',
  high: 'text-orange-500',
  medium: 'text-amber-500',
  low: 'text-gray-400',
};

export default function TicketList({
  tickets,
  selectedId,
  onSelect,
  features: customFeatures,
  loading = false,
  accentColor = 'emerald',
}: TicketListProps & { accentColor?: 'emerald' | 'violet' | 'sky' }) {
  const features = { ...defaultFeatures, ...customFeatures };
  const accent = accentColorMap[accentColor];

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 text-center">
        <div>
          <Icon name="Inbox" className="w-12 h-12 mx-auto mb-4 text-gray-200" />
          <p className="text-xs text-gray-400 font-black uppercase tracking-widest">
            Sin tickets
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar">
      {tickets.map((ticket) => (
        <button
          key={ticket.id}
          onClick={() => onSelect(ticket.id)}
          className={`w-full p-6 border-b border-gray-50 text-left hover:bg-gray-50/30 transition-all relative group ${
            selectedId === ticket.id 
              ? accent.activeBg 
              : ''
          }`}
        >
          {/* Active indicator */}
          {selectedId === ticket.id && (
            <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-12 ${accent.indicator} rounded-r-full`} />
          )}
          
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-gray-800 uppercase tracking-tight group-hover:text-gray-600 transition-colors truncate">
                {ticket.subject}
              </p>
              <p className="text-[9px] text-gray-400 font-black mt-1 uppercase tracking-widest">
                Ticket #{ticket.id}
              </p>
            </div>
            
            {/* Status badge */}
            <span className={`flex-shrink-0 px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-wider ${
              accent.statusColors[ticket.status as keyof typeof accent.statusColors] || 'bg-gray-100 text-gray-600'
            }`}>
              {statusLabels[ticket.status] || ticket.status}
            </span>
          </div>
          
          {/* Priority indicator */}
          {features.showPriority && ticket.priority && (
            <div className="flex items-center justify-between mt-4">
              <span className={`text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 ${priorityColors[ticket.priority] || 'text-gray-400'}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                Prioridad {ticket.priority}
              </span>
              <span className="text-[9px] text-gray-400 font-bold">
                {new Date(ticket.updatedAt).toLocaleDateString('es-PE')}
              </span>
            </div>
          )}
        </button>
      ))}
    </div>
  );
}
