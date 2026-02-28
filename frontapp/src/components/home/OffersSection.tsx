'use client';

import Image from 'next/image';
import { ShoppingCart, Eye, ExternalLink } from 'lucide-react';
import { Producto } from '@/types/public';

interface OfferBlockProps {
  titulo: string;
  productos: Producto[];
  backgroundImage: string;
  linkText?: string;
}

function OfferCard({ producto }: { producto: Producto }) {
  return (
    <article className="oferta-card flex-shrink-0 snap-center w-[190px] md:w-[220px] bg-white/[0.92] dark:bg-[#111A15]/92 backdrop-blur-lg border border-white/40 dark:border-[#2A3F33]/50 rounded-[20px] p-3 shadow-[0_10px_25px_rgba(15,23,42,0.08)] dark:shadow-[0_10px_25px_rgba(0,0,0,0.3)] group transition-all duration-300 hover:-translate-y-[5px] hover:shadow-[0_15px_35px_rgba(15,23,42,0.2)] dark:hover:shadow-[0_15px_35px_rgba(0,0,0,0.5)] flex flex-col items-center relative mr-[14px] md:mr-5">
      {/* Image wrapper — aspect-square, contain, con action bar al fondo */}
      <div className="oferta-image-wrapper relative w-full aspect-square rounded-[18px] overflow-hidden bg-white dark:bg-[#182420] flex items-center justify-center">
        <Image
          src={producto.imagen}
          alt={producto.titulo}
          fill
          sizes="(max-width: 768px) 190px, 220px"
          className="object-contain p-[7.5%] transition-transform duration-500 group-hover:scale-[1.08]"
          draggable={false}
        />

        {/* Tag */}
        {producto.tag && (
          <span className="absolute top-2 left-2 bg-sky-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide shadow-md z-20">
            {producto.tag}
          </span>
        )}

        {/* Bottom action bar — slides up on hover, always visible on mobile */}
        <div className="oferta-actions absolute bottom-0 left-0 w-full h-[44px] flex bg-sky-500 dark:bg-[#4A7C59] transform translate-y-full group-hover:translate-y-0 md:translate-y-full md:group-hover:translate-y-0 max-md:!translate-y-0 transition-transform duration-300 z-10">
          <button
            className="oferta-action-btn flex-1 flex items-center justify-center text-white border-r border-white/20 dark:border-white/15 hover:bg-white/15 dark:hover:bg-white/10 transition-colors"
            title="Agregar al carrito"
          >
            <ShoppingCart className="w-[18px] h-[18px]" />
          </button>
          <button
            className="oferta-action-btn flex-1 flex items-center justify-center text-white border-r border-white/20 dark:border-white/15 hover:bg-white/15 dark:hover:bg-white/10 transition-colors"
            title="Vista rápida"
          >
            <Eye className="w-[18px] h-[18px]" />
          </button>
          <button
            className="oferta-action-btn flex-1 flex items-center justify-center text-white hover:bg-white/15 dark:hover:bg-white/10 transition-colors"
            title="Ver producto"
          >
            <ExternalLink className="w-[18px] h-[18px]" />
          </button>
        </div>
      </div>

      {/* Product info */}
      <div className="mt-3 w-full text-center">
        <h3 className="oferta-title text-[13px] font-bold text-sky-700 dark:text-[#4A7C59] uppercase whitespace-nowrap overflow-hidden text-ellipsis mb-0.5">
          {producto.titulo}
        </h3>
        <p className="oferta-price text-[15px] font-extrabold text-gray-800 dark:text-[#E8EDE9]">
          S/ {producto.precio.toFixed(2)}
        </p>
        <div className="text-amber-400 text-xs mt-1">
          {producto.estrellas || '★★★★★'}
        </div>
      </div>
    </article>
  );
}

function OfferBlock({ titulo, productos, backgroundImage, linkText = 'Ver todo' }: OfferBlockProps) {
  return (
    <section className="space-y-4 md:space-y-6 max-w-7xl mx-auto px-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-[#E8EDE9] tracking-tight">{titulo}</h2>
        <button type="button" className="text-sm font-bold text-sky-600 dark:text-[#4A7C59] hover:text-sky-700 dark:hover:text-[#6BAF7B] flex items-center gap-1">
          {linkText} →
        </button>
      </div>

      <div
        className="relative min-h-[480px] rounded-[30px] shadow-2xl overflow-hidden"
      >
        {/* Parallax background */}
        <div
          className="absolute inset-0 z-0 bg-fixed bg-center bg-cover"
          style={{ backgroundImage: `url('${backgroundImage}')`, backgroundPosition: 'center 20%' }}
        />
        <div className="absolute inset-0 bg-white/5 dark:bg-[#111A15]/50 backdrop-blur-[1px] z-10 pointer-events-none" />

        <div className="relative z-20 p-4 md:p-8 min-h-[480px] flex items-center">
          <div className="flex flex-col w-full">
            {/* Scrollable product cards */}
            <div className="flex items-center overflow-x-auto lg:overflow-x-hidden lg:flex-nowrap lg:justify-end gap-4 lg:gap-5 py-6 lg:py-0 snap-x snap-mandatory scrollbar-hide max-w-full lg:ml-auto lg:max-w-5xl lg:mr-8 touch-pan-x">
              {productos.map((producto) => (
                <OfferCard key={producto.id} producto={producto} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface OffersSectionProps {
  ofertasServicios: Producto[];
  ofertasProductos: Producto[];
  productosNuevos: Producto[];
}

export default function OffersSection({
  ofertasServicios,
  ofertasProductos,
  productosNuevos,
}: OffersSectionProps) {
  return (
    <div className="space-y-12 mt-12">
      <OfferBlock
        titulo="Las mejores ofertas de Servicios"
        productos={ofertasServicios}
        backgroundImage="/img/Inicio/7.png"
      />

      <OfferBlock
        titulo="Las mejores ofertas de productos"
        productos={ofertasProductos}
        backgroundImage="/img/Inicio/6.webp"
      />

      <OfferBlock
        titulo="Productos Nuevos"
        productos={productosNuevos}
        backgroundImage="/img/Inicio/8.png"
      />
    </div>
  );
}