'use client';

import React from 'react';
import Image from 'next/image';
import { ShopConfig } from '@/lib/types/seller/shop';
import Icon from '@/components/ui/Icon';

interface StoreAwardsProps {
    config: ShopConfig;
}

export default function StoreAwards({ config }: StoreAwardsProps) {
    return (
        <div className="glass-card p-0 overflow-hidden border-none rounded-[2.5rem] shadow-2xl bg-white mb-8">
            <div className="bg-gradient-to-r from-sky-500 via-sky-500 to-sky-400 p-8 flex items-center justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                <div className="flex items-center gap-5 text-white relative z-10">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-inner">
                        <Icon name="Medal" className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black tracking-tighter leading-none">Estatus de Socio Lyrium</h3>
                        <p className="text-[10px] font-bold text-blue-100 uppercase tracking-[0.2em] mt-1 opacity-80">
                            Credenciales Oficiales de la Plataforma
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-12">
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-2 mb-1">
                        <h3 className="text-2xl font-black text-gray-800 tracking-tight">Estatus de Socio Lyrium</h3>
                        <div className="relative group/info">
                            <button type="button" className="text-gray-300 hover:text-sky-500 transition-colors">
                                <Icon name="Info" className="w-5 h-5" />
                            </button>
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-white p-4 rounded-2xl shadow-2xl border border-gray-100 w-64 opacity-0 invisible group-hover/info:opacity-100 group-hover/info:visible transition-all z-[100] cursor-default text-left">
                                <p className="text-[10px] font-black text-sky-500 uppercase tracking-widest mb-2">Acerca del Estatus</p>
                                <p className="text-[9px] text-gray-500 font-medium leading-relaxed">
                                    Las medallas son reconocimientos automáticos y manuales que validan la trayectoria y confianza de tu tienda en el ecosistema Lyrium.
                                </p>
                                <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r border-b border-gray-100 rotate-45"></div>
                            </div>
                        </div>
                    </div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Credenciales Oficiales de la Plataforma</p>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-center gap-16">
                    <div className="relative group flex-shrink-0">
                        <div className="absolute -inset-4 bg-sky-500/10 rounded-full blur-2xl group-hover:bg-sky-500/20 transition-all"></div>
                        <Image 
                            src="/img/INSIGNIA PREMIUM.png" 
                            alt="Insignia" 
                            width={208} 
                            height={208}
                            className="relative w-52 h-52 object-contain transition-transform duration-700 group-hover:scale-110 drop-shadow-2xl"
                        />
                        <div className="mt-8 text-center">
                            <span className="px-6 py-2 bg-white rounded-full shadow-xl border border-sky-100 text-sky-600 font-black text-sm uppercase tracking-tighter">Vendedor de Élite Verificado</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        {/* Identidad Verificada */}
                        <div className="relative group/medal">
                            <div className="flex items-center gap-2 bg-sky-50 px-4 py-2 rounded-full border border-sky-100 shadow-sm transition-all hover:bg-sky-500 hover:text-white cursor-help">
                                <Icon name="ShieldCheck" className="text-sky-500 group-hover/medal:text-white transition-colors w-4 h-4" />
                                <span className="text-[9px] font-black uppercase tracking-widest">Identidad Verificada</span>
                            </div>
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-white p-3 rounded-xl shadow-2xl border border-gray-100 w-56 opacity-0 invisible group-hover/medal:opacity-100 group-hover/medal:visible transition-all z-[100] cursor-default text-left">
                                <p className="text-[9px] font-black text-sky-500 uppercase mb-1">Requisito de Obtención</p>
                                <p className="text-[8px] text-gray-500 font-medium leading-tight">Otorgada al validar satisfactoriamente los documentos oficiales (RUC y DNI) del titular.</p>
                                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-[-6px] w-3 h-3 bg-white border-r border-b border-gray-100 rotate-45"></div>
                            </div>
                        </div>

                        {/* Vendedor Top */}
                        <div className="relative group/medal">
                            <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-full border border-amber-100 shadow-sm transition-all hover:bg-amber-500 hover:text-white cursor-help">
                                <Icon name="Star" className="text-amber-500 group-hover/medal:text-white transition-colors w-4 h-4" />
                                <span className="text-[9px] font-black uppercase tracking-widest">Vendedor Top</span>
                            </div>
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-white p-3 rounded-xl shadow-2xl border border-gray-100 w-56 opacity-0 invisible group-hover/medal:opacity-100 group-hover/medal:visible transition-all z-[100] cursor-default text-left">
                                <p className="text-[9px] font-black text-amber-600 uppercase mb-1">Requisito de Obtención</p>
                                <p className="text-[8px] text-gray-500 font-medium leading-tight">Requiere un promedio superior a 4.5 estrellas y más de 50 ventas exitosas en el último mes.</p>
                                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-[-6px] w-3 h-3 bg-white border-r border-b border-gray-100 rotate-45"></div>
                            </div>
                        </div>

                        {/* Envio Express */}
                        <div className="relative group/medal">
                            <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100 shadow-sm transition-all hover:bg-emerald-500 hover:text-white cursor-help">
                                <Icon name="Zap" className="text-emerald-500 group-hover/medal:text-white transition-colors w-4 h-4" />
                                <span className="text-[9px] font-black uppercase tracking-widest">Envío Express</span>
                            </div>
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-white p-3 rounded-xl shadow-2xl border border-gray-100 w-56 opacity-0 invisible group-hover/medal:opacity-100 group-hover/medal:visible transition-all z-[100] cursor-default text-left">
                                <p className="text-[9px] font-black text-emerald-600 uppercase mb-1">Requisito de Obtención</p>
                                <p className="text-[8px] text-gray-500 font-medium leading-tight">Otorgada al vendedor que cumpla con despachos en menos de 12 horas por 20 pedidos consecutivos.</p>
                                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-[-6px] w-3 h-3 bg-white border-r border-b border-gray-100 rotate-45"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
