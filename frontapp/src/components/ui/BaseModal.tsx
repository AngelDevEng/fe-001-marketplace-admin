'use client';

import React, { useEffect, useState } from 'react';
import ModalPortal from '@/components/ModalPortal';
import Icon from '@/components/ui/Icon';

interface BaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    subtitle?: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | 'full';
    showCloseButton?: boolean;
    accentColor?: string; // e.g., 'from-sky-500 to-indigo-500'
}

const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-xl',
    xl: 'max-w-2xl',
    '2xl': 'max-w-3xl',
    '4xl': 'max-w-5xl',
    full: 'max-w-[95vw] h-[90vh]'
};

export default function BaseModal({
    isOpen,
    onClose,
    title,
    subtitle,
    children,
    size = 'xl',
    showCloseButton = true,
    accentColor = 'from-sky-400 to-indigo-400'
}: BaseModalProps) {
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
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!shouldRender) return null;

    return (
        <ModalPortal>
            <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
                {/* Backdrop */}
                <div
                    className={`absolute inset-0 bg-gray-900/60 backdrop-blur-md transition-opacity duration-300 ease-out
                        ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                    onClick={onClose}
                ></div>

                {/* Content Card */}
                <div
                    className={`bg-white w-full ${sizeClasses[size]} max-h-[85vh] rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden transition-all duration-300 ease-out border border-gray-100 flex flex-col
                        ${isOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}
                >
                    {/* Top Accent Decorator */}
                    <div className={`h-1.5 w-full bg-gradient-to-r ${accentColor}`}></div>

                    {/* Header */}
                    {(title || subtitle || showCloseButton) && (
                        <div className="p-6 md:p-8 pb-4 flex justify-between items-start bg-white/50 backdrop-blur-sm sticky top-0 z-20 border-b border-gray-50/50">
                            <div className="flex-1 min-w-0 pr-4">
                                {title && (
                                    <h2 className="text-2xl md:text-3xl font-black text-gray-800 tracking-tighter leading-none truncate">
                                        {title}
                                    </h2>
                                )}
                                {subtitle && (
                                    <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2 px-0.5 truncate">
                                        {subtitle}
                                    </p>
                                )}
                            </div>
                            {showCloseButton && (
                                <button
                                    onClick={onClose}
                                    className="w-10 h-10 md:w-12 md:h-12 bg-gray-50 text-gray-400 rounded-2xl md:rounded-[1.25rem] flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 transition-all duration-300 active:scale-90 group border border-gray-100/50 shadow-sm shrink-0"
                                >
                                    <Icon name="X" className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                                </button>
                            )}
                        </div>
                    )}

                    {/* Body */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 pt-4 md:pt-4">
                        {children}
                    </div>
                </div>
            </div>
        </ModalPortal>
    );
}
