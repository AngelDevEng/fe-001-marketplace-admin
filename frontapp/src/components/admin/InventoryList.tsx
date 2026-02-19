'use client';

import React, { useEffect, useState } from 'react';
import { getProducts } from '@/lib/api';
import { Product } from '@/lib/types';

export default function InventoryList() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<'all' | 'low' | 'out'>('all');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const data = await getProducts();
                setProducts(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching inventory:', err);
                setError('No se pudo cargar el inventario. Verifique la conexión.');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const filteredProducts = products.filter(p => {
        if (filter === 'low') return p.manage_stock && p.stock_quantity !== null && p.stock_quantity > 0 && p.stock_quantity <= 5;
        if (filter === 'out') return p.stock_status === 'outofstock' || (p.manage_stock && p.stock_quantity === 0);
        return true;
    });

    if (loading) {
        return (
            <div className="bg-white rounded-3xl p-20 border border-gray-100 shadow-sm flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-brand-sky/20 border-t-brand-sky rounded-full animate-spin"></div>
                <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Analizando Existencias...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Filtros de Inventario */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                    onClick={() => setFilter('all')}
                    className={`p-6 rounded-3xl border transition-all text-left ${filter === 'all' ? 'bg-brand-sky border-brand-sky text-white shadow-lg shadow-brand-sky/20' : 'bg-white border-gray-100 text-gray-500 hover:border-brand-sky/30'}`}
                >
                    <div className="flex items-center justify-between">
                        <i className="ph-bold ph-package text-2xl"></i>
                        <span className="text-2xl font-black">{products.length}</span>
                    </div>
                    <p className="mt-4 font-black uppercase tracking-widest text-[10px]">Total Productos</p>
                </button>

                <button
                    onClick={() => setFilter('low')}
                    className={`p-6 rounded-3xl border transition-all text-left ${filter === 'low' ? 'bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/20' : 'bg-white border-gray-100 text-gray-500 hover:border-amber-500/30'}`}
                >
                    <div className="flex items-center justify-between">
                        <i className="ph-bold ph-warning-circle text-2xl"></i>
                        <span className="text-2xl font-black">{products.filter(p => p.manage_stock && p.stock_quantity !== null && p.stock_quantity > 0 && p.stock_quantity <= 5).length}</span>
                    </div>
                    <p className="mt-4 font-black uppercase tracking-widest text-[10px]">Stock Bajo ( &lt; 5 )</p>
                </button>

                <button
                    onClick={() => setFilter('out')}
                    className={`p-6 rounded-3xl border transition-all text-left ${filter === 'out' ? 'bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-500/20' : 'bg-white border-gray-100 text-gray-500 hover:border-rose-500/30'}`}
                >
                    <div className="flex items-center justify-between">
                        <i className="ph-bold ph-prohibit text-2xl"></i>
                        <span className="text-2xl font-black">{products.filter(p => p.stock_status === 'outofstock' || (p.manage_stock && p.stock_quantity === 0)).length}</span>
                    </div>
                    <p className="mt-4 font-black uppercase tracking-widest text-[10px]">Agotados</p>
                </button>
            </div>

            <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">SKU / ID</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Producto</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Existencias</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="group hover:bg-gray-50/50 transition-colors">
                                    <td className="px-8 py-5">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-black text-gray-900 uppercase">{product.sku || 'SIN-SKU'}</span>
                                            <span className="text-[9px] text-gray-400 font-bold uppercase">ID: #{product.id}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 overflow-hidden border border-gray-200">
                                                {product.images?.[0]?.src ? (
                                                    <img src={product.images[0].src} alt={product.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <i className="ph-bold ph-image text-lg"></i>
                                                )}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-gray-900 uppercase tracking-tight">{product.name}</span>
                                                <span className="text-[9px] text-gray-400 font-bold uppercase">en {product.store?.shop_name || 'Tienda Oficial'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-sm font-black ${product.stock_status === 'outofstock' ? 'text-rose-500' :
                                                (product.manage_stock && product.stock_quantity !== null && product.stock_quantity <= 5) ? 'text-amber-500' : 'text-emerald-500'
                                                }`}>
                                                {product.manage_stock ? (product.stock_quantity ?? 0) : 'Stock Simple'}
                                            </span>
                                            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${product.stock_status === 'instock' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                                                }`}>
                                                {product.stock_status === 'instock' ? 'Disponible' : 'Agotado'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <button className="p-2 rounded-xl bg-gray-50 text-gray-400 hover:bg-brand-sky/10 hover:text-brand-sky transition-all active:scale-90">
                                            <i className="ph-bold ph-arrows-counter-clockwise text-lg"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
