'use client';

import React, { useState, useRef } from 'react';
import Icon from '@/components/ui/Icon';
interface ChatInputProps {
    onSendMessage: (text: string, attachments?: any[]) => void;
    quickReplies: string[];
    disabled?: boolean;
}

export default function ChatInput({ onSendMessage, quickReplies, disabled }: ChatInputProps) {
    const [message, setMessage] = useState('');
    const [showQuickReplies, setShowQuickReplies] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const textAreaRef = useRef<HTMLInputElement>(null);

    const handleFormat = (type: 'bold' | 'italic') => {
        const input = textAreaRef.current;
        if (!input) return;

        const start = input.selectionStart || 0;
        const end = input.selectionEnd || 0;
        const text = input.value;
        const selected = text.substring(start, end);

        let formatted = '';
        if (type === 'bold') formatted = `**${selected}**`;
        if (type === 'italic') formatted = `*${selected}*`;

        const newText = text.substring(0, start) + formatted + text.substring(end);
        setMessage(newText);

        // Re-focus and set selection
        setTimeout(() => {
            input.focus();
            input.setSelectionRange(start, start + formatted.length);
        }, 0);
    };

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;
        onSendMessage(message);
        setMessage('');
    };

    return (
        <div className="p-3 bg-white border-t border-gray-50">
            {/* Quick Replies - Collapsible */}
            <button
                type="button"
                onClick={() => setShowQuickReplies(!showQuickReplies)}
                className="text-[9px] font-black text-sky-500 uppercase tracking-wider hover:underline mb-2"
            >
                {showQuickReplies ? '▼ Ocultar' : '▶ Respuestas rápidas'}
            </button>
            {showQuickReplies && (
                <div className="flex flex-wrap gap-1 mb-2">
                    {quickReplies.map((reply, i) => (
                        <button
                            key={i}
                            onClick={() => setMessage(reply)}
                            className="px-2 py-1 bg-gray-100 hover:bg-sky-100 text-[9px] font-bold text-gray-600 rounded-lg transition-all"
                        >
                            {reply.length > 20 ? reply.substring(0, 20) + '...' : reply}
                        </button>
                    ))}
                </div>
            )}

            <form onSubmit={handleSend} className="flex gap-2 bg-gray-50 p-2 rounded-xl border border-gray-100 items-center">
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-8 h-8 text-gray-400 hover:text-sky-500 hover:bg-white rounded-lg flex items-center justify-center transition-all"
                >
                    <Icon name="Paperclip" className="text-lg w-4 h-4" />
                </button>

                <input
                    type="text"
                    ref={textAreaRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={disabled}
                    className="flex-1 bg-transparent border-none focus:ring-0 text-xs font-medium px-2 disabled:opacity-50 outline-none"
                    placeholder={disabled ? "Enviando..." : "Escribe un mensaje..."}
                />

                <button
                    type="submit"
                    disabled={!message.trim() || disabled}
                    className="w-8 h-8 bg-emerald-500 text-white rounded-lg flex items-center justify-center hover:bg-emerald-600 transition-all disabled:opacity-50"
                >
                    {disabled ? <Icon name="Loader2" className="animate-spin w-3 h-3" /> : <Icon name="Send" className="w-4 h-4" />}
                </button>
            </form>
        </div>
    );
}
