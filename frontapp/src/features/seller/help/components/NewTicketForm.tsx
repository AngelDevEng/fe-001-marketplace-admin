'use client';

import React, { useState, useRef } from 'react';
import { TicketType } from '@/features/seller/help/types';

import BaseButton from '@/components/ui/BaseButton';
import Icon from '@/components/ui/Icon';

interface TicketFormData {
    asunto: string;
    tipo_ticket: string;
    criticidad: string;
    mensaje: string;
}

interface NewTicketFormProps {
    onCreateTicket: (data: TicketFormData) => void | Promise<void>;
    onCancel: () => void;
}

export default function NewTicketForm({ onCreateTicket, onCancel }: NewTicketFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);
    const messageRef = useRef<HTMLTextAreaElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formRef.current) return;

        const formData = new FormData(formRef.current);
        const data = Object.fromEntries(formData.entries()) as unknown as TicketFormData;

        setIsSubmitting(true);
        try {
            await onCreateTicket(data);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFormat = (type: 'bold' | 'italic') => {
        const input = messageRef.current;
        if (!input) return;

        const start = input.selectionStart || 0;
        const end = input.selectionEnd || 0;
        const text = input.value;
        const selected = text.substring(start, end);

        let formatted = '';
        if (type === 'bold') formatted = `** ${selected}** `;
        if (type === 'italic') formatted = `* ${selected}* `;

        const newText = text.substring(0, start) + formatted + text.substring(end);
        input.value = newText;
        input.focus();
        input.setSelectionRange(start, start + formatted.length);
    };

    return (
        <form ref={formRef} onSubmit={handleSubmit} className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Propósito del Ticket <span className="text-red-500">*</span></label>
                    <select
                        name="tipo_ticket"
                        required
                        className="w-full px-5 py-4 bg-gray-50 border-none rounded-3xl font-bold text-gray-700 focus:ring-4 focus:ring-sky-500/5 cursor-pointer outline-none transition-all"
                    >
                        <option value="payments">Pagos y Facturación</option>
                        <option value="tech">Soporte Técnico</option>
                        <option value="documentation">Trámites y Documentos</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 text-opacity-50">Nivel de Urgencia</label>
                    <select
                        name="criticidad"
                        required
                        className="w-full px-5 py-4 bg-gray-50 border-none rounded-3xl font-bold text-gray-700 focus:ring-4 focus:ring-sky-500/5 cursor-pointer outline-none transition-all"
                    >
                        <option value="baja">Baja</option>
                        <option value="media">Media</option>
                        <option value="alta">Alta</option>
                        <option value="critica">Crítica</option>
                    </select>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Asunto Principal <span className="text-red-500">*</span></label>
                <input
                    type="text"
                    name="asunto"
                    required
                    className="w-full px-6 py-5 bg-gray-50 border-none rounded-[2rem] font-bold text-gray-700 focus:ring-4 focus:ring-sky-500/5 outline-none transition-all"
                    placeholder="Describe brevemente el motivo..."
                />
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between ml-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Cuerpo de la Incidencia <span className="text-red-500">*</span></label>
                    <div className="flex gap-2">
                        <button type="button" onClick={() => handleFormat('bold')} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:bg-sky-50 hover:text-sky-500 rounded-lg transition-all"><Icon name="Bold" className="font-bold w-4 h-4" /></button>
                        <button type="button" onClick={() => handleFormat('italic')} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:bg-sky-50 hover:text-sky-500 rounded-lg transition-all"><Icon name="Italic" className="font-bold w-4 h-4" /></button>
                    </div>
                </div>
                <textarea
                    name="mensaje"
                    ref={messageRef}
                    required
                    rows={5}
                    className="w-full px-7 py-6 bg-gray-50 border-none rounded-[2.5rem] font-medium text-gray-600 text-sm focus:ring-4 focus:ring-sky-500/5 outline-none transition-all resize-none shadow-inner"
                    placeholder="Detalla los hechos, pasos para reproducir o dudas operativas..."
                ></textarea>
            </div>

            {/* File Upload Area */}
            <div className="space-y-3">
                <div className="flex justify-between items-center ml-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-gray-300">Evidencia Fotográfica / Documentos</label>
                    <span className="text-[9px] font-extrabold text-sky-400 uppercase tracking-tighter bg-sky-50 px-2 py-0.5 rounded-lg border border-sky-100/50">Límite 5MB</span>
                </div>
                <div className="relative group">
                    <input type="file" multiple name="adjuntos" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                    <div className="p-12 border-2 border-dashed border-gray-100 rounded-[3rem] bg-gray-50/10 group-hover:border-sky-300 group-hover:bg-sky-50/30 transition-all flex flex-col items-center justify-center gap-4 text-center">
                        <div className="w-14 h-14 bg-white rounded-2xl shadow-xl shadow-gray-200/50 flex items-center justify-center text-gray-300 group-hover:text-sky-500 transition-all group-hover:scale-110">
                            <Icon name="CloudUpload" className="text-3xl font-bold w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1 px-4">Adjuntar evidencias</p>
                            <p className="text-[9px] font-bold text-gray-300 uppercase italic">Arrastra hacia aquí o haz clic</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-8 gap-4 border-t border-gray-50">
                <BaseButton
                    variant="ghost"
                    onClick={onCancel}
                >
                    Descartar
                </BaseButton>
                <BaseButton
                    type="submit"
                    isLoading={isSubmitting}
                    variant="primary"
                    leftIcon="Send"
                    className="min-w-[200px]"
                >
                    Enviar Ticket
                </BaseButton>
            </div>
        </form>
    );
}
