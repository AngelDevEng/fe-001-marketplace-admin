'use client';

import Image from 'next/image';
import type { BannersPub } from '../types';

interface AdBannersProps {
  bannersPub: BannersPub;
}

export default function AdBanners({ bannersPub }: AdBannersProps) {
  return (
    <section className="!mt-0 max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="aspect-[3/1] rounded-2xl overflow-hidden bg-gray-100">
            {bannersPub.slider1[0]?.imagenes[0] && (
              <Image
                src={bannersPub.slider1[0].imagenes[0]}
                alt="Banner publicitario"
                fill
                className="object-cover"
              />
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {bannersPub.pequenos1.map((src, i) => (
              <div key={i} className="aspect-[3/2] rounded-xl overflow-hidden bg-gray-100">
                <Image src={src} alt={`Banner ${i + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="aspect-[3/1] rounded-2xl overflow-hidden bg-gray-100">
            {bannersPub.slider2[0]?.imagenes[0] && (
              <Image
                src={bannersPub.slider2[0].imagenes[0]}
                alt="Banner publicitario"
                fill
                className="object-cover"
              />
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {bannersPub.pequenos2.map((src, i) => (
              <div key={i} className="aspect-[3/2] rounded-xl overflow-hidden bg-gray-100">
                <Image src={src} alt={`Banner ${i + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
