'use client';

import React from 'react';
import { Service, Specialist, ServiceSticker } from '@/lib/types/seller/service';
import Icon from '@/components/ui/Icon';

interface ServiceCardProps {
    service: Service;
    specialists: Specialist[];
    onDetail: (service: Service) => void;
    onEdit: (service: Service) => void;
    onDelete: (id: number) => void;
}

const stickerConfigs: Record<ServiceSticker, { label: string; class: string }> = {
    'liquidacion': { label: 'Liquidación', class: 'bg-red-50 text-red-600 border-red-100' },
    'oferta': { label: 'Oferta', class: 'bg-amber-50 text-amber-600 border-amber-100' },
    'nuevo': { label: 'Nuevo', class: 'bg-sky-50 text-sky-600 border-sky-100' },
    'bestseller': { label: 'Top', class: 'bg-purple-50 text-purple-600 border-purple-100' },
    '': { label: '', class: '' }
};

export default function ServiceCard({ service, specialists, onDetail, onEdit, onDelete }: ServiceCardProps) {
    const sticker = service.sticker ? stickerConfigs[service.sticker] : null;

    return (
        <div className="glass-card bg-white p-6 border-l-4 border-sky-500 rounded-2xl shadow-sm hover:shadow-xl transition-all group animate-fadeIn flex flex-col justify-between h-full">
            <div>
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="font-black text-gray-800 tracking-tight">{service.nombre}</h3>
                            {sticker && sticker.label !== '' && (
                                <span className={`px-2 py-0.5 rounded-md border text-[8px] font-black uppercase tracking-wider ${sticker.class}`}>
                                    {sticker.label}
                                </span>
                            )}
                            <span className={`w-2 h-2 rounded-full ${service.estado === 'disponible' ? 'bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500/50' : 'bg-rose-500'}`}></span>
                        </div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{service.horario}</p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={(e) => { e.stopPropagation(); onEdit(service); }}
                            className="w-8 h-8 flex items-center justify-center bg-gray-50 text-gray-400 hover:bg-sky-50 hover:text-sky-500 rounded-lg transition-colors border border-gray-100"
                            title="Editar"
                        >
                            <Icon name="Pencil" className="w-4 h-4" />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); onDelete(service.id); }}
                            className="w-8 h-8 flex items-center justify-center bg-gray-50 text-gray-400 hover:bg-rose-50 hover:text-rose-500 rounded-lg transition-colors border border-gray-100"
                            title="Eliminar"
                        >
                            <Icon name="Trash2" className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                <div className="flex -space-x-2">
                    {service.especialistas_ids.map(id => {
                        const esp = specialists.find(e => e.id === id);
                        if (!esp) return null;
                        return (
                            <div
                                key={id}
                                className="w-8 h-8 rounded-full border-2 border-white bg-sky-100 flex items-center justify-center text-[10px] font-black overflow-hidden shadow-sm hover:scale-110 hover:z-10 transition-transform cursor-help"
                                title={`${esp.nombres} ${esp.apellidos}`}
                            >
                                {esp.foto ? (
                                    <img src={esp.foto} className="w-full h-full object-cover" alt={esp.nombres} />
                                ) : (
                                    <span className="text-sky-600">{esp.avatar_chars}</span>
                                )}
                            </div>
                        );
                    })}
                    {service.especialistas_ids.length === 0 && (
                        <span className="text-[9px] font-bold text-gray-400 italic">Sin asignar</span>
                    )}
                </div>
                <button
                    onClick={() => onDetail(service)}
                    className="text-[10px] font-black text-sky-600 uppercase tracking-widest hover:text-sky-700 transition-colors flex items-center gap-1 group/btn bg-sky-50 px-3 py-1.5 rounded-lg"
                >
                    Ver Detalles
                    <Icon name="ArrowRight" className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
}
