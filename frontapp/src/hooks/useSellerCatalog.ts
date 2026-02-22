import { useState, useMemo, useEffect } from 'react';
import { Product } from '@/lib/types/seller/product';
import { MOCK_CATALOG_DATA } from '@/lib/mocks/mockCatalogData';

export function useSellerCatalog() {
    const [products, setProducts] = useState<Product[]>([]);
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [viewProduct, setViewProduct] = useState<Product | null>(null);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    useEffect(() => {
        const loadMockProducts = async () => {
            setLoading(true);
            await new Promise(res => setTimeout(res, 800));
            setProducts(MOCK_CATALOG_DATA);
            setLoading(false);
        };
        loadMockProducts();
    }, []);

    const filteredProducts = useMemo(() => {
        return products.filter(p =>
            p.name.toLowerCase().includes(searchText.toLowerCase()) ||
            p.category.toLowerCase().includes(searchText.toLowerCase())
        );
    }, [products, searchText]);

    const handleSaveProduct = (product: Product): boolean => {
        if (editingProduct) {
            setProducts(products.map(p => p.id === product.id ? product : p));
            setIsModalOpen(false);
            return true; // isEdit
        } else {
            setProducts([...products, { ...product, id: Date.now().toString() }]);
            setIsModalOpen(false);
            return false; // isNew
        }
    };

    const handleDeleteProduct = (productId: string) => {
        if (typeof window !== 'undefined' && window.confirm('¿Estás seguro de eliminar este producto?')) {
            setProducts(products.filter(p => p.id !== productId));
            return true;
        }
        return false;
    };

    const openEditModal = (product: Product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleCreateProduct = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const openDetailModal = (product: Product) => {
        setViewProduct(product);
        setIsDetailModalOpen(true);
    };

    const closeDetailModal = () => {
        setViewProduct(null);
        setIsDetailModalOpen(false);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return {
        products: filteredProducts,
        searchText,
        setSearchText,
        loading,
        isModalOpen,
        isDetailModalOpen,
        viewProduct,
        editingProduct,
        handleSaveProduct,
        handleDeleteProduct,
        openEditModal,
        handleCreateProduct,
        openDetailModal,
        closeDetailModal,
        closeModal
    };
}
