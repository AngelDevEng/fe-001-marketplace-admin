'use client';

import React, { useState, useEffect } from 'react';
import ModuleHeader from '@/components/layout/shared/ModuleHeader';
import BaseButton from '@/components/ui/BaseButton';
import Skeleton from '@/components/ui/Skeleton';
import Icon from '@/components/ui/Icon';
import { useLogisticsHelpdesk } from '@/hooks/useLogisticsHelpdesk';

const colorMap: Record<string, string> = {
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    violet: 'bg-violet-50 text-violet-600 border-violet-100',
};

export default function LogisticsHelpdeskPage() {
    const {
        tickets,
        selectedTicket,
        setSelectedTicket,
        filters,
        setFilters,
        ticketStats,
        createTicket,
        addMessage,
    } = useLogisticsHelpdesk();

    const [simulatedLoading, setSimulatedLoading] = useState(true);
    const [showNewTicketModal, setShowNewTicketModal] = useState(false);
    const [newTicketSubject, setNewTicketSubject] = useState('');
    const [newTicketContent, setNewTicketContent] = useState('');
    const [replyContent, setReplyContent] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => setSimulatedLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const handleCreateTicket = () => {
        if (!newTicketSubject.trim() || !newTicketContent.trim()) return;
        createTicket(newTicketSubject, newTicketContent);
        setNewTicketSubject('');
        setNewTicketContent('');
        setShowNewTicketModal(false);
    };

    const handleReply = () => {
        if (!replyContent.trim() || !selectedTicket) return;
        addMessage(selectedTicket.id, replyContent);
        setReplyContent('');
    };

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'open': return { label: 'Abierto', color: 'bg-rose-100 text-rose-600' };
            case 'in_progress': return { label: 'En Proceso', color: 'bg-amber-100 text-amber-600' };
            case 'resolved': return { label: 'Resuelto', color: 'bg-emerald-100 text-emerald-600' };
            case 'closed': return { label: 'Cerrado', color: 'bg-gray-100 text-gray-600' };
            default: return { label: status, color: 'bg-gray-100 text-gray-600' };
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'urgent': return 'text-rose-500';
            case 'high': return 'text-orange-500';
            case 'medium': return 'text-amber-500';
            case 'low': return 'text-gray-400';
            default: return 'text-gray-400';
        }
    };

    return (
        <div className="space-y-8 animate-fadeIn pb-20 font-industrial">
            <ModuleHeader
                title="Mesa de Ayuda"
                subtitle="Protocolos de Soporte e Incidencias Administrativas (RF-05)"
                icon="Help"
                actions={
                    <BaseButton
                        onClick={() => setShowNewTicketModal(true)}
                        variant="primary"
                        leftIcon="Plus"
                        size="md"
                        className="shadow-xl shadow-violet-100"
                    >
                        Nuevo Ticket
                    </BaseButton>
                }
            />

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {simulatedLoading ? (
                    [1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-4">
                            <div className="flex justify-between items-center">
                                <Skeleton className="h-10 w-10 rounded-xl" />
                                <Skeleton className="h-8 w-10 rounded" />
                            </div>
                            <Skeleton className="h-4 w-24 rounded" />
                        </div>
                    ))
                ) : (
                    <>
                        {[
                            { label: 'Abiertos', value: ticketStats.open, icon: 'AlertCircle', color: 'rose' },
                            { label: 'En Proceso', value: ticketStats.inProgress, icon: 'Clock', color: 'amber' },
                            { label: 'Resueltos', value: ticketStats.resolved, icon: 'CheckCircle', color: 'emerald' },
                            { label: 'Total Histórico', value: ticketStats.total, icon: 'Inbox', color: 'violet' },
                        ].map((stat, i) => (
                            <div key={i} className="bg-white p-7 rounded-[2.5rem] border border-gray-100 shadow-sm group hover:shadow-md transition-all">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-4 ${colorMap[stat.color]} rounded-2xl flex items-center justify-center`}>
                                        <Icon name={stat.icon as any} className="w-5 h-5" />
                                    </div>
                                    <span className="text-2xl font-black text-gray-900 tracking-tighter">{stat.value}</span>
                                </div>
                                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</h3>
                            </div>
                        ))}
                    </>
                )}
            </div>

            <div className="grid grid-cols-12 gap-8">
                {/* Tickets List */}
                <div className="col-span-12 md:col-span-5 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                    {/* Filters */}
                    <div className="p-6 border-b border-gray-50 flex gap-2 overflow-x-auto no-scrollbar">
                        {(['all', 'open', 'in_progress'] as const).map((id) => {
                            const btn = {
                                all: { label: 'Todos', color: 'bg-violet-500' },
                                open: { label: 'Abiertos', color: 'bg-rose-500' },
                                in_progress: { label: 'Proceso', color: 'bg-amber-500' },
                            }[id];
                            return (
                                <button
                                    key={id}
                                    onClick={() => setFilters(prev => ({ ...prev, status: id }))}
                                    className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filters.status === id ? `${btn.color} text-white shadow-lg` : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                                        }`}
                                >
                                    {btn.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* List */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {simulatedLoading ? (
                            <div className="p-4 space-y-4">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div key={i} className="p-6 bg-gray-50/50 rounded-3xl space-y-3">
                                        <div className="flex justify-between">
                                            <Skeleton className="h-4 w-2/3 rounded" />
                                            <Skeleton className="h-4 w-12 rounded-full" />
                                        </div>
                                        <Skeleton className="h-3 w-1/3 rounded" />
                                    </div>
                                ))}
                            </div>
                        ) : tickets.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center opacity-40">
                                <Icon name="Inbox" className="w-12 h-12 mb-4 text-gray-300" />
                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Sin casos pendientes</h3>
                            </div>
                        ) : (
                            tickets.map((ticket) => (
                                <button
                                    key={ticket.id}
                                    onClick={() => setSelectedTicket(ticket)}
                                    className={`w-full p-6 border-b border-gray-50 text-left hover:bg-violet-50/30 transition-all group relative ${selectedTicket?.id === ticket.id ? 'bg-violet-50/50' : ''
                                        }`}
                                >
                                    {selectedTicket?.id === ticket.id && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-12 bg-violet-600 rounded-r-full" />
                                    )}
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-black text-gray-800 uppercase tracking-tight group-hover:text-violet-600 transition-colors truncate">{ticket.subject}</p>
                                            <p className="text-[9px] text-gray-400 font-black mt-1 uppercase tracking-widest">Ticket #{ticket.id}</p>
                                        </div>
                                        <span className={`flex-shrink-0 px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-wider ${getStatusConfig(ticket.status).color}`}>
                                            {getStatusConfig(ticket.status).label}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between mt-4">
                                        <span className={`text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 ${getPriorityColor(ticket.priority)}`}>
                                            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                                            Prioridad {ticket.priority}
                                        </span>
                                        <span className="text-[9px] text-gray-400 font-bold">
                                            {new Date(ticket.updatedAt).toLocaleDateString('es-PE')}
                                        </span>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Ticket Detail */}
                <div className="col-span-12 md:col-span-7 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
                    {simulatedLoading ? (
                        <div className="flex-1 flex flex-col">
                            <div className="p-8 border-b border-gray-50 space-y-4">
                                <div className="flex justify-between">
                                    <Skeleton className="h-8 w-2/3 rounded-xl" />
                                    <Skeleton className="h-8 w-24 rounded-full" />
                                </div>
                                <Skeleton className="h-3 w-48 rounded" />
                            </div>
                            <div className="flex-1 p-8 space-y-6">
                                <Skeleton className="h-24 w-3/4 rounded-3xl rounded-tl-none" />
                                <div className="flex justify-end">
                                    <Skeleton className="h-24 w-2/3 rounded-3xl rounded-tr-none" />
                                </div>
                            </div>
                        </div>
                    ) : !selectedTicket ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-gray-50/30">
                            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 border border-gray-100">
                                <Icon name="MessageSquare" className="w-10 h-10 text-gray-200" />
                            </div>
                            <h3 className="text-xl font-black text-gray-400 uppercase tracking-widest mb-2">Visor de Incidencias</h3>
                            <p className="text-xs text-gray-400 max-w-xs leading-relaxed uppercase font-black tracking-tight">Selecciona un ticket para visualizar la trazabilidad de la resolución.</p>
                        </div>
                    ) : (
                        <>
                            {/* Header */}
                            <div className="p-8 border-b border-gray-50 bg-violet-50/10 backdrop-blur-sm relative z-10">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-xl font-black text-gray-900 tracking-tighter uppercase italic">{selectedTicket.subject}</h3>
                                        <p className="text-[10px] text-violet-500 font-extrabold mt-1 tracking-widest uppercase">Referencia de Servicio: {selectedTicket.id}</p>
                                    </div>
                                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${getStatusConfig(selectedTicket.status).color}`}>
                                        {getStatusConfig(selectedTicket.status).label}
                                    </span>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-gray-50/30 custom-scrollbar">
                                {selectedTicket.messages.map((msg) => (
                                    <div key={msg.id} className={`flex ${msg.sender === 'operator' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[85%] p-6 rounded-[2rem] shadow-sm transform transition-all ${msg.sender === 'operator'
                                            ? 'bg-violet-600 text-white rounded-tr-none shadow-violet-100'
                                            : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none'
                                            }`}>
                                            <div className="flex items-center gap-2 mb-2 opacity-60">
                                                <span className="text-[8px] font-black uppercase tracking-widest">{msg.senderName}</span>
                                                <span className="w-1 h-1 bg-current rounded-full"></span>
                                                <span className="text-[8px] font-black uppercase tracking-widest">{new Date(msg.timestamp).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                            <p className="text-xs font-medium leading-relaxed">{msg.content}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Reply */}
                            {selectedTicket.status !== 'resolved' && selectedTicket.status !== 'closed' && (
                                <div className="p-6 border-t border-gray-50 bg-white">
                                    <div className="flex gap-3 bg-gray-50 p-2 rounded-[2.5rem] border border-gray-100 focus-within:border-violet-200 focus-within:ring-4 focus-within:ring-violet-500/5 transition-all">
                                        <input
                                            type="text"
                                            value={replyContent}
                                            onChange={(e) => setReplyContent(e.target.value)}
                                            placeholder="Escribe una respuesta técnica..."
                                            className="flex-1 px-6 bg-transparent border-none text-xs font-black focus:ring-0 placeholder:text-gray-400"
                                            onKeyPress={(e) => e.key === 'Enter' && handleReply()}
                                        />
                                        <button
                                            onClick={handleReply}
                                            className="w-12 h-12 bg-violet-600 text-white rounded-full flex items-center justify-center hover:bg-violet-700 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-violet-100"
                                        >
                                            <Icon name="Send" className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* New Ticket Modal */}
            {showNewTicketModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md animate-fadeIn" onClick={() => setShowNewTicketModal(false)} />
                    <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl relative overflow-hidden p-10 animate-bounceIn">
                        <div className="h-3 w-full absolute top-0 left-0 bg-violet-600"></div>

                        <h3 className="text-2xl font-black text-gray-900 tracking-tighter uppercase italic mb-6">
                            Apertura de Incidencia
                        </h3>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Asunto Operativo</label>
                                <input
                                    type="text"
                                    value={newTicketSubject}
                                    onChange={(e) => setNewTicketSubject(e.target.value)}
                                    placeholder="Ej: Retraso en entrega #9822..."
                                    className="w-full p-5 bg-gray-50 border-none rounded-2xl text-xs font-black"
                                    autoFocus
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Cuerpo del Mensaje</label>
                                <textarea
                                    value={newTicketContent}
                                    onChange={(e) => setNewTicketContent(e.target.value)}
                                    placeholder="Detalla la situación administrativa o técnica..."
                                    className="w-full p-5 bg-gray-50 border-none rounded-2xl text-xs font-medium resize-none"
                                    rows={4}
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 mt-10">
                            <button
                                onClick={handleCreateTicket}
                                className="flex-1 py-5 bg-violet-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-violet-700 transition-all shadow-2xl shadow-violet-200 flex items-center justify-center gap-3"
                            >
                                <Icon name="Send" className="w-4 h-4" /> Emitir Reporte
                            </button>
                            <button
                                onClick={() => setShowNewTicketModal(false)}
                                className="px-10 py-5 bg-gray-100 text-gray-500 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-gray-200 transition-all"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
