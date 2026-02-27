import { Suspense } from 'react';
import { CategoriesPageClient } from './CategoriesPageClient';
import BaseLoading from '@/components/ui/BaseLoading';

export default async function CategoriesPage() {
    return (<Suspense fallback={<BaseLoading message="Cargando categorías..." />}><CategoriesPageClient /></Suspense>);
}
