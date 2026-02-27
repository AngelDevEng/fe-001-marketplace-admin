'use client';

import {
  Heart,
  Store,
  Tag,
  ShieldCheck,
  Zap,
  Clock,
  Globe,
} from 'lucide-react';
import { Beneficio } from '@/types/public';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  heart: Heart,
  storefront: Store,
  tag: Tag,
  'shield-check': ShieldCheck,
  lightning: Zap,
  clock: Clock,
  globe: Globe,
};

const iconColorMap: Record<string, string> = {
  heart: 'text-sky-600',
  storefront: 'text-emerald-600',
  tag: 'text-amber-600',
  'shield-check': 'text-violet-600',
  lightning: 'text-lime-600',
  clock: 'text-slate-600',
  globe: 'text-rose-600',
};

interface BenefitsSectionProps {
  beneficios: Beneficio[];
}

export default function BenefitsSection({ beneficios }: BenefitsSectionProps) {
  // Duplicate items for infinite scroll effect
  const allItems = [...beneficios, ...beneficios];

  return (
    <section className="max-w-7xl mx-auto px-4 my-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Beneficios</h2>

      <div
        className="relative w-full h-[350px] rounded-2xl shadow-xl overflow-hidden group"
        style={{ backgroundColor: '#8BC34A' }}
      >
        {/* Parallax background image */}
        <div
          className="absolute inset-0 z-0 bg-fixed bg-center bg-cover"
          style={{ backgroundImage: "url('/img/Inicio/11/1.png')", backgroundPosition: 'center center' }}
        />

        {/* Fade mask on edges */}
        <div
          className="absolute inset-0 z-10 flex items-center"
          style={{
            maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
          }}
        >
          {/* Infinite scroll container */}
          <div
            className="flex items-center animate-scroll-infinite group-hover:[animation-play-state:paused]"
            style={{ width: 'max-content' }}
          >
            {allItems.map((beneficio, index) => {
              const Icon = iconMap[beneficio.icono] || Heart;
              const iconColor = iconColorMap[beneficio.icono] || 'text-sky-600';

              return (
                <div
                  key={`${beneficio.id}-${index}`}
                  className="flex flex-col items-center justify-center text-center w-[250px] mx-1 flex-shrink-0 cursor-default"
                >
                  {/* Circle with icon */}
                  <div className="w-28 h-28 rounded-full bg-[#A4D65E] flex items-center justify-center mb-4 shadow-lg transition-transform duration-300 hover:scale-105 border-4 border-white/20">
                    <Icon className={`w-10 h-10 ${iconColor} group-hover:scale-125 transition-transform duration-500`} />
                  </div>

                  {/* Title */}
                  <h3
                    className="font-black text-lg md:text-xl mb-1 text-white uppercase tracking-wider leading-tight"
                    style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
                  >
                    {beneficio.titulo}
                  </h3>

                  {/* Subtitle */}
                  <div
                    className="text-[10px] md:text-xs text-white uppercase tracking-normal w-full px-2 font-light whitespace-nowrap overflow-hidden text-ellipsis"
                    style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                    title={beneficio.descripcion}
                  >
                    {beneficio.descripcion}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}