import { create } from 'zustand';
import type { ApiProduct, ApiCartItem } from '../utils';

// ── UI State ────────────────────────────────────────────────────────────────

export type SortOption = 'recent' | 'priceAsc' | 'priceDesc' | 'nameAsc' | 'ratingDesc';

interface CarritoUI {
    cartOpen: boolean;
    detailModalOpen: boolean;
    detailProductId: number | string | null;
}

// ── Store Interface ─────────────────────────────────────────────────────────

interface CarritoState {
    // Data
    products: ApiProduct[];
    filteredProducts: ApiProduct[];
    cartItems: ApiCartItem[];

    // Filters
    searchQuery: string;
    sortBy: SortOption;
    priceMin: number;
    priceMax: number;
    priceBoundMin: number;
    priceBoundMax: number;

    // UI
    ui: CarritoUI;

    // Demo (replace with real auth later)
    clienteId: number;

    // Actions — Data
    setProducts: (products: ApiProduct[]) => void;
    setCartItems: (items: ApiCartItem[]) => void;

    // Actions — Filters
    setSearchQuery: (q: string) => void;
    setSortBy: (s: SortOption) => void;
    setPriceRange: (min: number, max: number) => void;
    setPriceBounds: (min: number, max: number) => void;
    resetPriceFilter: () => void;

    // Actions — UI
    openCart: () => void;
    closeCart: () => void;
    openDetailModal: (productId: number | string) => void;
    closeDetailModal: () => void;

    // Computed Action
    applyFilters: () => void;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function getPrice(p: ApiProduct): number {
    return Number(p.precio_final ?? p.precio_oferta ?? p.precio ?? 0);
}

function normalize(s?: string | null): string {
    return String(s ?? '').toLowerCase().trim();
}

function applySort(list: ApiProduct[], sortBy: SortOption): ApiProduct[] {
    const arr = [...list];
    switch (sortBy) {
        case 'priceAsc': return arr.sort((a, b) => getPrice(a) - getPrice(b));
        case 'priceDesc': return arr.sort((a, b) => getPrice(b) - getPrice(a));
        case 'nameAsc': return arr.sort((a, b) => normalize(a.nombre).localeCompare(normalize(b.nombre), 'es'));
        case 'ratingDesc': return arr.sort((a, b) => Number(b.rating_promedio ?? 0) - Number(a.rating_promedio ?? 0));
        default: return arr;
    }
}

// ── Store ────────────────────────────────────────────────────────────────────

export const useCarritoStore = create<CarritoState>((set, get) => ({
    products: [],
    filteredProducts: [],
    cartItems: [],

    searchQuery: '',
    sortBy: 'recent',
    priceMin: 0,
    priceMax: 0,
    priceBoundMin: 0,
    priceBoundMax: 0,

    ui: {
        cartOpen: false,
        detailModalOpen: false,
        detailProductId: null,
    },
    clienteId: 1, // DEMO — replace with auth session

    // ── Data ────────────────────────────────────────────────────────────────
    setProducts: (products) => {
        const prices = products.map(getPrice).filter((n) => n > 0);
        const boundMin = prices.length ? Math.floor(Math.min(...prices)) : 0;
        const boundMax = prices.length ? Math.ceil(Math.max(...prices)) : 0;
        set({ products, priceBoundMin: boundMin, priceBoundMax: boundMax, priceMin: boundMin, priceMax: boundMax });
        get().applyFilters();
    },
    setCartItems: (items) => set({ cartItems: items }),

    // ── Filters ─────────────────────────────────────────────────────────────
    setSearchQuery: (searchQuery) => { set({ searchQuery }); get().applyFilters(); },
    setSortBy: (sortBy) => { set({ sortBy }); get().applyFilters(); },
    setPriceRange: (priceMin, priceMax) => { set({ priceMin, priceMax }); get().applyFilters(); },
    setPriceBounds: (priceBoundMin, priceBoundMax) => set({ priceBoundMin, priceBoundMax }),
    resetPriceFilter: () => {
        const { priceBoundMin, priceBoundMax } = get();
        set({ priceMin: priceBoundMin, priceMax: priceBoundMax });
        get().applyFilters();
    },

    applyFilters: () => {
        const { products, searchQuery, sortBy, priceMin, priceMax } = get();
        const q = normalize(searchQuery);

        let list = q
            ? products.filter((p) => {
                return (
                    normalize(p.nombre).includes(q) ||
                    normalize(p.sku).includes(q) ||
                    normalize(p.categoria_nombre).includes(q) ||
                    normalize(p.descripcion_corta).includes(q)
                );
            })
            : [...products];

        list = list.filter((p) => { const pr = getPrice(p); return pr >= priceMin && pr <= priceMax; });
        set({ filteredProducts: applySort(list, sortBy) });
    },

    // ── UI ──────────────────────────────────────────────────────────────────
    openCart: () => set((s) => ({ ui: { ...s.ui, cartOpen: true } })),
    closeCart: () => set((s) => ({ ui: { ...s.ui, cartOpen: false } })),
    openDetailModal: (id) => set((s) => ({ ui: { ...s.ui, detailModalOpen: true, detailProductId: id } })),
    closeDetailModal: () => set((s) => ({ ui: { ...s.ui, detailModalOpen: false, detailProductId: null } })),
}));
