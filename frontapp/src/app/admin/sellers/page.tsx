'use client';

import React, { useState } from 'react';
import ModuleHeader from '@/components/layout/shared/ModuleHeader';
import BaseButton from '@/components/ui/BaseButton';
import { useControlVendedores } from '@/hooks/useControlVendedores';
import {
    StatsOverview, ProductModeration, AuditLog
} from '@/components/admin/sellers/ModuleSections';
import SellerList from '@/components/admin/SellerList';
import { Users, CheckCircle, ShieldCheck, Search, ShieldAlert, Sliders, X } from 'lucide-react';
import { SellerStatus, ProductStatus } from '@/lib/types/admin/sellers';
import Skeleton, { SkeletonRow } from '@/components/ui/Skeleton';
import { exportToCSV } from '@/lib/utils/export';
import ModalsPortal from '@/components/layout/shared/ModalsPortal';

interface TabButtonProps {
    active: boolean;
    onClick: () => void;
    label: string;
    icon: React.ReactNode;
    badge?: number;
}

// --- Internal Components (Externalized to avoid re-renders) ---

const TabButton = ({ active, onClick, label, icon, badge }: TabButtonProps) => (
    <button
        onClick={onClick}
        className={`px-8 py-4 rounded-2xl text-[11px] font-black transition-all flex items-center gap-3 relative border ${active ? 'bg-white shadow-xl shadow-gray-200/50 text-blue-600 border-gray-100' : 'text-gray-400 border-transparent hover:bg-white/50'
            }`}
    >
        {icon}
        <span className="uppercase tracking-widest">{label}</span>
        {badge !== undefined && badge > 0 && (
            <span className="absolute -top-1 -right-1 px-2.5 py-1 bg-rose-500 text-white rounded-full text-[9px] font-black animate-bounce shadow-lg shadow-rose-200">
                {badge}
            </span>
        )}
    </button>
);

interface ManagementModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    type: 'seller' | 'product';
    onSubmit: (data: { status: string; reason: string }) => void | Promise<void>;
    isSubmitting: boolean;
    suggested?: string;
    sellerContractStatus?: string;
}

const ManagementModal = ({ isOpen, onClose, title, type, onSubmit, isSubmitting, suggested, sellerContractStatus }: ManagementModalProps) => {
    if (!isOpen) return null;

    return (
        <ModalsPortal>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <div
                    className="absolute inset-0 bg-gray-900/80 backdrop-blur-md animate-fadeIn"
                    onClick={onClose}
                ></div>

                <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl relative overflow-hidden p-10 animate-scaleUp border border-gray-100 font-industrial">
                    <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="w-6 h-6" />
                    </button>

                    <div className={`h-2 w-full absolute top-0 left-0 ${type === 'seller' ? 'bg-rose-500' : 'bg-blue-600'}`}></div>

                    <div className="flex items-center gap-3 mb-4">
                        <div className={`p-2 rounded-lg ${type === 'seller' ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'}`}>
                            <ShieldAlert className="w-5 h-5" />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 tracking-tighter uppercase">{title}</h3>
                    </div>

                    <p className="text-xs text-gray-500 mb-8 font-medium leading-relaxed">
                        {type === 'seller'
                            ? 'La suspensión o baja de una cuenta es una acción crítica que afecta la recaudación y visibilidad del vendedor. Requiere trazabilidad absoluta.'
                            : 'Asegúrese de que el producto cumpla con las políticas de calidad y descripción antes de habilitar su venta pública.'}
                    </p>

                    <form className="space-y-6" onSubmit={(e) => {
                        e.preventDefault();
                        const fd = new FormData(e.currentTarget);
                        onSubmit({
                            status: fd.get('status') as string,
                            reason: fd.get('reason') as string
                        });
                    }}>
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">Nuevo Estado Transaccional</label>
                            <div className="relative">
                                <select
                                    name="status"
                                    defaultValue={suggested}
                                    required
                                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-black text-gray-700 focus:ring-4 focus:ring-blue-500/10 appearance-none transition-all"
                                >
                                    {type === 'seller' ? (
                                        <>
                                            <option value="ACTIVE" disabled={sellerContractStatus !== 'VIGENTE'}>ACTIVA - Operación Normal {sellerContractStatus !== 'VIGENTE' ? '(BLOQUEADO)' : ''}</option>
                                            <option value="SUSPENDED">SUSPENDIDA - Bloqueo Temporal</option>
                                            <option value="REJECTED">BAJA LÓGICA - Cese Total</option>
                                        </>
                                    ) : (
                                        <>
                                            <option value="APPROVED">APROBADO - Publicación Inmediata</option>
                                            <option value="REJECTED">RECHAZADO - Violación de Políticas</option>
                                        </>
                                    )}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    <Sliders className="w-4 h-4" />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">Justificación de Auditoría (RF-02) *</label>
                            <textarea
                                name="reason"
                                rows={4}
                                required
                                minLength={10}
                                placeholder="Detalle los motivos técnicos..."
                                className="w-full p-5 bg-gray-50 border border-gray-100 rounded-3xl font-medium text-gray-600 focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all resize-none text-[11px] placeholder:text-gray-300"
                            ></textarea>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <BaseButton type="submit" disabled={isSubmitting} variant="primary" className="flex-1">
                                {isSubmitting ? 'Sincronizando...' : 'Confirmar Cambio'}
                            </BaseButton>
                        </div>
                    </form>
                </div>
            </div>
        </ModalsPortal>
    );
};

