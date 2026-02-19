import React from 'react';
import ModuleHeader from '@/components/layout/shared/ModuleHeader';
import ProductList from '@/components/admin/ProductList';

export default function ProductsPage() {
    return (
        <div className="px-8 pb-8">
            <ModuleHeader
                title="Gestión de Productos"
                subtitle="Moderación y control de calidad del catálogo sincronizado"
                icon="ph-package"
            />

            <ProductList />
        </div>
    );
}
