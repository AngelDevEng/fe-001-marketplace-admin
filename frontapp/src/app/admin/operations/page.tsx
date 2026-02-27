import { Suspense } from 'react';
import { OperationsPageClient } from './OperationsPageClient';
import BaseLoading from '@/components/ui/BaseLoading';

export default async function OperationsPage() {
    return (<Suspense fallback={<BaseLoading message="Cargando operaciones..." />}><OperationsPageClient /></Suspense>);
}
