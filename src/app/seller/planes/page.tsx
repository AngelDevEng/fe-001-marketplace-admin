import { Suspense } from 'react';
import { PlansPageClient } from '@/features/seller/plans/PlansPageClient';
import BaseLoading from '@/components/ui/BaseLoading';

export default async function PlanesPage() {
    return (
        <Suspense fallback={<BaseLoading message="Cargando planes..." />}>
            <PlansPageClient />
        </Suspense>
    );
}
