'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import SellerSidebar from '@/components/layout/seller/SellerSidebar';
import SellerHeader from '@/components/layout/seller/SellerHeader';
import Footer from '@/components/layout/shared/Footer';

export default function SellerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const pathname = usePathname();

    // Close on route change
    useEffect(() => {
        setIsMobileOpen(false);
    }, [pathname]);

    // Close on ESC
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsMobileOpen(false);
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <SellerHeader onOpenMenu={() => setIsMobileOpen(true)} />
            <div className="flex flex-1 max-w-[1920px] w-full mx-auto relative">
                <SellerSidebar isMobileOpen={isMobileOpen} onClose={() => setIsMobileOpen(false)} />
                <main className="flex-1 p-4 md:p-8 overflow-x-hidden min-h-[calc(100vh-4rem)]">
                    <div className="animate-fadeIn">
                        {children}
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
}
