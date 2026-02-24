'use client';

import React from 'react';
import { Product } from '@/lib/types/seller/product';
import ModalsPortal from '@/components/layout/shared/ModalsPortal';
import { formatCurrency } from '@/lib/utils/formatters';
import Icon from '@/components/ui/Icon';

interface ProductDetailModalProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function ProductDetailModal({ product, isOpen, onClose }: ProductDetailModalProps) {
    if (!product || !isOpen) return null;

    const mainAttributes = product.mainAttributes || [];
    const additionalAttributes = product.additionalAttributes || [];

    return (
        <ModalsPortal>
            <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-gray-900/80 backdrop-blur-md animate-fadeIn"
                    onClick={onClose}
                ></div>

                <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden transform transition-all duration-300 flex flex-col max-h-[90vh] animate-scaleUp">
                    <div className="h-2 w-full bg-gradient-to-r from-sky-500 to-indigo-500"></div>

                    <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-white">
                        <div>
                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Ficha Técnica</span>
                            <h2 className="text-2xl font-black text-gray-800 tracking-tighter">Detalle del Producto</h2>
                        </div>
                        <button onClick={onClose} className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all">
                            <Icon name="X" className="text-xl w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-8 overflow-y-auto custom-scrollbar">
                        <div className="flex flex-col md:flex-row gap-8">
                            {/* Image Side */}
                            <div className="w-full md:w-1/3 space-y-4">
                                <div className="aspect-square bg-gray-50 rounded-2xl flex items-center justify-center p-4 border border-gray-100">
                                    <img src={product.image || 'https://placehold.co/300x300'} alt={product.name} className="w-full h-full object-contain" />
                                </div>
                                <div className="grid grid-cols-2 gap-3 text-center">
                                    <div className="p-3 bg-gray-50 rounded-xl">
                                        <p className="text-[8px] font-black text-gray-400 uppercase">Stock</p>
                                        <p className="text-lg font-black text-gray-800">{product.stock}</p>
                                    </div>
                                    <div className="p-3 bg-sky-50 rounded-xl">
                                        <p className="text-[8px] font-black text-sky-400 uppercase">Precio</p>
                                        <p className="text-lg font-black text-sky-600">{formatCurrency(product.price)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Details Side */}
                            <div className="flex-1 space-y-6">
                                <div>
                                    <h3 className="text-3xl font-black text-gray-800 leading-tight mb-2">{product.name}</h3>
                                    <div className="flex gap-2">
                                        <span className="px-2 py-1 bg-gray-100 rounded-md text-[10px] font-bold text-gray-500 uppercase">{product.category}</span>
                                        {product?.sticker && <span className="px-2 py-1 bg-sky-100 rounded-md text-[10px] font-bold text-sky-500 uppercase">{product.sticker}</span>}
                                    </div>
                                </div>

                                <p className="text-sm text-gray-600 font-medium leading-relaxed">
                                    {product.description}
                                </p>

                                <div className="space-y-6">
                                    {mainAttributes.length > 0 && (
                                        <div className="space-y-3">
                                            <h4 className="text-[10px] font-black text-sky-500 uppercase tracking-widest border-b border-sky-100 pb-2">Información Principal</h4>
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
                                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Detalles Adicionales</h4>
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
                    </div>
                </div>
            </div>
        </ModalsPortal>
    );
}
