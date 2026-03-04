import { PublicHeader, PublicFooter } from '@/components/layout/public';

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-[#0A0F0D] text-slate-900 dark:text-[#E8EDE9]">
            <PublicHeader />
            <main className="flex-1">
                {children}
            </main>
            <PublicFooter />
        </div>
    );
}