'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Mic, Filter, X } from 'lucide-react';
import { Categoria } from '@/types/public';

interface SearchBarProps {
  categorias: Categoria[];
}

export default function SearchBar({ categorias }: SearchBarProps) {
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/buscar?q=${encodeURIComponent(searchTerm)}&category=${selectedCategory}`);
  };

  return (
    <div className="border-t border-gray-100 bg-white/80 backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <form onSubmit={handleSearch} className="w-full relative">
          <input type="hidden" name="category" value={selectedCategory} />

          <div className="relative w-full">
            {/* Input Principal */}
            <input
              type="text"
              name="q"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="¿Qué buscas para tu salud?"
              className="w-full h-12 md:h-14 pl-4 pr-36 md:pl-6 md:pr-56 rounded-full border border-gray-200 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition-all shadow-inner bg-gray-50/50"
              autoComplete="off"
            />

            {/* Botones de Acción */}
            <div className="absolute right-1 top-1 bottom-1 flex items-center gap-1 md:gap-2">
              <button
                type="button"
                className="h-full w-10 md:w-14 rounded-full bg-sky-500 hover:bg-sky-600 text-white font-semibold flex items-center justify-center transition-all duration-200"
                title="Buscar por voz"
              >
                <Mic className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => setFilterOpen(!filterOpen)}
                className="flex h-full w-10 md:w-auto md:px-7 rounded-full bg-sky-500 text-white hover:bg-sky-600 font-bold items-center justify-center gap-2 transition-all border border-sky-200"
              >
                <Filter className="w-5 h-5" />
                <span className="hidden md:inline">Filtros</span>
              </button>

              <button
                type="submit"
                className="h-full w-10 md:w-auto md:px-7 rounded-full bg-sky-500 text-white hover:bg-sky-600 font-bold flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <Search className="w-5 h-5" />
                <span className="hidden md:inline">Buscar</span>
              </button>
            </div>
          </div>

          {/* DROPDOWN DE FILTROS */}
          {filterOpen && (
            <div className="absolute top-[calc(100%+1rem)] left-0 right-0 bg-white/95 backdrop-blur-2xl border border-gray-200 rounded-[2.5rem] shadow-[0_30px_70px_rgba(0,0,0,0.15)] p-6 z-50 overflow-hidden">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800">Filtros de búsqueda</h3>
                <button
                  type="button"
                  onClick={() => setFilterOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Categorías */}
                <div className="p-4 bg-gray-50/50 rounded-2xl">
                  <p className="text-xs uppercase tracking-wider text-gray-500 font-bold inline-flex items-center gap-2 mb-4">
                    <span className="w-2 h-2 bg-sky-500 rounded-full"></span>
                    Categorías
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {categorias.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(selectedCategory === cat.nombre ? '' : cat.nombre)}
                        className={`px-3.5 py-2.5 rounded-full border text-xs font-bold transition-all ${selectedCategory === cat.nombre
                            ? 'bg-sky-500 text-white border-sky-500 shadow-md'
                            : 'bg-white border-gray-100 text-gray-600 hover:border-sky-300 hover:bg-sky-50'
                          }`}
                      >
                        {cat.nombre}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ofertas */}
                <div className="p-4 bg-gray-50/50 rounded-2xl">
                  <p className="text-xs uppercase tracking-wider text-gray-500 font-bold inline-flex items-center gap-2 mb-4">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    Ofertas Especiales
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" className="px-3.5 py-2.5 rounded-full bg-white border border-gray-100 text-xs font-bold text-sky-600 hover:border-sky-300 hover:bg-sky-50 transition-all">
                      Descuentos
                    </button>
                    <button type="button" className="px-3.5 py-2.5 rounded-full bg-white border border-gray-100 text-xs font-bold text-sky-600 hover:border-sky-300 hover:bg-sky-50 transition-all">
                      Promociones
                    </button>
                    <button type="button" className="px-3.5 py-2.5 rounded-full bg-white border border-gray-100 text-xs font-bold text-sky-600 hover:border-sky-300 hover:bg-sky-50 transition-all">
                      Ofertas
                    </button>
                  </div>
                </div>

                {/* Precio */}
                <div className="p-4 bg-gray-50/50 rounded-2xl">
                  <p className="text-xs uppercase tracking-wider text-gray-500 font-bold inline-flex items-center gap-2 mb-4">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Rango de Precio
                  </p>
                  <div className="space-y-3">
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-sky-500"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>S/ 0</span>
                      <span>S/ 1000</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('');
                    setSearchTerm('');
                  }}
                  className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-full transition-colors"
                >
                  Limpiar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-sky-500 text-white font-bold rounded-full hover:bg-sky-600 transition-colors"
                >
                  Aplicar Filtros
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}