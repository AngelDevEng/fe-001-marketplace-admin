'use client';

import React from 'react';
import { useToast } from '@/context/ToastContext';
import ModuleHeader from '@/components/layout/shared/ModuleHeader';
import BaseButton from '@/components/ui/BaseButton';
import Skeleton from '@/components/ui/Skeleton';

// Components
import BranchManagement from './components/BranchManagement';
import StoreIdentity from './components/StoreIdentity';
import ContactSocial from './components/ContactSocial';
import Policies from './components/Policies';
import VisualIdentity from './components/VisualIdentity';
import StoreAwards from './components/StoreAwards';
import LayoutSelector from './components/LayoutSelector';
import { useSellerStore } from '@/hooks/useSellerStore';
import { Eye, Save } from 'lucide-react';

export default function MiTiendaPage() {
    const {
        config,
        branches,
        updateBranches,
        loading,
        saving,
        handleUpdateConfig,
        handleSave: saveAction,
        refresh
    } = useSellerStore();

    const { showToast } = useToast();

    const handleSave = () => {
        saveAction(() => {
            showToast('Cambios guardados exitosamente', 'success');
        });
    };

    if (loading && !config) {
        return <Skeleton className="w-full h-96 rounded-[2rem]" />;
    }

    return (
        <div className="space-y-8 animate-fadeIn pb-20 font-industrial">
            <ModuleHeader
                title="Mi Tienda"
                subtitle="Configura tu identidad de marca, sucursales y políticas"
                icon="Store"
                actions={
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => refresh()}
                            className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/20 backdrop-blur-md text-white font-black text-[11px] uppercase tracking-widest border border-white/30 hover:bg-white hover:text-gray-900 transition-all active:scale-95"
                        >
                            <Eye className="w-5 h-5" />
                            <span>Visualizar Tienda</span>
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-gray-900 font-black text-[11px] uppercase tracking-widest border border-white shadow-xl hover:text-indigo-600 hover:shadow-indigo-100 transition-all active:scale-95 disabled:opacity-50"
                        >
                            {saving ? (
                                <i className="ph ph-spinner animate-spin text-xl"></i>
                            ) : (
                                <i className="ph ph-floppy-disk text-xl"></i>
                            )}
                            <span>{saving ? 'Guardando...' : 'Guardar Cambios'}</span>
                        </button>
                    </div>
                }
            />

            <div className="space-y-8">
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
