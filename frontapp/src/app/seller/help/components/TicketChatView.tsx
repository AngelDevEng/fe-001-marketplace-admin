'use client';

import React from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import SurveyArea from './SurveyArea';
import { Ticket } from '@/lib/types/seller/helpDesk';
import Icon from '@/components/ui/Icon';

interface TicketChatViewProps {
    ticket: Ticket | null;
    isSending: boolean;
    isClosing: boolean;
    onSendMessage: (params: { text: string }) => void;
    onCloseTicket: () => void;
    onSubmitSurvey: (params: { rating: number; comment: string }) => void;
}

export default function TicketChatView({ ticket, isSending, isClosing, onSendMessage, onCloseTicket, onSubmitSurvey }: TicketChatViewProps) {
    if (!ticket) return null;

    return (
        <div className="flex flex-col h-full bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden animate-fadeIn">
            {/* Header */}
            <div className="border-b border-gray-50 flex justify-between items-center bg-white p-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center text-sky-500 shadow-sm">
                        <Icon name={ticket.escalated ? 'ShieldCheck' : 'Headset'} className={`text-xl font-bold w-5 h-5 ${ticket.escalated ? 'animate-pulse' : ''}`} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-sky-500 uppercase">#{ticket.id_display}</span>
                            {ticket.critical && <span className="bg-rose-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase">Crítico</span>}
                        </div>
                        <h2 className="text-sm font-black text-gray-800 tracking-tight truncate max-w-[200px]">{ticket.titulo}</h2>
                    </div>
                </div>

                {ticket.status !== 'cerrado' && !ticket.survey_required && (
                    <button
                        onClick={onCloseTicket}
                        disabled={isClosing}
                        className={`px-4 py-2 bg-gray-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all ${isClosing ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isClosing ? 'Cerrando...' : 'Cerrar'}
                    </button>
                )}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col no-scrollbar bg-slate-50/20">
                {/* Store Info Banner - Compacto */}
                <div className="flex items-center gap-4 p-3 bg-white border border-gray-100 rounded-2xl">
                    <div className="flex-1 min-w-0">
                        <p className="text-[9px] font-black text-gray-400 uppercase">Tienda</p>
                        <p className="text-xs font-black text-gray-700 truncate">{ticket.tienda.nombre_comercial}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[9px] font-black text-gray-400 uppercase">Contacto</p>
                        <p className="text-xs font-black text-gray-700 truncate">{ticket.contacto_adm.nombre}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[9px] font-black text-gray-400 uppercase">Correo</p>
                        <p className="text-xs font-black text-sky-600 truncate">{ticket.contacto_adm.correo}</p>
                    </div>
                </div>

                {/* Messages */}
                {ticket.mensajes.map((msg) => (
                    <ChatMessage key={msg.id} message={msg} />
                ))}

                {/* Mandatory Survey */}
                {ticket.survey_required && (
                    <SurveyArea onSubmit={(rating: number, comment: string) => onSubmitSurvey({ rating, comment })} />
                )}
            </div>

            {/* Input Area (Only if not closed or survey pending) */}
            {ticket.status !== 'cerrado' && !ticket.survey_required && (
                <ChatInput
                    onSendMessage={(text) => onSendMessage({ text })}
                    quickReplies={[
                        "Quiero que un asesor me contacte.",
                        "Necesito información sobre mi solicitud.",
                        "Quiero cancelar mi solicitud."
                    ]}
                    disabled={isSending}
                />
            )}

            {ticket.status === 'cerrado' && !ticket.survey_required && (
                <div className="p-6 bg-gray-50 border-t border-gray-100 text-center">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Este ticket ha sido resuelto y archivado.</p>
                </div>
            )}
        </div>
    );
}
