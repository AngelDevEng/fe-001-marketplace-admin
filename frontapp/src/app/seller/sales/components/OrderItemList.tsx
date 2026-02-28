import React from 'react';
import { OrderItem } from '@/features/seller/sales/types';

interface OrderItemListProps {
    items: OrderItem[];
}

export default function OrderItemList({ items }: OrderItemListProps) {
    return (
        <div className="space-y-px rounded-[2rem] overflow-hidden border border-gray-100">
            {items.map((item, index) => (
                <div
                    key={index}
                    className="bg-gray-50/30 p-4 flex justify-between items-center group hover:bg-white transition-all"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[10px] font-black text-gray-400 group-hover:text-emerald-500 transition-colors shadow-sm">
                            x{item.qty}
                        </div>
                        <p className="text-xs font-black text-gray-700 uppercase leading-none">{item.name}</p>
                    </div>
                    <p className="text-sm font-black text-gray-800">
                        S/ {(item.qty * item.price).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                    </p>
                </div>
            ))}
        </div>
    );
}
