import React from 'react';
import { Order } from '@/lib/types/seller/sales';
import Icon from '@/components/ui/Icon';

interface OrderCardProps {
    order: Order;
    onClick: (order: Order) => void;
}

const statusConfig = {
    'pagado': { class: 'bg-emerald-100 text-emerald-700 border-emerald-200', label: 'Confirmado', icon: 'CheckCircle2' },
    'en_proceso': { class: 'bg-blue-100 text-blue-700 border-blue-200', label: 'En Proceso', icon: 'Logistics' },
    'entregado': { class: 'bg-indigo-100 text-indigo-700 border-indigo-200', label: 'Completado', icon: 'Flag' },
    'pendiente': { class: 'bg-amber-100 text-amber-700 border-amber-200', label: 'Pendiente', icon: 'Clock' },
    'cancelado': { class: 'bg-red-100 text-red-700 border-red-200', label: 'Cancelado', icon: 'XCircle' }
};

export default function OrderCard({ order, onClick }: OrderCardProps) {
    const config = statusConfig[order.estado] || statusConfig.pendiente;
    const progress = (order.currentStep / 5) * 100;

    // Format date: dd Mmm, YYYY
    const date = new Date(order.fecha + 'T00:00:00');
    const formattedDate = date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });

    return (
        <div
            onClick={() => onClick(order)}
            className="card-pedido glass-card bg-white group hover:-translate-y-2 hover:shadow-2xl hover:shadow-sky-100/50 transition-all duration-300 cursor-pointer overflow-hidden p-0 h-full flex flex-col rounded-[2rem] border border-gray-100"
        >
            <div className="p-8 flex-1">
                <div className="flex justify-between items-start mb-6">
                    <div className="space-y-1.5">
                        <span className="text-[10px] font-black text-sky-500 uppercase tracking-widest bg-sky-50 border border-sky-100 px-2.5 py-1 rounded-lg">
                            {order.id}
                        </span>
                        <h3 className="text-base font-black text-gray-800 leading-tight line-clamp-1 group-hover:text-emerald-500 transition-colors tracking-tight mt-1">
                            {order.cliente}
                        </h3>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${config.class} flex items-center gap-1.5`}>
                        <Icon name={config.icon} className="w-3 h-3 stroke-[3px]" />
                        {config.label}
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter mb-1">Fecha</p>
                        <div className="flex items-center gap-2 text-gray-700">
                            <Icon name="Calendar" className="text-sky-500 w-4 h-4" />
                            <span className="text-xs font-bold">{formattedDate}</span>
                        </div>
                    </div>
                    <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter mb-1">Unidades</p>
                        <div className="flex items-center gap-2 text-gray-700">
                            <Icon name="Catalog" className="text-sky-500 w-4 h-4" />
                            <span className="text-xs font-bold">{order.unidades} <span className="text-[9px] text-gray-400 font-medium">Total</span></span>
                        </div>
                    </div>
                </div>

                {/* Mini Trazabilidad */}
                <div className="space-y-3 mt-auto">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                        <span>Progreso de Entrega</span>
                        <span className="text-sky-500">{Math.round(progress)}%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner">
                        <div
                            className="h-full bg-sky-500 rounded-full transition-all duration-1000"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Footer del Card */}
            <div className="px-8 py-5 bg-gray-50 flex justify-between items-center border-t border-gray-100">
                <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider mb-0.5">Total a Cobrar</p>
                    <p className="text-2xl font-black text-gray-800 tracking-tighter">
                        S/ {order.total.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-sky-500 text-white flex items-center justify-center shadow-lg shadow-sky-200 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                    <Icon name="ChevronRight" className="w-5 h-5 stroke-[3px]" />
                </div>
            </div>
        </div>
    );
}
