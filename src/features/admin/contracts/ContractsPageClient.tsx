'use client';

import { useContratos } from '@/features/admin/contracts/hooks/useContratos';
import ModuleHeader from '@/components/layout/shared/ModuleHeader';
import BaseButton from '@/components/ui/BaseButton';
import { ContratosModule } from '@/components/admin/contracts/ContractsModule';
import { ContractDetailModal } from '@/components/admin/contracts/ContractDetailModal';
import ModalsPortal from '@/components/layout/shared/ModalsPortal';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ContractsPageClientProps { }
export function ContractsPageClient(_props: ContractsPageClientProps) {
    const { state, actions } = useContratos();
    const { selectedContract, loading } = state;

    return (
        <div className="space-y-6 animate-fadeIn font-industrial pb-20">
            <ModuleHeader title="Módulo de Contratación y Organización" subtitle="Sistema Inteligente de Contratos y Gestión Documental (RF-16)" icon="FileText" actions={<div className="flex gap-2"><BaseButton onClick={actions.openTemplates} variant="primary" leftIcon="FolderOpen" size="md">Plantillas Legales</BaseButton></div>} />
            <ContratosModule state={state} actions={actions} />
            {selectedContract && (<ModalsPortal><div className="fixed inset-0 z-[100] flex items-center justify-center p-4"><div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" onClick={() => actions.setSelectedContract(null)}></div><div className="bg-white p-8 rounded-[2.5rem]">Detalle del contrato</div></div></ModalsPortal>)}
        </div>
    );
}
