'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Ticket, Admin, Priority } from '@/lib/types/admin/helpdesk';
import { StatusBadge, scrollbarClass } from './HelpDeskShared';
import { UserPlus, AlertTriangle, CheckSquare, Send, MessageSquare } from 'lucide-react';

interface ChatViewProps {
    ticket: Ticket;
    admins: Admin[];
    onSendMessage: (text: string, isQuick?: boolean) => void;
    onPriorityChange: (id: number, priority: Priority) => void;
    onAdminChange: (id: number, adminId: number) => void;
    onEscalate: () => void;
    onCloseTicket: () => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
    ticket, admins, onSendMessage, onPriorityChange, onAdminChange, onEscalate, onCloseTicket
}) => {
    const [replyText, setReplyText] = useState('');
    const msgContainerRef = useRef<HTMLDivElement>(null);

    const quickReplies = [
        "Estamos revisando tu caso.",
        "El problema fue escalado al área técnica.",
        "Por favor adjunta evidencia adicional.",
        "Solicitud resuelta. ¿Podría confirmar si está conforme?",
        "Hemos verificado sus documentos y están correctos."
    ];

    useEffect(() => {
        if (msgContainerRef.current) {
            msgContainerRef.current.scrollTop = msgContainerRef.current.scrollHeight;
        }
    }, [ticket.mensajes]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyText.trim()) return;
        onSendMessage(replyText);
        setReplyText('');
    };

    const handleQuickReply = (reply: string) => {
        onSendMessage(reply, true);
    };

    return (
        <div className="col-span-12 lg:col-span-7 h-full min-h-[600px]">
            <div className="h-full flex flex-col bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden relative">
                {/* Chat Header */}
                <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-white relative z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-sky-500 to-cyan-400 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-sky-100">
                            <UserPlus className="w-8 h-8" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-sky-500 font-industrial">{ticket.numero}</span>
                                <StatusBadge status={ticket.estado} />
                            </div>
                            <h2 className="text-lg font-black text-gray-900 tracking-tight leading-tight mb-0.5 font-industrial uppercase">{ticket.asunto}</h2>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-industrial">
                                {ticket.vendedor.nombre} · {ticket.vendedor.empresa}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={onEscalate}
                            title="Escalar Caso"
                            className="w-10 h-10 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center hover:bg-amber-100 transition-all border border-amber-100"
                        >
                            <AlertTriangle className="w-5 h-5" />
                        </button>
                        <button
                            onClick={onCloseTicket}
                            title="Cerrar Ticket"
                            className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-100 transition-all border border-red-100"
                        >
                            <CheckSquare className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Chat Messages */}
                <div ref={msgContainerRef} className={`flex-1 p-8 space-y-6 bg-gray-50/30 ${scrollbarClass}`}>
                    {ticket.mensajes.map((m) => {
                        const isAdmin = m.usuario.includes('(Admin)') || m.usuario === 'Sistema Lyrium';
                        return (
                            <div key={m.id} className={`flex w-full ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                                <div className={`flex flex-col max-w-[80%] space-y-1.5 ${isAdmin ? 'items-end' : 'items-start'}`}>
                                    <div className="flex items-center gap-2 px-1">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest font-industrial">
                                            {m.tipo === 'respuesta_rapida' && '📋 '}
                                            {m.tipo === 'escalamiento' && '🔄 '}
                                            {m.usuario}
                                        </span>
                                        <span className="text-[9px] font-bold text-gray-300 tracking-wider font-industrial">{m.timestamp}</span>
                                    </div>
                                    <div className={`p-5 rounded-[2rem] text-sm font-medium leading-relaxed relative shadow-sm border border-black/5 ${isAdmin ? 'bg-sky-500 text-white italic rounded-tr-none' : 'bg-emerald-500 text-white rounded-tl-none'
                                        }`}>
                                        {m.contenido}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Chat Footer */}
                <div className="p-8 bg-white border-t border-gray-50 space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-6">
                            <div className="flex flex-col">
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1 font-industrial">Prioridad Actual</label>
                                <select
                                    value={ticket.prioridad}
                                    onChange={(e) => onPriorityChange(ticket.id, e.target.value as Priority)}
                                    className="bg-transparent border-none p-0 text-xs font-black text-gray-800 focus:ring-0 font-industrial"
                                >
                                    <option value="Baja">Baja Priority</option>
                                    <option value="Media">Media Priority</option>
                                    <option value="Alta">Alta Priority</option>
                                    <option value="Crítica">Crítica Priority</option>
                                </select>
                            </div>
                            <div className="w-px h-8 bg-gray-100"></div>
                            <div className="flex flex-col">
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1 font-industrial">Asignado a</label>
                                <select
                                    value={ticket.admin_asignado.id}
                                    onChange={(e) => onAdminChange(ticket.id, parseInt(e.target.value))}
                                    className="bg-transparent border-none p-0 text-xs font-black text-gray-800 focus:ring-0 font-industrial"
                                >
                                    {admins.map(a => <option key={a.id} value={a.id}>{a.nombre}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Quick Replies */}
                    <div className="flex flex-wrap gap-2 px-2">
                        {quickReplies.map((qr, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => handleQuickReply(qr)}
                                className="px-3 py-1.5 bg-gray-100 hover:bg-sky-100 text-[10px] font-bold text-gray-500 rounded-xl transition-all border border-gray-100 hover:border-sky-200 font-industrial"
                            >
                                {qr}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} className="relative group">
                        <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            rows={3}
                            placeholder="Escribe una respuesta estratégica (RF-05)..."
                            className="w-full p-6 bg-gray-50 border-none rounded-[1.5rem] text-xs font-medium text-gray-600 resize-none focus:ring-2 focus:ring-sky-500/10 transition-all pr-32 font-industrial"
                        />
                        <button
                            type="submit"
                            className="absolute right-4 bottom-4 px-6 py-3 bg-gray-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2 font-industrial"
                        >
                            Enviar <Send className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
