'use client';

import { usePathname } from 'next/navigation';
import { PublicHeader, PublicFooter } from '@/components/layout/public';
import { HeaderProvider } from '@/components/layout/public/HeaderContext';

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isCheckout = pathname === '/checkout';

    return (
        <HeaderProvider>
            <div className="bg-gray-50 dark:bg-[#0A0F0D] min-h-screen flex flex-col overflow-x-hidden">
                {!isCheckout && <PublicHeader />}
                <main className="flex-1">
                    {children}
                </main>
                {!isCheckout && <PublicFooter />}
            </div>
        </HeaderProvider>
    );
}
