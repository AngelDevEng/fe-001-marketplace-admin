'use client';

import React, { useEffect, useState, useMemo } from 'react';
import ModuleHeader from '@/components/layout/shared/ModuleHeader';
import BaseModal from '@/components/ui/BaseModal';
import { Ticket, TicketType, TicketStatus } from '@/lib/types/seller/helpDesk';
import { MOCK_TICKETS } from '@/lib/mocks/mockHelpDeskData';
import TicketSidebar from './components/TicketSidebar';
import TicketChatView from './components/TicketChatView';
import NewTicketForm from './components/NewTicketForm';
import RegisteredStoreInfo from './components/RegisteredStoreInfo';
import Icon from '@/components/ui/Icon';

export default function HelpPage() {
    // --- Estado Local ---
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [activeTicketId, setActiveTicketId] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState<'soporte' | 'tienda'>('soporte');
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [filters, setFiltersState] = useState({
        search: '',
        category: 'all' as TicketType | 'all' | 'critical' | 'tech-critical'
    });

    // --- Carga Inicial ---
    useEffect(() => {
        const loadTickets = async () => {
            setIsLoading(true);
            await new Promise(r => setTimeout(r, 600));
            setTickets([...MOCK_TICKETS]);
            // Seleccionar el primer ticket por defecto en desktop
            if (MOCK_TICKETS.length > 0) setActiveTicketId(MOCK_TICKETS[0].id);
            setIsLoading(false);
        };
        loadTickets();
    }, []);

    // --- Filtros ---
    const filteredTickets = useMemo(() => {
        return tickets.filter(t => {
            const matchesSearch = t.titulo.toLowerCase().includes(filters.search.toLowerCase()) ||
                t.id_display.includes(filters.search);

            let matchesCategory = true;
            if (filters.category === 'critical') matchesCategory = t.critical;
            else if (filters.category === 'tech-critical') matchesCategory = t.type === 'tech' && t.critical;
            else if (filters.category !== 'all') matchesCategory = t.type === filters.category;

            return matchesSearch && matchesCategory;
        });
    }, [tickets, filters]);

    const activeTicket = useMemo(() => {
        return tickets.find(t => t.id === activeTicketId) || null;
    }, [tickets, activeTicketId]);

    // --- Acciones ---
    const setFilters = (newFilters: any) => {
        setFiltersState(prev => ({ ...prev, ...newFilters }));
    };

    const handleSendMessage = async ({ text }: { text: string }) => {
        if (!activeTicketId) return;
        setIsSending(true);
        await new Promise(r => setTimeout(r, 800));

        const newMessage = {
            id: Date.now(),
            user: "Vendedor",
            role: "Vendedor",
            timestamp: new Date().toLocaleTimeString(),
            texto: text,
            isUser: true,
            hora: new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })
        };

        setTickets(prev => prev.map(t => {
            if (t.id === activeTicketId) {
                return {
                    ...t,
                    mensajes: [...t.mensajes, newMessage as any],
                    mensajes_count: t.mensajes_count + 1
                };
            }
            return t;
        }));
        setIsSending(false);
    };

    const handleCreateTicket = async (formData: any) => {
        setIsLoading(true);
        await new Promise(r => setTimeout(r, 1000));
        const newTicket: Ticket = {
            id: Date.now(),
            id_display: `2026-0${tickets.length + 1}`,
            titulo: formData.asunto,
            descripcion: formData.mensaje,
            status: 'abierto',
            type: formData.tipo_ticket,
            critical: formData.criticidad === 'alta' || formData.criticidad === 'critica',
            tiempo: 'Recién',
            mensajes_count: 0,
            tienda: { razon_social: "Tienda de Prueba", nombre_comercial: "Mi Tienda Mock" },
            contacto_adm: { nombre: "Usuario", apellido: "Demo", numeros: "999888777", correo: "test@lyrium.com" },
            mensajes: []
        };

        setTickets(prev => [newTicket, ...prev]);
        setActiveTicketId(newTicket.id);
        setIsModalOpen(false);
        setIsLoading(false);
    };

    const handleCloseTicket = async () => {
        if (!activeTicketId) return;
        setIsClosing(true);
        await new Promise(r => setTimeout(r, 800));

        setTickets(prev => prev.map(t => {
            if (t.id === activeTicketId) {
                return {
                    ...t,
                    status: 'cerrado' as TicketStatus,
                    survey_required: true
                };
            }
            return t;
        }));
        setIsClosing(false);
    };

    const handleSubmitSurvey = async ({ rating, comment }: { rating: number, comment: string }) => {
        if (!activeTicketId) return;
        setIsLoading(true);
        await new Promise(r => setTimeout(r, 800));

        setTickets(prev => prev.map(t => {
            if (t.id === activeTicketId) {
                return {
                    ...t,
                    survey_required: false,
                    satisfaction_rating: rating,
                    satisfaction_comment: comment
                };
            }
            return t;
        }));
        setIsLoading(false);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] animate-fadeIn">
            <ModuleHeader
                title="Mesa de Ayuda"
                subtitle="Gestión de incidencias y soporte técnico operativo"
                icon="Headset"
                actions={
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-6 py-3 bg-white text-brand-sky rounded-xl font-black text-[10px] uppercase tracking-[0.1em] shadow-xl shadow-brand-sky/10 hover:bg-brand-sky hover:text-white transition-all active:scale-95 flex items-center gap-2"
                    >
                        <Icon name="PlusCircle" className="w-5 h-5" />
                        Nuevo Ticket
                    </button>
                }
            />

            {/* Tab System Header */}
            <div className="flex gap-1 bg-gray-100/50 p-1.5 rounded-3xl w-fit mb-8 border border-gray-100/50 shadow-sm ml-2">
                <button
                    onClick={() => setActiveTab('soporte')}
                    className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all
                        ${activeTab === 'soporte' ? 'bg-white text-sky-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    Centro de Soporte
                </button>
                <button
                    onClick={() => setActiveTab('tienda')}
                    className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all
                        ${activeTab === 'tienda' ? 'bg-white text-sky-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    Datos Registrados
                </button>
            </div>

            {/* Module Content Area */}
            <div className="flex-1 min-h-0">
                {activeTab === 'soporte' ? (
                    <div className="flex glass-card h-full overflow-hidden border-none shadow-2xl shadow-gray-200/50">
                        {/* Sidebar (List) */}
                        <div className="w-full lg:w-96 flex-shrink-0">
                            <TicketSidebar
                                tickets={filteredTickets}
                                activeTicketId={activeTicketId}
                                filters={filters}
                                onSetFilters={setFilters}
                                onSetActiveTicket={setActiveTicketId}
                                onNewTicket={() => setIsModalOpen(true)}
                            />
                        </div>

                        {/* Detail Area */}
                        <div className="hidden lg:flex flex-1 min-w-0 bg-white">
                            {activeTicketId ? (
                                <TicketChatView
                                    ticket={activeTicket}
                                    isSending={isSending}
                                    isClosing={isClosing}
                                    onSendMessage={handleSendMessage}
                                    onCloseTicket={handleCloseTicket}
                                    onSubmitSurvey={handleSubmitSurvey}
                                />
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center p-20 text-center space-y-6">
                                    <div className="w-24 h-24 bg-sky-50 rounded-[2.5rem] flex items-center justify-center text-sky-500 shadow-inner">
                                        <Icon name="MessageCircle" className="w-12 h-12" />
                                    </div>
                                    <h3 className="text-2xl font-black text-gray-800 tracking-tight">Selecciona un ticket</h3>
                                    <p className="max-w-xs text-gray-400 font-bold text-xs uppercase tracking-widest leading-relaxed">
                                        Elige una incidencia de la lista de la izquierda para ver el historial o crear una nueva para recibir asistencia inmediata.
                                    </p>
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="mt-4 px-10 py-4 bg-sky-500 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-sky-100 hover:bg-sky-600 transition-all active:scale-95"
                                    >
                                        Reportar Incidencia
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="h-full overflow-y-auto no-scrollbar px-2">
                        <RegisteredStoreInfo />
                    </div>
                )}
            </div>

            {/* Modal de Nuevo Ticket */}
            <BaseModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Reportar Incidencia"
                subtitle="Centro de Respuesta Operativa (RF-23)"
                size="xl"
                accentColor="from-sky-500 to-indigo-500"
            >
                <NewTicketForm
                    onCreateTicket={handleCreateTicket}
                    onCancel={() => setIsModalOpen(false)}
                />
            </BaseModal>

            {/* Cargando Overlay si es necesario */}
            {isLoading && (
                <div className="fixed inset-0 bg-white/50 backdrop-blur-sm flex flex-col items-center justify-center z-[200]">
                    <Icon name="Loader2" className="animate-spin text-sky-500 mb-4 w-10 h-10" />
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Procesando solicitud...</p>
                </div>
            )}
        </div>
    );
}