// --- Main Page Component ---

export default function SellersPage() {
    const {
        data, loading, error, currentTab, setCurrentTab,
        stats, filteredSellers, actions, setFilters
    } = useControlVendedores();

    const [statusModal, setStatusModal] = useState<{
        isOpen: boolean,
        type: 'seller' | 'product',
        id: number,
        title: string,
        suggested?: string
    }>({ isOpen: false, type: 'seller', id: 0, title: '' });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleExport = () => {
        if (!data?.sellers.length) return;
        const headers = ['ID', 'Nombre', 'Empresa', 'Email', 'Estado', 'Contratos'];
        const csvData = data.sellers.map(s => [s.id, s.name, s.company, s.email, s.status, s.contractStatus]);
        const dateStr = new Date().toISOString().split('T')[0];
        exportToCSV(headers, csvData, `padron-vendedores-${dateStr}.csv`);
    };

    const handleStatusSubmit = async ({ status, reason }: { status: string, reason: string }) => {
        if (!data) return;
        setIsSubmitting(true);
        if (statusModal.type === 'seller') {
            const seller = data.sellers.find(s => s.id === statusModal.id);
            if (status === 'ACTIVE' && seller?.contractStatus !== 'VIGENTE') {
                alert('BLOQUEO TÉCNICO: No se puede activar una cuenta sin un contrato VIGENTE (RF-16).');
                setIsSubmitting(false);
                return;
            }
            await actions.updateSellerStatus(statusModal.id, status as SellerStatus, reason);
        } else {
            await actions.updateProductStatus(statusModal.id, status as ProductStatus, reason);
        }
        setIsSubmitting(false);
        setStatusModal(prev => ({ ...prev, isOpen: false }));
    };

    if (loading || !data) {
        return (
            <div className="px-8 pb-20 space-y-8 animate-fadeIn font-industrial">
                <ModuleHeader title="Control de Vendedores" subtitle="Cargando Inteligencia Operativa..." icon="Users" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-[2.5rem]" />)}
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                    <SkeletonRow count={8} />
                </div>
            </div>
        );
    }

    return (
        <div className="px-8 pb-20 space-y-8 animate-fadeIn font-industrial">
            <ModuleHeader
                title="Control de Vendedores"
                subtitle="Gestión y supervisión estratégica de vendedores"
                icon="Users"
            />

            {error && (
                <div className="p-6 bg-rose-50 border border-rose-100 rounded-[2rem] flex items-center gap-4 text-rose-600 font-bold text-sm">
                    <ShieldAlert className="w-5 h-5" />
                    {error}
                </div>
            )}

            <StatsOverview stats={stats} />

            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-gray-100 py-5 pb-6 overflow-x-auto no-scrollbar scroll-smooth">
                <TabButton
                    active={currentTab === 'vendedores'}
                    onClick={() => setCurrentTab('vendedores')}
                    label="Gestión de Vendedores"
                    icon={<Users className="w-5 h-5" />}
                />
                <TabButton
                    active={currentTab === 'aprobacion'}
                    onClick={() => setCurrentTab('aprobacion')}
                    label="Aprobación de Productos"
                    icon={<CheckCircle className="w-5 h-5" />}
                    badge={stats.pendingProducts}
                />
                <TabButton
                    active={currentTab === 'auditoria'}
                    onClick={() => setCurrentTab('auditoria')}
                    label="Historial de Auditoría"
                    icon={<ShieldCheck className="w-5 h-5" />}
                />
            </div>

            {/* Panels */}
            <div className="min-h-[500px]">
                {currentTab === 'vendedores' && (
                    <div className="space-y-6 animate-fadeIn">
                        <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Buscar por Nombre, Empresa o ID..."
                                    className="w-full pl-14 pr-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-sky-500/20"
                                    onChange={(e) => setFilters(prev => ({ ...prev, sellerSearch: e.target.value }))}
                                />
                            </div>
                            <BaseButton
                                onClick={handleExport}
                                variant="secondary"
                                leftIcon="Download"
                                size="md"
                            >
                                Exportar Padrón
                            </BaseButton>
                        </div>
                        <SellerList sellers={filteredSellers} loading={loading} onResetPassword={(id) => alert(`Reset manual para vendedor ${id}`)} />
                    </div>
                )}

                {currentTab === 'aprobacion' && (
                    <div className="animate-fadeIn">
                        <div className="mb-8">
                            <h2 className="text-xl font-black text-gray-900 tracking-tight">Control de Acciones Críticas</h2>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">RF-03: Validación de productos nuevos y editados</p>
                        </div>
                        <ProductModeration
                            products={data.products}
                            onAction={(product: any, suggest: any) => setStatusModal({
                                isOpen: true,
                                type: 'product',
                                id: product.id,
                                title: `Moderar: ${product.name}`,
                                suggested: suggest
                            })}
                        />
                    </div>
                )}

                {currentTab === 'auditoria' && (
                    <div className="animate-fadeIn">
                        <AuditLog entries={data.auditoria} />
                    </div>
                )}
            </div>

            <ManagementModal
                isOpen={statusModal.isOpen}
                onClose={() => setStatusModal(prev => ({ ...prev, isOpen: false }))}
                title={statusModal.title}
                type={statusModal.type}
                suggested={statusModal.suggested}
                isSubmitting={isSubmitting}
                sellerContractStatus={data.sellers.find(s => s.id === statusModal.id)?.contractStatus}
                onSubmit={handleStatusSubmit}
            />
        </div>
    );
}
