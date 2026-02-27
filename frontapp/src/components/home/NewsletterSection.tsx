'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [suscrito, setSuscrito] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSuscrito(true);
      setEmail('');
    }
  };

  return (
    <section className="bg-teal-300 text-white px-6 md:px-10 py-8 md:py-10 max-w-7xl mx-auto">
      {suscrito ? (
        <div className="text-center py-4">
          <p className="font-semibold text-xl">¡Gracias por suscribirte! 🎉</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <h2 className="text-lg md:text-xl font-semibold mb-2">
              ¡SUSCRÍBETE Y RECIBE LAS MEJORES OFERTAS!
            </h2>
            <p className="text-sm md:text-[15px]">
              Obtén nuestras últimas novedades, ofertas y tips para llevar una vida saludable.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Correo electrónico"
                className="flex-1 px-4 py-2.5 rounded-full text-gray-800 text-sm border border-teal-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
              <button
                type="submit"
                className="px-6 py-2.5 rounded-full bg-sky-500 hover:bg-sky-600 text-sm font-semibold shadow-md transition-colors"
              >
                Suscribirme
              </button>
            </div>

            <label className="flex items-start gap-2 text-xs">
              <input type="checkbox" className="mt-1" required />
              <span className="leading-tight">
                He leído y acepto la{' '}
                <Link href="/politicas-de-privacidad" className="underline">
                  Política de Privacidad.
                </Link>
              </span>
            </label>
          </form>
        </div>
      )}
    </section>
  );
}