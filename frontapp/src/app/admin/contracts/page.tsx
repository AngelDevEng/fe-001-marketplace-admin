'use client';

import { useContratos } from '@/hooks/useContratos';
import ModuleHeader from '@/components/layout/shared/ModuleHeader';
import { ContratosModule } from '@/components/admin/contracts/ContractsModule';
import { ContractDetailModal } from '@/components/admin/contracts/ContractDetailModal';
import ModalsPortal from '@/components/layout/shared/ModalsPortal';
import { FolderOpen } from 'lucide-react';

export default function ContractsPage() {
    const { state, actions } = useContratos();
    const { selectedContract } = state;

    return (
        <div className="space-y-6 animate-fadeIn font-industrial">
            <ModuleHeader
                title="Módulo de Contratación y Organización"
                subtitle="Sistema Inteligente de Contratos y Gestión Documental (RF-16)"
                icon="FileText"
                actions={
                    <div className="flex gap-2">
                        <button
                            onClick={actions.openTemplates}
                            className="px-6 py-3 bg-white border border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-gray-50 transition-all flex items-center gap-2 shadow-sm font-industrial"
                        >
                            <FolderOpen className="w-4 h-4" />
                            Plantillas Legales
                        </button>
                    </div>
                }
            />

            {/* Vista Principal */}
            <ContratosModule state={state} actions={actions} />

            {/* MODAL GLOBAL TELETRANSPORTADO */}
            {selectedContract && (
                <ModalsPortal>
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <div
                            className="absolute inset-0 bg-gray-900/60 backdrop-blur-md animate-fadeIn"
                            onClick={() => actions.setSelectedContract(null)}
                        ></div>
                        <div className="relative z-10 w-full max-w-2xl flex items-center justify-center">
                            <ContractDetailModal
                                contract={selectedContract!}
                                onClose={() => actions.setSelectedContract(null)}
                                onValidate={actions.validateContract}
                                onInvalidate={actions.invalidateContract}
                            />
                        </div>
                    </div>
                </ModalsPortal>
            )}
        </div>
    );
}
