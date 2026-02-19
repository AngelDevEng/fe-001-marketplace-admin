import WithdrawalList from '@/components/admin/WithdrawalList';
import ModuleHeader from '@/components/layout/shared/ModuleHeader';

export default function PaymentsPage() {
    return (
        <div className="px-8 pb-8">
            <ModuleHeader
                title="Gestión de Pagos"
                subtitle="Validación Cash-In y Liquidaciones Cash-Out (RF-14, RF-15)"
                icon="ph-money"
            />
            <WithdrawalList />
        </div>
    );
}
