'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/Icon';

interface MessageInputProps {
  onSend: (message: string) => void;
  placeholder?: string;
}

export default function MessageInput({ onSend, placeholder = 'Escribe un mensaje...' }: MessageInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    onSend(message);
    setMessage('');
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 border-t border-gray-50">
      <div className="flex gap-3 bg-gray-50 p-2 pl-6 rounded-[2.5rem] border border-gray-100 focus-within:border-emerald-200 focus-within:ring-4 focus-within:ring-emerald-500/5 transition-all">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-2 bg-transparent border-none text-xs font-bold text-gray-700 placeholder:text-gray-300 focus:ring-0 outline-none"
        />
        <button
          type="submit"
          disabled={!message.trim()}
          className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center hover:bg-emerald-600 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <Icon name="Send" className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
}
