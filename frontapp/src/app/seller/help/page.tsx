import { Suspense } from 'react';
import { HelpPageClient } from './HelpPageClient';
import BaseLoading from '@/components/ui/BaseLoading';

export default async function HelpPage() {
    // TODO Tarea 3: Cuando se implemente la API real, obtener datos aquí
    // const tickets = await getTickets();
    
    return (
        <Suspense fallback={<BaseLoading message="Cargando ayuda..." />}>
            <HelpPageClient />
        </Suspense>
    );
}
