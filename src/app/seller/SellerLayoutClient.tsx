'use client';

import React from 'react';
import SellerSidebar from '@/components/layout/seller/SellerSidebar';
import SellerHeader from '@/components/layout/seller/SellerHeader';
import { DashboardLayout } from '@/components/layout/shared/DashboardLayout';
import { useUIStore } from '@/store/uiStore';

interface SellerLayoutClientProps {
    children: React.ReactNode;
}

export function SellerLayoutClient({ children }: SellerLayoutClientProps) {
    const { sidebarOpen, toggleSidebar, closeSidebar } = useUIStore();

    return (
        <DashboardLayout
            header={<SellerHeader onOpenMenu={toggleSidebar} />}
            sidebar={<SellerSidebar isMobileOpen={sidebarOpen} onClose={closeSidebar} />}
            sidebarOpen={sidebarOpen}
            onSidebarClose={closeSidebar}
            className="bg-gray-50"
            mainClassName="p-4 md:p-8"
        >
            {children}
        </DashboardLayout>
    );
}
