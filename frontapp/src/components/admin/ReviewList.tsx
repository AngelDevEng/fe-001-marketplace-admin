'use client';

import React, { useEffect, useState } from 'react';
import { getReviews } from '@/lib/api';
import { ProductReview } from '@/lib/types';
import Icon from '@/components/ui/Icon';

export default function ReviewList() {
    const [reviews, setReviews] = useState<ProductReview[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setLoading(true);
                const data = await getReviews();
                setReviews(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching reviews:', err);
                setError('No se pudieron cargar las revisiones. Verifique la conexión con WordPress.');
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    const renderStars = (rating: number) => {
        return (
            <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                    <Icon
                        key={i}
                        name="Star"
                        className={`w-3 h-3 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`}
                    />
                ))}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="bg-white rounded-3xl p-20 border border-gray-100 shadow-sm flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-brand-sky/20 border-t-brand-sky rounded-full animate-spin"></div>
                <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Cargando Reseñas...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-3xl p-20 border border-rose-100 shadow-sm flex flex-col items-center justify-center gap-4 text-center">
                <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 mb-2">
                    <Icon name="Star" className="w-10 h-10" />
                </div>
                <h3 className="text-gray-900 font-black uppercase tracking-widest text-sm">Error de Reseñas</h3>
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
                    <h3 className="text-gray-900 font-black uppercase tracking-widest text-xs">Opiniones de Clientes</h3>
                    <p className="text-gray-400 text-[10px] font-bold mt-1 uppercase">Sincronizado vía WooCommerce API</p>
                </div>
                <span className="px-4 py-1.5 bg-brand-sky/10 text-brand-sky rounded-full text-[10px] font-black uppercase tracking-widest">
                    {reviews.length} Reseñas totales
                </span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50">
                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Usuario</th>
                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Calificación</th>
                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Comentario</th>
                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Estado</th>
                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {reviews.map((review) => (
                            <tr key={review.id} className="group hover:bg-gray-50/50 transition-colors">
                                <td className="px-8 py-5">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-black text-gray-900 uppercase tracking-tight">{review.reviewer}</span>
                                        <span className="text-[10px] text-gray-400 font-bold uppercase">{review.reviewer_email}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-5">
                                    <div className="flex flex-col gap-1">
                                        {renderStars(review.rating)}
                                        <span className="text-[9px] text-gray-400 font-black uppercase tracking-tighter">
                                            {new Date(review.date_created).toLocaleDateString()}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-8 py-5">
                                    <div className="max-w-md">
                                        <p className="text-xs text-gray-500 font-medium leading-relaxed italic line-clamp-2">
                                            "{review.review.replace(/<[^>]*>?/gm, '')}"
                                        </p>
                                        <span className="text-[9px] text-brand-sky font-black uppercase tracking-widest mt-1 block">
                                            ID Producto: #{review.product_id}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-8 py-5">
                                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${review.status === 'approved'
                                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                        : 'bg-amber-50 text-amber-600 border-amber-100'
                                        }`}>
                                        {review.status === 'approved' ? 'Aprobado' : 'Pendiente'}
                                    </span>
                                </td>
                                <td className="px-8 py-5 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button className="p-2 rounded-xl bg-gray-50 text-gray-400 hover:bg-brand-sky/10 hover:text-brand-sky transition-all active:scale-90">
                                            <Icon name="Check" className="w-5 h-5" />
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

            {reviews.length === 0 && (
                <div className="p-20 text-center">
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">No hay reseñas para mostrar</p>
                </div>
            )}
        </div>
    );
}
