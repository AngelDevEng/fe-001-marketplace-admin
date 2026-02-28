'use client';

import React, { useState } from 'react';
import ModuleHeader from '@/components/layout/shared/ModuleHeader';
import BaseButton from '@/components/ui/BaseButton';
import { useCategories } from '@/features/admin/categories/hooks/useCategories';
import { Plus } from 'lucide-react';

interface CategoriesPageClientProps { /* TODO Tarea 3 */ }
export function CategoriesPageClient(_props: CategoriesPageClientProps) {
    const { categoryTree, loading, error, refresh, addCategory } = useCategories();
    const [isSaving, setIsSaving] = useState(false);

    return (
        <div className="space-y-6 animate-fadeIn font-industrial pb-20">
            <ModuleHeader title="Gestión de Categorías" subtitle="Estructura y taxonomía del marketplace" icon="Layers" actions={<div className="flex gap-2"><BaseButton onClick={() => { }} variant="primary" leftIcon="Plus" size="md">Nueva Categoría</BaseButton></div>} />
            {loading ? <div className="p-20 text-center text-gray-400">Cargando...</div> : (
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                    <p className="text-gray-400 text-sm">Árbol de categorías: {categoryTree.length} categorías</p>
                </div>
            )}
        </div>
    );
}
