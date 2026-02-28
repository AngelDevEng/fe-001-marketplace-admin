'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { BannersPub } from '@/types/public';

interface BannerSliderProps {
  slides: { id: number; imagenes: string[] }[];
}

function BannerSlider({ slides }: BannerSliderProps) {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((c) => (c === slides.length - 1 ? 0 : c + 1));
  }, [slides.length]);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <div className="relative overflow-hidden rounded-2xl">
      <div
        className="flex transition-transform duration-700"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide) => (
          <div key={slide.id} className="min-w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {slide.imagenes.map((img) => (
                <article key={img} className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                  <Image
                    src={img}
                    alt={`Banner ${slide.id}-${i + 1}`}
                    width={600}
                    height={300}
                    className="w-full h-auto object-cover"
                  />
                </article>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Dots */}
      {slides.length > 1 && (
        <div className="flex justify-center gap-2 mt-3">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all duration-300 ${i === current ? 'w-6 bg-sky-500' : 'w-2 bg-gray-300'
                }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SmallBannerCarousel({ images }: { images: string[] }) {
  return (
    <div className="overflow-hidden relative p-3 -m-3">
      <div className="flex gap-6">
        {images.slice(0, 3).map((img) => (
          <div
            key={img}
            className="flex-shrink-0 w-full sm:w-[280px] lg:w-[380px] rounded-[18px] overflow-hidden shadow-[0_10px_25px_rgba(15,23,42,0.12)] cursor-grab hover:scale-[1.02] transition-transform select-none"
          >
            <Image
              src={img}
              alt={`Banner pequeño ${i + 1}`}
              width={380}
              height={250}
              className="w-full h-full object-cover block select-none pointer-events-none"
              draggable={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

interface AdBannersProps {
  bannersPub: BannersPub;
}

export default function AdBanners({ bannersPub }: AdBannersProps) {
  return (
    <section className="mt-10 space-y-8 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900">Banners publicitarios</h2>
      </div>

      {/* Block 1: Slider Grande */}
      <div className="max-w-7xl mx-auto px-4">
        <BannerSlider slides={bannersPub.slider1} />
      </div>

      {/* Block 2: Banners Estáticos Pequeños */}
      <div className="max-w-7xl mx-auto px-4">
        <SmallBannerCarousel images={bannersPub.pequenos1} />
      </div>

      {/* Block 3: Otro Slider Grande */}
      <div className="max-w-7xl mx-auto px-4">
        <BannerSlider slides={bannersPub.slider2} />
      </div>

      {/* Block 4: Más Banners Estáticos */}
      <div className="max-w-7xl mx-auto px-4">
        <SmallBannerCarousel images={bannersPub.pequenos2} />
      </div>
    </section>
  );
}