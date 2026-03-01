'use client';

import React from 'react';
import Image from 'next/image';
import { ShopConfig } from '@/features/seller/store/types';
import PolaroidCard from './PolaroidCard';

interface VisualIdentityProps {
    config: ShopConfig;
    updateConfig: (updates: Partial<ShopConfig>) => void;
}

import Icon from '@/components/ui/Icon';

export default function VisualIdentity({ config, updateConfig }: VisualIdentityProps) {
    const handleFileChange = (field: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const result = event.target?.result as string;
                if (field === 'logo') {
                    updateConfig({ visual: { ...config.visual, logo: result } });
                } else if (field === 'banner1') {
                    updateConfig({ visual: { ...config.visual, banner1: result } });
                } else if (field === 'banner2') {
                    updateConfig({ visual: { ...config.visual, banner2: result } });
                } else if (field === 'gallery') {
                    updateConfig({ visual: { ...config.visual, gallery: [...config.visual.gallery, result] } });
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDeleteGalleryItem = (index: number) => {
        const newGallery = [...config.visual.gallery];
        newGallery.splice(index, 1);
        updateConfig({ visual: { ...config.visual, gallery: newGallery } });
    };

    const getRotation = (index: number) => {
        const rotations = ['-rotate-2', 'rotate-1', 'rotate-2', '-rotate-1'];
        return rotations[index % rotations.length];
    };

    return (
        <div className="glass-card p-0 overflow-hidden border-none rounded-[2.5rem] shadow-2xl bg-white animate-fadeIn mb-8">
            <div className="bg-gradient-to-r from-sky-500 via-sky-500 to-sky-400 p-8 flex items-center justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                <div className="flex items-center gap-5 text-white relative z-10">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-inner">
                        <Icon name="Palette" className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black tracking-tighter leading-none">Estudio de Identidad</h3>
                        <p className="text-[10px] font-bold text-sky-100 uppercase tracking-[0.2em] mt-1 opacity-80">
                            Gestiona tu logo, banners y galeria de fotos de tu tienda
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-4 xl:col-span-3 space-y-8">
                    <div className="flex flex-col items-start">
                        <div className="flex items-center gap-2 mb-6">
                            <span className="w-1.5 h-4 bg-sky-500 rounded-full"></span>
                            <label className="text-[11px] font-black text-gray-800 uppercase tracking-widest">Logo de Marca</label>
                        </div>
                        <div
                            className="relative w-48 h-48 bg-gray-50 rounded-full ring-4 ring-gray-50 ring-offset-4 ring-offset-white border-2 border-dashed border-gray-200 group cursor-pointer overflow-hidden flex items-center justify-center transition-all duration-500 hover:scale-[1.02] hover:border-sky-400"
                            onClick={() => document.getElementById('input-logo')?.click()}
                        >
                            {config.visual.logo ? (
                                <Image src={config.visual.logo} fill sizes="112px" alt="Logo" className="object-contain group-hover:scale-110 transition-transform duration-700" />
                            ) : (
                                <Icon name="Image" className="w-12 h-12 text-gray-300" />
                            )}
                            <div className="absolute inset-0 bg-sky-600/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center text-white">
                                <Icon name="Camera" className="w-8 h-8 mb-2 animate-bounce" />
                                <span className="text-[9px] font-black uppercase tracking-widest">Actualizar</span>
                            </div>
                            <input type="file" id="input-logo" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={e => handleFileChange('logo', e)} />
                        </div>

                        <div className="mt-8 space-y-3 pl-2">
                            <div className="flex items-center gap-2">
                                <Icon name="Maximize" className="w-3 h-3 text-sky-500" />
                                <p className="text-[10px] font-black text-gray-500 uppercase">Ratio Profesional 1:1</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Icon name="Image" className="w-3 h-3 text-emerald-500" />
                                <p className="text-[9px] font-bold text-red-400 uppercase">PNG • JPG • WEBP (Máx 2MB)</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-8 xl:col-span-9 space-y-10">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-4 bg-sky-500 rounded-full"></span>
                                <label className="text-[11px] font-black text-gray-800 uppercase tracking-widest">Escaparate de Banners</label>
                            </div>
                            <p className="text-[9px] font-bold text-red-400 uppercase tracking-widest italic flex items-center gap-1">
                                <Icon name="AlertCircle" className="w-3 h-3" /> Resolución Óptima 4:1
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div
                                className="relative aspect-[4/1.5] rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 cursor-pointer group"
                                onClick={() => document.getElementById('input-banner1')?.click()}
                            >
                                {config.visual.banner1 ? (
                                    <Image src={config.visual.banner1} fill sizes="(max-width: 768px) 100vw, 50vw" alt="Banner Principal" className="object-cover group-hover:scale-105 transition-transform duration-1000" />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Icon name="Image" className="w-12 h-12 text-gray-300" />
                                    </div>
                                )}
                                <div className="absolute top-4 left-4">
                                    <span className="px-2 py-1 bg-black/40 backdrop-blur-md rounded-lg text-[8px] font-black text-white uppercase tracking-tighter border border-white/20">Banner Principal</span>
                                </div>
                                <input type="file" id="input-banner1" className="hidden" accept="image/*" onChange={e => handleFileChange('banner1', e)} />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-6">
                                    <span className="text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                        <Icon name="Upload" className="w-4 h-4" /> Cambiar imagen de fondo
                                    </span>
                                </div>
                            </div>
                            <div
                                className={`relative aspect-[4/1.5] rounded-3xl overflow-hidden border-2 border-dashed ${config.visual.banner2 ? 'border-gray-100 bg-gray-50' : 'border-sky-100 bg-sky-50/30'} flex items-center justify-center cursor-pointer hover:bg-sky-50 transition-all group`}
                                onClick={() => document.getElementById('input-banner2')?.click()}
                            >
                                {config.visual.banner2 ? (
                                    <>
                                        <Image src={config.visual.banner2} fill sizes="(max-width: 768px) 100vw, 50vw" alt="Banner de Oferta" className="object-cover group-hover:scale-105 transition-transform duration-1000" />
                                        <div className="absolute top-4 left-4">
                                            <span className="px-2 py-1 bg-black/40 backdrop-blur-md rounded-lg text-[8px] font-black text-white uppercase tracking-tighter border border-white/20">Banner de Oferta</span>
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-6">
                                            <span className="text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                                <Icon name="Upload" className="w-4 h-4" /> Cambiar imagen
                                            </span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-3 border border-sky-100 shadow-sm">
                                            <Icon name="Plus" className="text-sky-500 w-5 h-5" />
                                        </div>
                                        <p className="text-[10px] font-black text-sky-600 uppercase tracking-widest">Expandir Campaña</p>
                                        <p className="text-[8px] font-bold text-sky-300 uppercase mt-1">Añadir Banner de Oferta</p>
                                    </div>
                                )}
                                <input type="file" id="input-banner2" className="hidden" accept="image/*" onChange={e => handleFileChange('banner2', e)} />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-4 bg-indigo-500 rounded-full"></span>
                                <label className="text-[11px] font-black text-gray-800 uppercase tracking-widest">Muro de Instalaciones</label>
                            </div>
                            <button className="flex items-center gap-2 px-5 py-2.5 bg-sky-100 text-sky-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-sky-400 hover:text-white transition-all">
                                <Icon name="PlusCircle" className="w-4 h-4" />
                                <span>Gestionar Galería</span>
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-x-12 gap-y-10 pt-4 pl-4">
                            {config.visual.gallery.map((img, i) => (
                                <PolaroidCard
                                    key={i}
                                    image={img}
                                    rotation={getRotation(i)}
                                    onDelete={() => handleDeleteGalleryItem(i)}
                                />
                            ))}
                            <div
                                className="w-28 h-28 border-2 border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center bg-gray-50/50 hover:bg-white transition-all cursor-pointer rotate-1 group"
                                onClick={() => document.getElementById('input-gallery')?.click()}
                            >
                                <Icon name="Image" className="w-6 h-6 text-gray-200 group-hover:text-indigo-300" />
                                <span className="text-[8px] font-black text-gray-300 uppercase mt-1">Próxima Foto</span>
                                <input type="file" id="input-gallery" className="hidden" accept="image/*" multiple onChange={e => handleFileChange('gallery', e)} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
