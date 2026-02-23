'use client';

import React, { useEffect } from 'react';
import ModuleHeader from '@/components/layout/shared/ModuleHeader';
import SalesKPIs from './components/SalesKPIs';
import SalesFilters from './components/SalesFilters';
import OrderCard from './components/OrderCard';
import OrderDetailModal from './components/OrderDetailModal';
import { useSellerSales } from '@/hooks/useSellerSales';
import { useToast } from '@/context/ToastContext';
import ModalsPortal from '@/components/layout/shared/ModalsPortal';

export default function SalesPage() {
    const {
        orders,
        kpis,
        isLoading,
        selectedOrder,
        setSelectedOrder,
        filters,
        updateFilters,
        clearFilters,
        advanceStep,
        refresh
    } = useSellerSales();

    const { showToast } = useToast();

    // Trigger initial fetch using refresh if needed, but hook usually does it
    useEffect(() => {
        if (!isLoading && orders.length === 0 && kpis.length === 0) {
            refresh();
        }
    }, []);

    const handleExport = (type: 'excel' | 'pdf') => {
        alert(`Exportando a ${type.toUpperCase()}... (Funcionalidad Mock)`);
    };

    if (isLoading && kpis.length === 0) {
        return (
            <div className="p-20 flex flex-col items-center justify-center animate-pulse">
                <i className="ph ph-circle-notch animate-spin text-4xl text-indigo-500 mb-4"></i>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Cargando Centro de Control de Ventas...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fadeIn pb-20 font-industrial">
            <ModuleHeader
                title="Centro de Control de Ventas"
                subtitle="Monitoreo Transaccional, Trazabilidad de Pedidos y KPIs"
                icon="ph-receipt"
            />

            <SalesKPIs kpis={kpis} />

            <SalesFilters
                dateStart={filters.dateStart}
                dateEnd={filters.dateEnd}
                onDateChange={(type: 'dateStart' | 'dateEnd', value: string) => updateFilters({ [type]: value })}
                onClear={clearFilters}
                onExport={handleExport}
            />

            {/* Orders Grid */}
            {orders.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center bg-white rounded-[3rem] border-2 border-dashed border-gray-100 text-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-gray-200 border border-gray-100">
                        <i className="ph ph-bold ph-magnifying-glass text-4xl"></i>
                    </div>
                    <h3 className="text-xl font-black text-gray-400 uppercase tracking-widest italic mb-2">No se encontraron pedidos</h3>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Intenta ajustar los filtros de fecha</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {orders.map(order => (
                        <OrderCard
                            key={order.id}
                            order={order}
                            onClick={() => setSelectedOrder(order)}
                        />
                    ))}
                </div>
            )}

            {/* Modal */}
            {selectedOrder && (
                <ModalsPortal>
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md animate-fadeIn" onClick={() => setSelectedOrder(null)} />
                        <div className="relative z-10 w-full max-w-4xl animate-scaleUp max-h-[90vh] overflow-y-auto custom-scrollbar rounded-[3rem]">
                            <OrderDetailModal
                                order={selectedOrder}
                                isOpen={true}
                                onClose={() => setSelectedOrder(null)}
                                onAdvanceStep={async (id) => {
                                    await advanceStep(id);
                                    // Order state will be updated by the hook
                                }}
                            />
                        </div>
                    </div>
                </ModalsPortal>
            )}
        </div>
    );
}
