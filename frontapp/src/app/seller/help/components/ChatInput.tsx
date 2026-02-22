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
        <div className="p-4 bg-white border-t border-gray-50">
            {/* Quick Replies */}
            <div className="flex flex-wrap gap-2 mb-3">
                {quickReplies.map((reply, i) => (
                    <button
                        key={i}
                        onClick={() => setMessage(reply)}
                        className="px-3 py-1 bg-gray-100 hover:bg-sky-100 text-[10px] font-bold text-gray-600 rounded-lg transition-all"
                    >
                        {reply}
                    </button>
                ))}
            </div>

            {/* Toolbar */}
            <div className="flex gap-2 mb-2 px-1">
                <button
                    type="button"
                    onClick={() => handleFormat('bold')}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-sky-500 hover:bg-sky-50 transition-all"
                >
                    <Icon name="Bold" className="text-lg w-5 h-5" />
                </button>
                <button
                    type="button"
                    onClick={() => handleFormat('italic')}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-sky-500 hover:bg-sky-50 transition-all font-serif"
                >
                    <Icon name="Italic" className="text-lg w-5 h-5" />
                </button>
                <div className="w-[1px] h-4 bg-gray-100 self-center mx-1"></div>
                <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest self-center">Máx: 5MB • No Videos</span>
            </div>

            <form onSubmit={handleSend} className="flex gap-3 bg-gray-50 p-2 rounded-2xl border border-gray-100 items-center">
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    multiple
                    accept="image/*,.pdf,.doc,.docx"
                    onChange={(e) => {
                        const count = e.target.files?.length;
                        if (count) alert(`${count} archivo(s) seleccionados (Función Mock)`);
                    }}
                />
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-10 h-10 text-gray-400 hover:text-sky-500 hover:bg-white rounded-xl flex items-center justify-center transition-all"
                >
                    <Icon name="Paperclip" className="text-xl w-6 h-6" />
                </button>

                <input
                    type="text"
                    ref={textAreaRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={disabled}
                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium px-2 disabled:opacity-50 outline-none"
                    placeholder={disabled ? "Enviando..." : "Escribe un mensaje al soporte..."}
                />

                <button
                    type="submit"
                    disabled={!message.trim() || disabled}
                    className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100 disabled:opacity-50 disabled:shadow-none"
                >
                    {disabled ? <Icon name="Loader2" className="animate-spin w-4 h-4" /> : <Icon name="Send" className="w-5 h-5" />}
                </button>
            </form>
        </div>
    );
}
