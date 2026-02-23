'use client';

import React from 'react';
import { AgendaEvent } from '@/lib/types/seller/agenda';
import BaseDrawer from '@/components/ui/BaseDrawer';
import BaseButton from '@/components/ui/BaseButton';
import Icon from '@/components/ui/Icon';

interface DayActivityModalProps {
    isOpen: boolean;
    date: Date | null;
    events: AgendaEvent[];
    onClose: () => void;
}

export default function DayActivityModal({ isOpen, date, events, onClose }: DayActivityModalProps) {
    if (!date) return null;

    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    const dateLabel = date.toLocaleDateString('es-ES', options);

    const serviceEvents = events.filter(e => e.type === 'service');
    const orderEvents = events.filter(e => e.type === 'order');

    const footer = (
        <BaseButton
            onClick={onClose}
            className="bg-sky-500 text-gray-600 hover:bg-sky-400 hover:text-white"
            size="lg"
            fullWidth
        >
            Cerrar Vista de Agenda
        </BaseButton>
    );

    return (
        <BaseDrawer
            isOpen={isOpen}
            onClose={onClose}
            title={dateLabel}
            subtitle={`${events.length} Actividades Programadas`}
            badge="Operacional Diario"
            width="md:w-[650px]"
            accentColor="from-emerald-400/10 via-sky-400/5"
            footer={footer}
        >
            <div className="space-y-12">
                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-6">
                    <div className="bg-sky-50/50 p-6 rounded-[2.5rem] border border-sky-100/50 flex flex-col justify-between h-32">
                        <div className="flex justify-between items-start">
                            <span className="text-[10px] font-black text-sky-600 uppercase tracking-widest">Servicios</span>
                            <Icon name="CalendarCheck" className="text-2xl text-sky-400 w-6 h-6" />
                        </div>
                        <p className="text-3xl font-black text-gray-800">{serviceEvents.length}</p>
                    </div>
                    <div className="bg-amber-50/50 p-6 rounded-[2.5rem] border border-amber-100/50 flex flex-col justify-between h-32">
                        <div className="flex justify-between items-start">
                            <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Pedidos</span>
                            <Icon name="Package" className="text-2xl text-amber-400 w-6 h-6" />
                        </div>
                        <p className="text-3xl font-black text-gray-800">{orderEvents.length}</p>
                    </div>
                </div>

                {/* Timeline Content */}
                <div className="space-y-8">
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-1.5 h-4 bg-gray-900 rounded-full"></div>
                        <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Itinerario Detallado</h4>
                    </div>

                    <div className="space-y-4 relative">
                        {events.length > 0 ? (
                            events.map((event, idx) => (
                                <div key={`${event.type}-${event.id}`} className="relative pl-10 group">
                                    {/* Vertical Line Connector */}
                                    {idx !== events.length - 1 && (
                                        <div className="absolute left-[19px] top-10 bottom-[-16px] w-0.5 bg-gradient-to-b from-gray-100 to-transparent"></div>
                                    )}

                                    {/* Icon Marker */}
                                    <div className={`absolute left-0 top-2 w-10 h-10 rounded-2xl flex items-center justify-center text-lg z-10 border-[4px] border-white shadow-xl transition-all group-hover:scale-110
                                        ${event.type === 'order' ? 'bg-amber-100 text-amber-600' : 'bg-sky-100 text-sky-600'}`}>
                                        <Icon name={event.type === 'order' ? 'Package' : 'Clock'} className="fill-current w-5 h-5 flex-shrink-0" />
                                    </div>

                                    <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 transition-all hover:shadow-2xl hover:shadow-gray-100 hover:border-sky-100">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-black text-gray-800 text-base tracking-tight">{event.title}</span>
                                                <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest
                                                    ${event.type === 'order' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-sky-50 text-sky-600 border border-sky-100'}`}>
                                                    {event.type === 'order' ? 'Venta' : 'Asesoría'}
                                                </span>
                                            </div>
                                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-tighter">
                                                {event.time} • {event.subtitle}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border shadow-sm
                                                ${event.status === 'confirmed' || event.status === 'pagado'
                                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                    : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                                                {event.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-24 flex flex-col items-center justify-center text-center gap-4 bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-100">
                                <div className="w-16 h-16 bg-white rounded-[2rem] flex items-center justify-center shadow-2xl shadow-gray-100 border border-gray-50">
                                    <Icon name="Calendar" className="text-3xl text-gray-200 w-8 h-8" />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Día Despejado</p>
                                    <p className="text-[10px] font-bold text-gray-300 uppercase italic">Sin operaciones programadas en este bloque</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Tactical Footer Note */}
                <div className="p-8 bg-gray-900 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 blur-3xl -z-0"></div>
                    <div className="flex items-start gap-5 relative z-10">
                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center flex-shrink-0 border border-white/10">
                            <Icon name="Zap" className="text-sky-400 text-2xl font-bold w-6 h-6" />
                        </div>
                        <div>
                            <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-400 mb-1">Nota Operativa</h5>
                            <p className="text-xs text-white/50 leading-relaxed font-bold">
                                Los eventos listados aquí se sincronizan automáticamente con tus avisos de despacho y agenda de servicios en tiempo real.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </BaseDrawer>
    );
}
