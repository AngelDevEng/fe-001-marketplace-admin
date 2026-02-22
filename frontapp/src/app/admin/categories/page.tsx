'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import ModuleHeader from '@/components/layout/shared/ModuleHeader';
import { useCategories, CategoryNode } from '@/hooks/useCategories';
import { Plus, Folder, ChevronRight, Settings, AlertCircle, RefreshCw, Layers, Check, X, Trash2 } from 'lucide-react';

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
        const success = await editCategory(selectedCategory.id, formData);
        if (success) setEditMode(false);
        setIsSaving(false);
    };

    const handleDelete = async () => {
        if (!selectedCategory) return;
        setIsSaving(true);
        await removeCategory(selectedCategory.id);
        setIsSaving(false);
    };

    const handleCreate = async () => {
        if (!newName.trim()) return;
        setIsSaving(true);
        const success = await addCategory(newName, selectedCategory?.id || 0);
        if (success) {
            setShowNewDialog(false);
            setNewName('');
        }
        setIsSaving(false);
    };

    const renderCategoryItem = (node: CategoryNode, depth: number = 0) => {
        const isSelected = selectedCategory?.id === node.id;

        return (
            <div key={node.id} className="space-y-1">
                <div
                    onClick={() => setSelectedCategoryId(node.id)}
                    className={`flex items-center justify-between p-3 rounded-xl cursor-pointer group transition-all ${isSelected
                        ? 'bg-indigo-600 text-white shadow-lg'
                        : 'bg-gray-50 hover:bg-indigo-50 text-gray-800'
                        }`}
                    style={{ marginLeft: `${depth * 1.5}rem` }}
                >
                    <div className="flex items-center gap-3">
                        <Folder className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-indigo-400'}`} />
                        <span className={`text-[10px] font-black uppercase tracking-tight ${isSelected ? 'text-white' : 'text-gray-700'}`}>
                            {node.name}
                        </span>
                        {node.count > 0 && (
                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-500'
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
            <div className="px-8 pb-20 space-y-8 animate-fadeIn font-industrial">
                <ModuleHeader
                    title="Gestión de Categorías"
                    subtitle="Estructura Maestra del Catálogo"
                    icon="LayoutDashboard"
                />
                <div className="min-h-[500px] flex flex-col items-center justify-center bg-white border border-gray-100 rounded-[3rem] p-32 shadow-sm">
                    <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest animate-pulse">Sincronizando Jerarquía...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="px-8 pb-20 space-y-8 animate-fadeIn font-industrial">
            <ModuleHeader
                title="Gestión de Categorías"
                subtitle="Estructura Maestra del Catálogo y Atributos Dinámicos"
                icon="LayoutDashboard"
                actions={
                    <div className="flex gap-3">
                        <button
                            onClick={() => refresh()}
                            className="p-3 bg-white border border-gray-100 text-gray-400 rounded-2xl hover:text-indigo-600 transition-all shadow-sm active:scale-95"
                        >
                            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                        <button
                            onClick={() => setShowNewDialog(true)}
                            className="flex items-center gap-3 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl active:scale-95"
                        >
                            <Plus className="w-4 h-4" /> Nueva Categoría
                        </button>
                    </div>
                }
            />

            {error && (
                <div className="p-6 bg-rose-50 border border-rose-100 rounded-[2rem] flex items-center gap-4 text-rose-600 font-bold text-sm">
                    <AlertCircle className="w-5 h-5" />
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-1 bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6 max-h-[700px] overflow-y-auto no-scrollbar scroll-smooth">
                    <div className="flex items-center justify-between sticky top-0 bg-white pb-4 z-10 border-b border-gray-50">
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Árbol Estructural</h3>
                        <Layers className="w-4 h-4 text-gray-300" />
                    </div>

                    <div className="space-y-4">
                        {categoryTree.map(node => renderCategoryItem(node))}
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-8 animate-in slide-in-from-right-4 duration-500">
                    {selectedCategory ? (
                        <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8 relative overflow-hidden">
                            {isSaving && (
                                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-50 flex items-center justify-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                                        <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Sincronizando WP...</p>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center justify-between border-b border-gray-100 pb-6">
                                <div>
                                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest leading-none mb-2">Editor de Nodo</p>
                                    <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">{selectedCategory.name}</h2>
                                    <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-widest">Slug: {selectedCategory.slug} | ID: #{selectedCategory.id}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setEditMode(!editMode)}
                                        className={`p-4 rounded-2xl transition-colors ${editMode ? 'bg-indigo-600 text-white' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                                    >
                                        <Settings className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nombre en Tienda</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        readOnly={!editMode}
                                        className={`w-full p-4 border-none rounded-2xl text-xs font-bold transition-all ${editMode ? 'bg-indigo-50 text-indigo-900 ring-2 ring-indigo-200' : 'bg-gray-50 text-gray-600'
                                            }`}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Contador de Productos</label>
                                    <div className="w-full p-4 bg-gray-50 border-none rounded-2xl text-xs font-bold text-indigo-600">
                                        {selectedCategory.count} Items vinculados
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Descripción de WooCommerce</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    readOnly={!editMode}
                                    rows={3}
                                    className={`w-full p-4 border-none rounded-2xl text-xs font-medium resize-none transition-all ${editMode ? 'bg-indigo-50 text-indigo-900 ring-2 ring-indigo-200 shadow-inner' : 'bg-gray-50 text-gray-500'
                                        }`}
                                />
                            </div>

                            {editMode ? (
                                <div className="flex gap-4 pt-6 animate-in fade-in zoom-in duration-300">
                                    <button
                                        onClick={handleSave}
                                        className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl flex items-center justify-center gap-3"
                                    >
                                        <Check className="w-4 h-4" /> Guardar Cambios en WP
                                    </button>
                                    <button
                                        onClick={() => setEditMode(false)}
                                        className="px-8 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-gray-200 transition-all"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            ) : (
                                <div className="flex gap-4 pt-6 border-t border-gray-50">
                                    <button
                                        onClick={() => setEditMode(true)}
                                        className="flex-1 py-4 bg-gray-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl"
                                    >
                                        Habilitar Edición
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="px-8 py-4 bg-rose-50 text-rose-600 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-rose-100 transition-all group"
                                    >
                                        <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                    </button>
                                </div>
                            )}

                            <div className="p-8 bg-indigo-50/50 border border-indigo-100 rounded-[2.5rem]">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Marketplace Rules</p>
                                        <p className="text-[9px] text-indigo-400 font-bold uppercase mt-1">Configuración Administrativa</p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {['Taxonomía', 'SEO Title', 'Canonical'].map((tag, i) => (
                                        <span key={i} className="px-4 py-2 bg-white text-indigo-700 text-[10px] font-black rounded-xl border border-indigo-100 uppercase shadow-sm">
                                            {tag}
                                        </span>
                                    ))}
                                    <button
                                        onClick={() => alert("Módulo de Reglas Dinámicas (Marketplace): Esta funcionalidad permite heredar comportamientos del sistema legacy Dokan. Próximamente disponible.")}
                                        className="px-5 py-2 bg-indigo-600 text-white text-[10px] font-black rounded-xl uppercase hover:bg-indigo-700 transition-all shadow-md active:scale-95"
                                    >
                                        + Configurar Regla
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full min-h-[500px] flex flex-col items-center justify-center bg-gray-50 border border-dashed border-gray-200 rounded-[3rem] p-12 text-center">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                                <Layers className="w-8 h-8 text-gray-200" />
                            </div>
                            <h3 className="text-lg font-black text-gray-400 uppercase tracking-widest mb-2">Editor de Nodos</h3>
                            <p className="text-xs text-gray-400 max-w-xs leading-relaxed">Selecciona una categoría para gestionar su estructura técnica.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* NEW CATEGORY MODAL */}
            {showNewDialog && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setShowNewDialog(false)} />
                    <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl relative overflow-hidden p-10 animate-in zoom-in duration-300">
                        <div className="h-2 w-full absolute top-0 left-0 bg-indigo-600"></div>
                        <h3 className="text-2xl font-black text-gray-900 tracking-tighter uppercase italic mb-2">Nueva Categoría</h3>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-8">
                            {selectedCategory ? `Hija de: ${selectedCategory.name}` : 'Categoría Raíz'}
                        </p>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nombre</label>
                                <input
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    placeholder="Ej: Accesorios Bio"
                                    className="w-full p-5 bg-gray-50 border-none rounded-2xl text-xs font-bold"
                                    autoFocus
                                />
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={handleCreate}
                                    disabled={isSaving}
                                    className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl"
                                >
                                    Crear Categoría
                                </button>
                                <button
                                    onClick={() => setShowNewDialog(false)}
                                    className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-gray-200 transition-all"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const CategoriesPage = dynamic(() => Promise.resolve(CategoriesModule), {
    ssr: false,
    loading: () => (
        <div className="px-8 pb-20 space-y-8 font-industrial">
            <div className="h-24 w-full bg-gray-100 rounded-2xl animate-pulse" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="h-[500px] bg-gray-50 rounded-[2.5rem] animate-pulse" />
                <div className="lg:col-span-2 h-[500px] bg-gray-50 rounded-[2.5rem] animate-pulse" />
            </div>
        </div>
    )
});

export default CategoriesPage;
