'use client';

import Image from 'next/image';
import Icon from '@/components/ui/Icon';
import type { Producto, Categoria } from '../types';

interface OffersSectionProps {
  ofertasServicios: Categoria[];
  ofertasProductos: Producto[];
  productosNuevos: Producto[];
}

function ProductCard({ producto }: { producto: Producto }) {
  return (
    <article className="flex-shrink-0 w-[190px] md:w-[220px] bg-white rounded-2xl p-3 shadow-md hover:-translate-y-1 hover:shadow-lg transition-all flex flex-col items-center">
      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center">
        <Image
          src={producto.imagen}
          alt={producto.titulo}
          fill
          sizes="(max-width: 768px) 190px, 220px"
          className="object-contain p-2"
        />
        {producto.tag && (
          <span className="absolute top-2 left-2 bg-sky-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
            {producto.tag}
          </span>
        )}
        {producto.descuento && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
            -{producto.descuento}%
          </span>
        )}
      </div>
      <div className="mt-3 w-full text-center">
        <h3 className="text-xs font-bold text-sky-600 uppercase truncate">{producto.titulo}</h3>
        <p className="text-base font-extrabold text-gray-800">S/ {producto.precio.toFixed(2)}</p>
        <div className="text-amber-400 text-xs">{producto.estrellas || '★★★★★'}</div>
      </div>
    </article>
  );
}

export default function OffersSection({ ofertasServicios, ofertasProductos, productosNuevos }: OffersSectionProps) {
  return (
    <section className="!mt-0 space-y-8 max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900">Ofertas Especiales</h2>
        <button className="text-sm font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1">
          Ver todo <Icon name="ArrowRight" className="w-4 h-4" />
        </button>
      </div>

      <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
        <div className="flex gap-4">
          {ofertasProductos.map((producto) => (
            <ProductCard key={producto.id} producto={producto} />
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900">Nuevos Productos</h2>
        <button className="text-sm font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1">
          Ver todo <Icon name="ArrowRight" className="w-4 h-4" />
        </button>
      </div>

      <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
        <div className="flex gap-4">
          {productosNuevos.map((producto) => (
            <ProductCard key={producto.id} producto={producto} />
          ))}
        </div>
      </div>
    </section>
  );
}
