'use client';

import React from 'react';
import { Product } from '@/lib/types/seller/product';
import BaseModal from '@/components/ui/BaseModal';
import { formatCurrency } from '@/lib/utils/formatters';

interface ProductDetailModalProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function ProductDetailModal({ product, isOpen, onClose }: ProductDetailModalProps) {
    if (!product) return null;

    const mainAttributes = product.mainAttributes || [];
    const additionalAttributes = product.additionalAttributes || [];

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={product.name}
            subtitle="Detalle del Producto"
            size="4xl"
            accentColor="from-sky-500 to-indigo-500"
        >
            <div className="flex flex-col md:flex-row gap-8">
                {/* Image Side */}
                <div className="w-full md:w-1/3 space-y-4">
                    <div className="aspect-square bg-gray-50 rounded-2xl flex items-center justify-center p-4 border border-gray-100">
                        <img src={product.image || 'https://placehold.co/300x300'} alt={product.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-center">
                        <div className="p-3 bg-gray-50 rounded-xl">
                            <p className="text-xs font-black text-gray-400 uppercase">Stock</p>
                            <p className="text-lg font-black text-gray-800">{product.stock}</p>
                        </div>
                        <div className="p-3 bg-sky-50 rounded-xl">
                            <p className="text-xs font-black text-sky-400 uppercase">Precio</p>
                            <p className="text-lg font-black text-sky-600">{formatCurrency(product.price)}</p>
                        </div>
                    </div>
                </div>

                {/* Details Side */}
                <div className="flex-1 space-y-6">
                    <div>
                        <div className="flex gap-2 mb-4">
                            <span className="px-2 py-1 bg-gray-100 rounded-md text-xs font-bold text-gray-500 uppercase">{product.category}</span>
                            {product?.sticker && <span className="px-2 py-1 bg-sky-100 rounded-md text-xs font-bold text-sky-500 uppercase">{product.sticker}</span>}
                        </div>
                    </div>

                    <p className="text-sm text-gray-600 font-medium leading-relaxed">
                        {product.description}
                    </p>

                    <div className="space-y-6">
                        {mainAttributes.length > 0 && (
                            <div className="space-y-3">
                                <h4 className="text-xs font-black text-sky-500 uppercase tracking-widest border-b border-sky-100 pb-2">Información Principal</h4>
                                <div className="space-y-2">
                                    {mainAttributes.map((attr, idx) => (
                                        <div key={idx} className="grid grid-cols-2 md:grid-cols-3 gap-4 py-2 border-b border-gray-50 border-dashed">
                                            {attr.values && Array.isArray(attr.values) && attr.values.map((val, vIdx) => (
                                                <span key={vIdx} className={`text-xs ${vIdx === 0 ? 'font-black text-gray-700 uppercase' : 'font-bold text-gray-600'}`}>
                                                    {val}
                                                </span>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {additionalAttributes.length > 0 && (
                            <div className="space-y-3">
                                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Detalles Adicionales</h4>
                                <div className="space-y-2">
                                    {additionalAttributes.map((attr, idx) => (
                                        <div key={idx} className="grid grid-cols-2 md:grid-cols-3 gap-4 py-2 border-b border-gray-50 border-dashed">
                                            {attr.values && Array.isArray(attr.values) && attr.values.map((val, vIdx) => (
                                                <span key={vIdx} className={`text-xs ${vIdx === 0 ? 'font-bold text-gray-500 uppercase' : 'font-medium text-gray-400'}`}>
                                                    {val}
                                                </span>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </BaseModal>
    );
}
