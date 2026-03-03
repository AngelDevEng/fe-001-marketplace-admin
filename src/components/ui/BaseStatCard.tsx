import React from 'react';
import Icon from './Icon';

interface BaseStatCardProps {
    label: string;
    value: string | number;
    suffix?: string;
    description?: string;
    icon: string;
    trend?: {
        value: string | number;
        isPositive: boolean;
    };
    color?: 'sky' | 'emerald' | 'amber' | 'indigo' | 'rose' | 'violet';
    isLoading?: boolean;
    chart?: React.ReactNode;
}

const colorMap = {
    sky: {
        bg: 'bg-sky-500/5',
        iconBg: 'bg-sky-500',
        text: 'text-sky-600',
        border: 'border-sky-100/50',
        shadow: 'shadow-sky-100'
    },
    emerald: {
        bg: 'bg-emerald-500/5',
        iconBg: 'bg-emerald-500',
        text: 'text-emerald-600',
        border: 'border-emerald-100/50',
        shadow: 'shadow-emerald-100'
    },
    amber: {
        bg: 'bg-amber-500/5',
        iconBg: 'bg-amber-500',
        text: 'text-amber-600',
        border: 'border-amber-100/50',
        shadow: 'shadow-amber-100'
    },
    indigo: {
        bg: 'bg-indigo-500/5',
        iconBg: 'bg-indigo-500',
        text: 'text-indigo-600',
        border: 'border-indigo-100/50',
        shadow: 'shadow-indigo-100'
    },
    rose: {
        bg: 'bg-rose-500/5',
        iconBg: 'bg-rose-500',
        text: 'text-rose-600',
        border: 'border-rose-100/50',
        shadow: 'shadow-rose-100'
    },
    violet: {
        bg: 'bg-violet-500/5',
        iconBg: 'bg-violet-500',
        text: 'text-violet-600',
        border: 'border-violet-100/50',
        shadow: 'shadow-violet-100'
    }
};

export default function BaseStatCard({
    label,
    value,
    suffix,
    description,
    icon,
    trend,
    color = 'sky',
    isLoading = false,
    chart
}: BaseStatCardProps) {
    if (isLoading) {
        return (
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm animate-pulse space-y-4">
                <div className="flex justify-between items-start">
                    <div className="w-12 h-12 bg-gray-50 rounded-2xl"></div>
                    <div className="w-16 h-6 bg-gray-50 rounded-xl"></div>
                </div>
                <div className="space-y-2">
                    <div className="w-24 h-8 bg-gray-50 rounded-xl"></div>
                    <div className="w-32 h-3 bg-gray-50 rounded-full"></div>
                </div>
            </div>
        );
    }

    const theme = colorMap[color];

    return (
        <div className={`bg-white p-8 rounded-[2.5rem] border ${theme.border} shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-gray-100 hover:-translate-y-1 group relative overflow-hidden`}>
            {/* Background Accent Mesh */}
            <div className={`absolute top-0 right-0 w-32 h-32 ${theme.bg} rounded-full -mr-16 -mt-16 blur-2xl transition-all duration-700 group-hover:scale-150`}></div>

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div className={`w-12 h-12 ${theme.iconBg} text-white rounded-2xl flex items-center justify-center shadow-lg ${theme.shadow} transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                        <Icon name={icon} className="w-6 h-6 stroke-[2.5px]" />
                    </div>

                    {trend && (
                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${trend.isPositive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                            <Icon name={trend.isPositive ? 'TrendingUp' : 'AlertCircle'} className="w-3.5 h-3.5" />
                            {trend.value}
                        </div>
                    )}
                </div>

                <div className="space-y-1">
                    <div className="flex items-baseline gap-1">
                        <h3 className="text-2xl font-black text-gray-800 tracking-tighter leading-none">
                            {value}
                        </h3>
                        {suffix && <span className="text-sm font-black text-gray-400 uppercase tracking-tighter">{suffix}</span>}
                    </div>

                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">
                            {label}
                        </p>
                        {description && (
                            <p className="text-[9px] font-bold text-gray-300 uppercase leading-none italic">
                                {description}
                            </p>
                        )}
                    </div>
                </div>

                {chart && (
                    <div className="mt-6 mb-2 min-h-[140px] w-full">
                        {chart}
                    </div>
                )}
            </div>
        </div>
    );
}
