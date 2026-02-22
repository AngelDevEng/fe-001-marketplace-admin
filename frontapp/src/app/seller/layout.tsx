'use client';

import React from 'react';
import SellerSidebar from '@/components/layout/seller/SellerSidebar';
import SellerHeader from '@/components/layout/seller/SellerHeader';
import Footer from '@/components/layout/shared/Footer';

export default function SellerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50/50 flex flex-col">
            <SellerHeader />
            <div className="flex flex-1 max-w-[1920px] w-full mx-auto relative">
                <SellerSidebar />
                <main className="flex-1 p-6 md:p-8 overflow-x-hidden min-h-[calc(100vh-4rem)]">
                    <div className="animate-fadeIn">
                        {children}
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
}
