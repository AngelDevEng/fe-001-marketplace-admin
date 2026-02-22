'use client';

import React from 'react';
import ModuleHeader from '@/components/layout/shared/ModuleHeader';
import { Product } from '@/lib/types/seller/product';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import ProductDetailModal from './components/ProductDetailModal';
import BaseEmptyState from '@/components/ui/BaseEmptyState';
import BaseButton from '@/components/ui/BaseButton';
import Icon from '@/components/ui/Icon';
import { useToast } from '@/context/ToastContext';
import { useSellerCatalog } from '@/hooks/useSellerCatalog';

export default function CatalogPage() {
    const {
        products,
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
    } = useSellerCatalog();

    const { showToast } = useToast();

    const onSave = (product: Product) => {
        const isEdit = handleSaveProduct(product);
        if (isEdit) {
            showToast('Producto actualizado correctamente', 'success');
        } else {
            showToast('Nuevo producto agregado al catálogo', 'success');
        }
    };

    const onDelete = (productId: string) => {
        if (handleDeleteProduct(productId)) {
            showToast('Producto eliminado', 'info');
        }
    };

    return (
        <div className="space-y-8 animate-fadeIn pb-20 max-w-7xl mx-auto">
            <ModuleHeader
                title="Gestión de Catálogo"
                subtitle="Administra tus productos, precios e inventario centralizado."
                icon="Catalog"
                actions={
                    <BaseButton
                        onClick={handleCreateProduct}
                        variant="success"
                        leftIcon="PlusCircle"
                        size="md"
                        className="!rounded-3xl"
                    >
                        Nuevo Producto
                    </BaseButton>
                }
            />

            {/* Filters */}
            <div className="glass-card p-6 rounded-[2.5rem] bg-white border border-gray-100 shadow-xl shadow-gray-100/50">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Icon name="Search" className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o descripción..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all font-bold text-gray-700 outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
                {loading ? (
                    Array(4).fill(0).map((_, i) => (
                        <div key={i} className="bg-white rounded-3xl p-4 aspect-[3/4] border border-gray-100 animate-pulse flex flex-col pt-10 px-6 gap-4">
                            <div className="w-full aspect-square bg-gray-100 rounded-2xl mb-2"></div>
                            <div className="w-3/4 h-3 bg-gray-100 rounded-lg mx-auto"></div>
                            <div className="w-1/2 h-3 bg-gray-100 rounded-lg mx-auto"></div>
                        </div>
                    ))
                ) : products.length > 0 ? (
                    products.map(product => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onEdit={openEditModal}
                            onDelete={onDelete}
                            onViewInfo={openDetailModal}
                        />
                    ))
                ) : (
                    <div className="col-span-full">
                        <BaseEmptyState
                            title="Tu catálogo está vacío"
                            description="Comienza a construir tu presencia digital agregando tu primer producto estrella."
                            icon="Catalog"
                            actionLabel="Nuevo Producto"
                            onAction={handleCreateProduct}
                            suggestion="Los productos con buenas fotos y descripciones técnicas convierten un 40% más."
                        />
                    </div>
                )}
            </div>

            {/* Modals */}
            <ProductModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSave={onSave}
                productToEdit={editingProduct}
            />

            <ProductDetailModal
                product={viewProduct}
                isOpen={isDetailModalOpen}
                onClose={closeDetailModal}
            />

        </div>
    );
}
