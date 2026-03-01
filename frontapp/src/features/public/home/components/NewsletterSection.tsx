'use client';

import { useState, FormEvent } from 'react';
import Icon from '@/components/ui/Icon';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  return (
    <section className="!mt-0 py-12 md:py-16 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-sky-100 rounded-full flex items-center justify-center">
          <Icon name="Mail" className="w-8 h-8 text-sky-600" />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
          Recibe nuestras ofertas y novedades
        </h2>
        <p className="text-gray-600 mb-6">
          Suscríbete a nuestro newsletter y sé el primero en conocer nuestras promociones.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Tu correo electrónico"
            required
            className="flex-1 px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-sky-500 text-white font-bold rounded-full hover:bg-sky-600 transition-colors"
          >
            Suscribirse
          </button>
        </form>
        <p className="text-xs text-gray-500 mt-4">
          Al suscribirte, aceptas nuestra política de privacidad.
        </p>
      </div>
    </section>
  );
}
