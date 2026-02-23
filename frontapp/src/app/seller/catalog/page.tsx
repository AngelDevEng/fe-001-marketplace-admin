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
import ModalsPortal from '@/components/layout/shared/ModalsPortal';
import { useToast } from '@/context/ToastContext';
import Skeleton from '@/components/ui/Skeleton';
import { useSellerCatalog } from '@/hooks/useSellerCatalog';
import { Search, PlusCircle, LayoutGrid, Package, RefreshCw, X } from 'lucide-react';

export default function CatalogPage() {
    const {
        products,
        searchText,
        setSearchText,
        loading,
        isModalOpen,
        isDetailModalOpen,
        selectedProduct,
        handleSaveProduct,
        handleDeleteProduct,
        openEditModal,
        handleCreateProduct,
        openDetailModal,
        closeDetailModal,
        closeModal,
        refresh
    } = useSellerCatalog();

    const { showToast } = useToast();

    const onSave = async (product: Product) => {
        try {
            await handleSaveProduct(product);
            showToast(selectedProduct ? 'Producto actualizado correctamente' : 'Nuevo producto agregado al catálogo', 'success');
        } catch (err) {
            showToast('Error al procesar el producto', 'error');
        }
    };

    const onDelete = async (productId: string) => {
        if (window.confirm('¿Estás seguro de eliminar este ítem del catálogo activo?')) {
            try {
                await handleDeleteProduct(productId);
                showToast('Producto eliminado exitosamente', 'info');
            } catch (err) {
                showToast('No se pudo eliminar el producto', 'error');
            }
        }
    };

    return (
        <div className="space-y-10 animate-fadeIn font-industrial pb-32 max-w-7xl mx-auto">
            <ModuleHeader
                title="Gestión de Catálogo"
                subtitle="Administración Maestra de Productos, Inventarios y Ofertas (RF-04)"
                icon="Catalog"
                actions={
                    <div className="flex gap-3">
                        <BaseButton
                            onClick={() => refresh()}
                            variant="ghost"
                            size="md"
                            className="bg-white border border-gray-100 shadow-sm"
                        >
                            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                        </BaseButton>
                        <BaseButton
                            onClick={handleCreateProduct}
                            variant="primary"
                            leftIcon="PlusCircle"
                            size="md"
                            className="shadow-xl shadow-indigo-100"
                        >
                            Nuevo Producto
                        </BaseButton>
                    </div>
                }
            />

            {/* Filtros */}
            <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-xl">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o descripción..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            className="w-full pl-14 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/10 transition-all font-bold text-gray-700 text-sm outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {loading && products.length === 0 ? (
                    Array(8).fill(0).map((_, i) => (
                        <div key={i} className="bg-white rounded-[2.5rem] p-8 border border-gray-100 space-y-6 shadow-sm">
                            <Skeleton className="w-full aspect-square rounded-[2rem]" />
                            <div className="space-y-3">
                                <Skeleton className="w-3/4 h-4 rounded-lg" />
                                <Skeleton className="w-1/2 h-3 rounded-lg opacity-60" />
                            </div>
                            <Skeleton className="w-full h-12 rounded-2xl" />
                        </div>
                    ))
                ) : products.length > 0 ? (
                    products.map((product, idx) => (
                        <div key={product.id} className="animate-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${idx * 50}ms` }}>
                            <ProductCard
                                product={product}
                                onEdit={openEditModal}
                                onDelete={onDelete}
                                onViewInfo={openDetailModal}
                            />
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-24 flex flex-col items-center justify-center bg-white rounded-[3rem] border-2 border-dashed border-gray-100 text-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-200 border border-gray-100">
                            <Package className="w-10 h-10" />
                        </div>
                        <h3 className="text-xl font-black text-gray-400 mb-2 uppercase tracking-widest">Tu catálogo está vacío</h3>
                        <p className="text-[10px] text-gray-400 mb-8 max-w-xs mx-auto font-black uppercase tracking-widest leading-relaxed">
                            Agrega tu primer producto para comenzar.
                        </p>
                    </div>
                )}
            </div>

            {/* Modals Portal Teleportation */}
            {isModalOpen && (
                <ModalsPortal>
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md animate-fadeIn" onClick={closeModal} />
                        <div className="relative z-10 w-full max-w-2xl animate-scaleUp">
                            <button onClick={closeModal} className="absolute -top-12 right-0 text-white/50 hover:text-white transition-all">
                                <X className="w-8 h-8" />
                            </button>
                            <ProductModal
                                isOpen={isModalOpen}
                                onClose={closeModal}
                                onSave={onSave}
                                productToEdit={selectedProduct}
                            />
                        </div>
                    </div>
                </ModalsPortal>
            )}

            <ProductDetailModal
                product={selectedProduct}
                isOpen={isDetailModalOpen}
                onClose={closeDetailModal}
            />

        </div>
    );
}
