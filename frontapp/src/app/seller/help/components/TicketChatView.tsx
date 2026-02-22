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
        <div className="flex flex-col h-full bg-white relative animate-fadeIn">
            {/* Header */}
            <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-sky-50 rounded-2xl flex items-center justify-center text-sky-500 shadow-sm shadow-sky-100">
                        <Icon name={ticket.escalated ? 'ShieldCheck' : 'Headset'} className={`text-2xl font-bold w-6 h-6 ${ticket.escalated ? 'animate-pulse' : ''}`} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-sky-500 uppercase tracking-widest">CASO #{ticket.id_display}</span>
                            {ticket.critical && <span className="bg-rose-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase animate-pulse">Crítico</span>}
                        </div>
                        <h2 className="text-xl font-black text-gray-800 tracking-tight leading-none mt-1">{ticket.titulo}</h2>
                    </div>
                </div>

                {ticket.status !== 'cerrado' && !ticket.survey_required && (
                    <button
                        onClick={onCloseTicket}
                        disabled={isClosing}
                        className={`px-6 py-3 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-gray-200 ${isClosing ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isClosing ? 'Cerrando...' : 'Cerrar Ticket'}
                    </button>
                )}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-10 space-y-8 flex flex-col no-scrollbar bg-slate-50/20">
                {/* Store Info Banner */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 p-6 bg-white border border-gray-100 rounded-[2.5rem] shadow-sm mb-4">
                    <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Identidad Comercial</p>
                        <p className="text-xs font-black text-gray-700">{ticket.tienda.nombre_comercial}</p>
                    </div>
                    <div className="hidden md:block">
                        <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Contacto Directo</p>
                        <p className="text-xs font-black text-gray-700">{ticket.contacto_adm.nombre} {ticket.contacto_adm.apellido}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Correo Enlazado</p>
                        <p className="text-xs font-black text-sky-600 truncate">{ticket.contacto_adm.correo}</p>
                    </div>
                </div>

                {/* Messages */}
                {ticket.mensajes.map((msg: any) => (
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
