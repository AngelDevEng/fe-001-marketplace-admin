'use client';

import React from 'react';
import { ShopConfig } from '@/lib/types/seller/shop';
import Icon from '@/components/ui/Icon';

interface PoliciesProps {
    config: ShopConfig;
    updateConfig: (updates: Partial<ShopConfig>) => void;
}

export default function Policies({ config, updateConfig }: PoliciesProps) {
    const handleFileChange = (type: keyof ShopConfig['policies'], file: File | null) => {
        if (file) {
            // Basic size check (5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('El archivo no debe superar los 5 MB');
                return;
            }
            // Mock file upload
            updateConfig({
                policies: { ...config.policies, [type]: file.name }
            });
        }
    };

    const handleDelete = (type: keyof ShopConfig['policies']) => {
        updateConfig({
            policies: { ...config.policies, [type]: undefined }
        });
    };

    interface PolicyRowProps {
        label: string;
        icon: string;
        color: string;
        type: 'shippingPdf' | 'returnPdf' | 'privacyPdf';
        value?: string;
    }

    const PolicyRow = ({ label, icon, color, type, value }: PolicyRowProps) => (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest flex items-center gap-1">
                    <Icon name={icon} className={`w-3 h-3 ${color}`} /> {label}
                </label>
                <input
                    type="file"
                    id={`input-${type}`}
                    className="hidden"
                    accept="application/pdf"
                    onChange={e => handleFileChange(type, e.target.files?.[0] || null)}
                />
                <button
                    type="button"
                    onClick={() => document.getElementById(`input-${type}`)?.click()}
                    className={`flex items-center gap-1 text-[9px] font-black ${color} hover:opacity-80 uppercase`}
                >
                    <Icon name="Upload" className="w-3 h-3" /> PDF
                </button>
            </div>
            <div className={`flex items-center justify-between px-3 py-2 ${value ? 'bg-sky-50/50 border-sky-100' : 'bg-gray-50/50 border-gray-100'} rounded-xl border`}>
                <span className={`text-[9px] font-black ${value ? 'text-sky-500' : 'text-gray-300'} truncate`}>
                    <Icon name="FileText" className="w-3 h-3 inline mr-1" /> {value || 'No cargado'}
                </span>
                {value && (
                    <button
                        type="button"
                        onClick={() => handleDelete(type)}
                        className="text-red-400 hover:text-red-600"
                    >
                        <Icon name="Trash2" className="w-3 h-3" />
                    </button>
                )}
            </div>
        </div>
    );

    return (
        <div className="glass-card p-0 overflow-hidden border-none rounded-[2.5rem] shadow-2xl bg-white mb-8">
            <div className="bg-gradient-to-r from-sky-500 via-sky-500 to-sky-400 p-8 flex items-center justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                <div className="flex items-center gap-5 text-white relative z-10">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-inner">
                        <Icon name="FileText" className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black tracking-tighter leading-none">Políticas y Términos</h3>
                        <p className="text-[10px] font-bold text-amber-100 uppercase tracking-[0.2em] mt-1 opacity-80">
                            Resúmenes legales, envíos, devoluciones y privacidad
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-8">
                <div className="mb-6 p-4 bg-sky-50 border border-sky-200 rounded-2xl flex items-start gap-3">
                    <div className="w-8 h-8 bg-sky-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon name="Info" className="text-sky-600 w-5 h-5" />
                    </div>
                    <div className="flex-1">
                        <p className="text-xs font-black text-sky-800 uppercase tracking-wider mb-1">Tamaño Máximo de Archivo</p>
                        <p className="text-xs text-sky-700 font-medium">
                            Los archivos PDF no deben superar los <span className="font-black">5 MB</span>.
                            Formatos permitidos: <span className="font-black">PDF</span> únicamente.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <PolicyRow
                        label="Política de Envío"
                        icon="Truck"
                        color="text-sky-600"
                        type="shippingPdf"
                        value={config.policies.shippingPdf}
                    />
                    <PolicyRow
                        label="Devoluciones"
                        icon="RotateCcw"
                        color="text-sky-600"
                        type="returnPdf"
                        value={config.policies.returnPdf}
                    />
                    <PolicyRow
                        label="Privacidad"
                        icon="ShieldCheck"
                        color="text-emerald-600"
                        type="privacyPdf"
                        value={config.policies.privacyPdf}
                    />
                </div>
            </div>
        </div>
    );
}
