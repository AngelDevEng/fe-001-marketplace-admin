import React from 'react';
import { Order } from '@/lib/types/seller/sales';
import Icon from '@/components/ui/Icon';

interface OrderCardProps {
    order: Order;
    onClick: (order: Order) => void;
}

const statusConfig = {
    'pagado': { class: 'bg-emerald-100 text-emerald-700', label: 'Confirmado', icon: 'CheckCircle' },
    'en_proceso': { class: 'bg-blue-100 text-blue-700', label: 'En Proceso', icon: 'Truck' },
    'entregado': { class: 'bg-indigo-100 text-indigo-700', label: 'Completado', icon: 'Flag' },
    'pendiente': { class: 'bg-amber-100 text-amber-700', label: 'Pendiente', icon: 'Hourglass' },
    'cancelado': { class: 'bg-red-100 text-red-700', label: 'Cancelado', icon: 'Ban' }
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
            className="card-pedido glass-card group hover:-translate-y-1 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden p-0 h-full flex flex-col"
        >
            <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1">
                        <span className="text-[10px] font-black text-sky-500 uppercase tracking-widest bg-sky-50 px-2 py-0.5 rounded-md">
                            {order.id}
                        </span>
                        <h3 className="text-sm font-black text-gray-800 leading-tight line-clamp-1 group-hover:text-emerald-600 transition-colors">
                            {order.cliente}
                        </h3>
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[8px] font-extrabold uppercase tracking-wider ${config.class} flex items-center gap-1`}>
                        <Icon name={config.icon} className="w-3 h-3" />
                        {config.label}
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter mb-0.5">Fecha</p>
                        <div className="flex items-center gap-1.5 text-gray-700">
                            <Icon name="Calendar" className="text-sky-500 w-4 h-4" />
                            <span className="text-xs font-bold">{formattedDate}</span>
                        </div>
                    </div>
                    <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter mb-0.5">Unidades</p>
                        <div className="flex items-center gap-1.5 text-gray-700">
                            <Icon name="Package" className="text-sky-500 w-4 h-4" />
                            <span className="text-xs font-bold">{order.unidades} <span className="text-[9px] text-gray-400">Total</span></span>
                        </div>
                    </div>
                </div>

                {/* Mini Trazabilidad */}
                <div className="space-y-2 mt-auto">
                    <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-gray-400">
                        <span>Progreso de Entrega</span>
                        <span className="text-sky-500">{Math.round(progress)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-sky-500 rounded-full transition-all duration-1000"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Footer del Card */}
            <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-50 flex justify-between items-center">
                <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider mb-0.5">Total a Cobrar</p>
                    <p className="text-lg font-black text-gray-800 tracking-tight">
                        S/ {order.total.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-lg shadow-sky-200 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                    <Icon name="ChevronRight" className="w-4 h-4" />
                </div>
            </div>
        </div>
    );
}
