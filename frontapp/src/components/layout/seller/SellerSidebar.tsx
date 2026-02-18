'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { sellerNavigation } from '@/lib/constants/seller-nav';
import Logo from '@/components/layout/shared/Logo';
import Icon from '@/components/ui/Icon';

export default function SellerSidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [selectedStore, setSelectedStore] = useState('store-1');

    // Mock stores data - replace with actual data
    const stores = [
        { id: 'store-1', name: 'Tienda Principal', status: 'active' },
        { id: 'store-2', name: 'Tienda Secundaria', status: 'active' },
        { id: 'store-3', name: 'Outlet', status: 'inactive' },
    ];

    const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

    return (
        <aside
            className={`fixed left-0 top-0 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 z-30 ${isCollapsed ? 'w-20' : 'w-64'
                }`}
        >
            {/* Header */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800">
                <Logo variant={isCollapsed ? 'compact' : 'default'} />
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    aria-label="Toggle sidebar"
                >
                    <svg
                        className={`w-5 h-5 text-gray-600 dark:text-gray-400 transition-transform ${isCollapsed ? 'rotate-180' : ''
                            }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                    </svg>
                </button>
            </div>

            {/* Store Selector */}
            {!isCollapsed && (
                <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                    <select
                        value={selectedStore}
                        onChange={(e) => setSelectedStore(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {stores.map((store) => (
                            <option key={store.id} value={store.id}>
                                {store.name}
                            </option>
                        ))}
                    </select>
                    <div className="mt-2 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                            Tienda activa
                        </span>
                    </div>
                </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-6">
                {sellerNavigation.map((section, sectionIdx) => (
                    <div key={sectionIdx}>
                        {!isCollapsed && (
                            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
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
                                            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${active
                                                ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                                }`}
                                            title={isCollapsed ? item.label : undefined}
                                        >
                                            {/* Icon */}
                                            <Icon
                                                name={item.icon || 'Circle'}
                                                className={`w-5 h-5 flex-shrink-0 ${active ? 'text-purple-600' : 'text-gray-400'}`}
                                            />

                                            {!isCollapsed && (
                                                <>
                                                    <span className="flex-1 text-sm font-medium">{item.label}</span>
                                                    {item.badge && (
                                                        <span
                                                            className={`px-2 py-0.5 text-xs rounded-full ${typeof item.badge === 'number'
                                                                ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300'
                                                                : 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300'
                                                                }`}
                                                        >
                                                            {item.badge}
                                                        </span>
                                                    )}
                                                </>
                                            )}
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
                <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                            Panel Vendedor
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                            Gestiona tus tiendas
                        </p>
                    </div>
                </div>
            )}
        </aside>
    );
}
