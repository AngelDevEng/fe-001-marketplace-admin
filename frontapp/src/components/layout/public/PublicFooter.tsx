'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
                        <Image src="/img/logo_lyrium_blanco_01-scaled.webp" alt="Lyrium" width={120} height={48} className="h-10 md:h-12 w-auto object-contain" />
                    </div>
                    <p className="text-sm text-sky-100 max-w-xs">Biomarketplace de productos y servicios especializados.</p>
                    <div className="flex items-center gap-4 mt-2">
                        <a href="https://www.instagram.com/lyrium_biomarketplace/" target="_blank" rel="noopener noreferrer" className="social-icon-btn" title="Síguenos en Instagram">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                            </svg>
                        </a>
                        <a href="https://www.facebook.com/people/Lyrium-Biomarketplace/61579938364350/" target="_blank" rel="noopener noreferrer" className="social-icon-btn" title="Síguenos en Facebook">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                            </svg>
                        </a>
                        <a href="https://www.tiktok.com/@lyrium.biomarkep" target="_blank" rel="noopener noreferrer" className="social-icon-btn" title="Síguenos en TikTok">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                            </svg>
                        </a>
                        <a href="https://wa.me/51937093420" target="_blank" rel="noopener noreferrer" className="social-icon-btn" title="Escríbenos por WhatsApp">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                            </svg>
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
