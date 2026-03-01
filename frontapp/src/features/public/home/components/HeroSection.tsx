'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Icon from '@/components/ui/Icon';
import type { Banner } from '../types';

interface HeroSectionProps {
  banners: Banner[];
}

export default function HeroSection({ banners }: HeroSectionProps) {
  const [current, setCurrent] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const prev = useCallback(
    () => setCurrent((c) => (c === 0 ? banners.length - 1 : c - 1)),
    [banners.length]
  );

  const next = useCallback(
    () => setCurrent((c) => (c === banners.length - 1 ? 0 : c + 1)),
    [banners.length]
  );

  useEffect(() => {
    const timer = setInterval(() => {
      next();
    }, 5000);
    return () => clearInterval(timer);
  }, [next]);

  useEffect(() => {
    const timeout = setTimeout(() => setRevealed(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <section className="relative w-full !mt-0 overflow-hidden leading-[0]">
      <div
        className={`hidden md:block w-full -mb-px overflow-hidden transition-all duration-[800ms] ease-out ${
          revealed ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}
      >
        <Image
          src="/img/BANNER_SUPERIOR.png"
          alt="Banner Superior"
          width={1600}
          height={270}
          className="w-full h-auto object-cover min-h-[80px] block origin-center"
          style={{ transform: 'scaleX(1.005)' }}
          priority
        />
      </div>

      <div
        className={`relative transition-all duration-[800ms] ease-out delay-100 ${
          revealed ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-8 md:translate-y-0 md:scale-[0.97] opacity-0'
        }`}
      >
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {banners.map((banner) => (
            <div key={banner.id} className="min-w-full overflow-hidden">
              <picture>
                <source srcSet={banner.imagenMobile} media="(max-width: 767px)" />
                <Image
                  src={banner.imagen}
                  alt={banner.titulo}
                  width={1600}
                  height={600}
                  className="w-full h-auto object-cover cursor-pointer origin-center"
                  style={{ transform: 'scaleX(1.006)' }}
                  priority
                />
              </picture>
            </div>
          ))}
        </div>

        <button
          onClick={prev}
          className={`absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${revealed ? 'opacity-100' : 'opacity-0'}`}
          aria-label="Anterior"
        >
          <Icon name="ChevronLeft" className="w-5 h-5" />
        </button>
        <button
          onClick={next}
          className={`absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${revealed ? 'opacity-100' : 'opacity-0'}`}
          aria-label="Siguiente"
        >
          <Icon name="ChevronRight" className="w-5 h-5" />
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                i === current ? 'bg-sky-500 scale-110' : 'bg-white/60 hover:bg-white/80'
              }`}
              aria-label={`Ir a slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <div
        className={`hidden md:block w-full -mt-px transition-all duration-[800ms] ease-out ${
          revealed ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}
      >
        <Image
          src="/img/BANNER_INFERIOR.png"
          alt="Banner Inferior"
          width={1600}
          height={270}
          className="w-full h-auto object-cover min-h-[80px] block origin-center"
          style={{ transform: 'scaleX(1.006)' }}
        />
      </div>
    </section>
  );
}
