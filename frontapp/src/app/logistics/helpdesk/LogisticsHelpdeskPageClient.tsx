'use client';

import React from 'react';
import ModuleHeader from '@/components/layout/shared/ModuleHeader';
import { useLogisticsHelpdesk } from '@/features/logistics/helpdesk/hooks/useLogisticsHelpdesk';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface LogisticsHelpdeskPageClientProps { }
export function LogisticsHelpdeskPageClient(_props: LogisticsHelpdeskPageClientProps) {
    const { tickets, selectedTicket, setSelectedTicket } = useLogisticsHelpdesk();

    return (
        <div className="space-y-8 animate-fadeIn pb-20">
            <ModuleHeader title="Helpdesk Logística" subtitle="Soporte y tickets de logística" icon="Headset" />
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <p className="text-gray-400 text-sm">Tickets: {tickets.length}</p>
            </div>
        </div>
    );
}
