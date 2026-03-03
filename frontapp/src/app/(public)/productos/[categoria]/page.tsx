import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getCategoryBySlug, getProductsByCategorySlug, mapWooProductToLocal } from '@/shared/lib/api/wooCommerce';
import ProductGrid from '@/components/products/ProductGrid';

interface PageProps {
  params: Promise<{ categoria: string }>;
}

export default async function CategoryPage({ params }: PageProps) {
  const { categoria } = await params;
  
  const [category, wooProducts] = await Promise.all([
    getCategoryBySlug(categoria),
    getProductsByCategorySlug(categoria, 20),
  ]);

  if (!category) {
    notFound();
  }

  const productos = wooProducts.map(mapWooProductToLocal);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#0A0F0D]">
      <div className="bg-white dark:bg-[#111A15] border-b border-gray-200 dark:border-[#2A3F33]">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-[#9BAF9F] hover:text-sky-500 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-[#E8EDE9]">
            {category.name}
          </h1>
          <p className="text-gray-500 dark:text-[#9BAF9F] mt-2">
            {category.description || `Explora nuestra selección de productos en ${category.name}`}
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            {productos.length} producto{productos.length !== 1 ? 's' : ''} encontrado{productos.length !== 1 ? 's' : ''}
          </p>
        </div>

        <ProductGrid productos={productos} />
      </div>
    </main>
  );
}
