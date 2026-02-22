'use client';

import { useState, useEffect, useMemo } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/lib/api';
import { ProductCategory } from '@/lib/types';

export interface CategoryNode extends ProductCategory {
    children: CategoryNode[];
}

export const useCategories = () => {
    const [categories, setCategories] = useState<ProductCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

    const loadCategories = async () => {
        try {
            setLoading(true);
            const data = await getCategories();
            setCategories(data);

            // Seleccionar la primera por defecto si no hay ninguna
            if (data.length > 0 && !selectedCategoryId) {
                // Preferir una raíz
                const firstRoot = data.find(c => c.parent === 0) || data[0];
                setSelectedCategoryId(firstRoot.id);
            }
            setError(null);
        } catch (err: any) {
            console.error("Categories Load Error:", err);
            setError("Error al cargar las categorías de WooCommerce.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    // Construir árbol jerárquico
    const categoryTree = useMemo(() => {
        const nodes: Map<number, CategoryNode> = new Map(
            categories.map(c => [c.id, { ...c, children: [] }])
        );

        const tree: CategoryNode[] = [];

        nodes.forEach(node => {
            if (node.parent === 0) {
                tree.push(node);
            } else {
                const parent = nodes.get(node.parent);
                if (parent) {
                    parent.children.push(node);
                } else {
                    // Si el padre no existe en la lista (raro pero posible en paginación), va a la raíz
                    tree.push(node);
                }
            }
        });

        return tree;
    }, [categories]);

    const selectedCategory = useMemo(() => {
        return categories.find(c => c.id === selectedCategoryId) || null;
    }, [categories, selectedCategoryId]);

    const addCategory = async (name: string, parentId: number = 0) => {
        try {
            const newCat = await createCategory({ name, parent: parentId });
            setCategories(prev => [...prev, newCat]);
            setSelectedCategoryId(newCat.id);
            return true;
        } catch (err) {
            console.error("Error creating category:", err);
            return false;
        }
    };

    const editCategory = async (id: number, data: Partial<ProductCategory>) => {
        try {
            const updated = await updateCategory(id, data);
            setCategories(prev => prev.map(c => c.id === id ? updated : c));
            return true;
        } catch (err) {
            console.error("Error updating category:", err);
            return false;
        }
    };

    const removeCategory = async (id: number) => {
        if (typeof window === 'undefined' || !confirm("¿Está seguro de eliminar esta categoría? Esta acción es irreversible.")) return;
        try {
            await deleteCategory(id);
            setCategories(prev => prev.filter(c => c.id !== id));
            setSelectedCategoryId(null);
            return true;
        } catch (err) {
            console.error("Error deleting category:", err);
            alert("No se pudo eliminar la categoría. Verifique que no tenga productos vinculados.");
            return false;
        }
    };

    return {
        categories,
        categoryTree,
        loading,
        error,
        selectedCategory,
        setSelectedCategoryId,
        refresh: loadCategories,
        addCategory,
        editCategory,
        removeCategory
    };
};
