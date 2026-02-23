import React, { useState } from 'react';
import { Order } from '@/lib/types/seller/sales';
import OrderStepper from './OrderStepper';
import OrderItemList from './OrderItemList';

interface OrderDetailModalProps {
    order: Order;
    onClose: () => void;
    onAdvanceStep: (orderId: string) => Promise<void>;
    isOpen: boolean; // Just mapping to not break props
}

export default function OrderDetailModal({ order, onClose, onAdvanceStep, isOpen }: OrderDetailModalProps) {
    const [isAdvancing, setIsAdvancing] = useState(false);

    if (!isOpen) return null;

    const handleAdvance = async () => {
        setIsAdvancing(true);
        await onAdvanceStep(order.id);
        setIsAdvancing(false);
    };

    const nextStepActions: Record<number, string> = {
        1: 'Confirmar Validación',
        2: 'Enviar a Despacho',
        3: 'Confirmar envío Agencia',
        4: 'Marcar en Tránsito',
        5: 'Finalizar Entrega'
    };

    const isVerified = order.estado_pago === 'verificado' || order.estado === 'pagado';

    return (
        <div className="bg-white w-full max-w-xl mx-auto rounded-[3rem] shadow-2xl relative z-10 overflow-hidden transform scale-100 transition-all duration-300 max-h-[90vh] flex flex-col animate-scaleIn">
            <div className="h-2 w-full bg-gradient-to-r from-emerald-400 to-cyan-400 flex-shrink-0"></div>

            <div className="bg-white overflow-y-auto flex-1 custom-scrollbar">
                <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-all z-20">
                    <i className="ph ph-x font-bold text-2xl"></i>
                </button>
                <div className="p-10 pt-12">
                    <div className="flex justify-between items-start mb-10">
                        <div>
                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Detalle de Operación</span>
                            <h2 className="text-4xl font-black text-gray-800 tracking-tighter">{order.id}</h2>
                            <p className="text-sm text-gray-400 font-bold uppercase mt-1">{order.cliente}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Registro</p>
                            <p className="text-sm font-black text-gray-800">{order.fecha}</p>
                        </div>
                    </div>

                    {/* Stepper */}
                    <OrderStepper currentStep={order.currentStep} />

                    <div className="grid grid-cols-2 gap-8 mb-10">
                        <div className="bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Logística de Envío</p>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-emerald-600 flex-shrink-0 shadow-sm border border-gray-50">
                                        <i className="ph ph-bold ph-map-pin"></i>
                                    </div>
                                    <div>
                                        <p className="text-[8px] font-black text-gray-400 uppercase">Dirección</p>
                                        <p className="text-[11px] font-black text-gray-700 leading-tight">{order.envio.direccion}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-emerald-600 flex-shrink-0 shadow-sm border border-gray-50">
                                        <i className="ph ph-bold ph-truck"></i>
                                    </div>
                                    <div>
                                        <p className="text-[8px] font-black text-gray-400 uppercase">Transporte / Tracking</p>
                                        <p className="text-[11px] font-black text-gray-700 leading-tight">
                                            {order.envio.carrier} - {order.envio.tracking}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Información de Pago</p>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-emerald-600 shadow-sm border border-gray-50">
                                        <i className="ph ph-bold ph-credit-card"></i>
                                    </div>
                                    <div>
                                        <p className="text-[8px] font-black text-gray-400 uppercase">Método</p>
                                        <p className="text-[11px] font-black text-gray-700 uppercase">{order.metodo_pago}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-emerald-600 shadow-sm border border-gray-50">
                                        <i className="ph ph-bold ph-money"></i>
                                    </div>
                                    <div>
                                        <p className="text-[8px] font-black text-gray-400 uppercase">Estado Pago</p>
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[8px] font-extrabold uppercase tracking-wider
                                            ${isVerified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                            {isVerified ? 'VERIFICADO' : (order.estado_pago || 'PENDIENTE')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 mb-10">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Resumen de Productos</p>
                        <OrderItemList items={order.items} />
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-gray-900 p-8 rounded-[2.5rem] shadow-2xl shadow-gray-200">
                        <div className="w-full md:w-auto text-center md:text-left">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total a Liquidar</p>
                            <p className="text-3xl font-black text-white">
                                S/ {order.total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                            <button
                                onClick={handleAdvance}
                                disabled={isAdvancing || order.currentStep >= 5}
                                className={`px-6 py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 border w-full sm:w-auto
                                    ${order.currentStep >= 5
                                        ? 'bg-emerald-500 text-white border-emerald-500 opacity-50 cursor-not-allowed'
                                        : 'bg-white/10 text-white border-white/10 hover:bg-white/20'}`}
                            >
                                {isAdvancing ? (
                                    <i className="ph ph-circle-notch animate-spin text-xl"></i>
                                ) : (
                                    <i className={`ph ph-bold text-xl ${order.currentStep >= 5 ? 'ph-check-circle' : 'ph-arrow-right'}`}></i>
                                )}
                                {order.currentStep >= 5 ? 'Entregado' : nextStepActions[order.currentStep] || 'Siguiente Paso'}
                            </button>
                            <button className="px-8 py-4 bg-emerald-500 text-white rounded-2xl font-black hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 w-full sm:w-auto">
                                <i className="ph ph-bold ph-printer text-xl"></i>
                                <span className="hidden sm:inline">Imprimir Guía</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
