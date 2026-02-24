import Breadcrumb from '@/components/layout/shared/Breadcrumb';
import { BreadcrumbItem } from '@/lib/types/navigation';

interface SellerNavbarProps {
    title: string;
    breadcrumbs?: BreadcrumbItem[];
    actions?: React.ReactNode;
}

export default function SellerNavbar({ title, breadcrumbs, actions }: SellerNavbarProps) {
    return (
        <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between mb-2">
                <h1 className="text-2xl font-bold text-gray-900">
                    {title}
                </h1>
                {actions && (
                    <div className="flex items-center gap-3">
                        {actions}
                    </div>
                )}
            </div>
            {breadcrumbs && breadcrumbs.length > 0 && (
                <Breadcrumb items={breadcrumbs} />
            )}
        </div>
    );
}
