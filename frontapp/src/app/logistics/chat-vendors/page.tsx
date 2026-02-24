'use client';

import React, { useState, useEffect } from 'react';
import ModuleHeader from '@/components/layout/shared/ModuleHeader';
import Skeleton from '@/components/ui/Skeleton';
import Icon from '@/components/ui/Icon';
import { useLogisticsChat } from '@/hooks/useLogisticsChat';

// --- Internal Components (Architectural Pattern: Externalized to avoid re-renders) ---

const ConversationItem = ({ conv, active, onClick }: any) => (
    <button
        onClick={onClick}
        className={`w-full p-6 border-b border-gray-50 text-left hover:bg-violet-50/30 transition-all relative group ${active ? 'bg-violet-50/50' : ''}`}
    >
        {active && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-violet-500 rounded-r-full" />
        )}
        <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-gray-800 truncate uppercase tracking-tight">{conv.vendorName}</p>
                <p className="text-[9px] text-violet-500 font-black mt-0.5">#{conv.orderId}</p>
            </div>
            {conv.unreadCount > 0 && (
                <span className="px-2 py-0.5 bg-violet-500 text-white text-[9px] font-black rounded-full shadow-lg shadow-violet-100 flex items-center justify-center">
                    {conv.unreadCount}
                </span>
            )}
        </div>
        <p className="text-[10px] text-gray-400 font-medium truncate mt-2 leading-relaxed">{conv.lastMessage}</p>
    </button>
);

const ChatMessage = ({ msg }: any) => {
    const isOperator = msg.sender === 'operator';
    return (
        <div className={`flex ${isOperator ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
            <div className={`max-w-[75%] p-5 rounded-[2rem] shadow-sm transform transition-all hover:scale-[1.01] ${isOperator
                ? 'bg-violet-600 text-white rounded-tr-none shadow-violet-100'
                : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none'
                }`}>
                <p className="text-[8px] font-black uppercase mb-1 opacity-60 tracking-widest">
                    {isOperator ? 'Tú (Operador)' : 'Vendedor'}
                </p>
                <p className="text-xs font-medium leading-relaxed">{msg.content}</p>
                <div className="flex items-center justify-end gap-1 mt-2">
                    <p className={`text-[8px] font-black uppercase tracking-tighter ${isOperator ? 'text-violet-200' : 'text-gray-400'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    {isOperator && <Icon name="CheckCheck" className="w-3 h-3 text-violet-200" />}
                </div>
            </div>
        </div>
    );
};

// --- Main Page Component ---

export default function LogisticsChatVendorsPage() {
    const {
        conversations,
        selectedConversation,
        setSelectedConversation,
        filters,
        setFilters,
        totalUnread,
        sendMessage,
        messagesEndRef,
    } = useLogisticsChat();

    const [simulatedLoading, setSimulatedLoading] = useState(true);
    const [messageInput, setMessageInput] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => setSimulatedLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!messageInput.trim()) return;
        sendMessage(messageInput);
        setMessageInput('');
    };

    return (
        <div className="space-y-8 animate-fadeIn pb-20 h-[calc(100vh-8rem)] font-industrial">
            <ModuleHeader
                title="Consola de Mensajería"
                subtitle="Comunicación bidireccional con Vendedores (RF-05)"
                icon="Messages"
            />

            <div className="grid grid-cols-12 gap-6 h-full min-h-[600px]">
                {/* Conversations List */}
                <div className="col-span-12 md:col-span-4 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-gray-50">
                        <div className="relative">
                            <Icon name="Search" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Buscar vendedor o pedido..."
                                value={filters.search}
                                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-xs font-black focus:ring-2 focus:ring-violet-500/10 transition-all font-industrial"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {simulatedLoading ? (
                            <div className="p-4 space-y-4">
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <div key={i} className="flex gap-4 p-4">
                                        <Skeleton className="h-10 w-10 rounded-xl" />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-4 w-3/4 rounded" />
                                            <Skeleton className="h-3 w-1/2 rounded" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : conversations.length === 0 ? (
                            <div className="p-12 text-center opacity-40">
                                <Icon name="Messages" className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Sin conversaciones activas</p>
                            </div>
                        ) : (
                            conversations.map((conv) => (
                                <ConversationItem
                                    key={conv.id}
                                    conv={conv}
                                    active={selectedConversation?.id === conv.id}
                                    onClick={() => setSelectedConversation(conv.id)}
                                />
                            ))
                        )}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="col-span-12 md:col-span-8 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                    {simulatedLoading ? (
                        <div className="flex-1 flex flex-col">
                            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                                <div className="space-y-2">
                                    <Skeleton className="h-5 w-48 rounded" />
                                    <Skeleton className="h-3 w-32 rounded" />
                                </div>
                                <Skeleton className="h-10 w-10 rounded-full" />
                            </div>
                            <div className="flex-1 p-8 space-y-6 bg-gray-50/20">
                                <Skeleton className="h-20 w-1/2 rounded-[2rem] rounded-tl-none" />
                                <div className="flex justify-end"><Skeleton className="h-24 w-1/2 rounded-[2rem] rounded-tr-none" /></div>
                            </div>
                        </div>
                    ) : !selectedConversation ? (
                        <div className="flex-1 flex flex-col items-center justify-center bg-gray-50/30 p-12 text-center">
                            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 border border-gray-100">
                                <Icon name="Messages" className="w-10 h-10 text-gray-200" />
                            </div>
                            <h3 className="text-xl font-black text-gray-400 uppercase tracking-widest mb-2">Canal Seguro Lyrium</h3>
                            <p className="text-xs text-gray-400 max-w-xs leading-relaxed uppercase font-black tracking-tight">Inicia una sesión de chat para coordinar la entrega en tiempo real.</p>
                        </div>
                    ) : (
                        <>
                            <div className="p-6 border-b border-gray-50 bg-violet-50/10 backdrop-blur-sm">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white rounded-2xl border border-violet-100 flex items-center justify-center text-violet-500 shadow-sm font-black">
                                            {selectedConversation.vendorName.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-gray-800 uppercase tracking-tight">{selectedConversation.vendorName}</p>
                                            <p className="text-[10px] font-black text-violet-500 uppercase tracking-widest">Tracking: {selectedConversation.orderId}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-gray-50/30 custom-scrollbar">
                                {selectedConversation.messages.map((msg) => (
                                    <ChatMessage key={msg.id} msg={msg} />
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            <form onSubmit={handleSend} className="p-6 border-t border-gray-50">
                                <div className="flex gap-3 bg-gray-50 p-2 rounded-[2.5rem] border border-gray-100 focus-within:border-violet-200 focus-within:ring-4 focus-within:ring-violet-500/5 transition-all">
                                    <input
                                        type="text"
                                        value={messageInput}
                                        onChange={(e) => setMessageInput(e.target.value)}
                                        placeholder="Escribe un mensaje de gestión técnica..."
                                        className="flex-1 px-6 bg-transparent border-none text-xs font-black focus:ring-0 placeholder:text-gray-400 font-industrial"
                                    />
                                    <button
                                        type="submit"
                                        className="w-14 h-14 bg-violet-600 text-white rounded-full flex items-center justify-center hover:bg-violet-700 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-violet-100"
                                    >
                                        <Icon name="Send" className="w-5 h-5" />
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
