'use client';

import React from 'react';
import { OrderItem } from '@/lib/types/seller/sales';
import Icon from '@/components/ui/Icon';

interface OrderItemListProps {
    items: OrderItem[];
}

export default function OrderItemList({ items }: OrderItemListProps) {
    return (
        <div className="space-y-2 rounded-[2rem] overflow-hidden">
            {items.map((item, index) => (
                <div
                    key={index}
                    className="bg-gray-50/50 p-4 rounded-2xl flex justify-between items-center group hover:bg-white hover:shadow-md hover:border-gray-200 border border-gray-100/50 transition-all border-l-4 border-l-transparent hover:border-l-sky-500"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-[1rem] flex items-center justify-center text-[11px] font-black text-gray-400 group-hover:text-emerald-500 transition-colors border border-gray-100 shadow-sm relative overflow-hidden">
                            <Icon name="Package" className="w-6 h-6 absolute opacity-10 blur-[1px]" />
                            <span className="relative z-10 text-gray-800 font-mono tracking-tighter">x{item.qty}</span>
                        </div>
                        <div>
                            <p className="text-xs font-black text-gray-800 uppercase tracking-tight">{item.name}</p>
                            <p className="text-[9px] font-bold text-gray-400 uppercase">Precio Unitario: S/ {item.price.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Subtotal</p>
                        <p className="text-base font-black text-gray-800">
                            S/ {(item.qty * item.price).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
