'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useSellerChat } from '@/hooks/useSellerChat';
import Icon from '@/components/ui/Icon';

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
        <div className="w-full bg-white rounded-[2.5rem] shadow-xl shadow-gray-100 border border-gray-100 overflow-hidden flex flex-col md:flex-row animate-fadeIn"
            style={{ height: 'calc(100vh - 160px)', minHeight: '600px' }}>

            {/* SIDEBAR */}
            <aside className={`w-full md:w-80 shrink-0 border-r border-gray-50 flex flex-col bg-white transition-all duration-300 ${!isMobileListVisible ? 'hidden md:flex' : 'flex'}`}>
                {/* Header Side */}
                <div className="p-6 bg-gray-50/50 border-b border-gray-50">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-sky-500 rounded-2xl flex items-center justify-center shadow-lg shadow-sky-100 shrink-0">
                            <Icon name="MessageCircle" className="text-white text-2xl font-black w-6 h-6" />
                        </div>
                        <div className="min-w-0">
                            <h3 className="text-sm font-black text-gray-800 uppercase tracking-tight truncate">Centro de Atención</h3>
                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest truncate">Soporte en Tiempo Real</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="bg-white p-4 rounded-3xl border border-gray-100 text-center shadow-sm">
                            <div className="text-xl font-black text-gray-800">{totalConversations}</div>
                            <div className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Total</div>
                        </div>
                        <div className="bg-rose-50 p-4 rounded-3xl border border-rose-100 text-center shadow-sm">
                            <div className="text-xl font-black text-rose-600">{criticalCount}</div>
                            <div className="text-[9px] text-rose-500 font-black uppercase tracking-widest">Críticos</div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="relative group">
                            <Icon name="Search" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-sky-500 transition-colors w-4 h-4" />
                            <input
                                type="text"
                                value={filters.search}
                                onChange={(e) => setFilters({ search: e.target.value })}
                                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-xs font-bold text-gray-700 placeholder:text-gray-300 focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all outline-none"
                                placeholder="Buscar por cliente o DNI..."
                            />
                        </div>
                        <select
                            value={filters.category}
                            onChange={(e) => setFilters({ category: e.target.value })}
                            className="w-full text-[10px] py-3 px-4 bg-white border border-gray-100 rounded-2xl focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 font-black uppercase tracking-wider text-gray-700 cursor-pointer outline-none shadow-sm"
                        >
                            <option value="all">TODAS LAS CATEGORÍAS</option>
                            <option value="tech">DIAGNÓSTICO TÉCNICO</option>
                            <option value="admin">SOPORTE ADMINISTRATIVO</option>
                            <option value="info">SOLICITUD DE INFO</option>
                            <option value="comment">ELOGIOS Y FEEDBACK</option>
                        </select>
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar">
                    {isLoading ? (
                        Array(5).fill(0).map((_, i) => (
                            <div key={i} className="p-4 rounded-3xl border border-gray-50 flex items-center gap-4 animate-pulse">
                                <div className="w-12 h-12 bg-gray-100 rounded-full"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                                    <div className="h-2 bg-gray-50 rounded w-full"></div>
                                </div>
                            </div>
                        ))
                    ) : conversations.length > 0 ? (
                        conversations.map(conv => (
                            <button
                                key={conv.id}
                                onClick={() => setActiveConversation(conv)}
                                className={`w-full p-4 rounded-3xl border transition-all duration-300 group flex items-center gap-4 ${activeConversation?.id === conv.id
                                    ? 'bg-sky-500 border-sky-400 shadow-xl shadow-sky-100'
                                    : 'border-transparent hover:bg-gray-50'
                                    }`}
                            >
                                <div className="relative">
                                    <img src={conv.avatar} className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-sm group-hover:scale-105 transition-transform" />
                                    {conv.critical && <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full border-2 border-white flex items-center justify-center text-[8px] text-white font-black">!</span>}
                                </div>
                                <div className="flex-1 text-left overflow-hidden">
                                    <div className="flex justify-between items-center mb-1">
                                        <h4 className={`text-xs font-black uppercase tracking-tight truncate ${activeConversation?.id === conv.id ? 'text-white' : 'text-gray-800'}`}>{conv.nombre}</h4>
                                        <span className={`text-[8px] font-black uppercase ${activeConversation?.id === conv.id ? 'text-white/70' : 'text-gray-400'}`}>{conv.fecha}</span>
                                    </div>
                                    <p className={`text-[10px] font-bold truncate ${activeConversation?.id === conv.id ? 'text-white/80' : 'text-gray-400'}`}>{conv.ultimoMensaje}</p>
                                </div>
                            </button>
                        ))
                    ) : (
                        <div className="p-12 text-center opacity-40">
                            <Icon name="MessageSquareOff" className="text-4xl mb-4 text-gray-300 mx-auto w-10 h-10" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 leading-relaxed">Sin resultados para<br />tu búsqueda</p>
                        </div>
                    )}
                </div>
            </aside>

            {/* CHAT MAIN */}
            <main className={`flex-1 flex flex-col bg-gray-50/30 transition-all duration-300 ${isMobileListVisible ? 'hidden md:flex' : 'flex'}`}>
                {!activeConversation ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center animate-fadeIn">
                        <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl shadow-gray-100 mb-8 border border-gray-50">
                            <Icon name="MessageCircle" className="text-6xl text-sky-500 opacity-20 w-16 h-16" />
                        </div>
                        <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter">Buzón de Mensajes</h2>
                        <p className="text-xs text-gray-400 mt-2 font-black uppercase tracking-widest">Selecciona una conversación para leer</p>
                    </div>
                ) : (
                    <div key={activeConversation.id} className="flex-1 flex flex-col h-full bg-white md:bg-transparent animate-fadeIn">
                        {/* Header Chat */}
                        <header className="p-6 bg-white border-b border-gray-50 flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setIsMobileListVisible(true)}
                                    className="md:hidden p-3 bg-gray-50 text-gray-400 rounded-2xl hover:bg-sky-50 transition-all active:scale-90"
                                >
                                    <Icon name="ChevronLeft" className="w-5 h-5" />
                                </button>
                                <img src={activeConversation.avatar} className="w-12 h-12 rounded-2xl object-cover border-2 border-emerald-50 shadow-sm" />
                                <div>
                                    <h3 className="text-sm font-black text-gray-800 uppercase tracking-tight">{activeConversation.nombre}</h3>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-[10px] text-gray-400 font-black uppercase">{activeConversation.email}</span>
                                        <span className="text-[10px] text-sky-500 font-black bg-sky-50 px-2 py-0.5 rounded-lg uppercase tracking-tight">DNI: {activeConversation.dni}</span>
                                        {activeConversation.critical && <span className="text-[9px] bg-rose-50 text-rose-500 font-black px-2 py-0.5 rounded-lg uppercase tracking-widest">Prioridad Alta</span>}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <ChatOptionsMenu onClear={clearActiveChat} onDelete={deleteActiveTicket} />
                            </div>
                        </header>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 no-scrollbar bg-gray-50/20">
                            {activeConversation.mensajes.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[90%] p-5 shadow-sm transition-all hover:shadow-md ${msg.sender === 'user'
                                        ? 'bg-emerald-500 text-white rounded-3xl rounded-tr-none shadow-emerald-100'
                                        : 'bg-white text-gray-800 rounded-3xl rounded-tl-none border border-gray-100'
                                        }`}>
                                        <p className="text-sm font-bold leading-relaxed">{msg.contenido}</p>
                                        <div className={`mt-3 flex items-center gap-2 text-[8px] font-black uppercase tracking-widest ${msg.sender === 'user' ? 'text-emerald-100' : 'text-gray-400'}`}>
                                            <span>{msg.sender === 'user' ? 'Tú' : 'Cliente'}</span>
                                            <span>•</span>
                                            <span>{msg.hora}</span>
                                            {msg.sender === 'user' && <Icon name="CheckCheck" className="text-emerald-100 text-[10px] w-3 h-3" />}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-6 bg-white border-t border-gray-50">
                            <MessageInput onSend={sendMessage} />
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

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
                className="p-3 bg-gray-50 text-gray-400 rounded-2xl hover:bg-gray-100 transition-all active:scale-90"
            >
                <Icon name="MoreVertical" className="font-bold w-5 h-5" />
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-100 rounded-[2rem] shadow-2xl shadow-gray-200 overflow-hidden z-50 animate-fadeInUp">
                    <button
                        onClick={() => { onClear(); setIsOpen(false); }}
                        className="w-full text-left p-4 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                    >
                        <Icon name="Trash2" className="text-gray-400 text-lg w-5 h-5" />
                        <span className="text-xs font-black text-gray-700 uppercase tracking-tight">Vaciar Historial</span>
                    </button>
                    <button
                        onClick={() => { if (confirm('¿Eliminar ticket permanentemente?')) { onDelete(); setIsOpen(false); } }}
                        className="w-full text-left p-4 hover:bg-rose-50 flex items-center gap-3 border-t border-gray-50 transition-colors"
                    >
                        <Icon name="AlertOctagon" className="text-rose-400 text-lg w-5 h-5" />
                        <span className="text-xs font-black text-rose-500 uppercase tracking-tight">Cerrar y Eliminar</span>
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
        <div className="flex items-center gap-4 bg-gray-50 p-2 pl-6 rounded-[2rem] border border-gray-100 shadow-inner group">
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-bold text-gray-700 placeholder:text-gray-300 resize-none py-4 max-h-32 outline-none"
                placeholder="Escribe tu respuesta estratégica..."
                rows={1}
            />
            <div className="flex gap-2 pr-2">
                <button className="p-3 text-gray-400 hover:text-sky-500 transition-colors">
                    <Icon name="Paperclip" className="text-xl w-6 h-6" />
                </button>
                <button
                    onClick={handleSend}
                    className="w-12 h-12 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 active:scale-95 flex items-center justify-center translate-y-0 group-focus-within:translate-y-[-2px]"
                >
                    <Icon name="Send" className="text-xl w-6 h-6" />
                </button>
            </div>
        </div>
    );
}
