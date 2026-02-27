import { Suspense } from 'react';
import { RapifacPageClient } from './RapifacPageClient';
import BaseLoading from '@/components/ui/BaseLoading';

export default async function AdminRapifacInvoicesPage() {
    return (<Suspense fallback={<BaseLoading message="Cargando comprobantes..." />}><RapifacPageClient /></Suspense>);
}
