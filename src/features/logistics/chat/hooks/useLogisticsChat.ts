'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { LogisticsConversation, LogisticsMessage } from '@/lib/types/logistics';
import { mockLogisticsConversations } from '@/lib/mocks/logistics';

export function useLogisticsChat() {
    const [conversations, setConversations] = useState<LogisticsConversation[]>(mockLogisticsConversations);
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
    const [filters, setFilters] = useState({ search: '' });
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const prevMessagesLengthRef = useRef<number>(0);

    const selectedConversation = useMemo(() => {
        return conversations.find(c => c.id === selectedConversationId) || null;
    }, [conversations, selectedConversationId]);

    const filteredConversations = useMemo(() => {
        let result = conversations;
        
        if (filters.search) {
            result = result.filter(c => 
                c.vendorName.toLowerCase().includes(filters.search.toLowerCase()) ||
                c.orderId.toLowerCase().includes(filters.search.toLowerCase())
            );
        }
        
        return [...result].sort((a, b) => 
            new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
        );
    }, [conversations, filters.search]);

    const totalUnread = useMemo(() => {
        return conversations.reduce((acc, c) => acc + c.unreadCount, 0);
    }, [conversations]);

    const selectConversation = (conversationId: string) => {
        prevMessagesLengthRef.current = 0; // Reset para evitar scroll al cambiar de chat
        setSelectedConversationId(conversationId);
        setConversations(prev => prev.map(c => {
            if (c.id === conversationId) {
                return { ...c, unreadCount: 0 };
            }
            return c;
        }));
    };

    useEffect(() => {
        const currentLength = selectedConversation?.messages.length || 0;
        // Solo hacer scroll si la cantidad de mensajes AUMENTÓ (nuevo mensaje)
        if (currentLength > prevMessagesLengthRef.current) {
            setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
        prevMessagesLengthRef.current = currentLength;
    }, [selectedConversation?.messages.length]);

    const sendMessage = (content: string) => {
        if (!selectedConversationId) return;

        const newMessage: LogisticsMessage = {
            id: `msg-${Date.now()}`,
            sender: 'operator',
            senderName: 'Operador Logístico',
            content,
            timestamp: new Date().toISOString(),
            read: true,
        };

        setConversations(prev => prev.map(c => {
            if (c.id === selectedConversationId) {
                return {
                    ...c,
                    messages: [...c.messages, newMessage],
                    lastMessage: content,
                    lastMessageTime: newMessage.timestamp,
                };
            }
            return c;
        }));

        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    return {
        conversations: filteredConversations,
        selectedConversation,
        setSelectedConversation: selectConversation,
        filters,
        setFilters,
        totalUnread,
        sendMessage,
        messagesEndRef,
    };
}
