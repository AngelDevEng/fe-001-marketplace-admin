'use client';

import { useState, useMemo } from 'react';
import { LogisticsTicket, LogisticsTicketMessage } from '@/lib/types/logistics';
import { mockLogisticsTickets } from '@/lib/mocks/logistics';

export function useLogisticsHelpdesk() {
    const [tickets, setTickets] = useState<LogisticsTicket[]>(mockLogisticsTickets);
    const [selectedTicket, setSelectedTicket] = useState<LogisticsTicket | null>(null);
    const [filters, setFilters] = useState({
        search: '',
        status: 'all' as 'all' | 'open' | 'in_progress' | 'resolved' | 'closed',
    });
    const [isLoading, setIsLoading] = useState(false);

    const filteredTickets = useMemo(() => {
        return tickets.filter(t => {
            const matchesSearch = !filters.search || 
                t.id.toLowerCase().includes(filters.search.toLowerCase()) ||
                t.subject.toLowerCase().includes(filters.search.toLowerCase());
            
            const matchesStatus = filters.status === 'all' || t.status === filters.status;
            
            return matchesSearch && matchesStatus;
        });
    }, [tickets, filters]);

    const ticketStats = useMemo(() => {
        return {
            open: tickets.filter(t => t.status === 'open').length,
            inProgress: tickets.filter(t => t.status === 'in_progress').length,
            resolved: tickets.filter(t => t.status === 'resolved').length,
            closed: tickets.filter(t => t.status === 'closed').length,
            total: tickets.length,
        };
    }, [tickets]);

    const createTicket = (subject: string, content: string) => {
        const newTicket: LogisticsTicket = {
            id: `TKT-${Date.now()}`,
            subject,
            status: 'open',
            priority: 'medium',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            messages: [{
                id: `tmsg-${Date.now()}`,
                sender: 'operator',
                senderName: 'Operador Logístico', // TODO: reemplazar por user.name desde AuthContext
                content,
                timestamp: new Date().toISOString(),
            }],
        };

        setTickets(prev => [newTicket, ...prev]);
        return newTicket.id;
    };

    const addMessage = (ticketId: string, content: string) => {
        const newMessage: LogisticsTicketMessage = {
            id: `tmsg-${Date.now()}`,
            sender: 'operator',
            senderName: 'Operador Logístico', // TODO: reemplazar por user.name desde AuthContext
            content,
            timestamp: new Date().toISOString(),
        };

        setTickets(prev => prev.map(t => {
            if (t.id !== ticketId) return t;
            return {
                ...t,
                messages: [...t.messages, newMessage],
                updatedAt: new Date().toISOString(),
                status: t.status === 'open' ? 'in_progress' : t.status,
            };
        }));

        if (selectedTicket?.id === ticketId) {
            setSelectedTicket(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    messages: [...prev.messages, newMessage],
                    updatedAt: new Date().toISOString(),
                };
            });
        }
    };

    return {
        tickets: filteredTickets,
        allTickets: tickets,
        selectedTicket,
        setSelectedTicket,
        filters,
        setFilters,
        ticketStats,
        isLoading,
        createTicket,
        addMessage,
    };
}
