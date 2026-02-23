'use client';

import React, { useState, useEffect } from 'react';
import ModuleHeader from '@/components/layout/shared/ModuleHeader';
import BaseButton from '@/components/ui/BaseButton';
import Skeleton from '@/components/ui/Skeleton';
import Icon from '@/components/ui/Icon';
import { useLogisticsShipments } from '@/hooks/useLogisticsShipments';
import { ShipmentStatus } from '@/lib/types/logistics';
import ModalsPortal from '@/components/layout/shared/ModalsPortal';

// --- Internal Components (Architectural Pattern: Externalized to avoid redeclaration) ---

const ShipmentStatusBadge = ({ status, labels }: { status: ShipmentStatus, labels: any }) => {
    const config = labels[status];
    return (
        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${config.color}`}>
            {config.label}
        </span>
    );
};

const LogisticsActionModal = ({ isOpen, onClose, action, onConfirm, shipmentId, note, onNoteChange }: any) => {
    if (!isOpen) return null;

    const titles: Record<string, string> = {
        advance: 'Validar Avance Operativo',
        incident: 'Protocolo de Incidencia',
        reschedule: 'Nueva Cita de Entrega'
    };

    return (
        <ModalsPortal>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md animate-fadeIn" onClick={onClose} />
                <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl relative overflow-hidden p-10 animate-scaleUp font-industrial">
                    <div className="h-3 w-full absolute top-0 left-0 bg-violet-600"></div>

                    <h3 className="text-2xl font-black text-gray-900 tracking-tighter uppercase italic mb-6">
                        {titles[action]}
                    </h3>

                    <div className="space-y-6">
                        <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Identificador de Envío</p>
                            <p className="text-xl font-black text-violet-600">{shipmentId}</p>
                        </div>

                        {(action === 'incident' || action === 'reschedule') && (
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Observaciones Críticas <span className="text-violet-500">*</span></label>
                                <textarea
                                    value={note}
                                    onChange={(e) => onNoteChange(e.target.value)}
                                    placeholder="Detalla lo ocurrido para el reporte de trazabilidad..."
                                    className="w-full p-6 bg-gray-50 border-none rounded-[2rem] text-sm font-medium focus:ring-2 focus:ring-violet-500/10 min-h-[120px] resize-none"
                                    autoFocus
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3 mt-10">
                        <BaseButton
                            onClick={onConfirm}
                            variant="primary"
                            className="flex-1 py-5 rounded-2xl flex items-center justify-center gap-2"
                        >
                            <Icon name="Check" className="w-5 h-5" /> Ejecutar
                        </BaseButton>
                        <BaseButton
                            onClick={onClose}
                            variant="ghost"
                            className="flex-1 py-5 rounded-2xl"
                        >
                            Abortar
                        </BaseButton>
                    </div>
                </div>
            </div>
        </ModalsPortal>
    );
};

// --- Main Page Component ---

const colorMap: Record<string, string> = {
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    sky: 'bg-sky-50 text-sky-600 border-sky-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
};

export default function LogisticsTrackerPage() {
    const {
        shipments,
        filters,
        setFilters,
        kpis,
        isLoading,
        advanceStatus,
        reportIncident,
        rescheduleDelivery,
        shipmentStatusLabels,
    } = useLogisticsShipments();

    const [simulatedLoading, setSimulatedLoading] = useState(true);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [actionShipment, setActionShipment] = useState<{ id: string; action: 'advance' | 'incident' | 'reschedule'; note?: string } | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => setSimulatedLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const confirmAction = () => {
        if (!actionShipment) return;
        if (actionShipment.action === 'advance') advanceStatus(actionShipment.id);
        else if (actionShipment.action === 'incident') reportIncident(actionShipment.id, actionShipment.note || '');
        else if (actionShipment.action === 'reschedule') rescheduleDelivery(actionShipment.id, actionShipment.note || '');
        setShowConfirmModal(false);
        setActionShipment(null);
    };

    const currentLoading = isLoading || simulatedLoading;

    if (currentLoading) {
        return (
            <div className="space-y-8 animate-fadeIn pb-20 font-industrial">
                <ModuleHeader title="Rastreador de Envíos" subtitle="Sincronizando Radar Logístico..." icon="Truck" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(idx => (
                        <div key={idx} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-4">
                            <div className="flex justify-between items-center">
                                <Skeleton className="h-12 w-12 rounded-2xl" />
                                <Skeleton className="h-10 w-12 rounded-lg" />
                            </div>
                            <Skeleton className="h-4 w-24 rounded" />
                        </div>
                    ))}
                </div>
                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8">
                    <Skeleton className="h-4 w-1/3 mb-6" />
                    <Skeleton className="h-64 w-full rounded-[2rem]" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fadeIn pb-20 font-industrial">
            <ModuleHeader
                title="Rastreador de Envíos"
                subtitle="Gestiona y actualiza el estado de tus pedidos asignados (RF-05)"
                icon="Truck"
            />

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpis.map((kpi, idx) => (
                    <div key={idx} className="bg-white p-7 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                        <div className="flex items-center justify-between mb-4 relative z-10">
                            <div className={`p-4 ${colorMap[kpi.color]} rounded-2xl flex items-center justify-center`}>
                                <Icon name={kpi.icon as any} className="w-6 h-6" />
                            </div>
                            <span className="text-3xl font-black text-gray-900 tracking-tighter">{kpi.value}</span>
                        </div>
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest relative z-10">{kpi.label}</h3>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <div className="flex flex-col lg:flex-row gap-6 items-end">
                    <div className="flex-1 space-y-2 w-full">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Inteligencia de Búsqueda</label>
                        <div className="relative">
                            <Icon name="Search" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="ID de envío, cliente o pedido..."
                                value={filters.search}
                                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-xs font-black focus:ring-2 focus:ring-violet-500/20 font-industrial transition-all"
                            />
                        </div>
                    </div>

                    <div className="w-full lg:w-64 space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Estado Lógico</label>
                        <select
                            value={filters.status}
                            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as any }))}
                            className="w-full px-4 py-4 bg-gray-50 border-none rounded-2xl text-[10px] font-black uppercase text-gray-700 font-industrial cursor-pointer"
                        >
                            <option value="ALL">Totalidad de Envíos</option>
                            {Object.keys(shipmentStatusLabels).map(s => (
                                <option key={s} value={s}>{shipmentStatusLabels[s as ShipmentStatus].label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Shipments List */}
            {shipments.length === 0 ? (
                <div className="min-h-[400px] flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-[3rem] p-12 text-center">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                        <Icon name="Package" className="w-12 h-12 text-gray-200" />
                    </div>
                    <h3 className="text-xl font-black text-gray-400 uppercase tracking-widest mb-2">Sin resultados tácticos</h3>
                    <p className="text-xs text-gray-400 max-w-xs leading-relaxed uppercase font-black tracking-tight">No se encontraron envíos registrados en la zona.</p>
                </div>
            ) : (
                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                    <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">ID Envío</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Pedido</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Cliente</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Estado Logístico</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap text-right">Gestión</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {shipments.map((shipment) => (
                                    <tr key={shipment.id} className="hover:bg-violet-50/20 transition-all group">
                                        <td className="px-6 py-5">
                                            <span className="text-xs font-black text-violet-600">{shipment.id}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-xs font-black text-gray-900 italic">{shipment.orderId}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-xs font-black text-gray-800 uppercase tracking-tighter">{shipment.customerName}</p>
                                            <p className="text-[9px] text-gray-400 font-bold uppercase">{shipment.customerPhone}</p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <ShipmentStatusBadge status={shipment.status} labels={shipmentStatusLabels} />
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex gap-2 justify-end">
                                                {shipment.status !== 'ENTREGADO' && shipment.status !== 'INCIDENCIA' && (
                                                    <BaseButton
                                                        onClick={() => {
                                                            setActionShipment({ id: shipment.id, action: 'advance' });
                                                            setShowConfirmModal(true);
                                                        }}
                                                        variant="primary"
                                                        size="sm"
                                                    >
                                                        Evolucionar
                                                    </BaseButton>
                                                )}
                                                {shipment.status !== 'ENTREGADO' && shipment.status !== 'INCIDENCIA' && (
                                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <BaseButton
                                                            onClick={() => {
                                                                setActionShipment({ id: shipment.id, action: 'incident', note: '' });
                                                                setShowConfirmModal(true);
                                                            }}
                                                            variant="danger"
                                                            size="sm"
                                                        >
                                                            Incidencia
                                                        </BaseButton>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <LogisticsActionModal
                isOpen={showConfirmModal}
                shipmentId={actionShipment?.id}
                action={actionShipment?.action}
                note={actionShipment?.note}
                onNoteChange={(note: string) => setActionShipment(prev => prev ? { ...prev, note } : null)}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={confirmAction}
            />
        </div>
    );
}
