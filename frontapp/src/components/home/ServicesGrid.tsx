'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Categoria } from '@/types/public';
import { getHomeServiceCategories, mapWooServiceCategoryToLocal } from '@/shared/lib/api/wooCommerce';

interface ServicesGridProps {
  categorias?: Categoria[];
  useApi?: boolean;
}

function SkeletonCard() {
  return (
    <div className="flex-shrink-0 w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.75rem)] animate-pulse">
      <div className="rounded-[2.5rem] overflow-hidden shadow-md bg-gray-200 dark:bg-gray-700 h-44 md:h-52">
      </div>
    </div>
  );
}

export default function ServicesGrid({ categorias: initialData, useApi = false }: ServicesGridProps) {
  const [current, setCurrent] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Categoria[]>(initialData || []);
  const [loadTime, setLoadTime] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    if (!useApi) return;

    async function fetchData() {
      const startTime = Date.now();
      setLoading(true);
      setError(null);

      try {
        const wooCategories = await getHomeServiceCategories();
        const mappedData = mapWooServiceCategoryToLocal(wooCategories);
        setData(mappedData);
        const endTime = Date.now();
        setLoadTime(endTime - startTime);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching service categories');
        console.error('Error fetching service categories:', err);
        if (initialData) {
          setData(initialData);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [useApi]);

  const categorias = data;
  const maxIndex = Math.max(0, categorias.length - itemsPerView);

  const prev = useCallback(() => {
    setCurrent((c) => Math.max(0, c - 1));
  }, []);

  const next = useCallback(() => {
    setCurrent((c) => Math.min(maxIndex, c + 1));
  }, [maxIndex]);

  return (
    <section className="!mt-0 rounded-3xl space-y-4 md:space-y-6 max-w-7xl mx-auto px-4 py-6 bg-white dark:bg-[#111A15]">
      <div className="flex justify-between items-center">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-[#E8EDE9]">
          Categorías de servicios saludables
        </h2>
        {loadTime && (
          <span className="text-xs text-green-600 font-mono">
            API: {loadTime}ms
          </span>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">Error: {error}</p>
          <p className="text-xs text-gray-500 mt-1">Usando datos por defecto</p>
        </div>
      )}

      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-700 gap-4"
          style={{
            transform: `translateX(-${current * (100 / itemsPerView)}%)`,
          }}
        >
          {(loading ? Array(4).fill(null) : categorias).map((categoria, index) => (
            loading ? (
              <SkeletonCard key={index} />
            ) : categoria ? (
              <Link
                key={categoria.id}
                href={`/productos/${categoria.slug || categoria.id}`}
                className="flex-shrink-0 w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.75rem)]"
              >
                <article className="rounded-[2.5rem] overflow-hidden shadow-md bg-white dark:bg-[#111A15] group cursor-pointer h-44 md:h-52">
                  <Image
                    src={categoria.imagen}
                    alt={categoria.nombre}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </article>
              </Link>
            ) : null
          ))}
        </div>

        {!loading && current > 0 && (
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white dark:bg-[#111A15] dark:hover:bg-[#182420] p-2 rounded-full shadow-lg transition-colors z-10"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-[#E8EDE9]" />
          </button>
        )}
        {!loading && current < maxIndex && (
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white dark:bg-[#111A15] dark:hover:bg-[#182420] p-2 rounded-full shadow-lg transition-colors z-10"
            aria-label="Siguiente"
          >
            <ChevronRight className="w-5 h-5 text-gray-700 dark:text-[#E8EDE9]" />
          </button>
        )}
      </div>
    </section>
  );
}
