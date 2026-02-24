'use client';

import React, { useState } from 'react';
import LogisticsSidebar from '@/components/layout/logistics/LogisticsSidebar';
import LogisticsHeader from '@/components/layout/logistics/LogisticsHeader';
import BaseLayout from '@/components/layout/shared/BaseLayout';

export default function LogisticsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <BaseLayout
            header={<LogisticsHeader onOpenMenu={() => setIsMobileOpen(true)} />}
            sidebar={<LogisticsSidebar isMobileOpen={isMobileOpen} onClose={() => setIsMobileOpen(false)} />}
            sidebarOpen={isMobileOpen}
            onSidebarClose={() => setIsMobileOpen(false)}
            className="bg-gray-50/50"
            mainClassName="p-6 md:p-8"
        >
            {children}
        </BaseLayout>
    );
}
