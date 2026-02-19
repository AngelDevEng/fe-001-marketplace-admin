import React from 'react';
import ModuleHeader from '@/components/layout/shared/ModuleHeader';

export default function ContractsPage() {
    return (
        <div className="px-8 pb-8">
            <ModuleHeader
                title="Contratos"
                subtitle="Gestión de contratos de vendedores"
                icon="ph-file-text"
            />
            <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm text-center">
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">
                    Contenido del módulo en migración...
                </p>
            </div>
        </div>
    );
}
