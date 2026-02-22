'use client';

import React, { useState, useEffect } from 'react';
import { Service, Specialist, ServiceSticker } from '@/lib/types/seller/service';
import BaseModal from '@/components/ui/BaseModal';
import BaseButton from '@/components/ui/BaseButton';
import { useToast } from '@/context/ToastContext';

interface ServiceConfigModalProps {
    service: Service | null;
    specialists: Specialist[];
    isOpen: boolean;
    onClose: () => void;
    onSave: (service: Partial<Service>) => void;
}

const stickerOptions: { value: ServiceSticker; label: string; color: 'gray' | 'red' | 'amber' | 'sky' | 'purple' }[] = [
    { value: '', label: 'Ninguno', color: 'gray' },
    { value: 'liquidacion', label: 'Lote', color: 'red' },
    { value: 'oferta', label: 'Oferta', color: 'amber' },
    { value: 'nuevo', label: 'Nuevo', color: 'sky' },
    { value: 'bestseller', label: 'Top', color: 'purple' }
];

const daysOptions = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

import Icon from '@/components/ui/Icon';

export default function ServiceConfigModal({ service, specialists, isOpen, onClose, onSave }: ServiceConfigModalProps) {
    const { showToast } = useToast();
    const [formData, setFormData] = useState<Partial<Service>>({
        nombre: '',
        especialistas_ids: [],
        sticker: '',
        config: {
            hora_inicio: '08:00',
            hora_fin: '20:00',
            duracion: 30,
            max_citas: 1,
            dias: []
        }
    });

    useEffect(() => {
        if (service) setFormData(service);
        else setFormData({
            nombre: '',
            especialistas_ids: [],
            sticker: '',
            config: { hora_inicio: '08:00', hora_fin: '20:00', duracion: 30, max_citas: 1, dias: [] }
        });
    }, [service, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validaciones de negocio
        if (!formData.especialistas_ids || formData.especialistas_ids.length === 0) {
            showToast('Debes asignar al menos un especialista al servicio', 'error');
            return;
        }

        if (!formData.config?.dias || formData.config.dias.length === 0) {
            showToast('Selecciona al menos un día de atención', 'error');
            return;
        }

        const { hora_inicio, hora_fin } = formData.config!;
        if (hora_inicio >= hora_fin) {
            showToast('La hora de inicio debe ser anterior a la hora de fin', 'error');
            return;
        }

        const diasStr = formData.config?.dias?.join(', ') || '';
        const horario = `${diasStr} • ${formData.config?.hora_inicio} - ${formData.config?.hora_fin}`;
        onSave({ ...formData, horario, estado: 'disponible' });
        onClose();
    };

    const toggleDay = (day: string) => {
        const currentDays = formData.config?.dias || [];
        const newDays = currentDays.includes(day)
            ? currentDays.filter(d => d !== day)
            : [...currentDays, day];
        setFormData({ ...formData, config: { ...formData.config!, dias: newDays } });
    };

    const toggleSpecialist = (id: number) => {
        const currentIds = formData.especialistas_ids || [];
        const newIds = currentIds.includes(id)
            ? currentIds.filter(i => i !== id)
            : [...currentIds, id];
        setFormData({ ...formData, especialistas_ids: newIds });
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Configuración de Agenda"
            subtitle="Planificación de Disponibilidad Operativa"
            size="4xl"
            accentColor="from-emerald-400 to-sky-400"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Columna 1: Datos y Especialistas */}
                    <div className="space-y-6">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Denominación del Servicio <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                required
                                value={formData.nombre}
                                onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                                className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-[1.5rem] font-bold text-gray-800 focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none"
                                placeholder="Ej: Consulta Especializada"
                            />
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Team Asignado</label>
                                <span className="text-[8px] font-black text-sky-500 bg-sky-50 px-2 py-0.5 rounded-lg border border-sky-100/50 uppercase">{formData.especialistas_ids?.length || 0} IDs</span>
                            </div>
                            <div className="grid grid-cols-1 gap-2.5 max-h-[220px] overflow-y-auto custom-scrollbar pr-2">
                                {specialists.map(esp => (
                                    <label key={esp.id} className={`flex items-center justify-between p-3 rounded-[1.25rem] border-2 transition-all cursor-pointer group active:scale-[0.98]
                                        ${formData.especialistas_ids?.includes(esp.id) ? 'bg-white border-sky-500 shadow-md shadow-sky-50' : 'bg-gray-50/50 border-transparent hover:border-gray-100 hover:bg-white'}`}>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-[10px] font-black text-sky-600 overflow-hidden shadow-xs">
                                                {esp.foto ? <img src={esp.foto} className="w-full h-full object-cover" alt="" /> : esp.avatar_chars}
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-gray-800 tracking-tight leading-tight">{esp.nombres}</p>
                                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{esp.especialidad}</p>
                                            </div>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={formData.especialistas_ids?.includes(esp.id)}
                                            onChange={() => toggleSpecialist(esp.id)}
                                            className="w-5 h-5 rounded-md border-gray-100 text-sky-500 focus:ring-sky-500/10 cursor-pointer shadow-inner"
                                        />
                                    </label>
                                ))}
                                {specialists.length === 0 && (
                                    <div className="p-8 text-center border-2 border-dashed border-gray-50 rounded-[1.5rem] bg-gray-50/20">
                                        <Icon name="Users" className="w-8 h-8 text-gray-200 mb-2 inline-block" />
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Sin colaboradores</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Columna 2: Horarios */}
                    <div className="bg-gray-50/50 p-6 rounded-[2.5rem] border border-gray-100/50 shadow-inner flex flex-col justify-between">
                        <div className="space-y-6">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100">
                                    <Icon name="CalendarCheck" className="w-5 h-5 text-sky-500" />
                                </div>
                                <h3 className="text-[10px] font-black text-gray-800 uppercase tracking-widest">Horario Operativo</h3>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 text-opacity-50">Inicio</label>
                                    <input
                                        type="time"
                                        value={formData.config?.hora_inicio}
                                        onChange={e => setFormData({ ...formData, config: { ...formData.config!, hora_inicio: e.target.value } })}
                                        className="w-full px-4 py-3 bg-white rounded-xl border-none font-bold text-gray-800 shadow-xs focus:ring-4 focus:ring-sky-500/10 transition-all font-mono text-sm outline-none"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 text-opacity-50">Fin</label>
                                    <input
                                        type="time"
                                        value={formData.config?.hora_fin}
                                        onChange={e => setFormData({ ...formData, config: { ...formData.config!, hora_fin: e.target.value } })}
                                        className="w-full px-4 py-3 bg-white rounded-xl border-none font-bold text-gray-800 shadow-xs focus:ring-4 focus:ring-sky-500/10 transition-all font-mono text-sm outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 text-opacity-50">Frecuencia</label>
                                    <select
                                        value={formData.config?.duracion}
                                        onChange={e => setFormData({ ...formData, config: { ...formData.config!, duracion: parseInt(e.target.value) } })}
                                        className="w-full px-4 py-3 bg-white rounded-xl border-none font-bold text-gray-700 shadow-xs focus:ring-4 focus:ring-sky-500/10 transition-all outline-none cursor-pointer text-sm"
                                    >
                                        <option value="15">15 min</option>
                                        <option value="30">30 min</option>
                                        <option value="45">45 min</option>
                                        <option value="60">60 min</option>
                                        <option value="90">90 min</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 text-opacity-50">Cupos</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={formData.config?.max_citas}
                                        onChange={e => setFormData({ ...formData, config: { ...formData.config!, max_citas: parseInt(e.target.value) } })}
                                        className="w-full px-4 py-3 bg-white rounded-xl border-none font-bold text-gray-800 shadow-xs focus:ring-4 focus:ring-sky-500/10 transition-all outline-none text-sm"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 block">Días de Atención</label>
                                <div className="flex flex-wrap gap-1.5">
                                    {daysOptions.map(day => (
                                        <button
                                            key={day}
                                            type="button"
                                            onClick={() => toggleDay(day)}
                                            className={`w-9 h-9 flex items-center justify-center rounded-xl border text-[9px] font-black uppercase transition-all shadow-xs
                                                ${formData.config?.dias?.includes(day)
                                                    ? 'bg-sky-500 text-white border-sky-600 shadow-inner'
                                                    : 'bg-white text-gray-400 border-gray-100 hover:border-sky-200 hover:text-sky-500'}`}
                                        >
                                            {day}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sticker / Promo area */}
                        <div className="mt-6 p-4 bg-white rounded-[1.5rem] border border-gray-100 shadow-xs space-y-3">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 block">Status de Vitrina</label>
                            <div className="flex flex-wrap gap-1.5">
                                {stickerOptions.map(opt => (
                                    <label key={opt.value} className="cursor-pointer">
                                        <input
                                            type="radio"
                                            name="sticker"
                                            value={opt.value}
                                            checked={formData.sticker === opt.value}
                                            onChange={e => setFormData({ ...formData, sticker: e.target.value as ServiceSticker })}
                                            className="sr-only"
                                        />
                                        <div className={`px-3 py-1.5 rounded-lg border text-[8px] font-black uppercase tracking-widest transition-all
                                            ${formData.sticker === opt.value
                                                ? 'bg-gray-900 text-white border-gray-900 shadow-md'
                                                : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200'}`}>
                                            {opt.label}
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="sticky bottom-0 bg-white/90 backdrop-blur-md pt-5 flex justify-end gap-3 border-t border-gray-50 z-20 -mx-8 -mb-8 p-6">
                    <BaseButton
                        variant="ghost"
                        onClick={onClose}
                    >
                        Cancelar
                    </BaseButton>
                    <BaseButton
                        type="submit"
                        variant="success"
                        leftIcon="Save"
                        className="px-8"
                    >
                        Guardar Cambios
                    </BaseButton>
                </div>
            </form>
        </BaseModal>
    );
}
