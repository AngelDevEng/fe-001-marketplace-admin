'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Ticket, TicketType, TicketStatus } from '../types';
import { MOCK_TICKETS } from '../mock';
import { useToast } from '@/shared/lib/context/ToastContext';
import { api } from '@/shared/lib/api';
import { USE_MOCKS } from '@/shared/lib/config/flags';

export function useSellerHelp() {
    const queryClient = useQueryClient();
    const { showToast } = useToast();
    const [activeTicketId, setActiveTicketId] = useState<number | null>(null);
    const [filters, setFiltersState] = useState({
        search: '',
        category: 'all' as TicketType | 'all' | 'critical' | 'tech-critical'
    });

    const { data: tickets = [], isLoading, refetch } = useQuery({
        queryKey: ['seller', 'help', 'tickets'],
        queryFn: async () => {
            if (USE_MOCKS) {
                return [...MOCK_TICKETS] as Ticket[];
            }
            try {
                return [...MOCK_TICKETS] as Ticket[];
            } catch (e) {
                console.warn('FALLBACK: Help tickets pendiente');
                return [...MOCK_TICKETS] as Ticket[];
            }
        },
        staleTime: 5 * 60 * 1000,
    });

    const sendMessageMutation = useMutation({
        mutationFn: async ({ ticketId, text }: { ticketId: number; text: string }) => {
            if (!USE_MOCKS) {
            }
            return { ticketId, text };
        },
        onSuccess: ({ ticketId, text }) => {
            const now = new Date();
            const hora = now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });

            const newMessage = {
                id: Date.now(),
                user: "Vendedor",
                role: "Vendedor",
                timestamp: now.toLocaleTimeString(),
                texto: text,
                isUser: true,
                hora
            };

            queryClient.setQueryData(['seller', 'help', 'tickets'], (old: Ticket[] | undefined) => {
                if (!old) return old;
                return old.map((t: Ticket) =>
                    t.id === ticketId ? { ...t, mensajes: [...t.mensajes, newMessage], mensajes_count: t.mensajes_count + 1 } : t
                );
            });
        }
    });

    const createTicketMutation = useMutation({
        mutationFn: async (formData: { asunto: string; mensaje: string; tipo_ticket: TicketType; criticidad: string }) => {
            await new Promise(r => setTimeout(r, 1000));
            return {
                id: Date.now(),
                id_display: `2026-0${Math.floor(Math.random() * 100)}`,
                titulo: formData.asunto,
                descripcion: formData.mensaje,
                status: 'abierto' as TicketStatus,
                type: formData.tipo_ticket,
                critical: formData.criticidad === 'alta' || formData.criticidad === 'critica',
                tiempo: 'Recién',
                mensajes_count: 0,
                tienda: { razon_social: "Tienda de Prueba", nombre_comercial: "Mi Tienda Mock" },
                contacto_adm: { nombre: "Usuario", apellido: "Demo", numeros: "999888777", correo: "test@lyrium.com" },
                mensajes: []
            } as Ticket;
        },
        onSuccess: (newTicket) => {
            queryClient.setQueryData(['seller', 'help', 'tickets'], (old: Ticket[] | undefined) => [newTicket, ...(old || [])]);
            setActiveTicketId(newTicket.id);
            showToast("Ticket generado con éxito. Un especialista lo revisará pronto.", "success");
        }
    });

    const closeTicketMutation = useMutation({
        mutationFn: async (ticketId: number) => {
            await new Promise(r => setTimeout(r, 800));
            return ticketId;
        },
        onSuccess: (ticketId) => {
            queryClient.setQueryData(['seller', 'help', 'tickets'], (old: Ticket[] | undefined) =>
                old.map((t: Ticket) => t.id === ticketId ? { ...t, status: 'cerrado' as TicketStatus, survey_required: true } : t)
            );
            showToast("Ticket finalizado. Por favor completa la encuesta de satisfacción.", "info");
        }
    });

    const submitSurveyMutation = useMutation({
        mutationFn: async ({ ticketId, rating, comment }: { ticketId: number; rating: number; comment: string }) => {
            await new Promise(r => setTimeout(r, 800));
            return { ticketId, rating, comment };
        },
        onSuccess: ({ ticketId, rating, comment }) => {
            queryClient.setQueryData(['seller', 'help', 'tickets'], (old: Ticket[] | undefined) =>
                old.map((t: Ticket) => t.id === ticketId ? { ...t, survey_required: false, satisfaction_rating: rating, satisfaction_comment: comment } : t)
            );
            showToast("Gracias por tu feedback. Nos ayuda a mejorar.", "success");
        }
    });

    const activeTicket = tickets.find(t => t.id === activeTicketId) || null;

    const filteredTickets = tickets.filter(t => {
        const matchesSearch = t.titulo.toLowerCase().includes(filters.search.toLowerCase()) || t.id_display.includes(filters.search);
        let matchesCategory = true;
        if (filters.category === 'critical') matchesCategory = t.critical;
        else if (filters.category === 'tech-critical') matchesCategory = t.type === 'tech' && t.critical;
        else if (filters.category !== 'all') matchesCategory = t.type === filters.category;
        return matchesSearch && matchesCategory;
    });

    return {
        tickets: filteredTickets,
        activeTicket,
        activeTicketId,
        setActiveTicketId,
        isLoading,
        isSending: sendMessageMutation.isPending,
        isClosing: closeTicketMutation.isPending,
        isCreating: createTicketMutation.isPending,
        filters,
        setFilters: (newFilters: Record<string, unknown>) => setFiltersState(prev => ({ ...prev, ...newFilters })),
        handleSendMessage: (text: string) => { if (activeTicketId) sendMessageMutation.mutate({ ticketId: activeTicketId, text }); },
        handleCreateTicket: (formData: { asunto: string; mensaje: string; tipo_ticket: TicketType; criticidad: string }) => createTicketMutation.mutate(formData),
        handleCloseTicket: () => { if (activeTicketId) closeTicketMutation.mutate(activeTicketId); },
        handleSubmitSurvey: (rating: number, comment: string) => { if (activeTicketId) submitSurveyMutation.mutate({ ticketId: activeTicketId, rating, comment }); },
        refresh: refetch
    };
}
