'use client';

import React, { useState, useEffect } from 'react';
import ModuleHeader from '@/components/layout/shared/ModuleHeader';
import BaseButton from '@/components/ui/BaseButton';
import Icon from '@/components/ui/Icon';
import { useLogisticsHelpdesk } from '@/hooks/useLogisticsHelpdesk';
import ChatLayout from '@/components/shared/chat/ChatLayout';
import TicketList, { Ticket } from '@/components/shared/helpdesk/TicketList';
import TicketStats from '@/components/shared/helpdesk/TicketStats';
import MessageBubble from '@/components/shared/chat/MessageBubble';
import MessageInput from '@/components/shared/chat/MessageInput';

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

    const [loading, setLoading] = useState(true);
    const [showNewTicketModal, setShowNewTicketModal] = useState(false);
    const [newTicketSubject, setNewTicketSubject] = useState('');
    const [newTicketContent, setNewTicketContent] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const handleCreateTicket = () => {
        if (!newTicketSubject.trim() || !newTicketContent.trim()) return;
        createTicket(newTicketSubject, newTicketContent);
        setNewTicketSubject('');
        setNewTicketContent('');
        setShowNewTicketModal(false);
    };

    const handleReply = (message: string) => {
        if (!selectedTicket) return;
        addMessage(selectedTicket.id, message);
    };

    const ticketData: Ticket[] = tickets.map(t => ({
        id: t.id,
        subject: t.subject,
        status: t.status,
        priority: t.priority,
        updatedAt: t.updatedAt,
    }));

    const filteredTickets = filters.status === 'all' 
        ? ticketData 
        : ticketData.filter(t => t.status === filters.status);

    const messages = selectedTicket?.messages.map(msg => ({
        sender: msg.sender,
        content: msg.content,
        timestamp: msg.timestamp,
    })) || [];

    const listContent = (
        <>
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
                            className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filters.status === id ? `${btn.color} text-white shadow-lg` : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                        >
                            {btn.label}
                        </button>
                    );
                })}
            </div>
            <TicketList
                tickets={filteredTickets}
                selectedId={selectedTicket?.id}
                onSelect={(id) => setSelectedTicket(tickets.find(t => t.id === id) || null)}
                loading={loading}
                accentColor="violet"
                features={{ showPriority: true }}
            />
        </>
    );

    const detailContent = loading ? (
        <div className="flex-1 flex flex-col">
            <div className="p-8 border-b border-gray-50 space-y-4">
                <div className="flex justify-between">
                    <div className="h-8 w-2/3 bg-gray-200 rounded-xl animate-pulse" />
                    <div className="h-8 w-24 bg-gray-200 rounded-full animate-pulse" />
                </div>
                <div className="h-3 w-48 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="flex-1 p-8 space-y-6 bg-gray-50/30">
                <div className="h-24 w-3/4 bg-gray-200 rounded-3xl rounded-tl-none animate-pulse" />
                <div className="h-24 w-2/3 bg-gray-200 rounded-3xl rounded-tr-none ml-auto animate-pulse" />
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
            <div className="p-8 border-b border-gray-50 bg-violet-50/10 backdrop-blur-sm relative z-10">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-xl font-black text-gray-900 tracking-tighter uppercase italic">{selectedTicket.subject}</h3>
                        <p className="text-[10px] text-violet-500 font-extrabold mt-1 tracking-widest uppercase">Referencia de Servicio: {selectedTicket.id}</p>
                    </div>
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                        selectedTicket.status === 'open' ? 'bg-rose-100 text-rose-600' :
                        selectedTicket.status === 'in_progress' ? 'bg-amber-100 text-amber-600' :
                        selectedTicket.status === 'resolved' ? 'bg-emerald-100 text-emerald-600' :
                        'bg-gray-100 text-gray-600'
                    }`}>
                        {selectedTicket.status === 'open' ? 'Abierto' :
                         selectedTicket.status === 'in_progress' ? 'En Proceso' :
                         selectedTicket.status === 'resolved' ? 'Resuelto' : 'Cerrado'}
                    </span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-gray-50/30 custom-scrollbar">
                <MessageBubble messages={messages} />
            </div>

            {selectedTicket.status !== 'resolved' && selectedTicket.status !== 'closed' && (
                <MessageInput onSend={handleReply} placeholder="Escribe una respuesta técnica..." />
            )}
        </>
    );

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

            <TicketStats
                stats={ticketStats}
                loading={loading}
                features={{ showStats: true }}
            />

            <div className="grid grid-cols-12 gap-8">
                <div className="col-span-12 md:col-span-5 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                    {listContent}
                </div>
                <div className="col-span-12 md:col-span-7 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
                    {detailContent}
                </div>
            </div>

            {showNewTicketModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md animate-fadeIn" onClick={() => setShowNewTicketModal(false)} />
                    <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl relative overflow-hidden p-10 animate-bounceIn">
                        <div className="h-3 w-full absolute top-0 left-0 bg-violet-600" />
                        <h3 className="text-2xl font-black text-gray-900 tracking-tighter uppercase italic mb-6">Apertura de Incidencia</h3>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Título de la incidencia..."
                                value={newTicketSubject}
                                onChange={(e) => setNewTicketSubject(e.target.value)}
                                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-xs font-black focus:ring-2 focus:ring-violet-500/10"
                            />
                            <textarea
                                placeholder="Describe el problema..."
                                value={newTicketContent}
                                onChange={(e) => setNewTicketContent(e.target.value)}
                                rows={4}
                                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-xs font-black focus:ring-2 focus:ring-violet-500/10 resize-none"
                            />
                            <div className="flex gap-3 pt-2">
                                <button onClick={() => setShowNewTicketModal(false)} className="flex-1 py-4 bg-gray-100 text-gray-400 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-gray-200">Cancelar</button>
                                <button onClick={handleCreateTicket} className="flex-1 py-4 bg-violet-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-violet-700">Crear Ticket</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
