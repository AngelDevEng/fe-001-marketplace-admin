'use client';

import React, { useState } from 'react';
import ModuleHeader from '@/components/layout/shared/ModuleHeader';
import TicketSidebar from './components/TicketSidebar';
import TicketChatView from './components/TicketChatView';
import NewTicketForm from './components/NewTicketForm';
import RegisteredStoreInfo from './components/RegisteredStoreInfo';
import { useSellerHelp } from '@/hooks/useSellerHelp';

export default function HelpPage() {
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

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] animate-fadeIn font-industrial">
            <ModuleHeader
                title="Mesa de Ayuda"
                subtitle="Centro de soporte y gestión de incidencias"
                icon="Headset"
            />

            {/* Tab System Header */}
            <div className="flex gap-1 bg-gray-100/80 p-1.5 rounded-[2rem] w-fit mb-8 border border-gray-100 shadow-sm ml-2">
                <button
                    onClick={() => setTab('soporte')}
                    className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all
                        ${activeTab === 'soporte' ? 'bg-white text-indigo-600 shadow-md' : 'text-gray-400 hover:text-gray-700'}`}
                >
                    Centro de Soporte
                </button>
                <button
                    onClick={() => setTab('tienda')}
                    className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all
                        ${activeTab === 'tienda' ? 'bg-white text-indigo-600 shadow-md' : 'text-gray-400 hover:text-gray-700'}`}
                >
                    Datos Registrados
                </button>
            </div>

            {/* Module Content Area */}
            <div className="flex-1 min-h-0">
                {activeTab === 'soporte' ? (
                    <div className="flex bg-white rounded-[2.5rem] border border-gray-100 shadow-xl h-full overflow-hidden">
                        {/* Sidebar (List) */}
                        <div className="w-full lg:w-96 flex-shrink-0">
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
                        <div className="hidden lg:flex flex-1 min-w-0 bg-white">
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
                                <div className="flex-1">
                                    <NewTicketForm
                                        onCreateTicket={handleCreateTicket}
                                        onCancel={() => { }}
                                    />
                                </div>
                            )}
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
