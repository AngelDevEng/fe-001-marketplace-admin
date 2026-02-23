'use client';

import React, { useState } from 'react';
import ModuleHeader from '@/components/layout/shared/ModuleHeader';
import DayActivityModal from './components/DayActivityModal';
import { useAgenda, generateCalendarDays } from '@/hooks/useAgenda';

export default function AgendaPage() {
    const { events, currentMonth, isLoading, nextMonth, prevMonth } = useAgenda();
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const monthDisplay = `${monthNames[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`;

    const calendarCells = generateCalendarDays(currentMonth);
    const today = new Date();

    const headerActions = (
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20">
            <button
                onClick={prevMonth}
                className="w-10 h-10 flex items-center justify-center hover:bg-white/20 rounded-xl transition-all text-white/90"
            >
                <i className="ph ph-caret-left text-xl"></i>
            </button>
            <span className="text-[11px] font-black text-white min-w-[120px] text-center uppercase tracking-widest">
                {monthDisplay}
            </span>
            <button
                onClick={nextMonth}
                className="w-10 h-10 flex items-center justify-center hover:bg-white/20 rounded-xl transition-all text-white/90"
            >
                <i className="ph ph-caret-right text-xl"></i>
            </button>
        </div>
    );

    if (isLoading && events.length === 0) {
        return (
            <div className="p-20 flex flex-col items-center justify-center animate-pulse">
                <i className="ph ph-circle-notch animate-spin text-4xl text-indigo-500 mb-4"></i>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Sincronizando Agenda...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fadeIn pb-20 font-industrial">
            <ModuleHeader
                title="Mi Agenda"
                subtitle="Gestión cronológica de entregas y compromisos"
                icon="ph-calendar-check"
                actions={headerActions}
            />

            {/* Icon Legend */}
            <div className="flex items-center gap-6 px-4">
                <div className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-100 shadow-sm">
                        <i className="ph-fill ph-package text-lg"></i>
                    </div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pedidos</span>
                </div>
                <div className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 shadow-sm">
                        <i className="ph-fill ph-clock text-lg"></i>
                    </div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Servicios</span>
                </div>
            </div>

            {/* Calendar Card */}
            <div className="bg-white overflow-hidden border border-gray-100 shadow-xl rounded-[3rem]">
                <div className="grid grid-cols-7 bg-gray-50/50 border-b border-gray-100">
                    {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(dia => (
                        <div key={dia} className="py-5 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            {dia}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 divide-x divide-y divide-gray-100 min-h-[600px]">
                    {calendarCells.map((cell, idx) => {
                        const dateStr = cell.date.toISOString().split('T')[0];
                        const dayEvents = events.filter(e => e.date === dateStr);
                        const isToday = cell.date.toDateString() === today.toDateString();

                        return (
                            <div
                                key={idx}
                                onClick={() => {
                                    if (!cell.isOtherMonth) {
                                        setSelectedDate(cell.date);
                                        setIsModalOpen(true);
                                    }
                                }}
                                className={`min-h-[140px] p-3 transition-all relative group
                                    ${cell.isOtherMonth ? 'bg-slate-50/30 opacity-20 pointer-events-none' : 'hover:bg-indigo-50/20 cursor-pointer'}
                                `}
                            >
                                <span className={`text-[15px] font-black mb-3 inline-flex items-center justify-center
                                    ${isToday ? 'text-white bg-gray-900 w-7 h-7 rounded-[10px] shadow-lg' : 'text-gray-700'}
                                `}>
                                    {cell.day}
                                </span>

                                <div className="space-y-1.5 mt-2">
                                    {dayEvents.map(event => (
                                        <div
                                            key={event.id}
                                            className={`text-[8px] font-extrabold p-1.5 px-2 rounded-lg border-l-[3px] shadow-sm flex items-center gap-1.5 whitespace-nowrap overflow-hidden
                                                ${event.type === 'order'
                                                    ? 'border-l-amber-500 bg-amber-50 text-amber-800'
                                                    : 'border-l-indigo-500 bg-indigo-50 text-indigo-800'}
                                            `}
                                        >
                                            <i className={`ph-fill ${event.type === 'order' ? 'ph-package' : 'ph-clock'}`}></i>
                                            <span className="truncate">{event.time} - {event.subtitle}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <DayActivityModal
                isOpen={isModalOpen}
                date={selectedDate}
                events={selectedDate ? events.filter(e => e.date === selectedDate?.toISOString().split('T')[0]) : []}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}
