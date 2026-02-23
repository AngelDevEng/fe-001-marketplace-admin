'use client';

import React, { useState } from 'react';
import ModuleHeader from '@/components/layout/shared/ModuleHeader';
import { useSellerInvoices } from '@/hooks/useSellerInvoices';

import InvoiceKPIsDisplay from './components/InvoiceKPIs';
import InvoiceFilters from './components/InvoiceFilters';
import InvoiceTable from './components/InvoiceTable';
import InvoiceDrawer from './components/InvoiceDrawer';
import EmitInvoiceModal from './components/EmitInvoiceModal';

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

    if (isLoading && filteredVouchers.length === 0) {
        return (
            <div className="p-20 flex flex-col items-center justify-center animate-pulse">
                <i className="ph ph-circle-notch animate-spin text-4xl text-indigo-500 mb-4"></i>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Sincronizando con SUNAT via Rapifac...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20 animate-fadeIn font-industrial">
            <ModuleHeader
                title="Facturación"
                subtitle="Gestión de comprobantes electrónicos vía Rapifac y SUNAT"
                icon="Receipt"
            />

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

            <EmitInvoiceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onEmit={emitNewInvoice}
            />
        </div>
    );
}
