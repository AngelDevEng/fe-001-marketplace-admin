'use client';

import React from 'react';
import { ShopConfig } from '@/lib/types/seller/shop';
import Icon from '@/components/ui/Icon';

interface StoreIdentityProps {
    config: ShopConfig;
    updateConfig: (updates: Partial<ShopConfig>) => void;
}

export default function StoreIdentity({ config, updateConfig }: StoreIdentityProps) {
    return (
        <div className="glass-card p-0 overflow-hidden border-none rounded-[2.5rem] shadow-2xl bg-white mb-8">
            <div className="bg-gradient-to-r from-sky-500 via-sky-500 to-sky-400 p-8 flex items-center justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                <div className="flex items-center gap-5 text-white relative z-10">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-inner">
                        <Icon name="Building" className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black tracking-tighter leading-none">Sobre Nosotros</h3>
                        <p className="text-[10px] font-bold text-sky-100 uppercase tracking-[0.2em] mt-1 opacity-80">
                            Identidad, historia y descripción de tu empresa
                        </p>
                    </div>
                </div>
                <div className="relative z-10">
                    <span className="px-4 py-2 bg-black/10 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-widest text-white border border-white/10">
                        Perfil Corporativo
                    </span>
                </div>
            </div>

            <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-4 space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                                    <Icon name="Building" className="w-3 h-3 text-sky-500" /> Nombre <span className="text-red-500 ml-1">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={config.name}
                                    onChange={e => updateConfig({ name: e.target.value })}
                                    className="w-full text-sm font-black text-gray-800 bg-transparent p-3 border-2 border-gray-200 rounded-xl outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition-all duration-300"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                                    <Icon name="Tag" className="w-3 h-3 text-purple-500" /> Categoría <span className="text-red-500 ml-1">*</span>
                                </label>
                                <select
                                    value={config.category}
                                    onChange={e => updateConfig({ category: e.target.value })}
                                    className="w-full text-sm font-black text-gray-800 bg-transparent p-3 border-2 border-gray-200 rounded-xl outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition-all duration-300"
                                >
                                    <option value="">Seleccionar...</option>
                                    <option>Bebes y recien nacidos</option>
                                    <option>Belleza</option>
                                    <option>Bienestas emocional y medicina natural</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                                    <Icon name="Briefcase" className="w-3 h-3 text-emerald-500" /> Actividad <span className="text-red-500 ml-1">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={config.activity}
                                    onChange={e => updateConfig({ activity: e.target.value })}
                                    className="w-full text-sm font-black text-gray-800 bg-transparent p-3 border-2 border-gray-200 rounded-xl outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition-all duration-300"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-8 space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                                <Icon name="Building2" className="w-3 h-3 text-sky-500" />
                                Descripción de la Empresa <span className="text-red-500 ml-1">*</span>
                            </label>
                            <textarea
                                rows={10}
                                value={config.description}
                                onChange={e => updateConfig({ description: e.target.value })}
                                className="w-full text-sm font-black text-gray-800 bg-transparent p-3 border-2 border-gray-200 rounded-xl outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition-all duration-300"
                                placeholder="Escribe aquí la historia de tu empresa..."
                            ></textarea>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
