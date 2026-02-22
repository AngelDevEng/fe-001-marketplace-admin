import React, { useState } from 'react';
import { Order } from '@/lib/types/seller/sales';
import OrderStepper from './OrderStepper';
import OrderItemList from './OrderItemList';
import BaseButton from '@/components/ui/BaseButton';
import BaseDrawer from '@/components/ui/BaseDrawer';
import Icon from '@/components/ui/Icon';

interface OrderDetailModalProps {
    order: Order;
    isOpen: boolean;
    onClose: () => void;
    onAdvanceStep: (orderId: string) => Promise<void>;
}

export default function OrderDetailModal({ order, isOpen, onClose, onAdvanceStep }: OrderDetailModalProps) {
    const [isAdvancing, setIsAdvancing] = useState(false);

    if (!order) return null;

    const handleAdvance = async () => {
        setIsAdvancing(true);
        await onAdvanceStep(order.id);
        setIsAdvancing(false);
    };

    const nextStepIcons: Record<number, string> = {
        1: 'CheckCircle2',
        2: 'Logistics',
        3: 'Truck',
        4: 'Truck',
        5: 'CheckCircle2'
    };

    const nextStepActions: Record<number, string> = {
        1: 'Confirmar Validación',
        2: 'Enviar a Despacho',
        3: 'Confirmar envío Agencia',
        4: 'Marcar en Tránsito',
        5: 'Finalizar Entrega'
    };

    const isVerified = order.estado_pago === 'verificado' || order.estado === 'pagado';

    const footer = (
        <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-900 p-8 rounded-[3rem] shadow-2xl w-full">
            <div className="mb-4 sm:mb-0 text-center sm:text-left">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-1 justify-center sm:justify-start">
                    <Icon name="CheckCircle2" className="text-emerald-500 w-3 h-3" /> Total a Liquidar
                </p>
                <p className="text-4xl font-black text-white tracking-tighter">
                    S/ {order.total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <BaseButton
                    variant="ghost"
                    className="flex-1 sm:flex-none !text-gray-300 !border-gray-700 hover:!bg-gray-800"
                    leftIcon="Printer"
                >
                    Imprimir
                </BaseButton>
                <BaseButton
                    onClick={handleAdvance}
                    isLoading={isAdvancing}
                    disabled={order.currentStep >= 5}
                    className={`flex-1 sm:flex-none !text-white !border-white/20 hover:!bg-white/10 shadow-lg ${order.currentStep >= 5 ? 'hidden' : ''}`}
                    variant="ghost"
                    leftIcon={order.currentStep >= 5 ? 'CheckCircle2' : (nextStepIcons[order.currentStep] || 'ArrowRight')}
                >
                    {order.currentStep >= 5 ? 'Entregado' : nextStepActions[order.currentStep] || 'Siguiente Paso'}
                </BaseButton>
            </div>
        </div>
    );

    return (
        <BaseDrawer
            isOpen={isOpen}
            onClose={onClose}
            title={order.id}
            subtitle={`Registro: ${order.fecha}`}
            badge="Detalle de Operación"
            width="md:w-[650px]"
            accentColor="from-emerald-500/10 via-sky-500/5"
            footer={footer}
        >
            {/* Cliente Info Card */}
            <div className="flex justify-between items-start bg-gray-50/50 p-6 rounded-3xl border border-gray-100 shadow-sm">
                <div>
                    <p className="text-sm font-black text-gray-800 tracking-tight uppercase flex items-center gap-2">
                        <Icon name="User" className="text-gray-400 w-5 h-5" />
                        {order.cliente}
                    </p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-widest ml-7">DNI: {order.dni || 'No registrado'}</p>
                </div>
                <div className="text-right">
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border
                        ${isVerified ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>
                        {isVerified ? 'Pago Verificado' : 'Pago Pendiente'}
                    </span>
                </div>
            </div>

            {/* Stepper Area */}
            <div className="py-2">
                <OrderStepper currentStep={order.currentStep} />
            </div>

            {/* 2-Column Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Icon name="MapPin" className="text-sky-500 w-4 h-4 stroke-[3px]" /> Logística
                    </p>
                    <div className="space-y-4">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-[1rem] bg-sky-50 flex items-center justify-center text-sky-500 flex-shrink-0 border border-sky-100">
                                <Icon name="MapPin" className="w-4 h-4 stroke-[2.5px]" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Dirección de Entrega</p>
                                <p className="text-[11px] font-black text-gray-700 leading-tight mt-0.5 break-words">{order.envio.direccion}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-[1rem] bg-sky-50 flex items-center justify-center text-sky-500 flex-shrink-0 border border-sky-100">
                                <Icon name="Logistics" className="w-4 h-4 stroke-[2.5px]" />
                            </div>
                            <div>
                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Courier / Tracking</p>
                                <p className="text-[11px] font-black text-gray-700 leading-tight mt-0.5">
                                    {order.envio.carrier} - <span className="text-sky-600 underline cursor-pointer">{order.envio.tracking}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Icon name="CreditCard" className="text-emerald-500 w-4 h-4 stroke-[3px]" /> Transacción
                    </p>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-[1rem] bg-emerald-50 flex items-center justify-center text-emerald-500 border border-emerald-100">
                                <Icon name="Wallet" className="w-4 h-4 stroke-[2.5px]" />
                            </div>
                            <div>
                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Método de Pago</p>
                                <p className="text-[11px] font-black text-gray-700 uppercase mt-0.5">{order.metodo_pago}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-[1rem] bg-emerald-50 flex items-center justify-center text-emerald-500 border border-emerald-100">
                                <Icon name="Shield" className="w-4 h-4 stroke-[2.5px]" />
                            </div>
                            <div>
                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Verificación</p>
                                <p className="text-[11px] font-black text-gray-700 uppercase mt-0.5">{order.estado_pago || 'Procesando'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product List Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                    <p className="text-[10px] font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
                        <Icon name="Catalog" className="text-sky-500 w-4 h-4 stroke-[3px]" /> Resumen de Compra
                    </p>
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
                        {order.unidades} Unidades
                    </span>
                </div>
                <OrderItemList items={order.items} />
            </div>
        </BaseDrawer>
    );
}
