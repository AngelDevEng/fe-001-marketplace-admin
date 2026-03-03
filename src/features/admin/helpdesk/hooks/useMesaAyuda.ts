'use client';

import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    MesaAyudaData, Ticket, TicketStatus, Priority,
    AuditEntry, Message, ActionType, FAQArticle
} from '@/lib/types/admin/helpdesk';
import { MOCK_HELPDESK_DATA } from '@/lib/mocks/helpdeskData';

export const useMesaAyuda = () => {
    const queryClient = useQueryClient();
    const [currentTab, setCurrentTab] = useState<'todos' | 'asignados' | 'faq' | 'auditoria'>('todos');
    const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
    const [filters, setFilters] = useState({
        search: '',
        status: '' as TicketStatus | '',
        priority: '' as Priority | '',
        auditSearch: '',
        auditDate: '',
        auditType: '' as ActionType | ''
    });

    // --- Query: Fetch Data ---
    const { data: helpdeskData, isLoading } = useQuery({
        queryKey: ['admin', 'helpdesk'],
        queryFn: async () => {
            // En un ecosistema real, esto sería fetch('/api/admin/helpdesk')
            return MOCK_HELPDESK_DATA as MesaAyudaData;
        },
        staleTime: 2 * 60 * 1000,
    });

    // --- Mutations ---

    const sendReplyMutation = useMutation({
        mutationFn: async ({ text, isQuick }: { text: string, isQuick: boolean }) => {
            // Actualización mock local
            console.log("Sending reply:", text);
            return { text, isQuick };
        },
        onSuccess: (_, variables) => {
            queryClient.setQueryData(['admin', 'helpdesk'], (old: MesaAyudaData | undefined) => {
                if (!old || !selectedTicketId) return old;
                const newMessage: Message = {
                    id: Date.now(),
                    usuario: 'Admin_Marketplace (Admin)',
                    contenido: variables.text,
                    tipo: variables.isQuick ? 'respuesta_rapida' : 'normal',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    leido: true
                };
                return {
                    ...old,
                    tickets: old.tickets.map(t => t.id === selectedTicketId ? {
                        ...t,
                        mensajes: [...t.mensajes, newMessage],
                        estado: 'Resuelto' as TicketStatus,
                        fecha_actualizacion: 'Hoy'
                    } : t)
                };
            });
        }
    });

    const closeTicketMutation = useMutation({
        mutationFn: async (survey: { satisfaction: number; timely: number; comments: string }) => {
            console.log("Closing ticket with survey:", survey);
            return survey;
        },
        onSuccess: () => {
            queryClient.setQueryData(['admin', 'helpdesk'], (old: MesaAyudaData | undefined) => {
                if (!old || !selectedTicketId) return old;
                return {
                    ...old,
                    tickets: old.tickets.map(t => t.id === selectedTicketId ? { ...t, estado: 'Cerrado' as TicketStatus } : t)
                };
            });
        }
    });

    const selectedTicket = useMemo(() =>
        helpdeskData?.tickets.find(t => t.id === selectedTicketId) || null
        , [helpdeskData?.tickets, selectedTicketId]);

    // Derived state: Filtered tickets
    const filteredTickets = useMemo(() => {
        if (!helpdeskData) return [];
        let tickets = helpdeskData.tickets;

        if (currentTab === 'asignados') {
            tickets = tickets.filter(t => t.admin_asignado.id === 1); // Mock current admin ID = 1
        }

        return tickets.filter(t => {
            const matchSearch = !filters.search ||
                t.numero.toLowerCase().includes(filters.search.toLowerCase()) ||
                t.vendedor.nombre.toLowerCase().includes(filters.search.toLowerCase()) ||
                t.asunto.toLowerCase().includes(filters.search.toLowerCase());
            const matchStatus = !filters.status || t.estado === filters.status;
            const matchPriority = !filters.priority || t.prioridad === filters.priority;
            return matchSearch && matchStatus && matchPriority;
        });
    }, [helpdeskData, currentTab, filters.search, filters.status, filters.priority]);

    // Derived state: Filtered Audit
    const filteredAudit = useMemo(() => {
        if (!helpdeskData) return [];
        return helpdeskData.auditoria.filter(a => {
            const matchSearch = !filters.auditSearch ||
                a.tienda.toLowerCase().includes(filters.auditSearch.toLowerCase()) ||
                a.responsable.toLowerCase().includes(filters.auditSearch.toLowerCase());
            const matchDate = !filters.auditDate || a.timestamp.includes(filters.auditDate);
            const matchType = !filters.auditType || a.accion === filters.auditType;
            return matchSearch && matchDate && matchType;
        });
    }, [helpdeskData, filters.auditSearch, filters.auditDate, filters.auditType]);

    return {
        data: helpdeskData,
        loading: isLoading,
        currentTab,
        setCurrentTab,
        selectedTicket,
        filteredTickets,
        filteredAudit,
        filters,
        setFilters,
        actions: {
            selectTicket: (id: number) => setSelectedTicketId(id),
            sendReply: (text: string, isQuick: boolean = false) => sendReplyMutation.mutateAsync({ text, isQuick }),
            closeTicket: (survey: { satisfaction: number; timely: number; comments: string }) => closeTicketMutation.mutateAsync(survey),
            escalateTicket: (destino: string, motivo: string) => {
                console.log("Escalating ticket to", destino);
                // Implementation...
            },
            updateTicketPriority: (id: number, priority: Priority) => {
                console.log("Updating priority for ticket", id, "to", priority);
            },
            updateTicketAdmin: (id: number, adminId: number) => {
                console.log("Updating admin for ticket", id, "to admin", adminId);
            }
        }
    };
};
