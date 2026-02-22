'use client';

import { useState, useMemo, useEffect } from 'react';
import { InventoryItem, ItemType, ItemStatus } from '@/lib/types/admin/inventory';
import { getProducts, updateProduct } from '@/lib/api';
import { Product } from '@/lib/types';
import { useNotifications } from '@/context/NotificationContext';

export const useInventory = () => {
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState({
        search: '',
        seller: 'ALL',
        type: 'ALL' as ItemType | 'ALL',
        status: 'ALL' as ItemStatus | 'ALL'
    });

    useEffect(() => {
        const loadRealData = async () => {
            try {
                setLoading(true);
                const wcProducts = await getProducts();

                // Mapeo: WC Product -> InventoryItem (RF compliant)
                const mappedItems: InventoryItem[] = wcProducts.map((p: Product) => {
                    // Determinar si es Servicio basado en categoría o nombre (lógica legacy Dokan)
                    const isService = p.categories.some(c =>
                        c.name.toLowerCase().includes('servicio') ||
                        c.name.toLowerCase().includes('asesoría')
                    );

                    // Determinar Estado Operativo
                    let status: ItemStatus = 'IN_STOCK';
                    if (p.stock_status === 'outofstock' || (p.manage_stock && p.stock_quantity === 0)) {
                        status = 'OUT_OF_STOCK';
                    } else if (p.manage_stock && (p.stock_quantity ?? 0) < 5) {
                        status = 'LOW_STOCK';
                    }

                    return {
                        id: p.id.toString(),
                        name: p.name,
                        type: isService ? 'SERVICE' : 'PRODUCT',
                        sku: p.sku || `SKU-${p.id}`,
                        seller: {
                            id: p.store?.id?.toString() || '0',
                            name: p.store?.shop_name || 'Tienda Principal'
                        },
                        category: p.categories[0]?.name || 'Sin Categoría',
                        price: parseFloat(p.price) || 0,
                        stock: p.stock_quantity || 0,
                        status: isService ? 'ACTIVE' : status,
                        lastUpdate: new Date().toLocaleDateString()
                    };
                });

                setItems(mappedItems);
                setError(null);
            } catch (err: any) {
                console.error("Inventory Fetch Error:", err);
                setError("No se pudo conectar con el servidor de WooCommerce. Verifique sus llaves API.");
            } finally {
                setLoading(false);
            }
        };

        loadRealData();
    }, []);

    const filteredItems = useMemo(() => {
        return items.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                item.sku?.toLowerCase().includes(filters.search.toLowerCase());
            const matchesSeller = filters.seller === 'ALL' || item.seller.id === filters.seller || item.seller.name === filters.seller;
            const matchesType = filters.type === 'ALL' || item.type === filters.type;
            const matchesStatus = filters.status === 'ALL' || item.status === filters.status;

            return matchesSearch && matchesSeller && matchesType && matchesStatus;
        });
    }, [items, filters]);

    const stats = useMemo(() => {
        return {
            totalItems: items.length,
            lowStockCount: items.filter(i => i.status === 'LOW_STOCK').length,
            outOfStockCount: items.filter(i => i.status === 'OUT_OF_STOCK').length,
            activeServices: items.filter(i => i.type === 'SERVICE').length
        };
    }, [items]);

    const sellers = useMemo(() => {
        const uniqueSellersMap = new Map();
        items.forEach(i => {
            if (!uniqueSellersMap.has(i.seller.id)) {
                uniqueSellersMap.set(i.seller.id, i.seller);
            }
        });
        return Array.from(uniqueSellersMap.values());
    }, [items]);

    const { addNotification } = useNotifications();

    const updateStock = async (id: string, newStock: number) => {
        try {
            const product = items.find(i => i.id === id);
            await updateProduct(Number(id), {
                stock_quantity: newStock,
                manage_stock: true
            });

            // Alerta Real-Time si el stock llega a 0
            if (newStock === 0 && product) {
                addNotification({
                    level: 'CRITICAL',
                    title: 'Stock Agotado Canal Crítico',
                    message: `El producto "${product.name}" de la tienda "${product.seller.name}" se ha agotado completamente.`
                });
            }

            setItems(prev => prev.map(item =>
                item.id === id ? { ...item, stock: newStock } : item
            ));
        } catch (err) {
            console.error("Error updating stock in WC:", err);
            return false;
        }
    };

    return {
        items: filteredItems,
        loading,
        error,
        stats,
        sellers,
        filters,
        setFilters,
        updateStock
    };
};
