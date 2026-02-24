'use client';

import React, { useState, useEffect, useRef } from 'react';
import ModuleHeader from '@/components/layout/shared/ModuleHeader';
import Icon from '@/components/ui/Icon';
import { useLogisticsChat } from '@/hooks/useLogisticsChat';
import ChatLayout from '@/components/shared/chat/ChatLayout';
import ConversationList, { Conversation } from '@/components/shared/chat/ConversationList';
import MessageBubble from '@/components/shared/chat/MessageBubble';
import MessageInput from '@/components/shared/chat/MessageInput';

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

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const handleSendMessage = (message: string) => {
        sendMessage(message);
    };

    const conversationData: Conversation[] = conversations.map(conv => ({
        id: conv.id,
        name: conv.vendorName,
        lastMessage: conv.lastMessage,
        unreadCount: conv.unreadCount,
    }));

    const messages = selectedConversation?.messages.map(msg => ({
        sender: msg.sender,
        content: msg.content,
        timestamp: msg.timestamp,
    })) || [];

    const listContent = (
        <>
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
            <ConversationList
                conversations={conversationData}
                activeId={selectedConversation?.id}
                onSelect={setSelectedConversation}
                loading={loading}
                accentColor="violet"
                features={{ showUnreadCount: true }}
            />
        </>
    );

    const detailContent = loading ? (
        <div className="flex-1 flex flex-col">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                <div className="space-y-2">
                    <div className="h-5 w-48 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
                </div>
            </div>
            <div className="flex-1 p-8 space-y-6 bg-gray-50/30">
                <div className="h-20 w-1/2 bg-gray-200 rounded-[2rem] rounded-tl-none animate-pulse" />
                <div className="h-24 w-1/2 bg-gray-200 rounded-[2rem] rounded-tr-none ml-auto animate-pulse" />
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
                <MessageBubble messages={messages} />
                <div ref={messagesEndRef} />
            </div>

            <MessageInput
                onSend={handleSendMessage}
                placeholder="Escribe un mensaje de gestión técnica..."
            />
        </>
    );

    return (
        <div className="space-y-8 animate-fadeIn pb-20 font-industrial">
            <ModuleHeader
                title="Consola de Mensajería"
                subtitle="Comunicación bidireccional con Vendedores (RF-05)"
                icon="Messages"
            />

            <ChatLayout
                list={listContent}
                detail={detailContent}
                listWidth="col-span-4"
            />
        </div>
    );
}
