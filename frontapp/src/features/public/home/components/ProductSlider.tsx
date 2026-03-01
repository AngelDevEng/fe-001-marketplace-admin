'use client';

import Image from 'next/image';
import Icon from '@/components/ui/Icon';
import type { Producto } from '../types';

interface ProductSliderProps {
  productos: Producto[];
  titulo: string;
  bannerImage?: string;
}

export default function ProductSlider({ productos, titulo, bannerImage }: ProductSliderProps) {
  return (
    <section className="!mt-0 max-w-7xl mx-auto px-4 py-6">
      {bannerImage && (
        <div className="relative aspect-[6/1] rounded-2xl overflow-hidden mb-6">
          <Image src={bannerImage} alt={titulo} fill className="object-cover" priority />
        </div>
      )}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900">{titulo}</h2>
        <button className="text-sm font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1">
          Ver todo <Icon name="ArrowRight" className="w-4 h-4" />
        </button>
      </div>
      <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
        <div className="flex gap-4">
          {productos.map((producto) => (
            <article
              key={producto.id}
              className="flex-shrink-0 w-[160px] md:w-[200px] bg-white rounded-2xl p-3 shadow-md hover:-translate-y-1 hover:shadow-lg transition-all"
            >
              <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50 mb-3">
                <Image
                  src={producto.imagen}
                  alt={producto.titulo}
                  fill
                  sizes="200px"
                  className="object-contain p-2"
                />
                {producto.descuento && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                    -{producto.descuento}%
                  </span>
                )}
              </div>
              <h3 className="text-xs font-bold text-gray-800 truncate">{producto.titulo}</h3>
              <p className="text-sm font-extrabold text-sky-600 mt-1">S/ {producto.precio.toFixed(2)}</p>
              <div className="text-amber-400 text-xs mt-1">{producto.estrellas || '★★★★★'}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
