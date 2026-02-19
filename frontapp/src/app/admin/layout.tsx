import React from 'react';
import AdminSidebar from '@/components/layout/admin/AdminSidebar';
import AdminHeader from '@/components/layout/admin/AdminHeader';
import Footer from '@/components/layout/shared/Footer';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50">
            <AdminSidebar />
            <div className="ml-64">
                <AdminHeader />
                <main className="mt-[112px] min-h-[calc(100vh-112px)]">
                    {children}
                </main>
                <Footer />
            </div>
        </div>
    );
}
