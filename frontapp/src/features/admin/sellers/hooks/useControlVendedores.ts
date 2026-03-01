'use client';

import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    ControlVendedoresData, SellerStatus, ProductStatus, Stats, AuditEntry, Seller, Product as AdminProduct
} from '@/features/admin/sellers/types';
import { MOCK_CONTROL_DATA } from '@/features/admin/sellers/mock';
import { getStores, getProducts, updateStoreStatus, updateProduct } from '@/shared/lib/api';
import { Product as WCProduct } from '@/lib/types/wp/wp-types';
import { Store as DokanStore } from '@/lib/types/stores/store';
import { USE_MOCKS } from '@/shared/lib/config/flags';

export const useControlVendedores = () => {
    const queryClient = useQueryClient();
    const [currentTab, setCurrentTab] = useState<'vendedores' | 'aprobacion' | 'auditoria'>('vendedores');
    const [filters, setFilters] = useState({
        sellerSearch: '',
        auditStore: '',
        auditType: 'ALL'
    });

    // --- Query: Fetch and Map Data ---
    const { data: rawData, isLoading, error } = useQuery({
        queryKey: ['admin', 'control-vendedores'],
        queryFn: async () => {
            if (USE_MOCKS) {
                return MOCK_CONTROL_DATA as ControlVendedoresData;
            }

            const [dokanStores, wcProducts] = await Promise.all([
                getStores(),
                getProducts()
            ]);

            // 1. Mapeo de Vendedores (Dokan -> Admin Seller)
            const mappedSellers: Seller[] = dokanStores.map((s: DokanStore) => ({
                id: s.id,
                name: `${s.first_name} ${s.last_name || ''}`.trim(),
                company: s.store_name || 'Sin Nombre de Tienda',
                email: s.email || 'n/a',
                status: 'ACTIVE',
                productsTotal: wcProducts.filter(p => p.store?.id === s.id).length,
                productsPending: wcProducts.filter(p => p.store?.id === s.id && p.status === 'pending').length,
                regDate: new Date().toLocaleDateString(),
                contractStatus: 'VIGENTE'
            }));

            // 2. Mapeo de Productos (WC -> Admin Product)
            const mappedProducts: AdminProduct[] = wcProducts.map((p: WCProduct) => ({
                id: p.id,
                name: p.name,
                seller: p.store?.shop_name || 'Tienda Principal',
                sellerId: p.store?.id || 0,
                category: p.categories[0]?.name || 'Sin Categoría',
                price: parseFloat(p.price) || 0,
                status: p.status === 'publish' ? 'APPROVED' : (p.status === 'pending' ? 'PENDING' : 'REJECTED'),
                imageUrl: p.images[0]?.src
            }));

            return {
                sellers: mappedSellers,
                products: mappedProducts,
                notifications: MOCK_CONTROL_DATA.notifications,
                auditoria: MOCK_CONTROL_DATA.auditoria
            } as ControlVendedoresData;
        },
        staleTime: 5 * 60 * 1000, // 5 minutos de validez
    });

    // --- Mutation: Update Seller Status ---
    const sellerStatusMutation = useMutation({
        mutationFn: async ({ id, status, reason }: { id: number, status: SellerStatus, reason: string }) => {
            const statusMap: Record<string, string> = {
                'ACTIVE': 'approved',
                'activa': 'approved',
                'SUSPENDED': 'pending',
                'REJECTED': 'disabled'
            };
            return updateStoreStatus(id, statusMap[status] || 'pending');
        },
        onSuccess: (_, variables) => {
            // Optimistic update or refetch
            queryClient.invalidateQueries({ queryKey: ['admin', 'control-vendedores'] });
            // In a real app we would add the audit entry here via another API call
        }
    });

    // --- Mutation: Update Product Status ---
    const productStatusMutation = useMutation({
        mutationFn: async ({ id, status, reason }: { id: number, status: ProductStatus, reason: string }) => {
            const statusMap: Record<string, string> = {
                'APPROVED': 'publish',
                'REJECTED': 'draft',
                'PENDING': 'pending'
            };
            return updateProduct(id, { status: statusMap[status] || 'draft' });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'control-vendedores'] });
        }
    });

    // --- Derived State: Stats ---
    const stats = useMemo((): Stats => {
        if (!rawData) return { totalSellers: 0, activeSellers: 0, pendingProducts: 0, alerts: 0 };
        return {
            totalSellers: rawData.sellers.length,
            activeSellers: rawData.sellers.filter(s => s.status === 'activa' || s.status === 'ACTIVE').length,
            pendingProducts: rawData.products.filter(p => p.status === 'en_espera' || p.status === 'PENDING').length,
            alerts: rawData.notifications.filter(n => n.estado_revision === 'nueva').length
        };
    }, [rawData]);

    // --- Derived State: Filtered Sellers ---
    const filteredSellers = useMemo(() => {
        if (!rawData) return [];
        return rawData.sellers.filter(s =>
            s.name.toLowerCase().includes(filters.sellerSearch.toLowerCase()) ||
            s.company.toLowerCase().includes(filters.sellerSearch.toLowerCase())
        );
    }, [rawData, filters.sellerSearch]);

    return {
        data: rawData,
        loading: isLoading,
        error: error ? (error as Error).message : null,
        currentTab,
        setCurrentTab,
        stats,
        filteredSellers,
        filters,
        setFilters,
        actions: {
            updateSellerStatus: (id: number, status: SellerStatus, reason: string) =>
                sellerStatusMutation.mutateAsync({ id, status, reason }),
            updateProductStatus: (id: number, status: ProductStatus, reason: string) =>
                productStatusMutation.mutateAsync({ id, status, reason }),
            markAllAsRead: () => {
                // This would be a mutation in a real app
                console.log("Marking all as read (Mock)");
            }
        }
    };
};
