'use client';

import React from 'react';
import { Seller, Product, Notification, AuditEntry, ProductStatus } from '@/features/admin/sellers/types';
import { CVStatusBadge, CVCard } from './SharedCVUI';
import BaseButton from '@/components/ui/BaseButton';
import { User, Mail, Phone, ShieldAlert, ShieldCheck, Clock, Bell, Info, Sliders, Package, Store, Eye, CheckCircle, XCircle, Terminal } from 'lucide-react';

// --- STATS OVERVIEW ---
export const StatsOverview: React.FC<{ stats: { totalSellers: number, activeSellers: number, pendingProducts: number, alerts: number } }> = ({ stats }) => {
    const cards = [
        { label: 'Vendedores', val: stats.totalSellers, icon: <User className="w-6 h-6" />, color: 'blue', border: 'border-blue-500' },
        { label: 'Activos', val: stats.activeSellers, icon: <CheckCircle className="w-6 h-6" />, color: 'emerald', border: 'border-emerald-400' },
        { label: 'En Espera', val: stats.pendingProducts, icon: <Clock className="w-6 h-6" />, color: 'amber', border: 'border-amber-400' },
        { label: 'Alertas', val: stats.alerts, icon: <Bell className="w-6 h-6" />, color: 'rose', border: 'border-rose-500' }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {cards.map((c, i) => (
                <CVCard key={i} className="p-7 border-l-4 shadow-sm hover:shadow-md transition-all" border={c.border}>
                    <div className="flex items-center justify-between mb-5">
                        <div className={`p-3 bg-gray-50 rounded-xl text-${c.color}-600`}>
                            {c.icon}
                        </div>
                        <span className="text-3xl font-black text-gray-900 tracking-tight">{c.val}</span>
                    </div>
                    <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">{c.label}</h3>
                </CVCard>
            ))}
        </div>
    );
};

// --- NOTIFICATIONS LIST ---
export const NotificationList: React.FC<{
    notifications: Notification[],
    onMarkAllRead: () => void
}> = ({ notifications, onMarkAllRead }) => {
    const impactMap = {
        'critico': 'bg-rose-500',
        'seguridad': 'bg-amber-500',
        'operativo': 'bg-blue-500'
    };

    const getIcon = (tipo: string) => {
        if (tipo === 'critico') return <ShieldAlert className="w-6 h-6" />;
        if (tipo === 'seguridad') return <ShieldCheck className="w-6 h-6" />;
        return <Info className="w-6 h-6" />;
    };

    return (
        <CVCard className="p-8" border="border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-xl font-black text-gray-900 tracking-tight">Centro de Notificaciones</h2>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Alertas en tiempo real (RF-01)</p>
                </div>
                <button
                    onClick={onMarkAllRead}
                    className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-2xl transition-all border border-blue-100 w-fit"
                >
                    Marcar todas como leídas
                </button>
            </div>
            <div className="space-y-4">
                {notifications.map(n => (
                    <div key={n.id} className={`flex items-start gap-5 p-6 rounded-[2rem] border transition-all ${n.estado_revision === 'nueva' ? 'bg-white border-gray-100 shadow-sm' : 'bg-gray-50/30 border-transparent'}`}>
                        <div className={`p-4 rounded-2xl ${impactMap[n.tipo] || 'bg-blue-500'} text-white shadow-xl`}>
                            {getIcon(n.tipo)}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <p className="text-sm font-black text-gray-900 tracking-tight uppercase">{n.entidad_relacionada}</p>
                                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${impactMap[n.tipo]} text-white`}>{n.tipo}</span>
                            </div>
                            <p className="text-xs text-gray-500 font-medium leading-relaxed">{n.mensaje}</p>
                            <div className="flex items-center gap-3 mt-4">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> {n.timestamp}
                                </span>
                                <span className="w-1 h-1 rounded-full bg-gray-200"></span>
                                <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest italic">{n.modulo_origen}</span>
                            </div>
                        </div>
                        {n.estado_revision === 'nueva' && (
                            <div className="w-3 h-3 rounded-full bg-blue-500 mt-2 animate-pulse shadow-lg shadow-blue-200"></div>
                        )}
                    </div>
                ))}
                {notifications.length === 0 && (
                    <div className="p-10 text-center border-2 border-dashed border-gray-100 rounded-3xl">
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Sin notificaciones nuevas</p>
                    </div>
                )}
            </div>
        </CVCard>
    );
};

// --- PRODUCT MODERATION (RF-03) ---
export const ProductModeration: React.FC<{
    products: Product[],
    onAction: (product: Product, suggest: ProductStatus) => void
}> = ({ products, onAction }) => {
    const pending = products.filter(p => p.status === 'en_espera' || p.status === 'PENDING');

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pending.map(p => {
                // Simulación de detección de edición vs nuevo (RF-03)
                const isEdition = p.id % 2 === 0;

                return (
                    <CVCard key={p.id} className="group border-gray-100 hover:border-blue-400 transition-all shadow-sm hover:shadow-2xl overflow-hidden">
                        <div className="h-64 bg-gray-50 flex items-center justify-center relative bg-gradient-to-b from-gray-50 to-white">
                            {p.imageUrl ? (
                                <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            ) : (
                                <Package className="w-16 h-16 text-gray-200 group-hover:scale-110 transition-transform duration-500" />
                            )}

                            {/* Badges de Auditoría RF-03 */}
                            <div className="absolute top-4 left-4 flex flex-col gap-2">
                                <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2 ${isEdition ? 'bg-orange-500 text-white shadow-orange-200' : 'bg-emerald-500 text-white shadow-emerald-200'
                                    }`}>
                                    {isEdition ? <Sliders className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                                    {isEdition ? 'Cambio Detectado' : 'Nuevo Registro'}
                                </div>
                                <div className="px-4 py-2 bg-white/90 backdrop-blur-md text-gray-900 text-[10px] font-black rounded-xl shadow-lg uppercase tracking-widest border border-gray-100 flex items-center gap-2">
                                    <Clock className="w-3 h-3" /> Pendiente
                                </div>
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1 opacity-70">Precio Propuesto</p>
                                <p className="text-2xl font-black italic tracking-tighter">S/ {p.price.toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="p-8">
                            <h3 className="font-black text-gray-900 text-lg mb-2 tracking-tight truncate uppercase leading-tight">{p.name}</h3>
                            <div className="flex flex-col gap-1.5 mb-8">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center">
                                        <Store className="w-3.5 h-3.5 text-blue-600" />
                                    </div>
                                    <p className="text-[10px] font-black text-gray-700 uppercase tracking-widest">
                                        {p.seller}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-lg bg-gray-50 flex items-center justify-center">
                                        <Package className="w-3.5 h-3.5 text-gray-400" />
                                    </div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                        {p.category}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <BaseButton
                                    onClick={() => onAction(p, 'APPROVED')}
                                    variant="secondary"
                                    leftIcon="CheckCircle"
                                    size="md"
                                    fullWidth
                                >
                                    Aprobar
                                </BaseButton>
                                <BaseButton
                                    onClick={() => onAction(p, 'REJECTED')}
                                    variant="danger"
                                    leftIcon="XCircle"
                                    size="md"
                                    fullWidth
                                >
                                    Rechazar
                                </BaseButton>
                            </div>
                        </div>
                    </CVCard>
                );
            })}
            {pending.length === 0 && (
                <div className="col-span-full p-32 text-center text-gray-300 font-black uppercase tracking-widest border-2 border-dashed border-gray-100 rounded-[3rem] animate-pulse">
                    No hay solicitudes de moderación activas (RF-03)
                </div>
            )}
        </div>
    );
};

