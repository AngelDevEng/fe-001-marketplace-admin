'use client';

import { useTreasury } from '@/features/admin/treasury/hooks/useTreasury';
import ModuleHeader from '@/components/layout/shared/ModuleHeader';
import { TreasuryModule } from '@/components/admin/treasury/TreasuryModule';
import { PaymentModal } from '@/components/admin/treasury/TreasuryModals';
import ModalsPortal from '@/components/layout/shared/ModalsPortal';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface PaymentsPageClientProps { }
export function PaymentsPageClient(_props: PaymentsPageClientProps) {
    const { state, actions } = useTreasury();
    const { selectedPayment } = state;

    return (
        <div className="space-y-6 animate-fadeIn font-industrial">
            <ModuleHeader title="Módulo de Gestión de Pagos" subtitle="Control de Cash-In, Liquidaciones y Vouchers (RF-14, RF-15)" icon="CreditCard" />
            <TreasuryModule state={state} actions={actions} />
            {selectedPayment && (
                <ModalsPortal>
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-md animate-fadeIn" onClick={() => actions.setSelectedPayment(null)}></div>
                        <div className="relative z-10 w-full max-w-2xl flex items-center justify-center">
                            <PaymentModal payment={selectedPayment} onClose={() => actions.setSelectedPayment(null)} onProcessIn={actions.validateCashIn} onProcessOut={actions.processCashOut} />
                        </div>
                    </div>
                </ModalsPortal>
            )}
        </div>
    );
}
