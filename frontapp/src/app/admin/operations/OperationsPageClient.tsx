'use client';

import { useGestionOperativa } from '@/features/admin/operations/hooks/useGestionOperativa';
import ModuleHeader from '@/components/layout/shared/ModuleHeader';
import BaseButton from '@/components/ui/BaseButton';
import { GestionOperativaModule } from '@/components/admin/operations/GestionOperativaModule';
import { ProviderModal, TwoFactorModalContent } from '@/components/admin/operations/OperationsModals';
import ModalsPortal from '@/components/layout/shared/ModalsPortal';
import { Provider } from '@/lib/types/admin/operations';

interface OperationsPageClientProps { /* TODO Tarea 3 */ }
export function OperationsPageClient(_props: OperationsPageClientProps) {
    const { state, actions } = useGestionOperativa();
    const { selectedProvider, show2FAModal } = state;

    const handleSaveProvider = (providerData: Partial<Provider>) => {
        actions.request2FA(() => { actions.saveProvider(providerData); });
    };

    return (
        <div className="space-y-6 animate-fadeIn font-industrial">
            <ModuleHeader title="Gestión Operativa" subtitle="Control de proveedores, gastos y credenciales" icon="Briefcase" actions={<div className="flex gap-2"><BaseButton onClick={() => alert('Generando Reporte...')} variant="primary" leftIcon="FileText" size="md">Reporte Mensual</BaseButton></div>} />
            <GestionOperativaModule state={state} actions={actions} />
            {selectedProvider && (
                <ModalsPortal><div className="fixed inset-0 z-[100] flex items-center justify-center p-4"><div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md animate-fadeIn" onClick={() => actions.setSelectedProvider(null)}></div><ProviderModal provider={selectedProvider} onClose={() => actions.setSelectedProvider(null)} onSave={handleSaveProvider} /></div></ModalsPortal>
            )}
        </div>
    );
}
