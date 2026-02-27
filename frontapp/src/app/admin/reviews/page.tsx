import { Suspense } from 'react';
import { ReviewsPageClient } from './ReviewsPageClient';
import BaseLoading from '@/components/ui/BaseLoading';

export default async function ReviewsPage() {
    return (
        <Suspense fallback={<BaseLoading message="Cargando reseñas..." />}>
            <ReviewsPageClient />
        </Suspense>
    );
}
