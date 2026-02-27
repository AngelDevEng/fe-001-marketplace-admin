'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Icon from '@/components/ui/Icon';
import { MenuItem, MegaCategoryData } from '@/data/menuData';

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    menuItems: MenuItem[];
    megaMenuData: Record<string, MegaCategoryData>;
}

// Icon name mapping for Lucide icons
const iconNameMap: Record<string, string> = {
    'shopping-bag': 'ShoppingBag',
    'headset': 'Headset',
    'info': 'Info',
    'newspaper': 'Newspaper',
    'chats-circle': 'MessageCircle',
    'storefront': 'Store',
    'buildings': 'Building2',
    'phone-call': 'PhoneCall',
};

export default function MobileMenu({ isOpen, onClose, menuItems, megaMenuData }: MobileMenuProps) {
    // Navigation state: 0 = main, 1 = subcategories, 2 = category detail
    const [menuLevel, setMenuLevel] = useState(0);
    const [activeParent, setActiveParent] = useState<MenuItem | null>(null);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    // PHP brand identity colors per drill-down level
    const levelColors: Record<number, string> = {
        0: '#ffffff',  // Nivel 0 - Blanco
        1: '#CEE86B',  // Nivel 1 - Verde Lima
        2: '#C0FDDF',  // Nivel 2 - Verde Menta
        3: '#7AC9EB',  // Nivel 3 - Azul
    };

    // Body scroll lock
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Reset to level 0 when menu closes
    useEffect(() => {
        if (!isOpen) {
            const timer = setTimeout(() => {
                setMenuLevel(0);
                setActiveParent(null);
                setActiveCategory(null);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    // Navigate to subcategories (level 1)
    const goToSubcategories = useCallback((item: MenuItem) => {
        setActiveParent(item);
        setMenuLevel(1);
    }, []);

    // Navigate to category detail (level 2)
    const goToCategoryDetail = useCallback((categoryName: string) => {
        setActiveCategory(categoryName);
        setMenuLevel(2);
    }, []);

    // Go back
    const goBack = useCallback(() => {
        if (menuLevel === 2) {
            setMenuLevel(1);
            setActiveCategory(null);
        } else if (menuLevel === 1) {
            setMenuLevel(0);
            setActiveParent(null);
        }
    }, [menuLevel]);

    // Close and navigate
    const handleLinkClick = useCallback(() => {
        setTimeout(onClose, 200);
    }, [onClose]);

    const categoryData = activeCategory ? megaMenuData[activeCategory] : null;

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 z-[100] transition-opacity duration-300 lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
            />

            {/* Drawer */}
            <div
                className={`fixed top-0 left-0 h-full w-[85vw] max-w-md bg-white z-[101] transform transition-transform duration-300 ease-out shadow-2xl lg:hidden flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                {/* ===== 1. HEADER — Logo + Close ===== */}
                <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center shrink-0 bg-white z-20">
                    <div className="flex items-center gap-2">
                        <img
                            src="/img/iconologo.png"
                            alt="Lyrium Icono"
                            className="h-14 w-auto object-contain"
                        />
                        <img
                            src="/img/nombrelogo.png"
                            alt="Lyrium Nombre"
                            className="h-8 w-auto object-contain"
                        />
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-800 text-3xl p-1"
                        aria-label="Cerrar menú"
                    >
                        <Icon name="X" />
                    </button>
                </div>

                {/* ===== 2. SECONDARY NAV HEADER — Back button (visible on level 1+) ===== */}
                {menuLevel > 0 && (
                    <div className="flex items-center px-5 py-3 bg-gray-50 border-b border-gray-100 shrink-0">
                        <button
                            onClick={goBack}
                            className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors group"
                        >
                            <div
                                className="rounded-full p-1.5 transition-colors border"
                                style={{
                                    backgroundColor: menuLevel <= 1 ? '#ffffff' : 'transparent',
                                    borderColor: menuLevel <= 1 ? '#e5e7eb' : levelColors[menuLevel - 1],
                                }}
                            >
                                <Icon
                                    name="ChevronLeft"
                                    className="text-lg"
                                    style={{ color: menuLevel <= 1 ? '#4b5563' : levelColors[menuLevel - 1] }}
                                />
                            </div>
                            <span className="font-bold text-base text-gray-700 group-hover:text-green-700">
                                {menuLevel === 2 && activeParent
                                    ? activeParent.label
                                    : 'Menú principal'}
                            </span>
                        </button>
                    </div>
                )}

                {/* ===== 3. SCROLLABLE CONTENT ===== */}
                <div className="flex-1 overflow-y-auto relative bg-white">
                    {/* === LEVEL 0: Main Menu === */}
                    <div
                        className="absolute inset-0 transition-all duration-300 ease-out overflow-y-auto"
                        style={{
                            transform: `translateX(${menuLevel === 0 ? '0%' : '-100%'})`,
                            opacity: menuLevel === 0 ? 1 : 0,
                            pointerEvents: menuLevel === 0 ? 'auto' : 'none',
                        }}
                    >
                        <div className="py-2">
                            {/* Inicio link */}
                            <Link
                                href="/"
                                onClick={handleLinkClick}
                                className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition group"
                            >
                                <Icon name="Home" className="text-xl text-gray-600 group-hover:scale-110 transition-transform" />
                                <span className="text-gray-800 text-[15px] font-medium">Inicio</span>
                            </Link>

                            {/* Menu items */}
                            {menuItems.map((item) => {
                                const iconName = item.icon ? iconNameMap[item.icon] || item.icon : 'ChevronRight';
                                const hasChildren = item.children && item.children.length > 0;

                                if (hasChildren) {
                                    return (
                                        <button
                                            key={item.label}
                                            onClick={() => goToSubcategories(item)}
                                            className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Icon name={iconName} className="text-xl text-gray-600 group-hover:scale-110 transition-transform" />
                                                <span className="text-gray-800 text-[15px] font-medium">{item.label}</span>
                                            </div>
                                            <Icon name="ChevronRight" className="text-gray-400 text-sm" />
                                        </button>
                                    );
                                }

                                return (
                                    <Link
                                        key={item.label}
                                        href={item.href}
                                        onClick={handleLinkClick}
                                        className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon name={iconName} className="text-xl text-gray-600 group-hover:scale-110 transition-transform" />
                                            <span className="text-gray-800 text-[15px] font-medium">{item.label}</span>
                                        </div>
                                        <Icon name="ChevronRight" className="text-gray-400 text-sm" />
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* === LEVEL 1: Subcategories === */}
                    <div
                        className="absolute inset-0 transition-all duration-300 ease-out overflow-y-auto"
                        style={{
                            transform: `translateX(${menuLevel === 1 ? '0%' : menuLevel === 0 ? '100%' : '-100%'})`,
                            opacity: menuLevel === 1 ? 1 : 0,
                            pointerEvents: menuLevel === 1 ? 'auto' : 'none',
                        }}
                    >
                        {activeParent && (
                            <div className="py-0">
                                {/* Section header — colored banner (Level 1 = Verde Lima) */}
                                <div
                                    className="flex items-center justify-between px-5 py-4 sticky top-0 z-10 shadow-md"
                                    style={{ backgroundColor: levelColors[1] }}
                                >
                                    <span className="font-bold text-lg text-gray-800">{activeParent.label}</span>
                                    <Link
                                        href={activeParent.href}
                                        onClick={handleLinkClick}
                                        className="text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wide whitespace-nowrap hover:brightness-95 transform hover:scale-105 transition shadow-sm"
                                        style={{ backgroundColor: 'rgba(255,255,255,0.9)', color: '#000000' }}
                                    >
                                        Ver todo
                                    </Link>
                                </div>

                                {/* Subcategory items — no extra "Ver todo" link needed */}

                                {/* Subcategory items */}
                                {activeParent.children?.map((child) => {
                                    const hasMegaData = megaMenuData[child.label] !== undefined;

                                    if (hasMegaData) {
                                        return (
                                            <button
                                                key={child.label}
                                                onClick={() => goToCategoryDetail(child.label)}
                                                className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition group"
                                            >
                                                <span className="text-gray-700 text-[14px] font-medium">{child.label}</span>
                                                <Icon name="ChevronRight" className="text-gray-400 text-sm" />
                                            </button>
                                        );
                                    }

                                    return (
                                        <Link
                                            key={child.label}
                                            href={child.href}
                                            onClick={handleLinkClick}
                                            className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition"
                                        >
                                            <span className="text-gray-700 text-[14px] font-medium">{child.label}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* === LEVEL 2: Category Detail (icons + columns) === */}
                    <div
                        className="absolute inset-0 transition-all duration-300 ease-out overflow-y-auto"
                        style={{
                            transform: `translateX(${menuLevel === 2 ? '0%' : '100%'})`,
                            opacity: menuLevel === 2 ? 1 : 0,
                            pointerEvents: menuLevel === 2 ? 'auto' : 'none',
                        }}
                    >
                        {categoryData && activeCategory && (
                            <div className="py-0 px-0">
                                {/* Category title — colored banner (Level 2 = Verde Menta) */}
                                <div
                                    className="flex items-center justify-between px-5 py-4 sticky top-0 z-10 shadow-md"
                                    style={{ backgroundColor: levelColors[2] }}
                                >
                                    <span className="font-bold text-lg text-gray-800">{activeCategory}</span>
                                    <Link
                                        href="#"
                                        onClick={handleLinkClick}
                                        className="text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wide whitespace-nowrap hover:brightness-95 transform hover:scale-105 transition shadow-sm"
                                        style={{ backgroundColor: 'rgba(255,255,255,0.9)', color: '#000000' }}
                                    >
                                        Ver todo
                                    </Link>
                                </div>

                                {/* Circular icons grid */}
                                <div className="grid grid-cols-3 gap-3 mb-6 px-4 pt-4">
                                    {categoryData.icons.map((icon, i) => (
                                        <Link
                                            key={i}
                                            href={icon.href || '#'}
                                            onClick={handleLinkClick}
                                            className="group text-center"
                                        >
                                            <div className="mx-auto w-[72px] h-[72px] rounded-full bg-lime-500/20 border border-lime-200 flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-[1.04] transition">
                                                <Image
                                                    src={icon.img}
                                                    alt={icon.title}
                                                    width={48}
                                                    height={48}
                                                    className="w-10 h-10 object-contain"
                                                />
                                            </div>
                                            <div className="mt-1.5 text-[11px] font-semibold text-gray-700 group-hover:text-sky-600 transition leading-tight">
                                                {icon.title}
                                            </div>
                                        </Link>
                                    ))}
                                </div>

                                {/* Divider */}
                                <div className="h-px bg-lime-400/60 mb-4" />

                                {/* Columns */}
                                <div className="space-y-5">
                                    {categoryData.cols.map((col, i) => (
                                        <div key={i}>
                                            <div className="text-[12px] font-extrabold tracking-wide text-gray-900 uppercase mb-2">
                                                {col.h}
                                            </div>
                                            <ul className="space-y-1.5">
                                                {col.items.map((item, j) => (
                                                    <li key={j}>
                                                        <Link
                                                            href="#"
                                                            onClick={handleLinkClick}
                                                            className="text-[13px] text-gray-600 hover:text-sky-600 transition"
                                                        >
                                                            {item}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* ===== 4. FOOTER — Account / Cart / Theme (visible on level 0) ===== */}
                {menuLevel === 0 && (
                    <div className="p-5 border-t border-gray-200 bg-gray-50 space-y-4 shrink-0">
                        <Link
                            href="/login"
                            onClick={handleLinkClick}
                            className="flex items-center gap-3 text-gray-700 hover:text-sky-600 transition group"
                        >
                            <Icon name="UserCircle" className="text-3xl text-sky-600 group-hover:scale-110 transition-transform" />
                            <span className="font-medium text-lg">Mi Cuenta / Registrarse</span>
                        </Link>

                        <Link
                            href="#"
                            className="flex items-center gap-3 text-gray-700 hover:text-sky-600 transition group"
                        >
                            <div className="relative">
                                <Icon name="ShoppingCart" className="text-3xl text-sky-600 group-hover:scale-110 transition-transform" />
                                <span className="absolute -top-1 -right-1 bg-sky-500 text-white text-[11px] rounded-full w-5 h-5 flex items-center justify-center">
                                    0
                                </span>
                            </div>
                            <span className="font-medium text-lg">Carrito</span>
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
}
