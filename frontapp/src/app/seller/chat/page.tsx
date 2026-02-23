'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useSellerChat } from '@/hooks/useSellerChat';
import Icon from '@/components/ui/Icon';
import Skeleton from '@/components/ui/Skeleton';
import {
    MessageCircle,
    Search,
    ChevronLeft,
    MoreVertical,
    Trash2,
    AlertOctagon,
    Paperclip,
    Send,
    CheckCheck,
    MessageSquareOff,
    ShieldAlert,
    User,
    ArrowLeft
} from 'lucide-react';

export default function ChatPage() {
    const {
        conversations,
        totalConversations,
        activeConversation,
        setActiveConversation,
        isLoading,
        filters,
        setFilters,
        isMobileListVisible,
        setIsMobileListVisible,
        sendMessage,
        clearActiveChat,
        deleteActiveTicket,
        criticalCount
    } = useSellerChat();

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll a último mensaje
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [activeConversation?.mensajes]);

    return (
        <div className="grid grid-cols-12 gap-0 md:gap-8 animate-fadeIn font-industrial h-[calc(100vh-12rem)] max-w-7xl mx-auto">
            {/* SIDEBAR - Inteligencia de Inbox */}
            <aside className={`col-span-12 md:col-span-4 bg-white rounded-[3rem] border border-gray-100 shadow-2xl flex flex-col transition-all duration-500 relative overflow-hidden ${!isMobileListVisible ? 'hidden md:flex' : 'flex'}`}>
                <div className="absolute top-0 left-0 w-2 h-full bg-indigo-600"></div>

                {/* Header Side */}
                <div className="p-8 border-b border-gray-50 bg-gray-50/30">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-100 shrink-0">
                            <MessageCircle className="text-white w-6 h-6" />
                        </div>
                        <div className="min-w-0">
                            <h3 className="text-xl font-black text-gray-900 uppercase italic tracking-tighter truncate leading-none">Buzón Maestro</h3>
                            <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest truncate leading-none mt-1">Soporte Transaccional (RF-11)</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-white p-5 rounded-[2rem] border border-gray-100 text-center shadow-sm hover:shadow-md transition-shadow group">
                            <div className="text-2xl font-black text-gray-900 italic group-hover:scale-110 transition-transform">{isLoading ? <Skeleton className="h-8 w-10 mx-auto" /> : totalConversations}</div>
                            <div className="text-[9px] text-gray-400 font-black uppercase tracking-widest mt-1">Abiertos</div>
                        </div>
                        <div className="bg-gray-900 p-5 rounded-[2rem] text-center shadow-xl group">
                            <div className="text-2xl font-black text-indigo-400 italic group-hover:scale-110 transition-transform">{isLoading ? <Skeleton className="h-8 w-10 mx-auto" /> : criticalCount}</div>
                            <div className="text-[9px] text-white/40 font-black uppercase tracking-widest mt-1">Críticos</div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-indigo-600 transition-colors w-4 h-4" />
                            <input
                                type="text"
                                value={filters.search}
                                onChange={(e) => setFilters({ search: e.target.value })}
                                className="w-full pl-12 pr-4 h-12 bg-white border border-gray-100 rounded-2xl text-[11px] font-bold text-gray-700 placeholder:text-gray-300 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none italic"
                                placeholder="CLIENTE / DNI / MENSAJE..."
                            />
                        </div>
                        <select
                            value={filters.category}
                            onChange={(e) => setFilters({ category: e.target.value })}
                            className="w-full h-10 px-4 bg-gray-900 border-none rounded-xl text-[9px] font-black uppercase tracking-[0.2em] text-white/70 cursor-pointer outline-none hover:text-white transition-colors"
                        >
                            <option value="all">TODAS LAS CATEGORÍAS</option>
                            <option value="tech">DIAGNÓSTICO TÉCNICO</option>
                            <option value="admin">SOPORTE ADMINISTRATIVO</option>
                            <option value="info">SOLICITUD DE INFO</option>
                        </select>
                    </div>
                </div>

                {/* Listado de Entradas */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar bg-white">
                    {isLoading ? (
                        Array(6).fill(0).map((_, i) => (
                            <div key={i} className="p-5 rounded-[2rem] border border-gray-50 flex items-center gap-4">
                                <Skeleton className="w-14 h-14 rounded-2xl shrink-0" />
                                <div className="flex-1 space-y-3">
                                    <div className="flex justify-between">
                                        <Skeleton className="h-4 w-1/2 rounded-lg" />
                                        <Skeleton className="h-3 w-8 rounded-lg" />
                                    </div>
                                    <Skeleton className="h-3 w-3/4 rounded-lg opacity-50" />
                                </div>
                            </div>
                        ))
                    ) : conversations.length > 0 ? (
                        conversations.map((conv, idx) => (
                            <button
                                key={conv.id}
                                onClick={() => setActiveConversation(conv)}
                                className={`w-full p-5 rounded-[2rem] border transition-all duration-500 group flex items-center gap-4 animate-in slide-in-from-left-4`}
                                style={{ animationDelay: `${idx * 100}ms` }}
                            >
                                <div className="relative">
                                    <div className={`w-14 h-14 rounded-2xl overflow-hidden border-2 shadow-sm group-hover:scale-105 transition-transform duration-500 ${activeConversation?.id === conv.id ? 'border-white' : 'border-emerald-50'}`}>
                                        <img src={conv.avatar} className="w-full h-full object-cover" alt={conv.nombre} />
                                    </div>
                                    {conv.critical && (
                                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-rose-600 rounded-full border-2 border-white flex items-center justify-center animate-pulse">
                                            <ShieldAlert className="w-3 h-3 text-white" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 text-left overflow-hidden">
                                    <div className="flex justify-between items-center mb-1">
                                        <h4 className={`text-xs font-black uppercase italic tracking-tighter truncate ${activeConversation?.id === conv.id ? 'text-indigo-600' : 'text-gray-900 group-hover:text-indigo-600'}`}>{conv.nombre}</h4>
                                        <span className="text-[8px] font-black uppercase text-gray-400">{conv.fecha}</span>
                                    </div>
                                    <p className={`text-[10px] font-bold truncate leading-none ${activeConversation?.id === conv.id ? 'text-indigo-400' : 'text-gray-400'}`}>{conv.ultimoMensaje}</p>
                                </div>
                                {activeConversation?.id === conv.id && (
                                    <div className="w-2 h-10 bg-indigo-600 rounded-full shadow-lg shadow-indigo-200"></div>
                                )}
                            </button>
                        ))
                    ) : (
                        <div className="p-20 text-center space-y-4">
                            <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto border border-gray-100">
                                <MessageSquareOff className="w-8 h-8 text-gray-200" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 leading-relaxed italic">Sin Registros<br />Sincronizados</p>
                        </div>
                    )}
                </div>
            </aside>

            {/* CHAT MAIN - Dossier de Conversación */}
            <main className={`col-span-12 md:col-span-8 bg-white rounded-[3.5rem] border border-gray-100 shadow-2xl overflow-hidden flex flex-col transition-all duration-500 shadow-indigo-100/20 ${isMobileListVisible ? 'hidden md:flex' : 'flex'}`}>
                {!activeConversation ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-20 text-center animate-fadeIn group">
                        <div className="w-32 h-32 bg-gray-50 rounded-[3rem] flex items-center justify-center shadow-inner mb-8 border border-gray-100 group-hover:bg-indigo-600 transition-all duration-700">
                            <MessageCircle className="w-12 h-12 text-gray-200 group-hover:text-white group-hover:rotate-12 transition-all duration-700" />
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">Canal de Respuesta</h2>
                        <p className="text-[10px] text-gray-400 mt-4 font-black uppercase tracking-[0.3em] leading-none">Selecciona un Hilo de Interoperabilidad</p>
                    </div>
                ) : (
                    <div key={activeConversation.id} className="flex-1 flex flex-col h-full bg-white animate-fadeIn relative">
                        {/* Header Chat */}
                        <header className="p-6 md:p-8 bg-white border-b border-gray-50 flex items-center justify-between shadow-sm relative z-20">
                            <div className="flex items-center gap-6">
                                <button
                                    onClick={() => setIsMobileListVisible(true)}
                                    className="md:hidden p-3 bg-gray-900 text-white rounded-2xl hover:bg-indigo-600 transition-all shadow-xl"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                                <div className="relative">
                                    <div className="w-16 h-16 rounded-[1.5rem] overflow-hidden border-2 border-indigo-100 shadow-xl shadow-indigo-100">
                                        <img src={activeConversation.avatar} className="w-full h-full object-cover" alt={activeConversation.nombre} />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-4 border-white"></div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">{activeConversation.nombre}</h3>
                                    <div className="flex items-center gap-4 mt-2">
                                        <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{activeConversation.email}</span>
                                        {activeConversation.critical && (
                                            <span className="text-[9px] bg-gray-900 text-indigo-400 font-black px-3 py-1 rounded-full uppercase tracking-[0.2em] border border-white/5 italic">PRIORIDAD_CRÍTICA</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <ChatOptionsMenu onClear={clearActiveChat} onDelete={deleteActiveTicket} />
                            </div>
                        </header>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar bg-gray-50/20 relative">
                            {/* Decorative Background Pattern */}
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none overflow-hidden flex flex-wrap gap-20 p-20">
                                {Array(20).fill(0).map((_, i) => <MessageCircle key={i} className="w-32 h-32" />)}
                            </div>

                            {activeConversation.mensajes.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
                                    <div className={`max-w-[70%] p-6 rounded-[2.5rem] transition-all relative ${msg.sender === 'user'
                                        ? 'bg-indigo-600 text-white rounded-tr-none shadow-2xl shadow-indigo-100 border border-indigo-400'
                                        : 'bg-white text-gray-900 rounded-tl-none border border-gray-100 shadow-xl'
                                        }`}>
                                        <p className="text-sm font-bold leading-relaxed">{msg.contenido}</p>
                                        <div className={`mt-4 flex items-center gap-3 text-[9px] font-black uppercase tracking-widest ${msg.sender === 'user' ? 'text-white/60' : 'text-indigo-400'}`}>
                                            <span className="flex items-center gap-1">
                                                {msg.sender === 'user' ? <User className="w-3 h-3" /> : <MessageCircle className="w-3 h-3" />}
                                                {msg.sender === 'user' ? 'SOPORTE_TIENDA' : 'CLIENTE_ID'}
                                            </span>
                                            <span>•</span>
                                            <span>{msg.hora}</span>
                                            {msg.sender === 'user' && <CheckCheck className="text-white w-4 h-4 ml-1" />}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area Interface */}
                        <div className="p-8 bg-white border-t border-gray-50 relative z-20">
                            <MessageInput onSend={sendMessage} />
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

// ── Componentes de UI Local ──

function ChatOptionsMenu({ onClear, onDelete }: { onClear: () => void, onDelete: () => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 bg-gray-50 text-gray-400 rounded-2xl hover:bg-gray-900 hover:text-white transition-all active:scale-90 flex items-center justify-center"
            >
                <MoreVertical className="w-6 h-6" />
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-5 w-64 bg-gray-900 border border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden z-50 animate-scaleUp">
                    <button
                        onClick={() => { onClear(); setIsOpen(false); }}
                        className="w-full text-left p-6 hover:bg-white/5 flex items-center gap-4 transition-colors group"
                    >
                        <Trash2 className="text-indigo-400 group-hover:text-white transition-colors w-5 h-5" />
                        <span className="text-[10px] font-black text-white/70 uppercase tracking-widest group-hover:text-white">Vaciar Historial</span>
                    </button>
                    <button
                        onClick={() => { if (confirm('¿Finalizar atención?')) { onDelete(); setIsOpen(false); } }}
                        className="w-full text-left p-6 hover:bg-rose-600 flex items-center gap-4 border-t border-white/5 transition-colors group"
                    >
                        <AlertOctagon className="text-rose-500 group-hover:text-white transition-colors w-5 h-5" />
                        <span className="text-[10px] font-black text-white/70 uppercase tracking-widest group-hover:text-white">Cerrar Ticket</span>
                    </button>
                </div>
            )}
        </div>
    );
}

function MessageInput({ onSend }: { onSend: (content: string) => void }) {
    const [text, setText] = useState('');

    const handleSend = () => {
        if (!text.trim()) return;
        onSend(text);
        setText('');
    };

    return (
        <div className="flex items-center gap-6 bg-gray-50 p-3 pl-10 rounded-[3rem] border border-gray-100 shadow-inner group focus-within:bg-white focus-within:shadow-xl focus-within:shadow-indigo-100 transition-all duration-500 border-transparent focus-within:border-indigo-100">
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-bold text-gray-700 placeholder:text-gray-300 resize-none py-4 max-h-32 outline-none italic"
                placeholder="PROPORCIONAR FEEDBACK ESTRATÉGICO..."
                rows={1}
            />
            <div className="flex items-center gap-2 pr-2">
                <button className="p-4 text-indigo-300 hover:text-indigo-600 transition-all">
                    <Paperclip className="w-8 h-8" />
                </button>
                <button
                    onClick={handleSend}
                    className="w-16 h-16 bg-indigo-600 text-white rounded-[1.75rem] hover:bg-gray-900 transition-all shadow-xl shadow-indigo-200 active:scale-95 flex items-center justify-center group-focus-within:-translate-y-1"
                >
                    <Send className="w-7 h-7" />
                </button>
            </div>
        </div>
    );
}
