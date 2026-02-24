'use client';

import React, { useState } from 'react';
import AdminSidebar from '@/components/layout/admin/AdminSidebar';
import AdminHeader from '@/components/layout/admin/AdminHeader';
import BaseLayout from '@/components/layout/shared/BaseLayout';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <BaseLayout
            header={<AdminHeader onOpenMenu={() => setIsMobileOpen(true)} />}
            sidebar={<AdminSidebar isMobileOpen={isMobileOpen} onClose={() => setIsMobileOpen(false)} />}
            sidebarOpen={isMobileOpen}
            onSidebarClose={() => setIsMobileOpen(false)}
            className="bg-gray-50/50"
            mainClassName="p-6 md:p-8"
        >
            {children}
        </BaseLayout>
    );
}
