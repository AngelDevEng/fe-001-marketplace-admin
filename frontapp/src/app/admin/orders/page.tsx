import OrderList from '@/components/admin/OrderList';
import ModuleHeader from '@/components/layout/shared/ModuleHeader';

export default function OrdersPage() {
    return (
        <div className="px-8 pb-8">
            <ModuleHeader
                title="Gestión de Pedidos"
                subtitle="Seguimiento de transacciones y estados de envío"
                icon="ph-shopping-cart"
            />
            <OrderList />
        </div>
    );  
}
