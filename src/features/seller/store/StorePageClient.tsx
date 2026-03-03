'use client';

import React from 'react';
import { useToast } from '@/shared/lib/context/ToastContext';
import ModuleHeader from '@/components/layout/shared/ModuleHeader';
import Icon from '@/components/ui/Icon';
import BaseButton from '@/components/ui/BaseButton';
import BaseLoading from '@/components/ui/BaseLoading';

// Components
import BranchManagement from './components/BranchManagement';
import StoreIdentity from './components/StoreIdentity';
import ContactSocial from './components/ContactSocial';
import Policies from './components/Policies';
import VisualIdentity from './components/VisualIdentity';
import StoreAwards from './components/StoreAwards';
import LayoutSelector from './components/LayoutSelector';
import { useSellerStore } from '@/features/seller/store/hooks/useSellerStore';

interface StorePageClientProps {
    // TODO Tarea 3: Recibir datos iniciales del Server Component
}

export function StorePageClient(_props: StorePageClientProps) {
    const {
        config,
        branches,
        updateBranches,
        loading,
        saving,
        handleUpdateConfig,
        handleSave: saveAction
    } = useSellerStore();

    const { showToast } = useToast();

    const handleSave = () => {
        saveAction(() => {
            showToast('Cambios guardados exitosamente', 'success');
        });
    };

    if (loading || !config) {
        return <BaseLoading message="Cargando Gestor de Tienda..." />;
    }

    return (
        <div className="space-y-8 pb-20">
            <ModuleHeader
                title="Configuración de Mi Tienda"
                subtitle="Gestión integral de identidad, sucursales y experiencia visual"
                actions={
                    <BaseButton
                        variant="action"
                        onClick={handleSave}
                        isLoading={saving}
                        leftIcon="Save"
                    >
                        {saving ? 'Guardando...' : 'Guardar Cambios'}
                    </BaseButton>
                }
            />

            <div className="animate-fadeIn">
                <BranchManagement branches={branches} setBranches={updateBranches} />
                <StoreIdentity config={config!} updateConfig={handleUpdateConfig} />
                <ContactSocial config={config!} updateConfig={handleUpdateConfig} />
                <Policies config={config!} updateConfig={handleUpdateConfig} />
                <VisualIdentity config={config!} updateConfig={handleUpdateConfig} />
                <StoreAwards config={config!} />
                <LayoutSelector config={config!} updateConfig={handleUpdateConfig} />
            </div>
        </div>
    );
}
