'use client';

import ModuleHeader from '@/components/layout/shared/ModuleHeader';

interface HelpdeskPageClientProps { /* TODO Tarea 3 */ }
export function HelpdeskPageClient(_props: HelpdeskPageClientProps) {
    return (
        <div className="space-y-6 animate-fadeIn font-industrial">
            <ModuleHeader title="Mesa de Ayuda Admin" subtitle="Gestión centralizada de tickets y soporte" icon="Headset" />
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <p className="text-gray-400 text-sm">Cargando helpdesk...</p>
            </div>
        </div>
    );
}
