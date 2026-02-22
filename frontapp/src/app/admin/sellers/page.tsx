'use client';

import React, { useState } from 'react';
import ModuleHeader from '@/components/layout/shared/ModuleHeader';
import { useControlVendedores } from '@/hooks/useControlVendedores';
import {
    StatsOverview, ProductModeration, AuditLog
} from '@/components/admin/sellers/ModuleSections';
import SellerList from '@/components/admin/SellerList'; // El que ya teníamos, o podemos usar el de legacy. 
import { Users, CheckCircle, ShieldCheck, Download, Search, ShieldAlert, Sliders, AlertTriangle } from 'lucide-react';
import { SellerStatus, ProductStatus } from '@/lib/types/admin/sellers';

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

    if (loading || !data) {
        return (
            <div className="flex items-center justify-center p-32">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                    <div className="text-center font-black animate-pulse uppercase tracking-[0.3em] text-blue-600 text-[10px]">
                        Sincronizando con Dokan & WooCommerce...
                    </div>
                </div>
            </div>
        );
    }

    const renderTabButton = (id: typeof currentTab, label: string, icon: React.ReactNode, badge?: number) => {
        const isActive = currentTab === id;
        return (
            <button
                onClick={() => setCurrentTab(id)}
                className={`px-8 py-4 rounded-2xl text-[11px] font-black transition-all flex items-center gap-3 relative border ${isActive ? 'bg-white shadow-xl shadow-gray-200/50 text-blue-600 border-gray-100' : 'text-gray-400 border-transparent hover:bg-white/50'
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
    };

    return (
        <div className="px-8 pb-20 space-y-8 animate-in fade-in duration-700">
            <ModuleHeader
                title="Control de Vendedores"
                subtitle="Gestión y supervisión estratégica de vendedores"
                icon="Users"
            />

            {error && (
                <div className="p-6 bg-rose-50 border border-rose-100 rounded-[2rem] flex items-center gap-4 text-rose-600 font-bold text-sm">
                    <AlertTriangle className="w-5 h-5" />
                    {error}
                </div>
            )}

            <StatsOverview stats={stats} />

            {/* Navigation Tabs (Aligned with RF-01 to RF-04) */}
            <div className="flex flex-wrap gap-2 border-b border-gray-100 py-5 pb-6 overflow-x-auto no-scrollbar scroll-smooth">
                {renderTabButton('vendedores', 'Gestión de Vendedores', <Users className="w-5 h-5" />)}
                {renderTabButton('aprobacion', 'Aprobacion de Productos y Servicios', <CheckCircle className="w-5 h-5" />, stats.pendingProducts)}
                {renderTabButton('auditoria', 'Historial de Auditoría', <ShieldCheck className="w-5 h-5" />)}
            </div>

            {/* Panels (Standardized Render Logic) */}
            <div className="min-h-[500px]">

                {currentTab === 'vendedores' && (
                    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                        {/* Buscador Integrado Legacy Style */}
                        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Buscar por Nombre, Empresa o ID..."
                                    className="w-full pl-14 pr-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500/20"
                                    onChange={(e) => setFilters(prev => ({ ...prev, sellerSearch: e.target.value }))}
                                />
                            </div>
                            <button
                                onClick={() => {
                                    if (!data.sellers.length) return;
                                    const headers = ['ID', 'Nombre', 'Empresa', 'Email', 'Estado', 'Contratos'];
                                    const csv = [
                                        headers.join(','),
                                        ...data.sellers.map(s => [s.id, `"${s.name}"`, `"${s.company}"`, s.email, s.status, s.contractStatus].join(','))
                                    ].join('\n');
                                    const blob = new Blob([csv], { type: 'text/csv' });
                                    const url = URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = `padron-vendedores-${new Date().toISOString().split('T')[0]}.csv`;
                                    a.click();
                                }}
                                className="flex items-center gap-2 px-6 py-4 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95"
                            >
                                <Download className="w-4 h-4" /> Exportar Padrón
                            </button>
                        </div>
                        <SellerList />
                    </div>
                )}

                {currentTab === 'aprobacion' && (
                    <div className="animate-in slide-in-from-bottom-4 duration-500">
                        <div className="mb-8">
                            <h2 className="text-xl font-black text-gray-900 tracking-tight">Control de Acciones Críticas</h2>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">RF-03: Validación de productos nuevos y editados</p>
                        </div>
                        <ProductModeration
                            products={data.products}
                            onAction={(product, suggest) => setStatusModal({
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
                    <div className="animate-in slide-in-from-bottom-4 duration-500">
                        <AuditLog entries={data.auditoria} />
                    </div>
                )}
            </div>

            {/* STATUS MODAL (1:1 Legacy functionality improved with RF-02 validation) */}
            {statusModal.isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-gray-900/80 backdrop-blur-md animate-in fade-in duration-300"
                        onClick={() => setStatusModal(prev => ({ ...prev, isOpen: false }))}
                    ></div>

                    <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl relative overflow-hidden p-10 animate-in zoom-in duration-300 border border-gray-100">
                        <div className={`h-2 w-full absolute top-0 left-0 ${statusModal.type === 'seller' ? 'bg-rose-500' : 'bg-blue-600'}`}></div>

                        <div className="flex items-center gap-3 mb-4">
                            <div className={`p-2 rounded-lg ${statusModal.type === 'seller' ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'}`}>
                                <ShieldAlert className="w-5 h-5" />
                            </div>
                            <h3 className="text-xl font-black text-gray-900 tracking-tighter uppercase">{statusModal.title}</h3>
                        </div>

                        <p className="text-xs text-gray-500 mb-8 font-medium leading-relaxed">
                            {statusModal.type === 'seller'
                                ? 'La suspensión o baja de una cuenta es una acción crítica que afecta la recaudación y visibilidad del vendedor. Requiere trazabilidad absoluta.'
                                : 'Asegúrese de que el producto cumpla con las políticas de calidad y descripción antes de habilitar su venta pública.'}
                        </p>

                        <form className="space-y-6" onSubmit={async (e) => {
                            e.preventDefault();
                            const fd = new FormData(e.currentTarget);
                            const reason = fd.get('reason') as string;
                            const status = fd.get('status') as string;

                            if (reason.trim().length < 10) return;

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
                        }}>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">Nuevo Estado Transaccional</label>
                                {statusModal.type === 'seller' && data.sellers.find(s => s.id === statusModal.id)?.contractStatus !== 'VIGENTE' && (
                                    <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3 animate-pulse">
                                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                                        <p className="text-[9px] font-black text-amber-700 uppercase tracking-tight">ALERTA: Contrato No Vigente. No podrá activar la cuenta.</p>
                                    </div>
                                )}
                                <div className="relative">
                                    <select
                                        name="status"
                                        defaultValue={statusModal.suggested}
                                        required
                                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-black text-gray-700 focus:ring-4 focus:ring-blue-500/10 appearance-none transition-all"
                                    >
                                        {statusModal.type === 'seller' ? (
                                            <>
                                                <option value="ACTIVE" disabled={data.sellers.find(s => s.id === statusModal.id)?.contractStatus !== 'VIGENTE'}>ACTIVA - Operación Normal {data.sellers.find(s => s.id === statusModal.id)?.contractStatus !== 'VIGENTE' ? '(BLOQUEADO BY CONTRACT)' : ''}</option>
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
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-2 flex justify-between">
                                    <span>Justificación de Auditoría (RF-02) *</span>
                                    <span className="text-blue-500">Mín. 10 caracteres</span>
                                </label>
                                <textarea
                                    name="reason"
                                    rows={4}
                                    required
                                    minLength={10}
                                    placeholder="Detalle los motivos técnicos para el registro de auditoría forensic inmutable..."
                                    className="w-full p-5 bg-gray-50 border border-gray-100 rounded-3xl font-medium text-gray-600 focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all resize-none text-[11px] placeholder:text-gray-300"
                                ></textarea>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 py-4 bg-gray-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-blue-600 hover:-translate-y-1 transition-all shadow-xl active:translate-y-0 disabled:opacity-50 disabled:translate-y-0"
                                >
                                    {isSubmitting ? 'Sincronizando...' : 'Confirmar Cambio'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setStatusModal(prev => ({ ...prev, isOpen: false }))}
                                    className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-gray-200 transition-all"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
