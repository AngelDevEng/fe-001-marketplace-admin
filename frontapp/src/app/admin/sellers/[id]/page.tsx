'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ModuleHeader from '@/components/layout/shared/ModuleHeader';
import { getDetailStore } from '@/lib/api';
import { Store } from '@/lib/types/stores/store';
import {
    User, Mail, Phone, MapPin, Calendar, CheckCircle,
    ShieldCheck, Globe, Facebook, Instagram, Twitter,
    ArrowLeft, ExternalLink, Star, Award
} from 'lucide-react';

export default function SellerDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [store, setStore] = useState<Store | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                setLoading(true);
                const data = await getDetailStore(id as string);
                setStore(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching seller detail:', err);
                setError('No se pudo cargar la información detallada del vendedor.');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchDetail();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-32">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                    <div className="text-center font-black animate-pulse uppercase tracking-[0.3em] text-blue-600 text-[10px]">
                        Obteniendo ficha técnica del vendedor...
                    </div>
                </div>
            </div>
        );
    }

    if (error || !store) {
        return (
            <div className="p-8">
                <div className="bg-rose-50 border border-rose-100 rounded-3xl p-12 text-center">
                    <p className="text-rose-600 font-bold">{error || 'Vendedor no encontrado'}</p>
                    <button
                        onClick={() => router.back()}
                        className="mt-4 px-6 py-2 bg-rose-600 text-white rounded-xl text-sm font-bold"
                    >
                        Volver
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fadeIn font-industrial">
            <div className="flex items-center gap-4 mb-4">
                <button
                    onClick={() => router.back()}
                    className="p-3 rounded-2xl bg-white border border-gray-100 text-gray-400 hover:text-gray-900 hover:shadow-md transition-all active:scale-95"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="h-8 w-px bg-gray-200"></div>
                <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                    <span>Panel Admin</span>
                    <span>/</span>
                    <span>Vendedores</span>
                    <span>/</span>
                    <span className="text-gray-900">{store.store_name}</span>
                </div>
            </div>

            <ModuleHeader
                title={`Ficha Técnica: ${store.store_name}`}
                subtitle="Gestión y supervisión estratégica de cuenta certificada"
                icon="UserCog"
                actions={
                    <a
                        href={store.shop_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-gray-900 transition-all active:scale-95"
                    >
                        Visitar Tienda Pública <ExternalLink className="w-4 h-4" />
                    </a>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Essential Profile */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Store Card Premium */}
                    <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden group">
                        <div className="relative h-48">
                            <img
                                src={store.banner || 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=1000&auto=format&fit=crop'}
                                alt="Banner"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                            <div className="absolute -bottom-12 left-8">
                                <div className="p-1 bg-white rounded-[2rem] shadow-2xl">
                                    <div className="w-24 h-24 rounded-[1.8rem] overflow-hidden border-4 border-white shadow-inner bg-gray-50">
                                        <img
                                            src={store.gravatar}
                                            alt="Avatar"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-16 p-8 space-y-6">
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                                    {store.store_name}
                                    {store.is_verified && <Award className="w-6 h-6 text-blue-500" />}
                                </h2>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">ID Comercial: #LY-{store.id}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Puntuación</p>
                                    <div className="flex items-center gap-2">
                                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                        <span className="text-sm font-black text-gray-900">{typeof store.rating.rating === 'number' ? store.rating.rating : '4.5'}</span>
                                    </div>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Reseñas</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-black text-gray-900">{store.rating.count}</span>
                                        <span className="text-[10px] font-bold text-gray-400">Usuarios</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-100 space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Email Corporativo</p>
                                        <p className="text-[11px] font-black text-gray-800 break-all">{store.email || 'info@fisiocenter.pe'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                                        <Phone className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Teléfono Directo</p>
                                        <p className="text-[11px] font-black text-gray-800">{store.phone}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                                        <MapPin className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Ubicación / Región</p>
                                        <p className="text-[11px] font-black text-gray-800">{store.address.city}, {store.address.state}, {store.address.country}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Security Badge */}
                    <div className="bg-gradient-to-br from-gray-900 to-slate-800 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                                <ShieldCheck className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                                <h3 className="text-sm font-black uppercase tracking-widest">Estatus de Seguridad</h3>
                                <p className="text-[10px] text-blue-300 font-bold uppercase tracking-wider">Validación Dokan Pro</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10 text-[10px] font-bold uppercase">
                                <span className="text-gray-400 tracking-widest">Validación KYC</span>
                                <span className="text-emerald-400">Completada</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10 text-[10px] font-bold uppercase">
                                <span className="text-gray-400 tracking-widest">Cuenta Activa</span>
                                <span className="text-blue-400">Verificada</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Detailed Tabs/Sections */}
                <div className="lg:col-span-8 space-y-8">
                    {/* General Information Bento */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-50">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Historial de Registro</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Fecha de Alta en Marketplace</span>
                                    <span className="text-sm font-black text-gray-800">{new Date(store.registered).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Representante Legal</span>
                                    <span className="text-sm font-black text-gray-800">{store.first_name} {store.last_name}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-50">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600">
                                    <Globe className="w-5 h-5" />
                                </div>
                                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Presencia Digital</h3>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl flex items-center gap-3 border border-blue-100">
                                    <Facebook className="w-5 h-5" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Facebook</span>
                                </div>
                                <div className="p-3 bg-pink-50 text-pink-600 rounded-2xl flex items-center gap-3 border border-pink-100">
                                    <Instagram className="w-5 h-5" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Instagram</span>
                                </div>
                                <div className="p-3 bg-sky-50 text-sky-600 rounded-2xl flex items-center gap-3 border border-sky-100">
                                    <Twitter className="w-5 h-5" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Twitter</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Business Configuration (Full Width in column) */}
                    <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-50 overflow-hidden">
                        <div className="bg-gray-50/50 p-8 border-b border-gray-100">
                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                                <Award className="w-5 h-5 text-blue-500" />
                                Configuración de Negocio (Dokan Pro)
                            </h3>
                        </div>
                        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="space-y-2">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Términos y Condiciones</p>
                                <div className={`flex items-center gap-2 ${store.toc_enabled ? 'text-emerald-500' : 'text-gray-400'}`}>
                                    <CheckCircle className="w-4 h-4" />
                                    <span className="text-xs font-black uppercase">{store.toc_enabled ? 'Habilitado' : 'Sin configurar'}</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Storefront Destacado</p>
                                <div className={`flex items-center gap-2 ${store.featured ? 'text-amber-500' : 'text-gray-400'}`}>
                                    <Star className="w-4 h-4" />
                                    <span className="text-xs font-black uppercase">{store.featured ? 'VIP Vendedor' : 'Estándar'}</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Canal de Confianza</p>
                                <div className={`flex items-center gap-2 ${store.trusted ? 'text-blue-500' : 'text-gray-400'}`}>
                                    <ShieldCheck className="w-4 h-4" />
                                    <span className="text-xs font-black uppercase">{store.trusted ? 'Auditado' : 'Pendiente'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Map / Logistics Placeholder */}
                    <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-50 p-8 h-64 flex flex-col items-center justify-center text-center opacity-70">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-300 mb-4">
                            <MapPin className="w-8 h-8" />
                        </div>
                        <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-1">Mapa de Logística</h4>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">{store.address.street_1 || 'Calle no especificada'}, {store.address.city}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
