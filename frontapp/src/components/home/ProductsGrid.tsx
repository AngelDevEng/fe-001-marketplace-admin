'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Categoria } from '@/types/public';
import { getHomeCategories, mapWooCategoryToLocal } from '@/shared/lib/api/wooCommerce';

interface ProductsGridProps {
  categorias?: Categoria[];
  titulo?: string;
  useApi?: boolean;
}

function SkeletonCard() {
  return (
    <div className="flex-shrink-0 w-full sm:w-[calc(33.333%-1rem)] lg:w-[calc(16.666%-1rem)] animate-pulse">
      <div className="rounded-[2.5rem] overflow-hidden shadow-md bg-gray-200 dark:bg-gray-700 h-28 md:h-36">
      </div>
      <div className="py-3 text-center">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto"></div>
      </div>
    </div>
  );
}

export default function ProductsGrid({ 
  categorias: initialData, 
  titulo = 'Categorías de productos saludables',
  useApi = false 
}: ProductsGridProps) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Categoria[]>([]);
  const [loadTime, setLoadTime] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!useApi) {
      if (initialData) {
        setData(initialData);
      }
      setLoading(false);
      return;
    }

    async function fetchData() {
      const startTime = Date.now();
      setLoading(true);
      setError(null);

      try {
        const wooCategories = await getHomeCategories();
        console.log('API Response Categories:', wooCategories);
        const mappedData = mapWooCategoryToLocal(wooCategories);
        console.log('Mapped Categories:', mappedData);
        setData(mappedData);
        const endTime = Date.now();
        setLoadTime(endTime - startTime);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching categories');
        console.error('Error fetching categories:', err);
        if (initialData) {
          setData(initialData);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [useApi, initialData]);

  const categorias = data;

  return (
    <section className="rounded-3xl space-y-4 md:space-y-6 max-w-7xl mx-auto px-4 py-6 bg-white dark:bg-[#111A15]">
      <div className="flex justify-between items-center">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-[#E8EDE9]">{titulo}</h2>
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
        <div className="flex transition-transform duration-700 gap-4">
          {(loading ? Array(6).fill(null) : categorias).map((cat, index) => (
            loading ? (
              <SkeletonCard key={index} />
            ) : cat ? (
              <Link 
                key={cat.id} 
                href={`/productos/${cat.slug || cat.id}`}
                className="flex-shrink-0 w-full sm:w-[calc(33.333%-1rem)] lg:w-[calc(16.666%-1rem)]"
              >
                <article className="rounded-[2.5rem] overflow-hidden shadow-md bg-sky-400 dark:bg-[#4A7C59] group cursor-pointer h-28 md:h-36">
                  <Image
                    src={cat.imagen}
                    alt={cat.nombre}
                    width={300}
                    height={200}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </article>
                <div className="py-3 text-center">
                  <p className="text-[11px] md:text-sm font-bold tracking-tight text-gray-800 dark:text-[#E8EDE9] uppercase">
                    {cat.nombre}
                  </p>
                </div>
              </Link>
            ) : null
          ))}
        </div>
      </div>
    </section>
  );
}
