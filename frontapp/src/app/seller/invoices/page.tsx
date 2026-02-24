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
import BaseLoading from '@/components/ui/BaseLoading';

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
        return <BaseLoading message="Sincronizando con SUNAT vía Rapifac..." />;
    }

    return (
        <div className="space-y-8 pb-20 animate-fadeIn">
            <ModuleHeader
                title="Mis Comprobantes"
                subtitle="Gestión de facturación electrónica y sincronización SUNAT vía Rapifac"
                icon="Receipt"
                actions={
                    <button
                        id="btn-nueva-factura"
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-3 px-7 py-4
                            bg-sky-500 text-white rounded-[2.5rem]
                            font-black text-[11px] uppercase tracking-widest
                            hover:bg-sky-600 transition-all shadow-xl shadow-sky-100
                            active:scale-95 group"
                    >
                        <Icon name="PlusCircle" className="w-5 h-5" />
                        Nueva Factura
                    </button>
                }
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
