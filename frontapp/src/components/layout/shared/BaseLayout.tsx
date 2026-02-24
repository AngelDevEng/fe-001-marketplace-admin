'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Footer from '@/components/layout/shared/Footer';

interface BaseLayoutProps {
    children: ReactNode;
    header: ReactNode;
    sidebar: ReactNode;
    sidebarOpen: boolean;
    onSidebarClose: () => void;
    className?: string;
    mainClassName?: string;
}

export default function BaseLayout({
    children,
    header,
    sidebar,
    sidebarOpen,
    onSidebarClose,
    className = 'bg-gray-50',
    mainClassName = 'p-6 md:p-8'
}: BaseLayoutProps) {
    const pathname = usePathname();

    useEffect(() => {
        onSidebarClose();
    }, [pathname, onSidebarClose]);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onSidebarClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onSidebarClose]);

    return (
        <div className={`min-h-screen ${className} flex flex-col`}>
            {header}
            <div className="flex flex-1 max-w-[1920px] w-full mx-auto relative">
                {sidebar}
                <main className={`flex-1 ${mainClassName} overflow-x-hidden min-h-[calc(100vh-4rem)]`}>
                    <div className="animate-fadeIn">
                        {children}
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
}
