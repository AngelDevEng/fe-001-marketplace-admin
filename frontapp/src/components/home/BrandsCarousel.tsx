'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Marca } from '@/types/public';

interface BrandsCarouselProps {
  marcas: Marca[];
}

export default function BrandsCarousel({ marcas }: BrandsCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(6);

  useEffect(() => {
    const update = () => {
      if (window.innerWidth >= 1024) setItemsPerView(6);
      else if (window.innerWidth >= 640) setItemsPerView(3);
      else setItemsPerView(2);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const maxIndex = Math.max(0, marcas.length - itemsPerView);

  const prev = useCallback(() => {
    setCurrent((c) => Math.max(0, c - 1));
  }, []);

  const next = useCallback(() => {
    setCurrent((c) => Math.min(maxIndex, c + 1));
  }, [maxIndex]);

  // Percentage to shift per item
  const itemWidthPercent = 100 / marcas.length;

  return (
    <section className="space-y-4 md:space-y-6 max-w-7xl mx-auto px-4">
      <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
        Nuestras marcas
      </h2>

      <div className="relative overflow-hidden -mx-4 px-4 py-4">
        <div
          className="flex transition-transform duration-700 gap-4"
          style={{ transform: `translateX(-${current * itemWidthPercent}%)` }}
        >
          {marcas.map((marca) => (
            <div
              key={marca.id}
              className="flex-shrink-0 w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-0.67rem)] lg:w-[calc(16.666%-0.83rem)]"
            >
              <article className="rounded-[2.5rem] overflow-hidden shadow-md bg-white group cursor-pointer h-28 md:h-36 flex items-center justify-center p-4 transition-all duration-300 border border-transparent hover:shadow-lg">
                <Image
                  src={marca.logo}
                  alt={marca.nombre}
                  width={160}
                  height={120}
                  className="max-w-full max-h-full object-contain transition-all duration-500 group-hover:scale-110"
                />
              </article>
            </div>
          ))}
        </div>

        {/* Navigation arrows */}
        {current > 0 && (
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2.5 rounded-full shadow-lg transition-all duration-200 z-10 hover:scale-105"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
        )}
        {current < maxIndex && (
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2.5 rounded-full shadow-lg transition-all duration-200 z-10 hover:scale-105"
            aria-label="Siguiente"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        )}
      </div>
    </section>
  );
}