'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { adminNavigation } from '@/lib/constants/admin-nav';
import Logo from '@/components/layout/shared/Logo';

export default function AdminSidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

    return (
        <aside
            className={`fixed left-0 top-0 h-screen bg-white border-r border-sky-100 transition-all duration-300 z-30 ${isCollapsed ? 'w-20' : 'w-64'
                }`}
        >
            {/* Header */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-sky-100">
                <Logo variant={isCollapsed ? 'compact' : 'default'} />
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    aria-label="Toggle sidebar"
                >
                    <svg
                        className={`w-5 h-5 text-gray-600 transition-transform ${isCollapsed ? 'rotate-180' : ''
                            }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                    </svg>
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-6">
                {adminNavigation.map((section, sectionIdx) => (
                    <div key={sectionIdx}>
                        {!isCollapsed && (
                            <h3 className="text-[9px] font-black text-sky-500/80 uppercase tracking-[0.2em] mb-3">
                                {section.title}
                            </h3>
                        )}
                        <ul className="space-y-1">
                            {section.items.map((item, itemIdx) => {
                                const active = isActive(item.href);
                                return (
                                    <li key={itemIdx}>
                                        <Link
                                            href={item.href}
                                            className={`relative group block transition-all duration-500 overflow-hidden rounded-2xl mb-2 ${active ? 'bg-brand-gradient shadow-lg shadow-brand-sky/20' : 'hover:bg-brand-sky/5'
                                                }`}
                                            title={isCollapsed ? item.label : undefined}
                                        >
                                            <div className="grid grid-cols-[80%_20%] items-center h-14 relative z-10 transition-all duration-500">
                                                {/* Content Wrapper */}
                                                <div className={`flex items-center h-full transition-all duration-500 ${active ? 'bg-white rounded-r-[80px] shadow-[10px_0_15px_-5px_rgba(0,0,0,0.05)]' : 'bg-transparent'
                                                    }`}>
                                                    {/* Icon Container */}
                                                    <div className={`flex items-center justify-center transition-all duration-500 ${isCollapsed ? 'w-20' : 'w-14'}`}>
                                                        <div className={`
                                                            w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500
                                                            ${active ? 'bg-brand-sky/10 text-brand-sky shadow-inner' : 'bg-gray-100 text-gray-400 group-hover:text-brand-sky group-hover:bg-white text-lg'}
                                                        `}>
                                                            <i className={`ph-bold ${item.icon} text-lg`}></i>
                                                        </div>
                                                    </div>

                                                    {/* Label */}
                                                    {!isCollapsed && (
                                                        <span className={`text-[13px] font-black whitespace-nowrap flex-1 transition-all duration-500 pr-4 ${active ? 'text-gray-900' : 'text-gray-600 group-hover:text-gray-900'
                                                            }`}>
                                                            {item.label}
                                                        </span>
                                                    )}
                                                </div>
                                                {/* The 20% empty space reveals the gradient background */}
                                                <div className="h-full"></div>
                                            </div>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </nav>

            {/* Footer */}
            {!isCollapsed && (
                <div className="mt-auto px-6 py-4 border-t border-blue-50 bg-gray-50/50">
                    <div className="flex items-center justify-between opacity-60">
                        <span className="flex items-center gap-1.5 text-[10px] font-black text-brand-sky">
                            <i className="ph-fill ph-lightning-bolt text-xs"></i>
                            <span>LYRIUM © 2025</span>
                        </span>
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                            v4.0 SPA
                        </span>
                    </div>
                </div>
            )}
        </aside>
    );
}
