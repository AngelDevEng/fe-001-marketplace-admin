'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { sellerNavigation } from '@/lib/constants/seller-nav';
import { useAuth } from '@/context/AuthContext';
import Icon from '@/components/ui/Icon';

export default function SellerSidebar() {
    const pathname = usePathname();
    const { user } = useAuth();
    const [isExpanded, setIsExpanded] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (mobile) setIsExpanded(false);
            else {
                const stored = localStorage.getItem('seller_sidebar_expanded');
                setIsExpanded(stored ? JSON.parse(stored) : true);
            }
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const toggleSidebar = () => {
        const newState = !isExpanded;
        setIsExpanded(newState);
        if (!isMobile) localStorage.setItem('seller_sidebar_expanded', JSON.stringify(newState));
    };

    const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

    const tiendaNombre = user?.display_name || "Mi Tienda";
    const userRoleText = user?.role === 'administrator' ? 'Administrador' : 'Vendedor Premium';

    return (
        <>
            <aside
                className={`bg-white fixed inset-y-0 left-0 md:sticky md:top-0 h-screen border-r border-sky-100 flex flex-col transition-all duration-500 ease-in-out z-[60] md:z-40 ${isExpanded ? 'w-72' : 'w-20'} ${!isExpanded && isMobile ? '-translate-x-full' : ''}`}
            >
                {/* 1. PERFIL DE USUARIO */}
                <div className={`p-4 border-b border-sky-100 bg-white/95 backdrop-blur flex items-center transition-all duration-500 ${!isExpanded && !isMobile ? 'justify-center px-2' : ''}`}>
                    <div className="flex items-center space-x-3 w-full">
                        <div className="relative flex-shrink-0">
                            {user?.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt="Usuario"
                                    className={`rounded-xl border-2 border-sky-200 shadow-sm object-cover transition-all duration-500 ${isExpanded ? 'w-11 h-11' : 'w-10 h-10'}`}
                                />
                            ) : (
                                <div className={`rounded-xl border-2 border-sky-200 shadow-sm transition-all duration-500 bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center text-white font-bold ${isExpanded ? 'w-11 h-11 text-base' : 'w-10 h-10 text-sm'}`}>
                                    {tiendaNombre.substring(0, 2).toUpperCase()}
                                </div>
                            )}
                            <span className="absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full bg-emerald-400"></span>
                        </div>

                        {(isExpanded || isMobile) && (
                            <div className="flex flex-col min-w-0 animate-fadeIn">
                                <p className="font-black text-xs text-gray-800 leading-tight truncate">
                                    {tiendaNombre}
                                </p>
                                <p className="text-[9px] mt-0.5 uppercase font-black tracking-widest text-sky-500">
                                    {userRoleText}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. HEADER DE CONTROL */}
                <div className="flex items-center justify-between p-4 px-6 border-b border-gray-50 bg-gray-50/20">
                    {(isExpanded || isMobile) && (
                        <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] animate-fadeIn">
                            Gestión Comercial
                        </h2>
                    )}
                    <button onClick={toggleSidebar} className={`p-2 hover:bg-white hover:text-sky-500 rounded-xl transition-all duration-300 ${!isExpanded && !isMobile ? 'mx-auto' : ''}`}>
                        <Icon name="ChevronLeft" className={`transition-transform duration-500 ${!isExpanded ? 'rotate-180' : ''} w-4 h-4`} />
                    </button>
                </div>

                {/* 3. NAVEGACIÓN MÓDULOS */}
                <div className="flex-1 overflow-y-auto custom-scrollbar py-6">
                    <nav className="space-y-1.5 px-4">
                        {(isExpanded || isMobile) && (
                            <div className="flex items-center gap-2 mb-4 px-2">
                                <span className="w-1.5 h-1.5 bg-sky-400 rounded-full"></span>
                                <h3 className="text-[9px] font-black text-sky-500/80 uppercase tracking-[0.2em]">
                                    Mi Ecosistema
                                </h3>
                            </div>
                        )}

                        {sellerNavigation.map((module) => {
                            const active = isActive(module.href);
                            return (
                                <Link
                                    key={module.id}
                                    href={module.href}
                                    className={`
                                        relative group block transition-all duration-500 overflow-hidden rounded-2xl mb-2
                                        ${active ? 'bg-brand-gradient shadow-lg shadow-sky-100/50' : 'hover:bg-sky-50/50'}
                                    `}
                                >
                                    <div className={`grid ${isExpanded || isMobile ? 'grid-cols-[80%_20%]' : 'grid-cols-1'} items-center h-14 relative z-10 transition-all duration-500`}>
                                        <div className={`flex items-center h-full transition-all duration-500 ${active ? 'bg-white rounded-r-[80px]' : 'bg-transparent'}`}>
                                            <div className={`flex items-center justify-center transition-all duration-500 ${isExpanded || isMobile ? 'w-14' : 'w-20'}`}>
                                                <div className={`
                                                    w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500
                                                    ${active ? 'bg-sky-50 text-sky-600 shadow-inner' : 'bg-sky-50/50 text-gray-400 group-hover:text-sky-500 group-hover:bg-white'}
                                                `}>
                                                    <Icon name={module.icon} className="w-5 h-5" />
                                                </div>
                                            </div>

                                            {(isExpanded || isMobile) && (
                                                <span className={`text-[13px] font-black whitespace-nowrap flex-1 transition-all duration-500 pr-4 ${active ? 'text-gray-900' : 'text-gray-600 group-hover:text-gray-900'}`}>
                                                    {module.label}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* 4. FOOTER */}
                {(isExpanded || isMobile) && (
                    <div className="mt-auto px-6 py-4 border-t border-sky-50 bg-gray-50/30 animate-fadeIn">
                        <div className="flex items-center justify-between opacity-60">
                            <span className="flex items-center gap-1.5 text-[10px] font-black text-sky-600">
                                <Icon name="Zap" className="w-3 h-3" />
                                <span>LYRIUM © 2025</span>
                            </span>
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                v4.0 SPA
                            </span>
                        </div>
                    </div>
                )}
            </aside>

            {isMobile && isExpanded && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm opacity-100 transition-all duration-500 z-[55]" onClick={() => setIsExpanded(false)} />
            )}
        </>
    );
}
