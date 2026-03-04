'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Categoria } from '@/types/public';

interface ServicesGridProps {
  categorias: Categoria[];
}

export default function ServicesGrid({ categorias }: ServicesGridProps) {
  const [current, setCurrent] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);

  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 640) setItemsPerView(1);
      else if (window.innerWidth < 1024) setItemsPerView(2);
      else setItemsPerView(4);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const maxIndex = Math.max(0, categorias.length - itemsPerView);

  const prev = useCallback(() => {
    setCurrent((c) => Math.max(0, c - 1));
  }, []);

  const next = useCallback(() => {
    setCurrent((c) => Math.min(maxIndex, c + 1));
  }, [maxIndex]);

  return (
    <section className="!mt-0 space-y-4 md:space-y-6 max-w-7xl mx-auto px-4">
      <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
        Categorías de servicios saludables
      </h2>

      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-700 gap-4"
          style={{
            transform: `translateX(-${current * (100 / itemsPerView)}%)`,
          }}
        >
          {categorias.map((categoria) => (
            <div
              key={categoria.id}
              className="flex-shrink-0 w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.75rem)]"
            >
              <article className="rounded-[2.5rem] overflow-hidden shadow-md bg-white group cursor-pointer h-44 md:h-52">
                <Image
                  src={categoria.imagen}
                  alt={categoria.nombre}
                  width={400}
                  height={300}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </article>
            </div>
          ))}
        </div>

        {/* Navigation arrows */}
        {current > 0 && (
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-colors z-10"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
        )}
        {current < maxIndex && (
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-colors z-10"
            aria-label="Siguiente"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        )}
      </div>
    </section>
  );
}