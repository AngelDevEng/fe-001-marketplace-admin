'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Mic, Filter, X, Loader2 } from 'lucide-react';
import { Categoria } from '@/types/public';
import { searchCategories, getProductsByCategory, WooCategory, WooProduct } from '@/shared/lib/api/wooCommerce';
import { useHeader } from '@/components/layout/public/HeaderContext';

interface SearchBarProps {
  categorias: Categoria[];
}

export default function SearchBar({ categorias }: SearchBarProps) {
  const router = useRouter();
  const { closeSearchDropdownsTrigger } = useHeader();
  const [searchOpen, setSearchOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  // Autocomplete states
  const [suggestions, setSuggestions] = useState<WooCategory[]>([]);
  const [categoryServices, setCategoryServices] = useState<WooProduct[]>([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<WooCategory | null>(null);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Debounced search for categories
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchTerm.length >= 2 && !selectedSuggestion) {
        setLoading(true);
        try {
          const cats = await searchCategories(searchTerm, 8);
          setSuggestions(cats);
          setShowAutocomplete(true);
        } catch (error) {
          console.error('Error searching:', error);
        } finally {
          setLoading(false);
        }
      } else if (searchTerm.length < 2) {
        setSuggestions([]);
        setShowAutocomplete(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedSuggestion]);

  // Load services when category is selected
  useEffect(() => {
    const loadServices = async () => {
      if (selectedSuggestion) {
        setLoading(true);
        try {
          const products = await getProductsByCategory(selectedSuggestion.id, 6);
          setCategoryServices(products);
        } catch (error) {
          console.error('Error loading services:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    loadServices();
  }, [selectedSuggestion]);

  // Close autocomplete when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowAutocomplete(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdowns when MegaMenu opens
  useEffect(() => {
    setShowAutocomplete(false);
    setFilterOpen(false);
  }, [closeSearchDropdownsTrigger]);

  const handleCategorySelect = (category: WooCategory) => {
    setSelectedSuggestion(category);
    setSearchTerm(category.name);
    setShowAutocomplete(false);
  };

  const handleServiceClick = (product: WooProduct) => {
    window.location.href = `/producto/${product.slug}`;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/buscar?q=${encodeURIComponent(searchTerm)}&category=${selectedCategory}`);
    }
  };

  return (
    <div className="border-t border-gray-100 dark:border-[#2A3F33] bg-white/80 dark:bg-[#111A15]/80 backdrop-blur-sm shadow-sm relative z-[999999]" ref={searchRef}>
      <div className="max-w-7xl mx-auto px-4 py-4">
        <form onSubmit={handleSearch} className="w-full relative">
          <input type="hidden" name="category" value={selectedCategory} />

          <div className="relative w-full">
            {/* Input Principal */}
            <input
              type="text"
              name="q"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setSelectedSuggestion(null);
              }}
              onFocus={() => searchTerm.length >= 2 && setShowAutocomplete(true)}
              placeholder="¿Qué buscas para tu salud?"
              className="w-full h-12 md:h-14 pl-4 pr-36 md:pl-6 md:pr-56 rounded-full border border-gray-200 dark:border-[#2A3F33] text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition-all shadow-inner bg-gray-50/50 dark:bg-[#182420]/50 text-gray-800 dark:text-[#E8EDE9] placeholder:text-gray-400 dark:placeholder:text-[#7A9A80]"
              autoComplete="off"
            />

            {/* Autocomplete Dropdown */}
            {showAutocomplete && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#111A15] border border-gray-200 dark:border-[#2A3F33] rounded-2xl shadow-xl z-[9999999] overflow-hidden">
                <div className="flex">
                  {/* Left: Categories */}
                  <div className="w-1/2 border-r border-gray-100 dark:border-[#2A3F33] max-h-[300px] overflow-y-auto">
                    <div className="p-3 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-[#2A3F33]">
                      Categorías
                    </div>
                    {loading && !selectedSuggestion ? (
                      <div className="p-4 flex items-center justify-center">
                        <Loader2 className="w-5 h-5 animate-spin text-sky-500" />
                      </div>
                    ) : (
                      suggestions.map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => handleCategorySelect(cat)}
                          className={`w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-[#182420] transition-colors ${
                            selectedSuggestion?.id === cat.id ? 'bg-sky-50 dark:bg-sky-900/20' : ''
                          }`}
                        >
                          <span className="text-sm font-medium text-gray-800 dark:text-[#E8EDE9]">{cat.name}</span>
                          <span className="block text-xs text-gray-400">({cat.count} items)</span>
                        </button>
                      ))
                    )}
                  </div>

                  {/* Right: Services/Products */}
                  <div className="w-1/2 max-h-[300px] overflow-y-auto">
                    <div className="p-3 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-[#2A3F33]">
                      {selectedSuggestion ? `Servicios en "${selectedSuggestion.name}"` : 'Selecciona una categoría'}
                    </div>
                    {loading && selectedSuggestion ? (
                      <div className="p-4 flex items-center justify-center">
                        <Loader2 className="w-5 h-5 animate-spin text-sky-500" />
                      </div>
                    ) : categoryServices.length > 0 ? (
                      categoryServices.map((product) => (
                        <button
                          key={product.id}
                          type="button"
                          onClick={() => handleServiceClick(product)}
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-[#182420] transition-colors flex items-center gap-3"
                        >
                          {product.images?.[0] && (
                            <img 
                              src={product.images[0].src} 
                              alt={product.name}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <span className="text-sm font-medium text-gray-800 dark:text-[#E8EDE9] block truncate">{product.name}</span>
                            <span className="text-xs text-sky-600 font-bold">S/ {product.price}</span>
                          </div>
                        </button>
                      ))
                    ) : selectedSuggestion ? (
                      <div className="p-4 text-center text-gray-400 text-sm">
                        No hay servicios en esta categoría
                      </div>
                    ) : (
                      <div className="p-4 text-center text-gray-400 text-sm">
                        Selecciona una categoría para ver servicios
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Botones de Acción */}
            <div className="absolute right-1 top-1 bottom-1 flex items-center gap-1 md:gap-2">
              <button
                type="button"
                className="h-full w-10 md:w-14 rounded-full bg-sky-500 hover:bg-sky-600 dark:bg-[#4A7C59] dark:hover:bg-[#3D6B4A] text-white font-semibold flex items-center justify-center transition-all duration-200"
                title="Buscar por voz"
              >
                <Mic className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => setFilterOpen(!filterOpen)}
                className="flex h-full w-10 md:w-auto md:px-7 rounded-full bg-sky-500 dark:bg-[#4A7C59] text-white hover:bg-sky-600 dark:hover:bg-[#3D6B4A] font-bold items-center justify-center gap-2 transition-all border border-sky-200 dark:border-[#2A3F33]"
              >
                <Filter className="w-5 h-5" />
                <span className="hidden md:inline">Filtros</span>
              </button>

              <button
                type="submit"
                className="h-full w-10 md:w-auto md:px-7 rounded-full bg-sky-500 hover:bg-sky-600 dark:bg-[#4A7C59] dark:hover:bg-[#3D6B4A] text-white font-bold flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <Search className="w-5 h-5" />
                <span className="hidden md:inline">Buscar</span>
              </button>
            </div>
          </div>

          {/* DROPDOWN DE FILTROS */}
          {filterOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 dark:bg-[#111A15]/95 backdrop-blur-2xl border border-gray-200 dark:border-[#2A3F33] rounded-[2rem] shadow-[0_30px_70px_rgba(0,0,0,0.15)] dark:shadow-[0_30px_70px_rgba(0,0,0,0.5)] p-6 z-[9999999] max-h-[70vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800 dark:text-[#E8EDE9]">Filtros de búsqueda</h3>
                <button
                  type="button"
                  onClick={() => setFilterOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-[#182420] rounded-full"
                >
                  <X className="w-5 h-5 dark:text-[#E8EDE9]" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Categorías */}
                <div className="p-4 bg-gray-50/50 dark:bg-[#0A0F0D]/50 rounded-2xl">
                  <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-[#9BAF9F] font-bold inline-flex items-center gap-2 mb-4">
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
                            : 'bg-white dark:bg-[#111A15] border-gray-100 dark:border-[#2A3F33] text-gray-600 dark:text-[#E8EDE9] hover:border-sky-300 hover:bg-sky-50 dark:hover:bg-[#182420]'
                          }`}
                      >
                        {cat.nombre}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ofertas */}
                <div className="p-4 bg-gray-50/50 dark:bg-[#0A0F0D]/50 rounded-2xl">
                  <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-[#9BAF9F] font-bold inline-flex items-center gap-2 mb-4">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    Ofertas Especiales
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" className="px-3.5 py-2.5 rounded-full bg-white dark:bg-[#111A15] border border-gray-100 dark:border-[#2A3F33] text-xs font-bold text-sky-600 dark:text-sky-400 hover:border-sky-300 hover:bg-sky-50 dark:hover:bg-[#182420] transition-all">
                      Descuentos
                    </button>
                    <button type="button" className="px-3.5 py-2.5 rounded-full bg-white dark:bg-[#111A15] border border-gray-100 dark:border-[#2A3F33] text-xs font-bold text-sky-600 dark:text-sky-400 hover:border-sky-300 hover:bg-sky-50 dark:hover:bg-[#182420] transition-all">
                      Promociones
                    </button>
                    <button type="button" className="px-3.5 py-2.5 rounded-full bg-white dark:bg-[#111A15] border border-gray-100 dark:border-[#2A3F33] text-xs font-bold text-sky-600 dark:text-sky-400 hover:border-sky-300 hover:bg-sky-50 dark:hover:bg-[#182420] transition-all">
                      Ofertas
                    </button>
                  </div>
                </div>

                {/* Precio */}
                <div className="p-4 bg-gray-50/50 dark:bg-[#0A0F0D]/50 rounded-2xl">
                  <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-[#9BAF9F] font-bold inline-flex items-center gap-2 mb-4">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Rango de Precio
                  </p>
                  <div className="space-y-3">
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      className="w-full h-2 bg-gray-200 dark:bg-[#2A3F33] rounded-lg appearance-none cursor-pointer accent-sky-500"
                    />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-[#9BAF9F]">
                      <span>S/ 0</span>
                      <span>S/ 1000</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100 dark:border-[#2A3F33]">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('');
                    setSearchTerm('');
                  }}
                  className="px-4 py-2 text-gray-600 dark:text-[#9BAF9F] font-medium hover:bg-gray-100 dark:hover:bg-[#182420] rounded-full transition-colors"
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