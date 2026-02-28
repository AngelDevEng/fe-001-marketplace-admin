import Image from 'next/image';
import { Star } from 'lucide-react';
import { Producto } from '@/types/public';

interface ProductCardProps {
  producto: Producto;
}

export default function ProductCard({ producto }: ProductCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow group">
      <div className="relative h-48 bg-gray-100">
        <Image
          src={producto.imagen}
          alt={producto.titulo}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {producto.descuento && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            -{producto.descuento}%
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
          {producto.titulo}
        </h3>
        <div className="flex items-center gap-1 mb-2">
          {producto.estrellas &&
            producto.estrellas.split('').map((estrella, i) => (
              <Star
                key={i}
                className="w-4 h-4 fill-yellow-400 text-yellow-400"
              />
            ))}
        </div>
        <p className="text-sky-600 font-bold text-lg">
          S/{producto.precio.toFixed(2)}
        </p>
      </div>
    </div>
  );
}