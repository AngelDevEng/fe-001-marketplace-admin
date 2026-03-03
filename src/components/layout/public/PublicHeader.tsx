'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Icon from '@/components/ui/Icon';
import TopBanner from './TopBanner';
import DesktopNav from './DesktopNav';
import MobileMenu from './MobileMenu';
import ThemeToggle from '@/components/layout/shared/ThemeToggle';
import { menuItems, megaMenuData } from '@/data/menuData';

export default function PublicHeader() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <>
            <TopBanner />
            <header className="bg-white dark:bg-[#111A15] shadow-sm sticky top-0 z-[999998]">
                <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 gap-6">
                    <Link href="/" className="flex items-center gap-3">
                        <Image src="/img/logo.png" alt="Logo" width={80} height={64} className="h-16 md:h-20 w-auto" />
                    </Link>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-3 text-xs lg:text-[13px] text-sky-600">
                            <ThemeToggle />
                            
                            <Link href="/login" className="flex items-center gap-1 hover:underline">
                                <Icon name="UserCircle" className="text-[18px]" />
                                <span className="whitespace-nowrap">Mi Cuenta</span>
                            </Link>

                            <Link href="#" className="flex items-center gap-1 hover:underline">
                                <Icon name="ShoppingCart" className="text-[18px]" />
                                <span>Carrito</span>
                                <span className="bg-sky-500 text-white text-[11px] rounded-full px-2 py-0.5">0</span>
                            </Link>
                        </div>

                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="lg:hidden text-3xl text-sky-600"
                            aria-label="Menú"
                        >
                            <Icon name="Menu" />
                        </button>
                    </div>
                </div>

                {/* Desktop Navigation con MegaMenu */}
                <DesktopNav menuItems={menuItems} megaMenuData={megaMenuData} />
            </header>

            {/* Mobile Menu */}
            <MobileMenu 
                isOpen={mobileMenuOpen} 
                onClose={() => setMobileMenuOpen(false)} 
                menuItems={menuItems} 
            />

            <Link
                href="https://wa.me/51999999999?text=Hola,%20tengo%20una%20consulta"
                target="_blank"
                className="fixed bottom-6 right-6 z-50 lg:hidden"
            >
                <div className="bg-green-500 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-green-600 transition-all duration-300 hover:scale-110">
                    <Icon name="WhatsAppLogo" className="text-3xl" />
                </div>
            </Link>
        </>
    );
}
