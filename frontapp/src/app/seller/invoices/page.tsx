'use client';

import React, { useState } from 'react';
import ModuleHeader from '@/components/layout/shared/ModuleHeader';
import { useSellerInvoices } from '@/hooks/useSellerInvoices';

import InvoiceKPIsDisplay from './components/InvoiceKPIs';
import InvoiceFilters from './components/InvoiceFilters';
import InvoiceTable from './components/InvoiceTable';
import InvoiceDrawer from './components/InvoiceDrawer';
import EmitInvoiceModal from './components/EmitInvoiceModal';
import Icon from '@/components/ui/Icon';

export default function InvoicesPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const {
        vouchers: filteredVouchers,
        kpis,
        isLoading,
        selectedVoucher,
        isDrawerOpen,
        filters,
        setFilters,
        clearFilters,
        handleViewDetail,
        handleCloseDrawer,
        handleRetryInvoice,
        emitNewInvoice,
    } = useSellerInvoices();

    return (
        <div className="space-y-8 pb-20 animate-fadeIn">

            {/* Cabecera + Botón Nueva Factura */}
            <div className="flex items-start justify-between">
                <ModuleHeader
                    title="Mis Comprobantes"
                    subtitle="Gestión de facturación electrónica y sincronización SUNAT vía Rapifac"
                    icon="Receipt"
                />

                <button
                    id="btn-nueva-factura"
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-3 px-7 py-4 mt-6
                        bg-gray-900 text-white rounded-[2.5rem]
                        font-black text-[11px] uppercase tracking-widest
                        hover:bg-emerald-600 transition-all shadow-xl shadow-gray-200/80
                        active:scale-95 group"
                >
                    <span className="w-6 h-6 bg-white/10 rounded-xl flex items-center justify-center
                        group-hover:bg-white/20 transition-all">
                        <Icon name="Plus" className="w-4 h-4" />
                    </span>
                    Nueva Factura
                </button>
            </div>

            <InvoiceKPIsDisplay kpis={kpis} />

            <InvoiceFilters
                search={filters.search}
                status={filters.status}
                type={filters.type}
                onFilterChange={setFilters}
                onClear={clearFilters}
            />

            <InvoiceTable
                vouchers={filteredVouchers}
                onViewDetail={handleViewDetail}
            />

            <InvoiceDrawer
                voucher={selectedVoucher}
                isOpen={isDrawerOpen}
                onClose={handleCloseDrawer}
                onRetry={handleRetryInvoice}
            />

            {/* Modal de emisión */}
            <EmitInvoiceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onEmit={emitNewInvoice}
            />

            {/* Loading Overlay */}
            {isLoading && !isDrawerOpen && !isModalOpen && (
                <div className="fixed inset-0 bg-white/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center animate-fadeIn">
                    <div className="relative">
                        <div className="w-20 h-20 border-4 border-emerald-100 rounded-full"></div>
                        <div className="w-20 h-20 border-4 border-t-emerald-50 rounded-full animate-spin absolute top-0 left-0"></div>
                        <Icon name="Receipt" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl text-emerald-500 animate-pulse" />
                    </div>
                    <p className="mt-6 text-xs font-black text-gray-400 uppercase tracking-[0.2em] animate-pulse">
                        Sincronizando con SUNAT vía Rapifac...
                    </p>
                </div>
            )}
        </div>
    );
}
