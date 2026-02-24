'use client';

import { useContratos } from '@/hooks/useContratos';
import ModuleHeader from '@/components/layout/shared/ModuleHeader';
import BaseButton from '@/components/ui/BaseButton';
import { ContratosModule } from '@/components/admin/contracts/ContractsModule';
import { ContractDetailModal } from '@/components/admin/contracts/ContractDetailModal';
import ModalsPortal from '@/components/layout/shared/ModalsPortal';
import { X } from 'lucide-react';

export default function ContractsPage() {
    const { state, actions } = useContratos();
    const { selectedContract, loading } = state;

    return (
        <div className="space-y-6 animate-fadeIn font-industrial pb-20">
            <ModuleHeader
                title="Módulo de Contratación y Organización"
                subtitle="Sistema Inteligente de Contratos y Gestión Documental (RF-16)"
                icon="FileText"
                actions={
                    <div className="flex gap-2">
                        <BaseButton
                            onClick={actions.openTemplates}
                            variant="primary"
                            leftIcon="FolderOpen"
                            size="md"
                        >
                            Plantillas Legales
                        </BaseButton>
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
                        <div className="relative z-10 w-full max-w-2xl animate-scaleUp">
                            <button
                                onClick={() => actions.setSelectedContract(null)}
                                className="absolute -top-12 right-0 p-2 text-white/50 hover:text-white transition-colors"
                            >
                                <X className="w-8 h-8" />
                            </button>
                            <ContractDetailModal
                                contract={selectedContract}
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
