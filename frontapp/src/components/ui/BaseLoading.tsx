import React from 'react';
import Icon from './Icon';

interface BaseLoadingProps {
    message?: string;
    fullPage?: boolean;
    variant?: 'spinner' | 'shimmer' | 'dots';
}

export default function BaseLoading({
    message = 'Sincronizando datos...',
    fullPage = false,
    variant = 'spinner'
}: BaseLoadingProps) {
    const content = (
        <div className="flex flex-col items-center justify-center gap-6 p-12 text-center animate-fadeIn">
            {variant === 'spinner' && (
                <div className="relative">
                    <div className="w-16 h-16 border-[6px] border-sky-100 rounded-full"></div>
                    <div className="w-16 h-16 border-[6px] border-t-sky-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Icon name="Zap" className="text-sky-500 text-lg animate-pulse" />
                    </div>
                </div>
            )}

            {variant === 'dots' && (
                <div className="flex gap-2">
                    <div className="w-3 h-3 bg-sky-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-3 h-3 bg-sky-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-3 h-3 bg-sky-500 rounded-full animate-bounce"></div>
                </div>
            )}

            <div className="space-y-1">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-1">
                    {message}
                </p>
                <div className="w-32 h-1 bg-gray-100 rounded-full overflow-hidden mx-auto">
                    <div className="w-full h-full bg-sky-500 origin-left animate-loadingBar"></div>
                </div>
            </div>
        </div>
    );

    if (fullPage) {
        return (
            <div className="fixed inset-0 z-[100000] bg-white/80 backdrop-blur-xl flex items-center justify-center">
                {content}
            </div>
        );
    }

    return content;
}
