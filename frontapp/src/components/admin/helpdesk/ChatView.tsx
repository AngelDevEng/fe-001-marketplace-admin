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
    const [showQuickReplies, setShowQuickReplies] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
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
        <div className="flex-1 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full">
                {/* Chat Header */}
                <div className="flex-shrink-0 p-4 border-b border-gray-50 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-cyan-400 rounded-xl flex items-center justify-center text-white shadow-lg shadow-sky-100">
                            <UserPlus className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-sky-500">{ticket.numero}</span>
                                <StatusBadge status={ticket.estado} />
                            </div>
                            <h2 className="text-sm font-black text-gray-900 tracking-tight leading-tight truncate max-w-[200px]">{ticket.asunto}</h2>
                            <p className="text-[10px] font-bold text-gray-400 truncate max-w-[200px]">
                                {ticket.vendedor.nombre} · {ticket.vendedor.empresa}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={onEscalate}
                            title="Escalar Caso"
                            className="w-8 h-8 bg-amber-50 text-amber-500 rounded-lg flex items-center justify-center hover:bg-amber-100 transition-all border border-amber-100"
                        >
                            <AlertTriangle className="w-4 h-4" />
                        </button>
                        <button
                            onClick={onCloseTicket}
                            title="Cerrar Ticket"
                            className="w-8 h-8 bg-red-50 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-100 transition-all border border-red-100"
                        >
                            <CheckSquare className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Chat Messages - Área con scroll */}
                <div ref={msgContainerRef} className={`flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/30 ${scrollbarClass}`}>
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
                                    <div className={`max-w-[80%] p-5 rounded-[2rem] text-sm font-medium leading-relaxed relative shadow-sm border border-transparent transition-all ${isAdmin ? 'bg-sky-500 text-white italic rounded-tr-none' : 'bg-emerald-500 text-white rounded-tl-none'}`}>
                                        {m.contenido}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Chat Footer */}
                <div className="flex-shrink-0 p-3 bg-white border-t border-gray-50 space-y-2">
                    {/* Compact selects - Collapsible */}
                    <button
                        type="button"
                        onClick={() => setShowOptions(!showOptions)}
                        className="text-[9px] font-black text-gray-400 uppercase tracking-wider hover:underline"
                    >
                        {showOptions ? '▼ Ocultar opciones' : '▶ Opciones del ticket'}
                    </button>
                    {showOptions && (
                        <div className="flex items-center gap-4 text-xs bg-gray-50 p-2 rounded-lg">
                            <div className="flex items-center gap-2">
                                <span className="text-[9px] font-black text-gray-400 uppercase">Prioridad:</span>
                                <select
                                    value={ticket.prioridad}
                                    onChange={(e) => onPriorityChange(ticket.id, e.target.value as Priority)}
                                    className="bg-white border-none p-1 px-2 text-xs font-black text-gray-800 rounded-lg"
                                >
                                    <option value="Baja">Baja</option>
                                    <option value="Media">Media</option>
                                    <option value="Alta">Alta</option>
                                    <option value="Crítica">Crítica</option>
                                </select>
                            </div>
                            <div className="w-px h-4 bg-gray-200"></div>
                            <div className="flex items-center gap-2">
                                <span className="text-[9px] font-black text-gray-400 uppercase">Asignado:</span>
                                <select
                                    value={ticket.admin_asignado.id}
                                    onChange={(e) => onAdminChange(ticket.id, parseInt(e.target.value))}
                                    className="bg-white border-none p-1 px-2 text-xs font-black text-gray-800 rounded-lg max-w-[100px] truncate"
                                >
                                    {admins.map(a => <option key={a.id} value={a.id}>{a.nombre}</option>)}
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Quick Replies - Collapsible */}
                    <button
                        type="button"
                        onClick={() => setShowQuickReplies(!showQuickReplies)}
                        className="text-[9px] font-black text-sky-500 uppercase tracking-wider hover:underline"
                    >
                        {showQuickReplies ? '▼ Ocultar respuestas' : '▶ Respuestas rápidas'}
                    </button>
                    {showQuickReplies && (
                        <div className="flex flex-wrap gap-1">
                            {quickReplies.map((qr, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => handleQuickReply(qr)}
                                    className="px-2 py-1 bg-gray-100 hover:bg-sky-100 text-[9px] font-bold text-gray-500 rounded-lg transition-all"
                                >
                                    {qr.length > 25 ? qr.substring(0, 25) + '...' : qr}
                                </button>
                            ))}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="relative">
                        <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            rows={2}
                            placeholder="Escribe una respuesta..."
                            className="w-full p-3 bg-gray-50 border-none rounded-xl text-xs font-medium text-gray-600 resize-none focus:ring-2 focus:ring-sky-500/10 transition-all pr-20"
                        />
                        <button
                            type="submit"
                            className="absolute right-3 bottom-3 px-4 py-2 bg-sky-500 text-white rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-sky-600 transition-all flex items-center gap-1"
                        >
                            Enviar <Send className="w-3 h-3" />
                        </button>
                    </form>
                </div>
        </div>
    );
};
