'use client';

import React from 'react';
import { TicketList } from './TicketList';
import { ChatView } from './ChatView';
import { FAQView, AuditTable } from './HelpDeskSections';
import { Priority, TicketStatus, ActionType } from '@/lib/types/admin/helpdesk';
import { MessageSquare, LayoutGrid, BookOpen, ShieldCheck } from 'lucide-react';

interface HelpDeskModuleProps {
    data: any;
    loading: boolean;
    currentTab: string;
    setCurrentTab: (tab: string) => void;
    selectedTicket: any;
    filteredTickets: any[];
    filteredAudit: any[];
    filters: any;
    setFilters: React.Dispatch<React.SetStateAction<any>>;
    actions: any;
    onEscalate: () => void;
    onCloseTicket: () => void;
    onFAQCreate: () => void;
    onFAQDetail: (id: number) => void;
}

export const HelpDeskModule: React.FC<HelpDeskModuleProps> = ({
    data, loading, currentTab, setCurrentTab,
    selectedTicket, filteredTickets, filteredAudit,
    filters, setFilters, actions,
    onEscalate, onCloseTicket, onFAQCreate, onFAQDetail
}) => {

    if (loading || !data) {
        return (
            <div className="flex items-center justify-center p-20">
                <div className="text-center font-black animate-pulse uppercase tracking-widest text-sky-500 font-industrial">
                    Cargando Mesa de Ayuda...
                </div>
            </div>
        );
    }

    const renderTabButton = (id: string, label: string, icon: React.ReactNode) => {
        const isActive = currentTab === id;
        return (
            <button
                onClick={() => setCurrentTab(id)}
                className={`px-8 py-3.5 rounded-[1.7rem] text-[10px] font-black transition-all flex items-center gap-2 font-industrial uppercase tracking-wider ${isActive ? 'bg-white shadow-md text-sky-600' : 'text-gray-400 hover:bg-white/50'
                    }`}
            >
                {icon} {label}
            </button>
        );
    };

    return (
        <div className="relative min-h-[800px] overflow-hidden">
            {/* Tab Navigation */}
            <div className="flex bg-gray-100/80 backdrop-blur-md p-1.5 rounded-[2rem] gap-1 shadow-inner border border-white/50 w-fit mx-auto mb-10">
                {renderTabButton('todos', 'Todos los Casos', <LayoutGrid className="w-4 h-4" />)}
                {renderTabButton('asignados', 'Mis Asignados', <MessageSquare className="w-4 h-4" />)}
                {renderTabButton('faq', 'Base de Conocimiento', <BookOpen className="w-4 h-4" />)}
                {renderTabButton('auditoria', 'Auditoría Forense', <ShieldCheck className="w-4 h-4" />)}
            </div>

            {/* Main Content Areas */}
            {currentTab === 'faq' ? (
                <FAQView
                    articles={data.faq}
                    onCreateClick={onFAQCreate}
                    onSearchChange={(q) => console.log('Search FAQ:', q)}
                    onDetailClick={onFAQDetail}
                />
            ) : currentTab === 'auditoria' ? (
                <AuditTable
                    entries={filteredAudit}
                    filters={{
                        search: filters.auditSearch,
                        date: filters.auditDate,
                        type: filters.auditType as ActionType
                    }}
                    onFilterChange={(f) => setFilters((prev: any) => ({ ...prev, ...f }))}
                />
            ) : (
                <div className="grid grid-cols-12 gap-8 animate-fadeIn">
                    <TicketList
                        tickets={filteredTickets}
                        selectedId={selectedTicket?.id || null}
                        onSelect={actions.selectTicket}
                        filters={{
                            search: filters.search,
                            status: filters.status as TicketStatus,
                            priority: filters.priority as Priority
                        }}
                        onFilterChange={(f) => setFilters((prev: any) => ({ ...prev, ...f }))}
                    />
                    {selectedTicket ? (
                        <ChatView
                            ticket={selectedTicket}
                            admins={data.admins}
                            onSendMessage={actions.sendReply}
                            onPriorityChange={actions.updateTicketPriority}
                            onAdminChange={actions.updateTicketAdmin}
                            onEscalate={onEscalate}
                            onCloseTicket={onCloseTicket}
                        />
                    ) : (
                        <div className="col-span-12 lg:col-span-7 h-full min-h-[600px]">
                            <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-100 bg-white/40 backdrop-blur-sm rounded-[2.5rem]">
                                <div className="w-24 h-24 bg-sky-50 text-sky-200 rounded-full flex items-center justify-center mb-6">
                                    <MessageSquare className="w-12 h-12" />
                                </div>
                                <h3 className="text-xl font-black text-gray-400 tracking-tight font-industrial uppercase">Selecciona un caso para gestionar</h3>
                                <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest mt-2 font-industrial">La trazabilidad garantiza un mejor servicio</p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default HelpDeskModule;
