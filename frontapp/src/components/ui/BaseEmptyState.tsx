import React from 'react';
import BaseButton from './BaseButton';
import Icon from './Icon';

interface BaseEmptyStateProps {
    title: string;
    description: string;
    icon?: string;
    actionLabel?: string;
    onAction?: () => void;
    suggestion?: string;
}

export default function BaseEmptyState({
    title,
    description,
    icon = 'Search',
    actionLabel,
    onAction,
    suggestion
}: BaseEmptyStateProps) {
    return (
        <div className="w-full py-24 flex flex-col items-center justify-center text-center px-6 bg-white rounded-[3rem] border border-gray-100 shadow-sm relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-transparent"></div>

            <div className="relative z-10 space-y-8 max-w-md">
                <div className="relative inline-block">
                    <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center shadow-inner border border-gray-100 text-gray-200 group-hover:scale-110 group-hover:text-sky-500 transition-all duration-700 ease-out">
                        <Icon name={icon} className="w-12 h-12 stroke-[1.5px]" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-2xl shadow-lg border border-gray-50 flex items-center justify-center text-gray-300">
                        <Icon name="Info" className="w-5 h-5" />
                    </div>
                </div>

                <div className="space-y-3">
                    <h3 className="text-2xl font-black text-gray-800 tracking-tighter">
                        {title}
                    </h3>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
                        {description}
                    </p>
                </div>

                {suggestion && (
                    <div className="py-3 px-6 bg-sky-50 rounded-2xl border border-sky-100 inline-block">
                        <p className="text-[10px] font-black text-sky-600 uppercase tracking-tighter flex items-center justify-center">
                            <Icon name="Lightbulb" className="w-3.5 h-3.5 mr-2" /> TIP: {suggestion}
                        </p>
                    </div>
                )}

                {actionLabel && onAction && (
                    <div className="pt-4">
                        <BaseButton onClick={onAction} variant="dark" size="lg">
                            {actionLabel}
                        </BaseButton>
                    </div>
                )}
            </div>
        </div>
    );
}
