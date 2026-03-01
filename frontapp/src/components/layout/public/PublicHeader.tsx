'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Icon from '@/components/ui/Icon';
import TopBanner from './TopBanner';

const navItems = [
    { label: 'PRODUCTOS', href: '/productos', icon: 'ShoppingBag' },
    { label: 'SERVICIOS', href: '/servicios', icon: 'Headset' },
    { label: 'NOSOTROS', href: '/nosotros', icon: 'Info' },
    { label: 'REGISTRA TU TIENDA', href: '/login', icon: 'Storefront' },
    { label: 'TIENDAS REGISTRADAS', href: '/tiendasregistradas', icon: 'Buildings' },
    { label: 'CONTÁCTANOS', href: '/contactanos', icon: 'PhoneCall' },
    { label: 'BIOBLOG', href: '/bioblog', icon: 'Newspaper' },
    { label: 'BIOFORO', href: '/bioforo', icon: 'ChatCircle' },
];

export default function PublicHeader() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <>
            <TopBanner />
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 gap-6">
                    <Link href="/" className="flex items-center gap-3">
                        <Image src="/img/logo.png" alt="Logo" width={80} height={64} className="h-16 md:h-20 w-auto" />
                    </Link>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-5 text-xs lg:text-[13px] text-sky-600">
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

                <div className="border-t border-gray-100">
                    <nav className="max-w-7xl mx-auto px-4 py-2 hidden lg:flex items-center justify-center gap-6 text-[13px] font-medium text-gray-800 tracking-tight">
                        {navItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="flex items-center gap-1 hover:text-sky-500 transition whitespace-nowrap"
                            >
                                <Icon name={item.icon} className="text-[17px]" />
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            </header>

            <div
                role="button"
                tabIndex={0}
                aria-label="Cerrar menú"
                className={`fixed inset-0 bg-black bg-opacity-50 z-[100] transition-opacity duration-300 lg:hidden cursor-default ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setMobileMenuOpen(false)}
                onKeyDown={(e) => e.key === 'Escape' && setMobileMenuOpen(false)}
            />

            <div
                className={`fixed top-0 left-0 h-full w-[280px] bg-white z-[101] transform transition-transform duration-300 ease-out shadow-2xl lg:hidden overflow-y-auto ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <Image src="/img/logo.png" alt="Lyrium Logo" width={60} height={48} className="h-12 w-auto" />
                        <button
                            onClick={() => setMobileMenuOpen(false)}
                            className="text-gray-600 hover:text-gray-800 text-2xl"
                            aria-label="Cerrar menú"
                        >
                            <Icon name="X" />
                        </button>
                    </div>
                </div>

                <div className="px-4 py-3 border-b border-gray-100">
                    <Link href="/" className="flex items-center gap-3 text-gray-800 font-medium hover:text-green-600 transition">
                        <span className="text-sm">Inicio</span>
                    </Link>
                </div>

                <div className="px-4 py-3 border-b border-gray-100 space-y-3">
                    <Link href="/login" className="flex items-center gap-2 text-sky-600 font-semibold hover:text-sky-700 transition">
                        <Icon name="UserCircle" className="text-lg" />
                        <span className="text-sm">Iniciar Sesión | Registrarse</span>
                    </Link>

                    <Link href="#" className="flex items-center gap-2 text-sky-600 font-semibold hover:text-sky-700 transition">
                        <Icon name="ShoppingCart" className="text-lg" />
                        <span className="text-sm">Carrito</span>
                        <span className="bg-sky-500 text-white text-[11px] rounded-full px-2 py-0.5">0</span>
                    </Link>
                </div>

                <div className="py-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition group"
                        >
                            <div className="flex items-center gap-3">
                                <Icon name={item.icon} className="text-xl text-gray-600 group-hover:scale-110 transition-transform" />
                                <span className="text-gray-800 text-sm font-medium">{item.label}</span>
                            </div>
                            <Icon name="ChevronRight" className="text-gray-400 text-sm" />
                        </Link>
                    ))}
                </div>
            </div>

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
