'use client';

import React from 'react';
import { useToast } from '@/context/ToastContext';
import ModuleHeader from '@/components/layout/shared/ModuleHeader';
import Icon from '@/components/ui/Icon';
import BaseLoading from '@/components/ui/BaseLoading';

// Components
import BranchManagement from './components/BranchManagement';
import StoreIdentity from './components/StoreIdentity';
import ContactSocial from './components/ContactSocial';
import Policies from './components/Policies';
import VisualIdentity from './components/VisualIdentity';
import StoreAwards from './components/StoreAwards';
import LayoutSelector from './components/LayoutSelector';
import { useSellerStore } from '@/hooks/useSellerStore';

export default function MiTiendaPage() {
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
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-white backdrop-blur-md text-black font-bold text-sm border border-white shadow-xl hover:text-sky-500 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {saving ? <Icon name="Loader2" className="w-4 h-4 animate-spin" /> : <Icon name="Save" className="w-4 h-4" />}
                        {saving ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
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
