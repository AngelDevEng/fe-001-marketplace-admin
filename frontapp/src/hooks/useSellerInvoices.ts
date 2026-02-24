'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Voucher, InvoiceKPIs, VoucherStatus, VoucherType } from '@/lib/types/seller/invoices';
import { MOCK_VOUCHERS, calculateKPIs } from '@/lib/mocks/mockInvoiceData';

export interface EmitInvoicePayload {
    seller_id: string;
    seller_name: string;
    type: VoucherType;
    customer_name: string;
    customer_ruc: string;
    series: string;
    number: string;
    amount: number;
    order_id: string;
}

export function useSellerInvoices() {
    const queryClient = useQueryClient();
    const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [filters, setFiltersState] = useState({
        search: '',
        status: 'ALL' as VoucherStatus | 'ALL',
        type: 'ALL' as VoucherType | 'ALL'
    });

    // --- Query: Fetch Invoices ---
    const { data: vouchers = [], isLoading, refetch } = useQuery({
        queryKey: ['seller', 'invoices', 'list'],
        queryFn: async () => {
            await new Promise(r => setTimeout(r, 800));
            // In a real app: const res = await fetch('/api/seller/invoices'); return res.json();
            return [...MOCK_VOUCHERS] as Voucher[];
        },
        staleTime: 2 * 60 * 1000,
    });

    // --- Query: KPIs (Calculados del pool) ---
    const kpis = calculateKPIs(vouchers);

    // --- Mutation: Emit New Invoice ---
    const emitMutation = useMutation({
        mutationFn: async (payload: EmitInvoicePayload) => {
            const res = await fetch('/api/rapifac/emit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error(`API error: ${res.status}`);
            const json = await res.json();
            if (!json.success || !json.data) throw new Error(json.error ?? 'Error desconocido');
            return json.data as Voucher;
        },
        onSuccess: (newVoucher) => {
            queryClient.setQueryData(['seller', 'invoices', 'list'], (old: any) => [newVoucher, ...(old || [])]);
        }
    });

    // --- Mutation: Retry Sync ---
    const retryMutation = useMutation({
        mutationFn: async (id: string) => {
            await new Promise(r => setTimeout(r, 1200));
            return id;
        },
        onSuccess: (id) => {
            queryClient.setQueryData(['seller', 'invoices', 'list'], (old: any) => {
                if (!old) return old;
                return old.map((v: Voucher) => v.id === id ? {
                    ...v,
                    sunat_status: 'SENT_WAIT_CDR' as VoucherStatus,
                    history: [
                        ...v.history,
                        {
                            status: 'SENT_WAIT_CDR' as VoucherStatus,
                            note: 'Reintento solicitado por el vendedor. Procesando con Rapifac...',
                            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
                            user: 'Vendedor'
                        }
                    ]
                } : v);
            });
            setIsDrawerOpen(false);
        }
    });

    const filteredVouchers = vouchers.filter(v => {
        const matchesSearch = v.series.toLowerCase().includes(filters.search.toLowerCase()) ||
            v.number.includes(filters.search) ||
            v.customer_name.toLowerCase().includes(filters.search.toLowerCase()) ||
            v.customer_ruc.includes(filters.search);
        const matchesStatus = filters.status === 'ALL' || v.sunat_status === filters.status;
        const matchesType = filters.type === 'ALL' || v.type === filters.type;
        return matchesSearch && matchesStatus && matchesType;
    });

    return {
        vouchers: filteredVouchers,
        kpis,
        isLoading,
        selectedVoucher,
        isDrawerOpen,
        filters,
        setFilters: (newFilters: any) => setFiltersState(prev => ({ ...prev, ...newFilters })),
        clearFilters: () => setFiltersState({ search: '', status: 'ALL', type: 'ALL' }),
        handleViewDetail: (voucher: Voucher) => {
            setSelectedVoucher(voucher);
            setIsDrawerOpen(true);
        },
        handleCloseDrawer: () => {
            setIsDrawerOpen(false);
            setTimeout(() => setSelectedVoucher(null), 300);
        },
        handleRetryInvoice: (id: string) => retryMutation.mutate(id),
        emitNewInvoice: async (payload: EmitInvoicePayload) => {
            try {
                await emitMutation.mutateAsync(payload);
                return { success: true };
            } catch (err: any) {
                return { success: false, error: err.message };
            }
        },
        isEmitting: emitMutation.isPending,
        isRetrying: retryMutation.isPending,
    };
}
