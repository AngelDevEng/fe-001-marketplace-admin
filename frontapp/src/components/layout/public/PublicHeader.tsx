'use client';

import { useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/Icon';
import TopBanner from './TopBanner';
import DesktopNav from './DesktopNav';
import MobileMenu from './MobileMenu';
import { menuItems, megaMenuData } from '@/data/menuData';

export default function PublicHeader() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <>
            <TopBanner />
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 gap-6">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <img
                            src="/img/iconologo.png"
                            alt="Lyrium Icono"
                            className="h-16 md:h-20 w-auto object-contain transition-transform duration-700 ease-out group-hover:rotate-[360deg]"
                        />
                        <img
                            src="/img/nombrelogo.png"
                            alt="Lyrium Nombre"
                            className="h-8 md:h-10 w-auto object-contain mt-1"
                        />
                    </Link>

                    <div className="flex items-center gap-4">
                        {/* Desktop: Session / Cart */}
                        <div className="hidden md:flex items-center gap-5 text-xs lg:text-[13px] text-sky-600">
                            <Link href="/login" className="flex items-center gap-1 hover:underline">
                                <Icon name="UserCircle" className="text-[18px]" />
                                <span className="whitespace-nowrap">Iniciar Sesión | Registrarse</span>
                            </Link>

                            <Link href="#" className="flex items-center gap-1 hover:underline">
                                <Icon name="ShoppingCart" className="text-[18px]" />
                                <span>Carrito</span>
                                <span className="bg-sky-500 text-white text-[11px] rounded-full px-2 py-0.5">0</span>
                            </Link>
                        </div>

                        {/* Hamburger button (mobile/tablet) */}
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="lg:hidden text-3xl text-sky-600"
                            aria-label="Menú"
                        >
                            <Icon name="Menu" />
                        </button>
                    </div>
                </div>

                {/* Desktop Nav con MegaMenu */}
                <DesktopNav menuItems={menuItems} megaMenuData={megaMenuData} />
            </header>

            {/* Mobile Menu (drawer con drill-down) */}
            <MobileMenu
                isOpen={mobileMenuOpen}
                onClose={() => setMobileMenuOpen(false)}
                menuItems={menuItems}
                megaMenuData={megaMenuData}
            />

            {/* WhatsApp floating button (mobile only) */}
            <Link
                href="https://wa.me/51999999999?text=Hola,%20tengo%20una%20consulta"
                target="_blank"
                className="fixed bottom-6 right-6 z-50 lg:hidden"
            >
                <div className="bg-green-500 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-green-600 transition-all duration-300 hover:scale-110">
                    <Icon name="MessageCircle" className="text-3xl" />
                </div>
            </Link>
        </>
    );
}
