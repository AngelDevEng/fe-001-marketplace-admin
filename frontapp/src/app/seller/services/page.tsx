'use client';

import React, { useState } from 'react';
import ModuleHeader from '@/components/layout/shared/ModuleHeader';
import ServiceCard from './components/ServiceCard';
import SpecialistItem from './components/SpecialistItem';
import SpecialistModal from './components/SpecialistModal';
import ServiceConfigModal from './components/ServiceConfigModal';
import ServiceDetailModal from './components/ServiceDetailModal';
import RescheduleModal from './components/RescheduleModal';
import { Service, Specialist, Appointment } from '@/lib/types/seller/service';
import { useSellerServices } from '@/hooks/useSellerServices';

export default function ServicesPage() {
    const {
        specialists,
        services,
        appointments,
        loading,
        handleSaveService,
        handleDeleteService,
        handleSaveSpecialist,
        handleReschedule,
    } = useSellerServices();

    const [activeService, setActiveService] = useState<Service | null>(null);
    const [selectedSpecialist, setSelectedSpecialist] = useState<Specialist | null>(null);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

    const [modals, setModals] = useState({
        serviceConfig: false,
        specialist: false,
        detail: false,
        reschedule: false
    });

    if (loading) {
        return (
            <div className="p-20 text-center text-xs font-black text-gray-400 uppercase tracking-widest animate-pulse">
                Cargando ecosistema de servicios...
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fadeIn pb-20 font-industrial">
            <ModuleHeader
                title="Gestión de Servicios"
                subtitle="Registro y administración de especialistas y servicios disponibles"
                icon="Services"
                actions={
                    <div className="flex gap-2.5 items-center whitespace-nowrap">
                        <button
                            onClick={() => {
                                setActiveService(null);
                                setModals({ ...modals, serviceConfig: true });
                            }}
                            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-gray-900 font-black text-[11px] uppercase tracking-widest border border-gray-100 shadow-xl hover:text-indigo-600 hover:shadow-indigo-100 transition-all active:scale-95"
                        >
                            <i className="ph ph-plus-circle text-lg"></i> Nuevo
                        </button>
                        <button
                            onClick={() => {
                                setSelectedSpecialist(null);
                                setModals({ ...modals, specialist: true });
                            }}
                            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-gray-900 font-black text-[11px] uppercase tracking-widest border border-gray-100 shadow-xl hover:text-indigo-600 hover:shadow-indigo-100 transition-all active:scale-95"
                        >
                            <i className="ph ph-user-plus text-lg"></i> Especialista
                        </button>
                    </div>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* LADO IZQUIERDO: Catálogo */}
                <div className="lg:col-span-8 space-y-4">
                    <div className="flex items-center justify-between mb-2 px-1">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-900 rounded-xl text-white">
                                <i className="ph ph-briefcase text-lg"></i>
                            </div>
                            <h2 className="text-xs font-black text-gray-600 uppercase tracking-widest">Catálogo de Servicios</h2>
                        </div>
                        <div className="flex gap-4">
                            <span className="flex items-center gap-1.5 text-[9px] font-black text-emerald-500 uppercase tracking-tighter">
                                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>Disponible
                            </span>
                            <span className="flex items-center gap-1.5 text-[9px] font-black text-rose-500 uppercase tracking-tighter">
                                <span className="w-2 h-2 bg-rose-500 rounded-full"></span>Agotado/Lleno
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {services.length > 0 ? (
                            services.map(s => (
                                <ServiceCard
                                    key={s.id}
                                    service={s}
                                    specialists={specialists}
                                    onDetail={(serv) => {
                                        setActiveService(serv);
                                        setModals({ ...modals, detail: true });
                                    }}
                                    onEdit={(serv) => {
                                        setActiveService(serv);
                                        setModals({ ...modals, serviceConfig: true });
                                    }}
                                    onDelete={handleDeleteService}
                                />
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100">
                                <i className="ph ph-selection-all text-4xl text-gray-200 mb-2 block"></i>
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">No hay servicios registrados</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* LADO DERECHO: Especialistas */}
                <div className="lg:col-span-4 space-y-4">
                    <div className="flex items-center gap-3 mb-2 px-1">
                        <div className="p-2 bg-gray-900 rounded-xl text-white">
                            <i className="ph ph-users-three text-lg"></i>
                        </div>
                        <h2 className="text-xs font-black text-gray-600 uppercase tracking-widest">Especialistas</h2>
                    </div>
                    <div className="space-y-3">
                        {specialists.length > 0 ? (
                            specialists.map(esp => (
                                <SpecialistItem
                                    key={esp.id}
                                    specialist={esp}
                                    onClick={(s) => {
                                        setSelectedSpecialist(s);
                                        setModals({ ...modals, specialist: true });
                                    }}
                                />
                            ))
                        ) : (
                            <div className="p-10 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sin especialistas</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modals */}
            <SpecialistModal
                isOpen={modals.specialist}
                specialist={selectedSpecialist}
                onClose={() => setModals({ ...modals, specialist: false })}
                onSave={handleSaveSpecialist}
            />

            <ServiceConfigModal
                isOpen={modals.serviceConfig}
                service={activeService}
                specialists={specialists}
                onClose={() => setModals({ ...modals, serviceConfig: false })}
                onSave={handleSaveService}
            />

            <ServiceDetailModal
                isOpen={modals.detail}
                service={activeService}
                specialists={specialists}
                appointments={appointments}
                onClose={() => setModals({ ...modals, detail: false })}
                onEdit={(serv) => {
                    setActiveService(serv);
                    setModals({ ...modals, serviceConfig: true, detail: false });
                }}
                onReschedule={(app) => {
                    setSelectedAppointment(app);
                    setModals({ ...modals, reschedule: true, detail: false });
                }}
            />

            <RescheduleModal
                isOpen={modals.reschedule}
                appointment={selectedAppointment}
                onClose={() => setModals({ ...modals, reschedule: false, detail: true })}
                onConfirm={handleReschedule}
            />
        </div>
    );
}
