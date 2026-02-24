'use client';

import React, { useState } from 'react';
import SellerSidebar from '@/components/layout/seller/SellerSidebar';
import SellerHeader from '@/components/layout/seller/SellerHeader';
import BaseLayout from '@/components/layout/shared/BaseLayout';

export default function SellerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <BaseLayout
            header={<SellerHeader onOpenMenu={() => setIsMobileOpen(true)} />}
            sidebar={<SellerSidebar isMobileOpen={isMobileOpen} onClose={() => setIsMobileOpen(false)} />}
            sidebarOpen={isMobileOpen}
            onSidebarClose={() => setIsMobileOpen(false)}
            className="bg-gray-50"
            mainClassName="p-4 md:p-8"
        >
            {children}
        </BaseLayout>
    );
}
