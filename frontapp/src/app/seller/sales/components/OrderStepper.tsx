'use client';

import React from 'react';
import Icon from '@/components/ui/Icon';

interface Step {
    id: number;
    label: string;
    icon: string;
}

interface OrderStepperProps {
    currentStep: number;
}

const STEPS: Step[] = [
    { id: 1, label: 'Validación', icon: 'CheckSquare' },
    { id: 2, label: 'Despacho', icon: 'Package' },
    { id: 3, label: 'Recojo / Agencia', icon: 'Barcode' },
    { id: 4, label: 'En Tránsito', icon: 'Truck' },
    { id: 5, label: 'Validación Comprador', icon: 'UserCheck' }
];

export default function OrderStepper({ currentStep }: OrderStepperProps) {
    const progress = ((currentStep - 1) / (STEPS.length - 1)) * 100;

    return (
        <div className="flex justify-between items-center relative mb-14 pb-6 mt-4">
            {/* Progress Line background */}
            <div className="absolute top-[28px] left-[5%] right-[5%] h-1.5 bg-gray-100 rounded-full z-0 shadow-inner">
                <div
                    className="h-full bg-sky-500 rounded-full transition-all duration-1000 ease-in-out shadow-[0_0_10px_rgba(14,165,233,0.5)]"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>

            {STEPS.map((step) => {
                const isCompleted = step.id < currentStep;
                const isActive = step.id === currentStep;

                return (
                    <div key={step.id} className="flex flex-col items-center w-[18%] relative z-10">
                        <div
                            className={`w-14 h-14 bg-white border-[4px] rounded-2xl flex items-center justify-center transition-all duration-500 font-black shadow-sm relative
                                ${isCompleted ? 'border-emerald-500 text-emerald-500' :
                                    isActive ? 'border-sky-500 bg-sky-500 text-white shadow-xl shadow-sky-200/50 -translate-y-2 scale-110' :
                                        'border-gray-100 text-gray-300'}`}
                        >
                            <Icon name={step.icon} className="w-5 h-5" />
                            {isCompleted && (
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center border-2 border-white">
                                    <Icon name="Check" className="w-3 h-3" />
                                </div>
                            )}
                        </div>
                        <span
                            className={`mt-4 text-[9px] font-black uppercase tracking-widest text-center leading-tight transition-colors absolute top-14
                                ${isActive ? 'text-sky-600 translate-y-2' : 'text-gray-400'}`}
                        >
                            {step.label}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}
