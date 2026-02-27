'use client';

import React, { useState, useEffect, useRef } from 'react';
import ModuleHeader from '@/components/layout/shared/ModuleHeader';
import Icon from '@/components/ui/Icon';
import { useLogisticsChat } from '@/hooks/useLogisticsChat';
import ChatLayout from '@/components/shared/chat/ChatLayout';
import MessageBubble from '@/components/shared/chat/MessageBubble';
import MessageInput from '@/components/shared/chat/MessageInput';

interface LogisticsChatVendorsPageClientProps { /* TODO Tarea 3 */ }
export function LogisticsChatVendorsPageClient(_props: LogisticsChatVendorsPageClientProps) {
    const { conversations, selectedConversation, setSelectedConversation, sendMessage } = useLogisticsChat();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [selectedConversation]);

    return (
        <div className="h-[calc(100vh-8rem)] overflow-hidden pb-4">
            <ModuleHeader title="Chat con Vedores" subtitle="Comunicación directa con vendedores" icon="MessageCircle" />
            <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
                <div className="grid grid-cols-12 h-full">
                    <div className="col-span-4 border-r border-gray-100 p-4 overflow-y-auto">
                        <p className="text-sm font-bold text-gray-400">Conversaciones: {conversations.length}</p>
                    </div>
                    <div className="col-span-8 p-4 flex flex-col">
                        <div className="flex-1 overflow-y-auto">
                            {selectedConversation ? <div>Seleccionado: {selectedConversation.id}</div> : <div className="flex items-center justify-center h-full text-gray-400">Selecciona una conversación</div>}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
