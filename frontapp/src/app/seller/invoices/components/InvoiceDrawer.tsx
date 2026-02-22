'use client';

import React, { useEffect, useState } from 'react';
import ModalPortal from '@/components/ModalPortal';
import Icon from '@/components/ui/Icon';

interface BaseDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    subtitle?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    width?: string;
    accentColor?: string;
    badge?: string;
}

const fileColorClasses: Record<string, { bg: string; bgIcon: string; textIcon: string; shadow: string }> = {
    PDF: { bg: 'hover:bg-rose-500/5', bgIcon: 'bg-rose-50', textIcon: 'text-rose-500', shadow: 'shadow-rose-100/50' },
    XML: { bg: 'hover:bg-emerald-500/5', bgIcon: 'bg-emerald-50', textIcon: 'text-emerald-500', shadow: 'shadow-emerald-100/50' },
    CDR: { bg: 'hover:bg-sky-500/5', bgIcon: 'bg-sky-50', textIcon: 'text-sky-500', shadow: 'shadow-sky-100/50' },
};

export default function InvoiceDrawer({
    isOpen,
    onClose,
    title,
    subtitle,
    children,
    footer,
    width = 'md:w-[600px]',
    accentColor = 'from-sky-500/10 via-indigo-500/5',
    badge
}: BaseDrawerProps) {
    const [shouldRender, setShouldRender] = useState(isOpen);

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            const prevOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            return () => { document.body.style.overflow = prevOverflow; };
        } else {
            const timer = setTimeout(() => {
                setShouldRender(false);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!shouldRender) return null;

    return (
        <ModalPortal>
            <div className="fixed inset-0 z-[99999] flex justify-end overflow-hidden">
                <div
                    className={`absolute inset-0 bg-gray-900/60 backdrop-blur-md transition-opacity duration-500 ease-in-out
                        ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                    onClick={onClose}
                ></div>

                <div className={`relative h-full bg-white shadow-[-40px_0_80px_-20px_rgba(0,0,0,0.15)] transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) flex flex-col w-full ${width}
                    ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

                    <div className={`absolute top-0 left-0 right-0 h-64 bg-gradient-to-br ${accentColor} to-transparent -z-10 blur-3xl opacity-60`}></div>

                    <div className="p-10 flex items-center justify-between border-b border-gray-50/50 backdrop-blur-2xl bg-white/30 sticky top-0 z-20">
                        <div className="flex-1 min-w-0 pr-4">
                            {badge && (
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-[10px] font-black text-sky-600 uppercase tracking-widest border border-sky-200/50 px-2 py-1 rounded-lg bg-sky-50 shadow-sm shadow-sky-100/50">
                                        {badge}
                                    </span>
                                </div>
                            )}
                            {title && (
                                <h2 className="text-4xl font-black text-gray-800 tracking-tighter leading-none truncate">
                                    {title}
                                </h2>
                            )}
                            {subtitle && (
                                <p className="text-xs text-gray-400 font-bold mt-3 uppercase tracking-widest flex items-center gap-2">
                                    {subtitle}
                                </p>
                            )}
                        </div>
                        <button
                            onClick={onClose}
                            className="w-14 h-14 flex items-center justify-center bg-white border border-gray-100 rounded-[2rem] shadow-xl shadow-gray-100/50 hover:bg-rose-50 hover:text-rose-500 hover:border-rose-100 transition-all active:scale-90 group shrink-0"
                        >
                            <Icon name="X" className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar relative z-10">
                        {children}
                    </div>

                    {footer && (
                        <div className="p-10 border-t border-gray-50 bg-white/80 backdrop-blur-xl flex gap-4 relative z-20">
                            {footer}
                        </div>
                    )}
                </div>
            </div>
        </ModalPortal>
    );
}
