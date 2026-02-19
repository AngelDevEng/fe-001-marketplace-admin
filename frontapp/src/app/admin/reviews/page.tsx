import React from 'react';
import ModuleHeader from '@/components/layout/shared/ModuleHeader';
import ReviewList from '@/components/admin/ReviewList';

export default function ReviewsPage() {
    return (
        <div className="px-8 pb-8">
            <ModuleHeader
                title="Revisiones de Productos"
                subtitle="Moderación de comentarios y calificaciones de clientes"
                icon="ph-star"
            />
            <ReviewList />
        </div>
    );
}
