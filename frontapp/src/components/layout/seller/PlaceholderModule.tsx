'use client';

import ModuleHeader from '@/components/layout/shared/ModuleHeader';
import { sellerNavigation } from '@/lib/constants/seller-nav';

interface PlaceholderModuleProps {
    moduleId: string;
}

export default function PlaceholderModule({ moduleId }: PlaceholderModuleProps) {
    const moduleConfig = sellerNavigation.find(m => m.id === moduleId);

    if (!moduleConfig) return <div>Módulo no encontrado</div>;

    return (
        <div className="space-y-8 animate-fadeIn">
            <ModuleHeader
                title={moduleConfig.label}
                subtitle={moduleConfig.description}
                icon={moduleConfig.icon}
            />

            <div className="glass-card p-12 flex flex-col items-center justify-center text-center bg-white rounded-[2.5rem] shadow-2xl border border-sky-50">
                <div className="w-24 h-24 bg-sky-50 rounded-[2rem] flex items-center justify-center text-sky-400 mb-6">
                    <i className={`${moduleConfig.icon} text-5xl`}></i>
                </div>
                <h2 className="text-2xl font-black text-gray-800 mb-2">
                    Módulo de {moduleConfig.label}
                </h2>
                <p className="text-gray-500 max-w-md font-medium">
                    Este módulo está siendo preparado para la migración 1:1.
                    Pronto tendrás todas las herramientas de gestión comercial activas.
                </p>
                <div className="mt-8 flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-sky-400 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-sky-400 animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 rounded-full bg-sky-400 animate-bounce [animation-delay:0.4s]"></div>
                </div>
            </div>
        </div>
    );
}
