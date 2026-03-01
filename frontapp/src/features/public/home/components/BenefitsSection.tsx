'use client';

import Icon from '@/components/ui/Icon';
import type { Beneficio } from '../types';

interface BenefitsSectionProps {
  beneficios: Beneficio[];
}

const iconMap: Record<string, string> = {
  truck: 'Truck',
  'shield-check': 'ShieldCheck',
  headphones: 'Headphones',
  refresh: 'RefreshCw',
  'check-circle': 'CheckCircle',
  'heart': 'Heart',
  'star': 'Star',
};

export default function BenefitsSection({ beneficios }: BenefitsSectionProps) {
  return (
    <section className="!mt-0 py-12 md:py-16 bg-gradient-to-r from-sky-500 to-teal-500">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-xl md:text-2xl font-semibold text-white text-center mb-8 md:mb-12">
          ¿Por qué elegirnos?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {beneficios.map((beneficio) => (
            <div key={beneficio.id} className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Icon name={iconMap[beneficio.icono] || 'CheckCircle'} className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-white font-bold mb-2">{beneficio.titulo}</h3>
              <p className="text-white/80 text-sm">{beneficio.descripcion}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
