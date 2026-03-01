'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import Icon from '@/components/ui/Icon';
import type { Marca } from '../types';

interface BrandsCarouselProps {
  marcas: Marca[];
}

export default function BrandsCarousel({ marcas }: BrandsCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);

  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 640) setItemsPerView(2);
      else if (window.innerWidth < 1024) setItemsPerView(3);
      else setItemsPerView(6);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const maxIndex = Math.max(0, Math.ceil(marcas.length / itemsPerView) - 1);

  const prev = useCallback(() => {
    setCurrent((c) => Math.max(0, c - 1));
  }, []);

  const next = useCallback(() => {
    setCurrent((c) => Math.min(maxIndex, c + 1));
  }, [maxIndex]);

  return (
    <section className="!mt-0 space-y-4 max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900">Nuestras Marcas</h2>
        <div className="flex gap-2">
          <button
            onClick={prev}
            disabled={current === 0}
            className="bg-white shadow-md rounded-full p-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <Icon name="ChevronLeft" className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            disabled={current >= maxIndex}
            className="bg-white shadow-md rounded-full p-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <Icon name="ChevronRight" className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-500 gap-4"
          style={{
            transform: `translateX(-${current * (100 / itemsPerView)}%)`,
          }}
        >
          {marcas.map((marca) => (
            <div
              key={marca.id}
              className="flex-shrink-0 w-1/2 sm:w-1/3 lg:w-1/6"
            >
              <div className="aspect-[3/2] bg-white rounded-xl shadow-sm flex items-center justify-center p-4 hover:shadow-md transition-shadow">
                <Image
                  src={marca.logo}
                  alt={marca.nombre}
                  width={120}
                  height={80}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
