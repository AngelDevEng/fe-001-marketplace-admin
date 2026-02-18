'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { adminNavigation } from '@/lib/constants/admin-nav';
import Logo from '@/components/layout/shared/Logo';
import Icon from '@/components/ui/Icon';

export default function AdminSidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);

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

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-6">
                {adminNavigation.map((section, sectionIdx) => (
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
                                                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                                }`}
                                            title={isCollapsed ? item.label : undefined}
                                        >
                                            {/* Icon */}
                                            <Icon
                                                name={item.icon || 'Circle'}
                                                className={`w-5 h-5 flex-shrink-0 ${active ? 'text-blue-600' : 'text-gray-400'}`}
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
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                            Panel Admin
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                            Acceso completo al sistema
                        </p>
                    </div>
                </div>
            )}
        </aside>
    );
}
