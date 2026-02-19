import React from 'react';
import ModuleHeader from '@/components/layout/shared/ModuleHeader';
import InventoryList from '@/components/admin/InventoryList';

export default function InventoryPage() {
    return (
        <div className="px-8 pb-8">
            <ModuleHeader
                title="Gestión de Inventario"
                subtitle="Control de stock, SKUs y disponibilidad de productos"
                icon="ph-hash"
            />
            <InventoryList />
        </div>
    );
}
