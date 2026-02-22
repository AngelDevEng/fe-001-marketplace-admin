'use client';

import { useState, useEffect, useMemo } from 'react';
import {
    ControlVendedoresData, SellerStatus, ProductStatus, Stats, AuditEntry, Seller, Product as AdminProduct
} from '@/lib/types/admin/sellers';
import { MOCK_CONTROL_DATA } from '@/lib/mocks/sellersData';
import { getStores, getProducts, updateStoreStatus, updateProduct } from '@/lib/api';
import { Product as WCProduct } from '@/lib/types';
import { Store as DokanStore } from '@/lib/types/stores/store';

export const useControlVendedores = () => {
    const [data, setData] = useState<ControlVendedoresData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentTab, setCurrentTab] = useState<'vendedores' | 'aprobacion' | 'auditoria'>('vendedores');
    const [filters, setFilters] = useState({
        sellerSearch: '',
        auditStore: '',
        auditType: 'ALL'
    });

    useEffect(() => {
        const loadRealData = async () => {
            try {
                setLoading(true);
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
                    status: 'ACTIVE', // Dokan no siempre expone status directo en v1/stores de esta forma
                    productsTotal: wcProducts.filter(p => p.store?.id === s.id).length,
                    productsPending: wcProducts.filter(p => p.store?.id === s.id && p.status === 'pending').length,
                    regDate: new Date().toLocaleDateString(), // Mocked ya que Dokan no lo envía siempre
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

                setData({
                    sellers: mappedSellers,
                    products: mappedProducts,
                    notifications: MOCK_CONTROL_DATA.notifications, // Mantener mocks de notificaciones por ahora
                    auditoria: MOCK_CONTROL_DATA.auditoria // Mantener histórico mock
                });
                setError(null);
            } catch (err: any) {
                console.error('Error loading real Control Vendedores data:', err);
                setError("No se pudo sincronizar con Dokan/WooCommerce. Cargando datos de respaldo.");
                setData(MOCK_CONTROL_DATA);
            } finally {
                setLoading(false);
            }
        };
        loadRealData();
    }, []);

    // Derived: Stats
    const stats = useMemo((): Stats => {
        if (!data) return { totalSellers: 0, activeSellers: 0, pendingProducts: 0, alerts: 0 };
        return {
            totalSellers: data.sellers.length,
            activeSellers: data.sellers.filter(s => s.status === 'activa' || s.status === 'ACTIVE').length,
            pendingProducts: data.products.filter(p => p.status === 'en_espera' || p.status === 'PENDING').length,
            alerts: data.notifications.filter(n => n.estado_revision === 'nueva').length
        };
    }, [data]);

    // Derived: Filtered Sellers
    const filteredSellers = useMemo(() => {
        if (!data) return [];
        return data.sellers.filter(s =>
            s.name.toLowerCase().includes(filters.sellerSearch.toLowerCase()) ||
            s.company.toLowerCase().includes(filters.sellerSearch.toLowerCase())
        );
    }, [data, filters.sellerSearch]);

    // Actions (Legacy logic implementation)
    const updateSellerStatus = async (id: number, status: SellerStatus, reason: string) => {
        try {
            // Mapeo de SellerStatus (Admin) a Dokan Status
            const statusMap: Record<string, string> = {
                'ACTIVE': 'approved',
                'activa': 'approved',
                'SUSPENDED': 'pending',
                'REJECTED': 'disabled'
            };

            await updateStoreStatus(id, statusMap[status] || 'pending');

            setData(prev => {
                if (!prev) return null;
                const seller = prev.sellers.find(s => s.id === id);
                const auditEntry: AuditEntry = {
                    id: Date.now(),
                    usuario: 'Admin_Marketplace',
                    accion: `CAMBIO ESTADO VENDEDOR: ${status}`,
                    entidad: seller?.company || 'Unknown',
                    fecha: new Date().toLocaleString(),
                    metadata: { motivo: reason }
                };
                return {
                    ...prev,
                    sellers: prev.sellers.map(s => s.id === id ? { ...s, status } : s),
                    auditoria: [auditEntry, ...prev.auditoria]
                };
            });
            return true;
        } catch (err) {
            console.error("Error updating seller status:", err);
            return false;
        }
    };

    const updateProductStatus = async (id: number, status: ProductStatus, reason: string) => {
        try {
            // Mapeo de ProductStatus (Admin) a WC Status
            const statusMap: Record<string, string> = {
                'APPROVED': 'publish',
                'REJECTED': 'draft',
                'PENDING': 'pending'
            };

            await updateProduct(id, { status: statusMap[status] || 'draft' });

            setData(prev => {
                if (!prev) return null;
                const prod = prev.products.find(p => p.id === id);
                const auditEntry: AuditEntry = {
                    id: Date.now(),
                    usuario: 'Moderador_Bot',
                    accion: `MODERACIÓN PRODUCTO: ${status}`,
                    entidad: prod?.name || 'Unknown',
                    fecha: new Date().toLocaleString(),
                    metadata: { motivo: reason }
                };
                return {
                    ...prev,
                    products: prev.products.map(p => p.id === id ? { ...p, status } : p),
                    auditoria: [auditEntry, ...prev.auditoria]
                };
            });
            return true;
        } catch (err) {
            console.error("Error updating product status:", err);
            return false;
        }
    };

    const markAllAsRead = () => {
        setData(prev => {
            if (!prev) return null;
            return {
                ...prev,
                notifications: prev.notifications.map(n => ({ ...n, estado_revision: 'leida' }))
            };
        });
    };

    return {
        data,
        loading,
        error,
        currentTab,
        setCurrentTab,
        stats,
        filteredSellers,
        filters,
        setFilters,
        actions: {
            updateSellerStatus,
            updateProductStatus,
            markAllAsRead
        }
    };
};
