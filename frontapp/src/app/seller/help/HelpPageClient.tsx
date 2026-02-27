'use client';

import React, { useState } from 'react';
import ModuleHeader from '@/components/layout/shared/ModuleHeader';
import TicketSidebar from './components/TicketSidebar';
import TicketChatView from './components/TicketChatView';
import NewTicketForm from './components/NewTicketForm';
import RegisteredStoreInfo from './components/RegisteredStoreInfo';
import BaseLoading from '@/components/ui/BaseLoading';
import { useSellerHelp } from '@/hooks/useSellerHelp';

interface HelpPageClientProps {
    // TODO Tarea 3: Recibir datos iniciales del Server Component
}

export function HelpPageClient(_props: HelpPageClientProps) {
    const {
        tickets,
        activeTicket,
        activeTicketId,
        setActiveTicketId,
        isLoading,
        isSending,
        isClosing,
        filters,
        setFilters,
        handleSendMessage,
        handleCreateTicket,
        handleCloseTicket,
        handleSubmitSurvey,
    } = useSellerHelp();

    const [activeTab, setTab] = useState('soporte');

    if (isLoading) {
        return (
            <div className="flex flex-col h-[calc(100vh-140px)] animate-fadeIn">
                <ModuleHeader
                    title="Mesa de Ayuda"
                    subtitle="Centro de soporte y gestión de incidencias"
                    icon="Headset"
                />
                <div className="flex-1 flex items-center justify-center">
                    <BaseLoading message="Cargando tickets de soporte..." />
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] animate-fadeIn">
            <ModuleHeader
                title="Mesa de Ayuda"
                subtitle="Centro de soporte y gestión de incidencias"
                icon="Headset"
            />

            {/* Tab System Header */}
            <div className="flex gap-1 bg-gray-100/50 p-1.5 rounded-3xl w-fit mb-8 border border-gray-100/50 shadow-sm ml-2">
                <button
                    onClick={() => setTab('soporte')}
                    className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all
                        ${activeTab === 'soporte' ? 'bg-white text-sky-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    Centro de Soporte
                </button>
                <button
                    onClick={() => setTab('tienda')}
                    className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all
                        ${activeTab === 'tienda' ? 'bg-white text-sky-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    Datos Registrados
                </button>
            </div>

            {/* Module Content Area */}
            <div className="flex-1 min-h-0">
                {activeTab === 'soporte' ? (
                    <div className="h-[calc(100vh-8rem)] overflow-hidden">
                        <div className="grid grid-cols-12 gap-8 h-full">
                            {/* Sidebar (List) */}
                            <div className="col-span-12 md:col-span-5 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                            <TicketSidebar
                                tickets={tickets}
                                activeTicketId={activeTicketId}
                                filters={filters}
                                onSetFilters={setFilters}
                                onSetActiveTicket={setActiveTicketId}
                                onNewTicket={() => handleCreateTicket({ subject: '', description: '', priority: 'normal', category: 'general' })}
                            />
                            </div>

                            {/* Detail Area */}
                        <div className="col-span-12 md:col-span-7 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
                            {activeTicketId ? (
                                <TicketChatView
                                    ticket={activeTicket!}
                                    isSending={isSending}
                                    isClosing={isClosing}
                                    onSendMessage={({ text }) => handleSendMessage(text)}
                                    onCloseTicket={handleCloseTicket}
                                    onSubmitSurvey={({ rating, comment }) => handleSubmitSurvey(rating, comment)}
                                />
                            ) : (
                                <div className="flex-1 flex items-center justify-center">
                                    <NewTicketForm
                                        onCreateTicket={handleCreateTicket}
                                        onCancel={() => { }}
                                    />
                                </div>
                            )}
                        </div>
                        </div>
                    </div>
                ) : (
                    <div className="h-full overflow-y-auto custom-scrollbar px-2">
                        <RegisteredStoreInfo />
                    </div>
                )}
            </div>
        </div>
    );
}
