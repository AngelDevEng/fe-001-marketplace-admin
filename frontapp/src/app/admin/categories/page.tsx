import CategoryList from '@/components/admin/CategoryList';
import ModuleHeader from '@/components/layout/shared/ModuleHeader';

export default function CategoriesPage() {
    return (
        <div className="px-8 pb-8">
            <ModuleHeader
                title="Categorías"
                subtitle="Estructura y taxonomía del catálogo"
                icon="ph-folder-star"
            />
            <CategoryList />
        </div>
    );
}
