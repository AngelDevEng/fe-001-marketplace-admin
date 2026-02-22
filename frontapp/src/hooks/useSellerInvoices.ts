import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Voucher, InvoiceKPIs, VoucherStatus, VoucherType } from '@/lib/types/seller/invoices';
import { MOCK_VOUCHERS, calculateKPIs } from '@/lib/mocks/mockInvoiceData';

/** Payload para emitir una nueva factura a Rapifac */
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
    const [vouchers, setVouchers] = useState<Voucher[]>([]);
    const [kpis, setKpis] = useState<InvoiceKPIs | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const [filters, setFiltersState] = useState({
        search: '',
        status: 'ALL' as VoucherStatus | 'ALL',
        type: 'ALL' as VoucherType | 'ALL'
    });

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            await new Promise(r => setTimeout(r, 800)); // Simular latencia SUNAT/Rapifac
            setVouchers([...MOCK_VOUCHERS]);
            setKpis(calculateKPIs(MOCK_VOUCHERS));
            setIsLoading(false);
        };
        fetchData();
    }, []);

    const filteredVouchers = useMemo(() => {
        return vouchers.filter(v => {
            const matchesSearch = v.series.toLowerCase().includes(filters.search.toLowerCase()) ||
                v.number.includes(filters.search) ||
                v.customer_name.toLowerCase().includes(filters.search.toLowerCase()) ||
                v.customer_ruc.includes(filters.search);

            const matchesStatus = filters.status === 'ALL' || v.sunat_status === filters.status;
            const matchesType = filters.type === 'ALL' || v.type === filters.type;

            return matchesSearch && matchesStatus && matchesType;
        });
    }, [vouchers, filters]);

    const setFilters = (newFilters: any) => {
        setFiltersState(prev => ({ ...prev, ...newFilters }));
    };

    const clearFilters = () => {
        setFiltersState({ search: '', status: 'ALL', type: 'ALL' });
    };

    const isMountedRef = useRef(true);
    useEffect(() => { return () => { isMountedRef.current = false; }; }, []);

    const handleViewDetail = (voucher: Voucher) => {
        setSelectedVoucher(voucher);
        setIsDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
        setTimeout(() => { if (isMountedRef.current) setSelectedVoucher(null); }, 300);
    };

    const handleRetryInvoice = async (id: string) => {
        setIsLoading(true);
        await new Promise(r => setTimeout(r, 1200));

        const updatedVouchers = vouchers.map(v => {
            if (v.id === id) {
                return {
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
                };
            }
            return v;
        });

        setVouchers(updatedVouchers);
        setKpis(calculateKPIs(updatedVouchers));
        setIsLoading(false);
        handleCloseDrawer();
    };

    /** 
     * Emite una nueva factura llamando al endpoint real de Rapifac.
     * El comprobante queda disponible también en el panel del admin.
     */
    const emitNewInvoice = useCallback(async (payload: EmitInvoicePayload): Promise<{ success: boolean; error?: string }> => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/rapifac/emit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                throw new Error(`API error: ${res.status}`);
            }
            const json = await res.json() as { success: boolean; data?: Voucher; error?: string };
            if (!json.success || !json.data) throw new Error(json.error ?? 'Error desconocido');

            // Agregar el nuevo comprobante al estado local del vendedor
            const updated = [json.data, ...vouchers];
            setVouchers(updated);
            setKpis(calculateKPIs(updated));
            setIsLoading(false);
            return { success: true };
        } catch (err: unknown) {
            setIsLoading(false);
            return { success: false, error: err instanceof Error ? err.message : 'Error' };
        }
    }, [vouchers]);

    return {
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
    };
}
