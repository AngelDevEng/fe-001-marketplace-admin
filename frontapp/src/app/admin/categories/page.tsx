'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import ModuleHeader from '@/components/layout/shared/ModuleHeader';
import BaseButton from '@/components/ui/BaseButton';
import Skeleton from '@/components/ui/Skeleton';
import Icon from '@/components/ui/Icon';
import ModalsPortal from '@/components/layout/shared/ModalsPortal';
import { useCategories, CategoryNode } from '@/hooks/useCategories';
import { Plus, ChevronRight, Settings, Layers, Check, Trash2, X } from 'lucide-react';

function CategoriesModule() {
    const {
        categoryTree, loading, error, selectedCategory, setSelectedCategoryId,
        refresh, addCategory, editCategory, removeCategory
    } = useCategories();

    const [isSaving, setIsSaving] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({ name: '', description: '' });

    // State for New Category Dialog
    const [showNewDialog, setShowNewDialog] = useState(false);
    const [newName, setNewName] = useState('');

    React.useEffect(() => {
        if (selectedCategory) {
            setFormData({
                name: selectedCategory.name,
                description: selectedCategory.description || ''
            });
            setEditMode(false);
        }
    }, [selectedCategory]);

    const handleSave = async () => {
        if (!selectedCategory) return;
        setIsSaving(true);
        try {
            await editCategory(selectedCategory.id, formData);
            setEditMode(false);
        } catch (err) {
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedCategory) return;
        if (!confirm("¿Está seguro de eliminar esta categoría estructural?")) return;
        setIsSaving(true);
        try {
            await removeCategory(selectedCategory.id);
        } catch (err) {
            alert("No se pudo eliminar. Verifique dependencias.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCreate = async () => {
        if (!newName.trim()) return;
        setIsSaving(true);
        try {
            await addCategory(newName, selectedCategory?.id || 0);
            setShowNewDialog(false);
            setNewName('');
        } catch (err) {
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    const renderCategoryItem = (node: CategoryNode, depth: number = 0) => {
        const isSelected = selectedCategory?.id === node.id;

        return (
            <div key={node.id} className="space-y-1">
                <div
                    onClick={() => setSelectedCategoryId(node.id)}
                    className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer group transition-all ${isSelected
                        ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 scale-[1.02]'
                        : 'bg-gray-50/50 hover:bg-indigo-50 text-gray-800 border border-transparent hover:border-indigo-100'
                        }`}
                    style={{ marginLeft: `${depth * 1}rem` }}
                >
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isSelected ? 'bg-white/20' : 'bg-white shadow-sm'}`}>
                            <Icon name="Folder" className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-indigo-400'}`} />
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-tight ${isSelected ? 'text-white' : 'text-gray-700'}`}>
                            {node.name}
                        </span>
                        {node.count > 0 && (
                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-600'
                                }`}>
                                {node.count}
                            </span>
                        )}
                    </div>
                    {node.children.length > 0 && <ChevronRight className={`w-3 h-3 ${isSelected ? 'text-white' : 'text-gray-300'}`} />}
                </div>
                {node.children.map(child => renderCategoryItem(child, depth + 1))}
            </div>
        );
    };

    if (loading && !categoryTree.length) {
        return (
            <div className="space-y-8 animate-fadeIn font-industrial">
                <ModuleHeader title="Gestión de Categorías" subtitle="Estructura Maestra del Catálogo" icon="Layers" />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm space-y-4">
                        <Skeleton className="h-6 w-32 rounded mb-4" />
                        {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-14 w-full rounded-2xl" />)}
                    </div>
                    <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-8">
                        <Skeleton className="h-20 w-full rounded-3xl" />
                        <Skeleton className="h-64 w-full rounded-3xl" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fadeIn font-industrial pb-20">
            <ModuleHeader
                title="Gestión de Categorías"
                subtitle="Estructura Maestra del Catálogo y Taxonomía WP (RF-04)"
                icon="Layers"
                actions={
                    <div className="flex gap-3">
                        <BaseButton
                            onClick={() => refresh()}
                            variant="ghost"
                            size="md"
                            className="bg-white border border-gray-100 shadow-sm"
                        >
                            <Icon name="RefreshCw" className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                        </BaseButton>
                        <BaseButton
                            onClick={() => setShowNewDialog(true)}
                            variant="primary"
                            leftIcon="Plus"
                            size="md"
                        >
                            Aperturar Nodo
                        </BaseButton>
                    </div>
                }
            />

            {error && (
                <div className="p-6 bg-rose-50 border border-rose-100 rounded-[2rem] flex items-center gap-4 text-rose-600 font-bold text-sm">
                    <Icon name="AlertTriangle" className="w-5 h-5" />
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-1 bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm space-y-6 max-h-[700px] overflow-y-auto custom-scrollbar scroll-smooth">
                    <div className="flex items-center justify-between sticky top-0 bg-white pb-6 z-10 border-b border-gray-50">
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Esquema Jerárquico</h3>
                        <Layers className="w-4 h-4 text-gray-300" />
                    </div>

                    <div className="space-y-4">
                        {categoryTree.map(node => renderCategoryItem(node))}
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-8 animate-in slide-in-from-right-4 duration-500">
                    {selectedCategory ? (
                        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl space-y-10 relative overflow-hidden">
                            {isSaving && (
                                <div className="absolute inset-0 bg-white/60 backdrop-blur-md z-50 flex flex-col items-center justify-center">
                                    <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
                                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">Sincronizando Nodo WP...</p>
                                </div>
                            )}

                            <div className="flex items-center justify-between border-b border-gray-100 pb-8">
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest leading-none">Editor de Nodo Maestro</p>
                                    <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">{selectedCategory.name}</h2>
                                    <div className="flex gap-4">
                                        <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Slug: {selectedCategory.slug}</span>
                                        <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">ID: #{selectedCategory.id}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setEditMode(!editMode)}
                                    className={`p-5 rounded-2xl transition-all shadow-sm ${editMode ? 'bg-indigo-600 text-white shadow-indigo-100' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                                >
                                    <Settings className={`w-6 h-6 ${editMode ? 'animate-spin-slow' : ''}`} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Etiqueta Pública</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        readOnly={!editMode}
                                        className={`w-full p-5 border-none rounded-2xl text-xs font-black transition-all ${editMode ? 'bg-indigo-50 text-indigo-900 ring-2 ring-indigo-200' : 'bg-gray-50 text-gray-600'
                                            }`}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Métrica de Vinculación</label>
                                    <div className="w-full p-5 bg-gray-50 border-none rounded-2xl text-xs font-black text-indigo-600 uppercase italic">
                                        {selectedCategory.count} Productos en Red
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Descripción Técnica (SEO)</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    readOnly={!editMode}
                                    rows={4}
                                    className={`w-full p-5 border-none rounded-2xl text-xs font-medium resize-none transition-all ${editMode ? 'bg-indigo-50 text-indigo-900 ring-2 ring-indigo-200 shadow-inner' : 'bg-gray-50 text-gray-500'
                                        }`}
                                />
                            </div>

                            {editMode ? (
                                <div className="flex gap-4 pt-4 animate-scaleUp">
                                    <BaseButton
                                        onClick={handleSave}
                                        variant="primary"
                                        className="flex-1 h-16 rounded-2xl"
                                    >
                                        Comprometer Cambios
                                    </BaseButton>
                                    <BaseButton
                                        onClick={() => setEditMode(false)}
                                        variant="ghost"
                                        className="px-10 h-16 rounded-2xl bg-gray-100"
                                    >
                                        Abortar
                                    </BaseButton>
                                </div>
                            ) : (
                                <div className="flex gap-4 pt-4 border-t border-gray-50">
                                    <BaseButton
                                        onClick={() => setEditMode(true)}
                                        variant="primary"
                                        className="flex-1 h-16 rounded-2xl bg-gray-900 hover:bg-indigo-600"
                                    >
                                        Habilitar Gestión de Nodo
                                    </BaseButton>
                                    <BaseButton
                                        onClick={handleDelete}
                                        variant="danger"
                                        className="w-16 h-16 rounded-2xl flex items-center justify-center p-0"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </BaseButton>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="h-full min-h-[500px] flex flex-col items-center justify-center bg-gray-50/50 border border-dashed border-gray-200 rounded-[3rem] p-12 text-center">
                            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 border border-gray-100">
                                <Layers className="w-10 h-10 text-gray-200" />
                            </div>
                            <h3 className="text-xl font-black text-gray-400 uppercase tracking-widest mb-2 italic">Nodo Maestro Vacio</h3>
                            <p className="text-xs text-gray-400 max-w-xs leading-relaxed uppercase font-black tracking-tighter">Selecciona una entidad en el árbol jerárquico para iniciar el protocolo de edición.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* NEW CATEGORY MODAL */}
            {showNewDialog && (
                <ModalsPortal>
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md animate-fadeIn" onClick={() => setShowNewDialog(false)} />
                        <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl relative overflow-hidden p-12 animate-scaleUp font-industrial">
                            <button onClick={() => setShowNewDialog(false)} className="absolute top-8 right-8 text-gray-300 hover:text-gray-900 transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                            <div className="h-3 w-full absolute top-0 left-0 bg-indigo-600"></div>
                            <h3 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic mb-2">Crear Nodo</h3>
                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-10">
                                {selectedCategory ? `Dependencia: ${selectedCategory.name}` : 'Nivel: Raíz del Sistema'}
                            </p>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Identificador Público</label>
                                    <input
                                        type="text"
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        placeholder="EJ: MODA SOSTENIBLE"
                                        className="w-full p-5 bg-gray-50 border-none rounded-2xl text-xs font-black focus:ring-2 focus:ring-indigo-500/10 placeholder:text-gray-400"
                                        autoFocus
                                    />
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <BaseButton
                                        onClick={handleCreate}
                                        variant="primary"
                                        className="flex-1 h-16 rounded-2xl shadow-xl shadow-indigo-100"
                                    >
                                        Confirmar Nodo
                                    </BaseButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </ModalsPortal>
            )}
        </div>
    );
}

const CategoriesPage = dynamic(() => Promise.resolve(CategoriesModule), {
    ssr: false,
    loading: () => <div className="p-10 text-center font-black text-gray-300 uppercase animate-pulse">Cargando Motor de Taxonomía...</div>
});

export default CategoriesPage;
