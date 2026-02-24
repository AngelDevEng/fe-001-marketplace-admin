'use client';

import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/lib/api';
import { ProductCategory } from '@/lib/types';

export interface CategoryNode extends ProductCategory {
    children: CategoryNode[];
}

export const useCategories = () => {
    const queryClient = useQueryClient();
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

    // --- Query: Fetch Categories ---
    const { data: categories = [], isLoading, error, refetch } = useQuery({
        queryKey: ['admin', 'categories'],
        queryFn: async () => {
            const data = await getCategories();
            return data;
        },
        staleTime: 10 * 60 * 1000,
    });

    // --- Mutations ---
    const createMutation = useMutation({
        mutationFn: async ({ name, parent }: { name: string, parent: number }) => {
            return await createCategory({ name, parent });
        },
        onSuccess: (newCat) => {
            queryClient.setQueryData(['admin', 'categories'], (old: ProductCategory[] | undefined) => {
                return old ? [...old, newCat] : [newCat];
            });
            setSelectedCategoryId(newCat.id);
        }
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: number, data: Partial<ProductCategory> }) => {
            return await updateCategory(id, data);
        },
        onSuccess: (updated) => {
            queryClient.setQueryData(['admin', 'categories'], (old: ProductCategory[] | undefined) => {
                if (!old) return old;
                return old.map(c => c.id === updated.id ? updated : c);
            });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            return await deleteCategory(id);
        },
        onSuccess: (_, deletedId) => {
            queryClient.setQueryData(['admin', 'categories'], (old: ProductCategory[] | undefined) => {
                if (!old) return old;
                return old.filter(c => c.id !== deletedId);
            });
            setSelectedCategoryId(null);
        }
    });

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
                    tree.push(node);
                }
            }
        });

        return tree;
    }, [categories]);

    const selectedCategory = useMemo(() => {
        const cat = categories.find(c => c.id === selectedCategoryId) || null;
        if (!cat && categories.length > 0 && !selectedCategoryId) {
            // Auto-selección inicial
            return categories.find(c => c.parent === 0) || categories[0];
        }
        return cat;
    }, [categories, selectedCategoryId]);

    return {
        categories,
        categoryTree,
        loading: isLoading || createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
        error: error ? (error as Error).message : null,
        selectedCategory,
        setSelectedCategoryId,
        refresh: refetch,
        addCategory: (name: string, parentId: number = 0) => createMutation.mutateAsync({ name, parent: parentId }),
        editCategory: (id: number, data: Partial<ProductCategory>) => updateMutation.mutateAsync({ id, data }),
        removeCategory: (id: number) => deleteMutation.mutateAsync(id)
    };
};
