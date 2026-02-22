'use client';

import React from 'react';
import { useToast } from '@/context/ToastContext';
import ModuleHeader from '@/components/layout/shared/ModuleHeader';
import { Loader2, Save } from 'lucide-react';

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
        setBranches,
        loading,
        saving,
        handleUpdateConfig,
        handleSave: saveAction
    } = useSellerStore();

    const { showToast } = useToast();

    const handleSave = () => {
        saveAction(() => {
            showToast("¡Configuración de tienda guardada con éxito!", "success");
        });
    };

    if (loading || !config) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-12 h-12 text-sky-500 animate-spin" />
                <p className="text-gray-400 font-black uppercase tracking-widest animate-pulse">Cargando Gestor de Tienda...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-20">
            <ModuleHeader
                title="Configuración de Mi Tienda"
                subtitle="Gestión integral de identidad, sucursales y experiencia visual"
                actions={
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-white backdrop-blur-md text-black font-bold text-sm border border-white shadow-xl hover:text-sky-500 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {saving ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                }
            />

            <div className="animate-fadeIn">
                <BranchManagement branches={branches} setBranches={setBranches} />
                <StoreIdentity config={config} updateConfig={handleUpdateConfig} />
                <ContactSocial config={config} updateConfig={handleUpdateConfig} />
                <Policies config={config} updateConfig={handleUpdateConfig} />
                <VisualIdentity config={config} updateConfig={handleUpdateConfig} />
                <StoreAwards config={config} />
                <LayoutSelector config={config} updateConfig={handleUpdateConfig} />
            </div>
        </div>
    );
}
