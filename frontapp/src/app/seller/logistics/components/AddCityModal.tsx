'use client';

import React, { useState } from 'react';
import { peruCoverage } from '@/lib/data/coverageData';
import { CityRate } from '@/lib/types/seller/logistics';
import BaseModal from '@/components/ui/BaseModal';
import BaseButton from '@/components/ui/BaseButton';
import Icon from '@/components/ui/Icon';

interface AddCityModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (rate: CityRate) => void;
}

export default function AddCityModal({ isOpen, onClose, onSave }: AddCityModalProps) {
    const [dept, setDept] = useState('');
    const [city, setCity] = useState('');
    const [rate, setRate] = useState(15.00);

    const departments = Object.keys(peruCoverage);
    const cities = dept ? (peruCoverage as Record<string, string[]>)[dept] : [];

    const handleSave = () => {
        if (!dept || !city) return;
        onSave({ department: dept, city, rate, agencies: [] });
        onClose();
        setDept('');
        setCity('');
        setRate(15.00);
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Nuevo Destino"
            subtitle="Configuración de Cobertura Geográfica"
            size="md"
            accentColor="from-emerald-400 to-sky-500"
        >
            <div className="p-8 space-y-8">
                <div className="bg-gray-50/50 p-8 rounded-[3rem] border border-gray-100 shadow-inner space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Departamento Originario</label>
                        <div className="relative">
                            <select
                                value={dept}
                                onChange={(e) => { setDept(e.target.value); setCity(''); }}
                                className="w-full px-6 py-5 bg-white border-none rounded-[1.75rem] font-black text-gray-800 shadow-xl shadow-gray-200/50 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none appearance-none cursor-pointer"
                            >
                                <option value="">Selecciona Jurisdicción</option>
                                {departments.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                            <Icon name="ChevronDown" className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-4 h-4" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Ciudad / Distrito Destino</label>
                        <div className="relative">
                            <select
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                disabled={!dept}
                                className="w-full px-6 py-5 bg-white border-none rounded-[1.75rem] font-black text-gray-800 shadow-xl shadow-gray-200/50 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none appearance-none cursor-pointer disabled:opacity-30 disabled:scale-[0.98]"
                            >
                                <option value="">{dept ? 'Selecciona Ciudad' : 'Esperando Departamento...'}</option>
                                {cities.map((c: string) => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <Icon name="ChevronDown" className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-4 h-4" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tarifa Logística Base (S/)</label>
                        <div className="relative group">
                            <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-sky-500 text-lg">S/</span>
                            <input
                                type="number"
                                value={rate}
                                onChange={(e) => setRate(parseFloat(e.target.value))}
                                step="0.50"
                                className="w-full pl-16 pr-8 py-5 bg-white border-none rounded-[1.75rem] font-black text-gray-800 text-xl shadow-xl shadow-gray-200/50 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none font-mono"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <BaseButton
                        onClick={handleSave}
                        disabled={!dept || !city}
                        variant="dark"
                        size="lg"
                        fullWidth
                        leftIcon="MapPin"
                    >
                        Habilitar Cobertura
                    </BaseButton>
                    <BaseButton
                        onClick={onClose}
                        variant="ghost"
                        size="lg"
                        fullWidth
                    >
                        Descartar
                    </BaseButton>
                </div>

                <p className="text-[9px] font-bold text-gray-300 leading-relaxed italic text-center px-4">
                    * La tarifa plana se aplicará a todos los envíos estándar. Las variaciones por peso se calculan al finalizar la compra.
                </p>
            </div>
        </BaseModal>
    );
}
