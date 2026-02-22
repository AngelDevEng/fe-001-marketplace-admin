'use client';

import { useState, useEffect, useMemo } from 'react';
import {
    MesaAyudaData, Ticket, TicketStatus, Priority,
    AuditEntry, Message, ActionType, FAQArticle
} from '@/lib/types/admin/helpdesk';
import { MOCK_HELPDESK_DATA } from '@/lib/mocks/helpdeskData';

export const useMesaAyuda = () => {
    const [data, setData] = useState<MesaAyudaData | null>(null);
    const [loading, setLoading] = useState(true);
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

    // Fetch data (Replica legacy load logic)
    useEffect(() => {
        const loadData = async () => {
            try {
                // Simulación de carga (1:1 con legacy logic)
                setData(MOCK_HELPDESK_DATA);
            } catch (error) {
                console.error('Error loading Mesa Ayuda:', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const selectedTicket = useMemo(() =>
        data?.tickets.find(t => t.id === selectedTicketId) || null
        , [data?.tickets, selectedTicketId]);

    // Derived state: Filtered tickets
    const filteredTickets = useMemo(() => {
        if (!data) return [];
        let tickets = data.tickets;

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
    }, [data, currentTab, filters.search, filters.status, filters.priority]);

    // Derived state: Filtered Audit
    const filteredAudit = useMemo(() => {
        if (!data) return [];
        return data.auditoria.filter(a => {
            const matchSearch = !filters.auditSearch ||
                a.tienda.toLowerCase().includes(filters.auditSearch.toLowerCase()) ||
                a.responsable.toLowerCase().includes(filters.auditSearch.toLowerCase());
            const matchDate = !filters.auditDate || a.timestamp.includes(filters.auditDate);
            const matchType = !filters.auditType || a.accion === filters.auditType;
            return matchSearch && matchDate && matchType;
        });
    }, [data, filters.auditSearch, filters.auditDate, filters.auditType]);

    // Actions (Legacy logic implementation)
    const logAudit = (action: ActionType, details: string, ticket?: Ticket) => {
        const entry: AuditEntry = {
            id: Date.now(),
            timestamp: new Date().toLocaleString(),
            tienda: ticket ? ticket.vendedor.empresa || 'Sistema' : 'Sistema',
            accion: action,
            responsable: 'Admin_Marketplace',
            detalles: details
        };
        setData(prev => prev ? { ...prev, auditoria: [entry, ...prev.auditoria] } : null);
    };

    const selectTicket = (id: number) => {
        setSelectedTicketId(id);
        setData(prev => {
            if (!prev) return null;
            return {
                ...prev,
                tickets: prev.tickets.map(t => t.id === id ? { ...t, mensajes_sin_leer: 0 } : t)
            };
        });
    };

    const sendReply = (text: string, isQuick: boolean = false) => {
        if (!selectedTicket || !text.trim()) return;

        const newMessage: Message = {
            id: Date.now(),
            usuario: 'Admin_Marketplace (Admin)',
            contenido: text,
            tipo: isQuick ? 'respuesta_rapida' : 'normal',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            leido: true
        };

        setData(prev => {
            if (!prev) return null;
            return {
                ...prev,
                tickets: prev.tickets.map(t => t.id === selectedTicket.id ? {
                    ...t,
                    mensajes: [...t.mensajes, newMessage],
                    estado: 'Resuelto' as TicketStatus,
                    fecha_actualizacion: 'Hoy'
                } : t)
            };
        });

        logAudit('Respuesta', `Mensaje: ${text.substring(0, 30)}...`, selectedTicket);
    };

    const updateTicketPriority = (id: number, priority: Priority) => {
        setData(prev => {
            if (!prev) return null;
            return {
                ...prev,
                tickets: prev.tickets.map(t => t.id === id ? { ...t, prioridad: priority } : t)
            };
        });
        const ticket = data?.tickets.find(t => t.id === id);
        logAudit('Cambio Prioridad', `Prioridad: ${priority}`, ticket);
    };

    const updateTicketAdmin = (id: number, adminId: number) => {
        const admin = data?.admins.find(a => a.id === adminId);
        if (!admin) return;

        setData(prev => {
            if (!prev) return null;
            return {
                ...prev,
                tickets: prev.tickets.map(t => t.id === id ? { ...t, admin_asignado: { id: admin.id, nombre: admin.nombre } } : t)
            };
        });
        const ticket = data?.tickets.find(t => t.id === id);
        logAudit('Asignación', `Reasignado a ${admin.nombre}`, ticket);
    };

    const escalateTicket = (destino: string, motivo: string) => {
        if (!selectedTicket) return;

        const sysMsg: Message = {
            id: Date.now(),
            usuario: 'Sistema Lyrium',
            contenido: `🔄 Caso escalado a ${destino}. Motivo: ${motivo}`,
            tipo: 'escalamiento',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            leido: true
        };

        setData(prev => {
            if (!prev) return null;
            return {
                ...prev,
                tickets: prev.tickets.map(t => t.id === selectedTicket.id ? {
                    ...t,
                    estado: 'En Proceso' as TicketStatus,
                    prioridad: 'Crítica' as Priority,
                    mensajes: [...t.mensajes, sysMsg]
                } : t)
            };
        });

        logAudit('Escalamiento', `Destino: ${destino} | Justificación: ${motivo}`, selectedTicket);
    };

    const closeTicket = (survey: { satisfaction: number; timely: number; comments: string }) => {
        if (!selectedTicket) return;

        setData(prev => {
            if (!prev) return null;
            return {
                ...prev,
                tickets: prev.tickets.map(t => t.id === selectedTicket.id ? { ...t, estado: 'Cerrado' as TicketStatus } : t)
            };
        });

        logAudit('Cierre', `Satis: ${survey.satisfaction}/5 | Oportuna: ${survey.timely}/5 | Msg: ${survey.comments || 'Sin msg'}`, selectedTicket);
    };

    const addFAQ = (article: Omit<FAQArticle, 'id' | 'visitas' | 'util_si' | 'util_no' | 'palabras_clave'>) => {
        const newArt: FAQArticle = {
            ...article,
            id: Date.now(),
            visitas: 0,
            util_si: 0,
            util_no: 0,
            palabras_clave: []
        };
        setData(prev => prev ? { ...prev, faq: [newArt, ...prev.faq] } : null);
    };

    return {
        data,
        loading,
        currentTab,
        setCurrentTab,
        selectedTicket,
        filteredTickets,
        filteredAudit,
        filters,
        setFilters,
        actions: {
            selectTicket,
            sendReply,
            updateTicketPriority,
            updateTicketAdmin,
            escalateTicket,
            closeTicket,
            addFAQ
        }
    };
};
