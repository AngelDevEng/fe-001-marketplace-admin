'use client';

import React, { useState } from 'react';
import { Agency } from '@/lib/types/seller/logistics';
import BaseModal from '@/components/ui/BaseModal';
import BaseButton from '@/components/ui/BaseButton';
import Icon from '@/components/ui/Icon';

interface AddAgencyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (agency: Omit<Agency, 'id' | 'logo'>) => void;
}

export default function AddAgencyModal({ isOpen, onClose, onSave }: AddAgencyModalProps) {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');

    const handleSave = () => {
        if (!name || !address) return;
        onSave({ name, address });
        setName('');
        setAddress('');
        onClose();
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Punto de Recojo"
            subtitle="Configuración de Red Logística"
            size="md"
            accentColor="from-sky-500 to-indigo-500"
        >
            <div className="p-8 space-y-8">
                <div className="space-y-6">
                    <div className="bg-gray-50/50 p-8 rounded-[2.5rem] border border-gray-100/50 shadow-inner space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Nombre de la Agencia <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Ej: Shalom - Sede Central"
                                className="w-full px-6 py-5 bg-white border-none rounded-[1.75rem] font-black text-gray-800 shadow-xl shadow-gray-200/50 focus:ring-4 focus:ring-sky-500/5 outline-none transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Ubicación Geo-referencial <span className="text-red-500">*</span></label>
                            <textarea
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Av. Principal 123, Distrito..."
                                rows={2}
                                className="w-full px-6 py-5 bg-white border-none rounded-[2rem] font-black text-gray-700 text-sm shadow-xl shadow-gray-200/50 focus:ring-4 focus:ring-sky-500/5 outline-none resize-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-6 bg-sky-50/50 rounded-3xl border border-sky-100/50">
                        <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-sky-500">
                            <Icon name="Info" className="w-5 h-5 font-bold" />
                        </div>
                        <p className="text-[10px] font-black text-sky-600 uppercase tracking-tighter leading-relaxed">
                            El sistema asignará el distintivo visual automáticamente basado en el operador logístico identificado.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-3 pt-6 border-t border-gray-50">
                    <BaseButton
                        onClick={handleSave}
                        disabled={!name || !address}
                        variant="dark"
                        size="lg"
                        fullWidth
                        leftIcon="PlusCircle"
                    >
                        Consolidar Agencia
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
            </div>
        </BaseModal>
    );
}
