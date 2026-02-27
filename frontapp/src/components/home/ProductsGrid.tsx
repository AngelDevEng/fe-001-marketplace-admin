import Image from 'next/image';
import { Categoria } from '@/types/public';

interface ProductsGridProps {
  categorias: Categoria[];
  titulo?: string;
}

export default function ProductsGrid({ categorias, titulo = 'Categorías de productos saludables' }: ProductsGridProps) {
  return (
    <section className="space-y-4 md:space-y-6 max-w-7xl mx-auto px-4">
      <h2 className="text-xl md:text-2xl font-semibold text-gray-900">{titulo}</h2>

      <div className="relative overflow-hidden">
        <div className="flex transition-transform duration-700 gap-4">
          {categorias.map((cat) => (
            <div key={cat.id} className="flex-shrink-0 w-full sm:w-[calc(33.333%-1rem)] lg:w-[calc(16.666%-1rem)]">
              <article className="rounded-[2.5rem] overflow-hidden shadow-md bg-sky-400 group cursor-pointer h-28 md:h-36">
                <Image
                  src={cat.imagen}
                  alt={cat.nombre}
                  width={300}
                  height={200}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </article>
              <div className="py-3 text-center">
                <p className="text-[11px] md:text-sm font-bold tracking-tight text-gray-800 uppercase">
                  {cat.nombre}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}