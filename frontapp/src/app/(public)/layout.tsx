import { PublicHeader, PublicFooter } from '@/components/layout/public';

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="bg-[var(--background)] min-h-screen flex flex-col">
            <PublicHeader />
            <main className="flex-1">
                {children}
            </main>
            <PublicFooter />
        </div>
    );
}