// --- AUDIT LOG ---
export const AuditLog: React.FC<{ entries: AuditEntry[] }> = ({ entries }) => {
    return (
        <CVCard border="border-gray-100">
            <div className="p-8 border-b border-gray-100 bg-gray-50/30 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-black text-gray-900 tracking-tight">Historial Forense Inmutable</h2>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">RF-04: Trazabilidad Absoluta (Log de Transacciones)</p>
                </div>
                <div className="p-3 bg-sky-500 text-white rounded-xl">
                    <Terminal className="w-5 h-5" />
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            <th className="px-8 py-5">Fecha / Hora</th>
                            <th className="px-8 py-5">Tienda / Entidad</th>
                            <th className="px-8 py-5">Acción Crítica</th>
                            <th className="px-8 py-5">Justificación Técnica</th>
                            <th className="px-8 py-5 text-right">Admin Interventor</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {entries.map(a => (
                            <tr key={a.id} className="hover:bg-gray-50/30 transition-all group">
                                <td className="px-8 py-6 text-[11px] font-bold text-gray-500 font-mono">
                                    {a.fecha}
                                </td>
                                <td className="px-8 py-6">
                                    <span className="text-xs font-black text-gray-900 uppercase tracking-tighter group-hover:text-blue-600 transition-colors">
                                        {a.entidad}
                                    </span>
                                </td>
                                <td className="px-8 py-6">
                                    <span className="px-3 py-1.5 bg-gray-900 text-white text-[9px] font-black rounded-lg uppercase tracking-widest border border-transparent shadow-sm">
                                        {a.accion}
                                    </span>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="relative group/note max-w-xs">
                                        <p className="text-xs text-gray-600 leading-relaxed italic font-medium truncate">
                                            "{a.metadata?.motivo || 'N/A'}"
                                        </p>
                                        <div className="absolute bottom-full left-0 mb-2 invisible group-hover/note:visible bg-gray-900 text-white p-3 rounded-xl text-[10px] w-64 shadow-2xl z-10 transition-all">
                                            {a.metadata?.motivo}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                                        {a.usuario}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {entries.length === 0 && (
                <div className="p-20 text-center">
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Sin registros en el log de auditoría</p>
                </div>
            )}
        </CVCard>
    );
};
