'use client';

import React, { useEffect, useState } from 'react';
import { getCategories } from '@/lib/api';
import { ProductCategory } from '@/lib/types';
import Icon from '@/components/ui/Icon';

export default function CategoryList() {
    const [categories, setCategories] = useState<ProductCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const data = await getCategories();
                setCategories(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching categories:', err);
                setError('No se pudieron cargar las categorías. Verifique la conexión con WordPress.');
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    if (loading) {
        return (
            <div className="bg-white rounded-3xl p-20 border border-gray-100 shadow-sm flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-brand-sky/20 border-t-brand-sky rounded-full animate-spin"></div>
                <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Sincronizando Taxonomía...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-3xl p-20 border border-rose-100 shadow-sm flex flex-col items-center justify-center gap-4 text-center">
                <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 mb-2">
                    <Icon name="FolderTree" className="w-10 h-10" />
                </div>
                <h3 className="text-gray-900 font-black uppercase tracking-widest text-sm">Error de Categorías</h3>
                <p className="text-gray-400 font-medium text-sm max-w-md">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-8 py-3 bg-sky-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-sky-600 transition-all active:scale-95"
                >
                    Reintentar Conexión
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm transition-all hover:shadow-md">
            <div className="p-8 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
                <div>
                    <h3 className="text-gray-900 font-black uppercase tracking-widest text-xs">Categorías del Catálogo</h3>
                    <p className="text-gray-400 text-[10px] font-bold mt-1 uppercase">Sincronizado vía WooCommerce API</p>
                </div>
                <span className="px-4 py-1.5 bg-brand-sky/10 text-brand-sky rounded-full text-[10px] font-black uppercase tracking-widest">
                    {categories.length} Categorías activas
                </span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50">
                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Nombre</th>
                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Slug</th>
                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Productos</th>
                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {categories.map((category) => (
                            <tr key={category.id} className="group hover:bg-gray-50/50 transition-colors">
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 overflow-hidden border border-gray-200 group-hover:border-brand-sky/30 transition-all">
                                            {category.image?.src ? (
                                                <img
                                                    src={category.image.src}
                                                    alt={category.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <Icon name="FolderTree" className="w-5 h-5 opacity-30" />
                                            )}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black text-gray-900 uppercase tracking-tight">{category.name}</span>
                                            {category.description && (
                                                <span className="text-[10px] text-gray-400 font-bold uppercase truncate max-w-[200px]">{category.description.replace(/<[^>]*>?/gm, '')}</span>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-5 text-xs font-bold text-gray-400">
                                    <span className="px-2 py-0.5 bg-gray-100 rounded text-[9px] uppercase tracking-tighter">/{category.slug}</span>
                                </td>
                                <td className="px-8 py-5">
                                    <span className="px-3 py-1 bg-brand-sky/5 text-brand-sky rounded-lg text-[10px] font-black uppercase tracking-widest border border-brand-sky/10">
                                        {category.count} Items
                                    </span>
                                </td>
                                <td className="px-8 py-5 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button className="p-2 rounded-xl bg-gray-50 text-gray-400 hover:bg-brand-sky/10 hover:text-brand-sky transition-all active:scale-90">
                                            <Icon name="Pencil" className="w-5 h-5" />
                                        </button>
                                        <button className="p-2 rounded-xl bg-gray-50 text-gray-400 hover:bg-rose-50 hover:text-rose-500 transition-all active:scale-90">
                                            <Icon name="Trash2" className="w-5 h-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {categories.length === 0 && (
                <div className="p-20 text-center">
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">No hay categorías configuradas</p>
                </div>
            )}
        </div>
    );
}
