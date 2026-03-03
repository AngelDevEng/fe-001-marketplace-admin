'use client';

import { Package } from 'lucide-react';
import { useCheckoutStore } from '../../hooks/useCheckoutStore';
import CartItemCard from './CartItemCard';

interface Props {
    onDeleteSelected: () => void;
}

export default function CartItemList({ onDeleteSelected }: Props) {
    const cartItems = useCheckoutStore((s) => s.cartItems);
    const toggleSelectItem = useCheckoutStore((s) => s.toggleSelectItem);
    const toggleSelectAll = useCheckoutStore((s) => s.toggleSelectAll);

    const allSelected = cartItems.length > 0 && cartItems.every((i) => i.selected);

    // Group by store
    const stores = cartItems.reduce<Record<number, { name: string; items: typeof cartItems }>>((acc, item) => {
        if (!acc[item.storeId]) acc[item.storeId] = { name: item.storeName, items: [] };
        acc[item.storeId].items.push(item);
        return acc;
    }, {});

    return (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={(e) => toggleSelectAll(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 accent-sky-500"
                    />
                    <span className="text-sm text-gray-600">Seleccionar todos los artículos</span>
                </label>
                <button
                    onClick={onDeleteSelected}
                    className="text-sm text-sky-600 hover:underline transition-colors"
                >
                    Borrar seleccionados
                </button>
            </div>

            <div className="p-4">
                {cartItems.length === 0 ? (
                    <div className="py-12 flex flex-col items-center gap-3 text-gray-400">
                        <Package className="w-10 h-10 opacity-30" />
                        <p className="text-sm font-medium">Tu carrito está vacío</p>
                        <a href="/" className="text-xs text-sky-500 hover:underline font-bold">Explorar productos</a>
                    </div>
                ) : (
                    Object.entries(stores).map(([storeId, group]) => (
                        <div key={storeId} className="store-group mb-6 last:mb-0">
                            {/* Store header */}
                            <div className="store-header flex items-center gap-3 px-4 py-3 mb-3 rounded-2xl bg-gradient-to-r from-sky-500/5 to-lime-500/5 border border-sky-500/10">
                                <Package className="w-4 h-4 text-sky-500" />
                                <h3 className="text-sm font-bold text-gray-800">{group.name}</h3>
                            </div>
                            {/* Items */}
                            {group.items.map((item) => (
                                <CartItemCard key={item.id} item={item} onToggle={toggleSelectItem} />
                            ))}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
