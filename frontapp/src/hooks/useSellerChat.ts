import { useState, useEffect, useRef } from 'react';
import { ChatConversation, ChatMessage, ChatFilters } from '@/lib/types/seller/chat';
import { MOCK_CHAT_DATA, getAutoResponse } from '@/lib/mocks/mockChatData';

export function useSellerChat() {
    const [conversations, setConversations] = useState<ChatConversation[]>([]);
    const [activeConversation, setActiveConversation] = useState<ChatConversation | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFiltersState] = useState<ChatFilters>({
        search: '',
        category: 'all'
    });
    const [isMobileListVisible, setIsMobileListVisible] = useState(true);

    const isMountedRef = useRef(true);
    useEffect(() => { return () => { isMountedRef.current = false; }; }, []);

    useEffect(() => {
        const fetchConversations = async () => {
            setIsLoading(true);
            await new Promise(r => setTimeout(r, 800)); // Simular carga
            setConversations(MOCK_CHAT_DATA);
            setIsLoading(false);
        };
        fetchConversations();
    }, []);

    useEffect(() => {
        if (activeConversation && typeof window !== 'undefined' && window.innerWidth < 768) {
            setIsMobileListVisible(false);
        }
    }, [activeConversation]);

    const setFilters = (newFilters: Partial<ChatFilters>) => {
        setFiltersState(prev => ({ ...prev, ...newFilters }));
    };

    const sendMessage = async (content: string) => {
        if (!activeConversation) return;

        const now = new Date();
        const hora = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

        const userMsg: ChatMessage = {
            sender: 'user',
            contenido: content,
            hora: hora,
            status: 'sent'
        };

        const updatedConv = {
            ...activeConversation,
            mensajes: [...activeConversation.mensajes, userMsg],
            ultimoMensaje: content,
            fecha: hora
        };

        setActiveConversation(updatedConv);
        setConversations(prev => prev.map(c => c.id === updatedConv.id ? updatedConv : c));

        setTimeout(async () => {
            if (!isMountedRef.current) return;
            const autoResponse = getAutoResponse(updatedConv.id);
            const finalConv = {
                ...updatedConv,
                mensajes: [...updatedConv.mensajes, autoResponse as ChatMessage],
                ultimoMensaje: autoResponse.contenido,
                fecha: autoResponse.hora
            };
            setActiveConversation(finalConv);
            setConversations(prev => prev.map(c => c.id === finalConv.id ? finalConv : c));
        }, 1000);
    };

    const clearActiveChat = () => {
        if (!activeConversation) return;
        const updatedConv = { ...activeConversation, mensajes: [] };
        setActiveConversation(updatedConv);
        setConversations(prev => prev.map(c => c.id === updatedConv.id ? updatedConv : c));
    };

    const deleteActiveTicket = () => {
        if (!activeConversation) return;
        const targetId = activeConversation.id;
        setActiveConversation(null);
        setConversations(prev => prev.filter(c => c.id !== targetId));
        setIsMobileListVisible(true);
    };

    const filteredConversations = conversations.filter(conv => {
        const matchesSearch = conv.nombre.toLowerCase().includes(filters.search.toLowerCase()) ||
            conv.dni.includes(filters.search) ||
            conv.ultimoMensaje.toLowerCase().includes(filters.search.toLowerCase());

        const matchesCategory = filters.category === 'all' || conv.type === filters.category;

        return matchesSearch && matchesCategory;
    });

    const criticalCount = conversations.filter(c => c.critical).length;

    return {
        conversations: filteredConversations,
        totalConversations: conversations.length,
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
    };
}
