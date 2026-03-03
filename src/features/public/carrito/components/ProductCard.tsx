'use client';

import { Star, ShieldCheck, Leaf, Barcode, FolderOpen, Package } from 'lucide-react';
import { money, resolveImg, NO_IMAGE } from '../utils';
import type { ApiProduct } from '../utils';

interface StarRatingProps { rating: number; total: number; }

function StarRating({ rating, total }: StarRatingProps) {
    return (
        <span className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-full bg-gradient-to-r from-sky-500/10 to-lime-500/8 border border-sky-200/50">
            <span className="inline-flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                        key={i}
                        className={`w-3 h-3 ${rating >= i + 0.75 ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
                    />
                ))}
            </span>
            <span className="text-slate-500">{rating.toFixed(1)} · {total}</span>
        </span>
    );
}

interface Props {
    product: ApiProduct;
    onAdd: (id: number | string) => void;
    onView: (id: number | string) => void;
}

export default function ProductCard({ product: p, onAdd, onView }: Props) {
    const finalPrice = Number(p.precio_final ?? p.precio_oferta ?? p.precio ?? 0);
    const basePrice = Number(p.precio ?? 0);
    const hasOffer = finalPrice > 0 && basePrice > 0 && finalPrice < basePrice;
    const pct = hasOffer
        ? (Number(p.descuento_pct ?? 0) || Math.round(((basePrice - finalPrice) / basePrice) * 100))
        : 0;

    const stock = Number(p.stock ?? 0);
    const outOfStock = p.estado_stock === 'out_of_stock' || stock <= 0;

    const rating = Number(p.rating_promedio ?? 0);
    const ratingTotal = Number(p.rating_total ?? 0);
    const cat = p.categoria_nombre ?? 'General';

    return (
        <article className="group flex flex-col rounded-3xl overflow-hidden border border-slate-100 bg-white transition-all duration-200 hover:border-sky-200 hover:shadow-[0_18px_52px_rgba(2,132,199,.10)] hover:-translate-y-0.5">

            {/* Image */}
            <div className="relative">
                <button onClick={() => onView(p.id)} className="block w-full">
                    <div className="aspect-square bg-gray-100 overflow-hidden">
                        <img
                            src={resolveImg(p.imagen_url)}
                            alt={p.nombre}
                            onError={(e) => { (e.target as HTMLImageElement).src = NO_IMAGE; }}
                            className="w-full h-full object-cover group-hover:scale-[1.05] transition duration-300"
                        />
                    </div>
                </button>

                {/* Lyrium badge */}
                <span className="absolute top-3 left-3 inline-flex items-center gap-1 text-[11px] px-3 py-1 rounded-full bg-white/85 border border-sky-100 backdrop-blur-sm text-slate-700 shadow-sm">
                    <Leaf className="w-3 h-3 text-sky-500" /> Lyrium
                </span>

                {/* Offer badge */}
                {hasOffer && (
                    <span className="absolute top-3 right-3 inline-flex items-center gap-1 text-[11px] px-3 py-1 rounded-full bg-emerald-600 text-white shadow">
                        -{pct}%
                    </span>
                )}

                {/* Quick add */}
                <button
                    onClick={() => onAdd(p.id)}
                    disabled={outOfStock}
                    title="Añadir rápido"
                    className="absolute bottom-3 right-3 w-11 h-11 rounded-2xl bg-white/95 border border-sky-100 text-slate-700 shadow-sm grid place-items-center hover:shadow transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    <span className="text-xl text-sky-500">+</span>
                </button>
            </div>

            {/* Info */}
            <div className="p-4 flex flex-col gap-2 flex-1">
                <div className="flex items-start justify-between gap-2">
                    <button onClick={() => onView(p.id)} className="text-left flex-1">
                        <p className="text-slate-800 leading-snug line-clamp-2 min-h-[42px] text-sm font-medium">{p.nombre}</p>
                    </button>
                    {p.sku && (
                        <span className="shrink-0 text-[10px] px-2 py-1 rounded-full bg-gray-100 text-slate-600 inline-flex items-center gap-1">
                            <Barcode className="w-3 h-3 text-sky-500" /> {p.sku}
                        </span>
                    )}
                </div>

                {p.descripcion_corta && (
                    <p className="text-[11px] text-slate-400 line-clamp-2">{p.descripcion_corta}</p>
                )}

                <div className="flex items-center justify-between gap-2 mt-auto pt-2">
                    <span className="text-[11px] px-2 py-1 rounded-full bg-slate-50 border border-slate-100 text-slate-600 inline-flex items-center gap-1">
                        <FolderOpen className="w-3 h-3 text-sky-500" /> {cat}
                    </span>
                    {ratingTotal > 0
                        ? <StarRating rating={rating} total={ratingTotal} />
                        : (
                            <span className="text-[10px] px-2 py-1 rounded-full bg-slate-50 border border-slate-100 text-slate-500 inline-flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3 text-sky-500" /> Verificado
                            </span>
                        )}
                </div>

                <div className="flex items-end justify-between mt-1">
                    <div>
                        <p className="text-emerald-700 text-xl font-bold">{money(finalPrice)}</p>
                        {hasOffer
                            ? <p className="text-xs text-gray-400 line-through">{money(basePrice)}</p>
                            : <p className="text-xs text-transparent">-</p>
                        }
                    </div>
                    <span className={`text-xs inline-flex items-center gap-1 ${outOfStock ? 'text-rose-500' : 'text-slate-400'}`}>
                        <Package className="w-3 h-3 text-sky-500" />
                        {outOfStock ? 'Agotado' : stock ? `Stock: ${stock}` : 'Disponible'}
                    </span>
                </div>

                {/* Action buttons */}
                <div className="grid grid-cols-2 gap-2 mt-2">
                    <button
                        onClick={() => onAdd(p.id)}
                        disabled={outOfStock}
                        className="py-2.5 rounded-2xl bg-sky-500 text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5 hover:bg-sky-600 transition shadow-md shadow-sky-100 disabled:opacity-40 disabled:cursor-not-allowed hover:-translate-y-px"
                    >
                        🛒 {outOfStock ? 'No disponible' : 'Añadir'}
                    </button>
                    <button
                        onClick={() => onView(p.id)}
                        className="py-2.5 rounded-2xl border border-sky-200 bg-white text-xs font-semibold text-slate-700 inline-flex items-center justify-center gap-1.5 hover:bg-sky-50 transition hover:-translate-y-px"
                    >
                        🔍 Ver
                    </button>
                </div>
            </div>
        </article>
    );
}
