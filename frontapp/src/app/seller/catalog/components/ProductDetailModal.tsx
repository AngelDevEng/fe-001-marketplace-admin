import React from 'react';
import { Product } from '@/lib/types/seller/product';
import BaseDrawer from '@/components/ui/BaseDrawer';
import BaseButton from '@/components/ui/BaseButton';
import Icon from '@/components/ui/Icon';

interface ProductDetailModalProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function ProductDetailModal({ product, isOpen, onClose }: ProductDetailModalProps) {
    if (!product) return null;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(amount);
    };

    const mainAttributes = product.mainAttributes || [];
    const additionalAttributes = product.additionalAttributes || [];

    const footer = (
        <div className="flex gap-4 w-full">
            <BaseButton
                variant="secondary"
                leftIcon="Printer"
                className="flex-1 !rounded-2xl"
                size="md"
            >
                Imprimir Ficha
            </BaseButton>
            <BaseButton
                variant="primary"
                leftIcon="Share2"
                className="flex-1 !rounded-2xl"
                size="md"
            >
                Compartir
            </BaseButton>
        </div>
    );

    return (
        <BaseDrawer
            isOpen={isOpen}
            onClose={onClose}
            title={product.name}
            subtitle={product.category}
            badge="Información Técnica"
            width="md:w-[600px]"
            accentColor="from-emerald-500/10 via-sky-500/5"
            footer={footer}
        >
            <div className="space-y-10">
                {/* Visual Section */}
                <div className="flex flex-col gap-6">
                    <div className="aspect-square bg-gray-50 rounded-[3rem] flex items-center justify-center p-8 border border-gray-100/50 shadow-inner relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/5 to-transparent opacity-50"></div>
                        <img src={product.image || 'https://placehold.co/300x300'} alt={product.name} className="w-full h-full object-contain relative z-10 transition-transform duration-500 group-hover:scale-110" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-6 bg-white rounded-[2rem] border border-gray-100 shadow-sm flex flex-col items-center text-center">
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Disponibilidad</span>
                            <p className="text-3xl font-black text-gray-800 tracking-tighter">{product.stock}</p>
                            <span className="text-[8px] font-bold text-gray-400 uppercase">Unidades en CEDI</span>
                        </div>
                        <div className="p-6 bg-sky-50/50 rounded-[2rem] border border-sky-100 shadow-sm flex flex-col items-center text-center">
                            <span className="text-[9px] font-black text-sky-400 uppercase tracking-widest mb-1">Precio Unitario</span>
                            <p className="text-3xl font-black text-sky-600 tracking-tighter">{formatCurrency(product.price)}</p>
                            <span className="text-[8px] font-bold text-sky-400 uppercase">Inc. IGV (PEN)</span>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-4">
                    <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest flex items-center gap-2 px-1">
                        <div className="w-1.5 h-4 bg-sky-500 rounded-full"></div>
                        Descripción Comercial
                    </h3>
                    <p className="text-sm text-gray-600 font-medium leading-relaxed bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                        {product.description || 'Sin descripción detallada registrada para este SKU.'}
                    </p>
                </div>

                {/* Attributes Tables */}
                <div className="space-y-8">
                    {mainAttributes.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest flex items-center gap-2 px-1">
                                <div className="w-1.5 h-4 bg-emerald-500 rounded-full"></div>
                                Especificaciones Críticas
                            </h3>
                            <div className="overflow-hidden border border-gray-100 rounded-[2rem] bg-white shadow-sm">
                                <table className="w-full text-xs">
                                    <tbody className="divide-y divide-gray-50">
                                        {mainAttributes.map((attr, idx) => (
                                            <tr key={idx} className="divide-x divide-gray-50 bg-white hover:bg-gray-50/50 transition-colors">
                                                {attr.values.map((val, vIdx) => (
                                                    <td key={vIdx} className={`px-6 py-4 ${vIdx === 0 ? 'font-black text-gray-700 uppercase tracking-tighter bg-gray-50/20' : 'font-bold text-gray-500'}`}>
                                                        {val}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {additionalAttributes.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 px-1 text-opacity-50">
                                <div className="w-1.5 h-4 bg-gray-300 rounded-full"></div>
                                Otros Detalles
                            </h3>
                            <div className="grid grid-cols-1 gap-2">
                                {additionalAttributes.map((attr, idx) => (
                                    <div key={idx} className="flex justify-between items-center p-4 bg-gray-50/50 rounded-2xl border border-gray-100/50">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">{attr.values[0]}</span>
                                        <span className="text-[11px] font-bold text-gray-600">{attr.values[1]}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </BaseDrawer>
    );
}
