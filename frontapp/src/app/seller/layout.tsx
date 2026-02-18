import SellerSidebar from '@/components/layout/seller/SellerSidebar';
import SellerHeader from '@/components/layout/seller/SellerHeader';
import Footer from '@/components/layout/shared/Footer';

export default function SellerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <SellerSidebar />
            <div className="ml-64">
                <SellerHeader />
                <main className="mt-16 min-h-[calc(100vh-4rem)]">
                    {children}
                </main>
                <Footer />
            </div>
        </div>
    );
}
