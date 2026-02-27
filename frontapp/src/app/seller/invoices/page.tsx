import { Suspense } from 'react';
import { InvoicesPageClient } from './InvoicesPageClient';
import BaseLoading from '@/components/ui/BaseLoading';

export default async function InvoicesPage() {
    // TODO Tarea 3: Cuando se implemente la API real, obtener datos aquí
    
    return (
        <Suspense fallback={<BaseLoading message="Cargando comprobantes..." />}>
            <InvoicesPageClient />
        </Suspense>
    );
}
