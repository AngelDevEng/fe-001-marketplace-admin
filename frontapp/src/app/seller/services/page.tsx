'use client';

import React, { useEffect, useState } from 'react';
import ModuleHeader from '@/components/layout/shared/ModuleHeader';
import ServiceCard from './components/ServiceCard';
import SpecialistItem from './components/SpecialistItem';
import SpecialistModal from './components/SpecialistModal';
import ServiceConfigModal from './components/ServiceConfigModal';
import ServiceDetailModal from './components/ServiceDetailModal';
import RescheduleModal from './components/RescheduleModal';
import BaseEmptyState from '@/components/ui/BaseEmptyState';
import { Service, Specialist, Appointment } from '@/lib/types/seller/service';
import { useToast } from '@/context/ToastContext';
import BaseModal from '@/components/ui/BaseModal';
import Icon from '@/components/ui/Icon';
import BaseLoading from '@/components/ui/BaseLoading';

export default function ServicesPage() {
    // Simulated state instead of Zustand to wrap all context cleanly within the NextJS rewrite
    const [services, setServices] = useState<Service[]>([]);
    const [specialists, setSpecialists] = useState<Specialist[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { showToast } = useToast();

    const [activeService, setActiveService] = useState<Service | null>(null);
    const [selectedSpecialist, setSelectedSpecialist] = useState<Specialist | null>(null);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

    const [modals, setModals] = useState({
        serviceConfig: false,
        specialist: false,
        detail: false,
        reschedule: false
    });

    useEffect(() => {
        const loadMockData = async () => {
            setIsLoading(true);
            await new Promise(r => setTimeout(r, 600)); // Simulate API call

            setSpecialists([
                { id: 1, nombres: 'Dra. María', apellidos: 'García', especialidad: 'Nutrición Deportiva', avatar_chars: 'MG', color: '#10b981' },
                { id: 2, nombres: 'Lic. Juan', apellidos: 'Pérez', especialidad: 'Fisioterapia', avatar_chars: 'JP', color: '#f59e0b' }
            ]);

            setServices([
                {
                    id: 1,
                    nombre: 'Evaluación Nutricional Integral',
                    horario: 'Lun, Mié, Vie • 08:00 - 18:00',
                    estado: 'disponible',
                    sticker: 'bestseller',
                    especialistas_ids: [1],
                    config: { hora_inicio: '08:00', hora_fin: '18:00', duracion: 45, max_citas: 1, dias: ['Lun', 'Mié', 'Vie'] }
                },
                {
                    id: 2,
                    nombre: 'Sesión de Terapia Física',
                    horario: 'Mar, Jue • 09:00 - 17:00',
                    estado: 'disponible',
                    sticker: 'nuevo',
                    especialistas_ids: [2],
                    config: { hora_inicio: '09:00', hora_fin: '17:00', duracion: 60, max_citas: 1, dias: ['Mar', 'Jue'] }
                }
            ]);

            setAppointments([
                { id: 101, fecha: '2024-03-20', hora: '10:00', duracionMinutos: 45, especialistaId: 1, cliente: 'Carlos Rodríguez', servicio: 'Evaluación Nutricional Integral' }
            ]);

            setIsLoading(false);
        };
        loadMockData();
    }, []);

    const saveService = (service: Partial<Service>) => {
        if (service.id) {
            setServices(services.map(s => s.id === service.id ? service as Service : s));
        } else {
            setServices([...services, { ...service, id: Date.now() } as Service]);
        }
    };

    const deleteService = (id: number) => {
        // Mejorado: Usaríamos un modal de confirmación, por ahora agregamos feedback toast
        if (typeof window !== 'undefined' && window.confirm('¿Seguro de eliminar este servicio?')) {
            setServices(services.filter(s => s.id !== id));
            showToast('Servicio eliminado del catálogo', 'info');
        }
    };

    const handleReschedule = (appointmentId: number, newTime: string) => {
        setAppointments(prev => prev.map(app =>
            app.id === appointmentId ? { ...app, hora: newTime } : app
        ));
        showToast('Cita reprogramada con éxito', 'success');
    };

    const saveSpecialist = (spec: Partial<Specialist>) => {
        if (spec.id) {
            setSpecialists(specialists.map(s => s.id === spec.id ? spec as Specialist : s));
        } else {
            setSpecialists([...specialists, { ...spec, id: Date.now() } as Specialist]);
        }
    };


    const headerActions = (
        <div className="flex gap-3 items-center whitespace-nowrap">
            <button
                onClick={() => {
                    setActiveService(null);
                    setModals({ ...modals, serviceConfig: true });
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white backdrop-blur-md text-black font-bold text-[11px] border border-white/30 hover:text-sky-600 transition-all active:scale-95 shadow-sm"
            >
                <Icon name="Briefcase" className="w-4 h-4" /> Nuevo Servicio
            </button>
            <button
                onClick={() => {
                    setSelectedSpecialist(null);
                    setModals({ ...modals, specialist: true });
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white backdrop-blur-md text-black font-bold text-[11px] border border-white/30 hover:text-sky-600 transition-all active:scale-95 shadow-sm"
            >
                <Icon name="PlusCircle" className="w-4 h-4" /> Especialista
            </button>
        </div>
    );

    return (
        <div className="space-y-8 animate-fadeIn pb-20 max-w-7xl mx-auto">
            <ModuleHeader
                title="Gestión de Servicios"
                subtitle="Registro y administración de especialistas y servicios disponibles."
                icon="Services"
                actions={headerActions}
            />

            {isLoading ? (
                <BaseLoading message="Cargando ecosistema de servicios..." />
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
                    {/* LADO IZQUIERDO: Catálogo */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="flex items-center justify-between mb-4 px-2">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-sky-50 rounded-2xl flex items-center justify-center border border-sky-100 shadow-sm text-sky-500">
                                    <Icon name="Services" className="w-5 h-5 stroke-[2.5px]" />
                                </div>
                                <div>
                                    <h2 className="text-sm font-black text-gray-800 uppercase tracking-widest">Catálogo de Servicios</h2>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Tus ofertas activas</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <span className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-sm shadow-emerald-500"></span>Disponible
                                </span>
                                <span className="flex items-center gap-2 text-[10px] font-black text-rose-500 uppercase tracking-widest bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100">
                                    <span className="w-2.5 h-2.5 bg-rose-500 rounded-full"></span>Agotado
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                                        onDelete={deleteService}
                                    />
                                ))
                            ) : (
                                <div className="col-span-full">
                                    <BaseEmptyState
                                        title="Sin servicios activos"
                                        description="Tu catálogo de servicios está esperando su primera oferta."
                                        icon="Services"
                                        actionLabel="Nuevo Servicio"
                                        onAction={() => {
                                            setActiveService(null);
                                            setModals({ ...modals, serviceConfig: true });
                                        }}
                                        suggestion="Definir horarios claros y especialistas aumenta la confianza del cliente."
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* LADO DERECHO: Especialistas */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="flex items-center gap-3 mb-4 px-2">
                            <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center border border-indigo-100 shadow-sm text-indigo-500">
                                <Icon name="Users" className="w-5 h-5 stroke-[2.5px]" />
                            </div>
                            <div>
                                <h2 className="text-sm font-black text-gray-800 uppercase tracking-widest">Especialistas</h2>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Tu equipo de profesionales</p>
                            </div>
                        </div>
                        <div className="space-y-4">
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
                                <div className="p-10 text-center bg-gray-50/50 rounded-[2.5rem] border border-dashed border-gray-200">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sin especialistas</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Modals */}
            <SpecialistModal
                isOpen={modals.specialist}
                specialist={selectedSpecialist}
                onClose={() => setModals({ ...modals, specialist: false })}
                onSave={saveSpecialist}
            />

            <ServiceConfigModal
                isOpen={modals.serviceConfig}
                service={activeService}
                specialists={specialists}
                onClose={() => setModals({ ...modals, serviceConfig: false })}
                onSave={saveService}
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
