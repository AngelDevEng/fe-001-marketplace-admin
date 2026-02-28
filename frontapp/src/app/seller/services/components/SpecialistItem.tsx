import React from 'react';
import { Specialist } from '@/features/seller/services/types';
import Icon from '@/components/ui/Icon';

interface SpecialistItemProps {
    specialist: Specialist;
    onClick: (specialist: Specialist) => void;
}

export default function SpecialistItem({ specialist, onClick }: SpecialistItemProps) {
    return (
        <div
            onClick={() => onClick(specialist)}
            className="glass-card bg-white p-4 flex items-center gap-4 hover:-translate-y-1 hover:shadow-lg hover:shadow-sky-100/50 transition-all cursor-pointer group animate-slideInRight rounded-2xl border border-gray-100"
        >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-black text-white overflow-hidden transition-transform group-hover:scale-105 shadow-md`} style={{ backgroundColor: specialist.color || '#38bdf8' }}>
                {specialist.foto ? (
                    <img src={specialist.foto} className="w-full h-full object-cover" alt={specialist.nombres} />
                ) : (
                    specialist.avatar_chars
                )}
            </div>
            <div className="flex-1 min-w-0">
                <h4 className="text-sm font-black text-gray-800 truncate tracking-tight">{specialist.nombres} {specialist.apellidos}</h4>
                <p className="text-[10px] font-bold text-gray-400 flex items-center gap-1 uppercase truncate tracking-widest mt-0.5">
                    <Icon name="Stethoscope" className="w-3 h-3 text-sky-400" /> {specialist.especialidad}
                </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-sky-50 group-hover:text-sky-500 transition-colors">
                <Icon name="ChevronRight" className="w-4 h-4" />
            </div>
        </div>
    );
}
