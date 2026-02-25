'use client';

import { useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/Icon';

export default function PublicFooter() {
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

    const toggleSection = (section: string) => {
        setOpenSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    return (
        <footer className="bg-sky-500 text-white mt-12">
            <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 text-base">
                <div className="footer-section space-y-4 flex flex-col items-center md:items-start text-center md:text-left">
                    <div className="flex items-center gap-2">
                        <img src="/img/logo_lyrium_blanco_01-scaled.webp" alt="Lyrium" className="h-10 md:h-12" />
                    </div>
                    <p className="text-sm text-sky-100 max-w-xs">Biomarketplace de productos y servicios especializados.</p>
                    <div className="flex items-center gap-4 mt-2">
                        <a href="https://www.instagram.com/lyrium_biomarketplace/" target="_blank" className="social-icon-btn" title="Síguenos en Instagram">
                            <Icon name="Instagram" className="text-xl" />
                        </a>
                        <a href="https://www.facebook.com/people/Lyrium-Biomarketplace/61579938364350/" target="_blank" className="social-icon-btn" title="Síguenos en Facebook">
                            <Icon name="Facebook" className="text-xl" />
                        </a>
                        <a href="https://www.tiktok.com/@lyrium.biomarkep" target="_blank" className="social-icon-btn" title="Síguenos en TikTok">
                            <Icon name="TiktokLogo" className="text-xl" />
                        </a>
                        <a href="https://wa.me/51937093420" target="_blank" className="social-icon-btn" title="Escríbenos por WhatsApp">
                            <Icon name="WhatsAppLogo" className="text-xl" />
                        </a>
                    </div>
                </div>

                <div className="footer-section">
                    <button
                        onClick={() => toggleSection('contacto')}
                        className="footer-accordion-header md:cursor-default w-full flex items-center justify-between md:block focus:outline-none py-2 md:py-0 border-b border-white/10 md:border-0"
                    >
                        <h3 className="font-bold text-[15px] tracking-widest text-white/90 uppercase text-left">CONTÁCTANOS</h3>
                        <Icon name="ChevronDown" className="md:hidden transition-transform duration-300" />
                    </button>
                    <div className={`footer-accordion-content ${openSections['contacto'] ? 'block' : 'hidden'} md:block mt-4 md:mt-4 space-y-3`}>
                        <p className="flex items-center justify-center md:justify-start gap-3 text-sm">
                            <Icon name="PhoneCall" className="text-xl text-sky-200" />
                            +51 937 093 420
                        </p>
                        <p className="flex items-center justify-center md:justify-start gap-3 text-sm">
                            <Icon name="EnvelopeSimple" className="text-xl text-sky-200" />
                            ventas@lyriumbiomarketplace.com
                        </p>
                    </div>
                </div>

                <div className="footer-section">
                    <button
                        onClick={() => toggleSection('ayuda')}
                        className="footer-accordion-header md:cursor-default w-full flex items-center justify-between md:block focus:outline-none py-2 md:py-0 border-b border-white/10 md:border-0"
                    >
                        <h3 className="font-bold text-[15px] tracking-widest text-white/90 uppercase text-left">¿TE AYUDAMOS?</h3>
                        <Icon name="ChevronDown" className="md:hidden transition-transform duration-300" />
                    </button>
                    <ul className={`footer-accordion-content ${openSections['ayuda'] ? 'block' : 'hidden'} md:block mt-4 md:mt-4 space-y-3 text-sm`}>
                        <li><Link href="/preguntasfrecuentes" className="hover:text-sky-200 transition-colors">Preguntas frecuentes</Link></li>
                        <li><Link href="/politicasdeprivacidad" className="hover:text-sky-200 transition-colors">Políticas de privacidad</Link></li>
                        <li><Link href="/terminoscondiciones" className="hover:text-sky-200 transition-colors">Términos y condiciones</Link></li>
                        <li><Link href="/libroreclamaciones" className="hover:text-sky-200 transition-colors">Libro de reclamaciones</Link></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <button
                        onClick={() => toggleSection('informacion')}
                        className="footer-accordion-header md:cursor-default w-full flex items-center justify-between md:block focus:outline-none py-2 md:py-0 border-b border-white/10 md:border-0"
                    >
                        <h3 className="font-bold text-[15px] tracking-widest text-white/90 uppercase text-left">INFORMACIÓN</h3>
                        <Icon name="ChevronDown" className="md:hidden transition-transform duration-300" />
                    </button>
                    <ul className={`footer-accordion-content ${openSections['informacion'] ? 'block' : 'hidden'} md:block mt-4 md:mt-4 space-y-3 text-sm`}>
                        <li><Link href="/nosotros" className="hover:text-sky-200 transition-colors">Nosotros</Link></li>
                        <li><Link href="/tiendasregistradas" className="hover:text-sky-200 transition-colors">Tiendas registradas</Link></li>
                        <li><Link href="/contactanos" className="hover:text-sky-200 transition-colors">Contáctanos</Link></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <button
                        onClick={() => toggleSection('pago')}
                        className="footer-accordion-header md:cursor-default w-full flex items-center justify-between md:block focus:outline-none py-2 md:py-0 border-b border-white/10 md:border-0"
                    >
                        <h3 className="font-bold text-[15px] tracking-widest text-white/90 uppercase text-left">MÉTODOS DE PAGO</h3>
                        <Icon name="ChevronDown" className="md:hidden transition-transform duration-300" />
                    </button>
                    <div className={`footer-accordion-content ${openSections['pago'] ? 'block' : 'hidden'} md:block mt-4 md:mt-4`}>
                        <p className="text-sm mb-3 text-sky-100">Aceptamos tarjetas:</p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                            <span className="px-3 py-1 rounded-lg bg-white/10 border border-white/20 text-xs font-medium">VISA</span>
                            <span className="px-3 py-1 rounded-lg bg-white/10 border border-white/20 text-xs font-medium">MasterCard</span>
                            <span className="px-3 py-1 rounded-lg bg-white/10 border border-white/20 text-xs font-medium">AmEx</span>
                        </div>
                        <p className="flex items-center gap-2 text-sm text-sky-100">
                            <Icon name="LockKey" className="text-xl" />
                            Tienda 100% segura
                        </p>
                    </div>
                </div>
            </div>

            <div className="border-t border-white/20">
                <div className="max-w-7xl mx-auto px-4 py-6 text-center text-xs md:text-sm text-sky-100 tracking-wide">
                    © 2025 LYRIUM BIOMARKETPLACE y sus afiliados. <br className="md:hidden" /> Todos los derechos reservados.
                </div>
            </div>

            <Link
                href="https://wa.me/51937093420"
                target="_blank"
                className="fixed bottom-5 right-5 bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-full shadow-lg hidden lg:flex items-center gap-2 text-base z-[100]"
            >
                <Icon name="WhatsAppLogo" className="text-2xl" />
                ¿Cómo puedo ayudarte?
            </Link>
        </footer>
    );
}
