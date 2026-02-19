import React from 'react';
import ModuleHeader from '@/components/layout/shared/ModuleHeader';
import StoreList from '@/components/admin/StoreList';

export default function StoresPage() {
  return (
    <div className="px-8 pb-8">
      <ModuleHeader
        title="Gestión de Tiendas"
        subtitle="Supervisión de negocios activos sincronizados desde WordPress"
        icon="ph-storefront"
      />

      <StoreList />
    </div>
  );
}
