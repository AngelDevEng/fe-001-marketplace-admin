'use client';

import Image from 'next/image';
import type { Categoria } from '../types';

interface ProductsGridProps {
  categorias: Categoria[];
  titulo: string;
}

export default function ProductsGrid({ categorias, titulo }: ProductsGridProps) {
  return (
    <section className="!mt-0 space-y-4 md:space-y-6 max-w-7xl mx-auto px-4">
      <h2 className="text-xl md:text-2xl font-semibold text-gray-900">{titulo}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categorias.map((categoria) => (
          <div
            key={categoria.id}
            className="group cursor-pointer"
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-md bg-white">
              <Image
                src={categoria.imagen}
                alt={categoria.nombre}
                width={300}
                height={300}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <h3 className="mt-2 text-xs md:text-sm font-medium text-gray-700 text-center group-hover:text-sky-600 transition-colors">
              {categoria.nombre}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
}
