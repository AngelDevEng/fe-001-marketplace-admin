'use client';

import { forwardRef, useImperativeHandle, useRef, useEffect, memo } from 'react';
import Icon from '@/components/ui/Icon';

interface TimelineProps {
    planOrder: string[];
    plansData: Record<string, {
        name: string;
        cssColor: string;
        isActive: boolean;
        timelineIcon?: string;
    }>;
    currentPlan: string;
    onPlanClick: (planId: string) => void;
}

interface TimelineHandle {
    scrollToPlan: (planId: string) => void;
}

const iconMap: Record<string, string> = {
    'star': 'Star',
    'trending-up': 'TrendUp',
    'crown': 'Crown',
    'zap': 'Zap',
    'gem': 'Gem',
    'rocket': 'Rocket',
    'shield': 'Shield',
    'award': 'Award',
    'check': 'CheckCircle'
};

function TimelineComponent({ planOrder, plansData, currentPlan, onPlanClick }: TimelineProps, ref: React.Ref<TimelineHandle>) {
    const containerRef = useRef<HTMLDivElement>(null);
    const activeIndex = planOrder.indexOf(currentPlan);

    useImperativeHandle(ref, () => ({
        scrollToPlan: (planId: string) => {
            const idx = planOrder.indexOf(planId);
            if (idx >= 0 && containerRef.current) {
                const itemWidth = 100 / planOrder.length;
                const scrollPos = (idx * itemWidth) - (itemWidth / 2) + 50;
                containerRef.current.scrollTo({ left: scrollPos, behavior: 'smooth' });
            }
        }
    }));

    useEffect(() => {
        if (containerRef.current && activeIndex >= 0) {
            const itemWidth = 100 / planOrder.length;
            const scrollPos = (activeIndex * itemWidth) - (itemWidth / 2) + 50;
            containerRef.current.scrollTo({ left: scrollPos, behavior: 'smooth' });
        }
    }, [currentPlan, activeIndex, planOrder.length]);

    const getPlanColor = (planId: string) => {
        const plan = plansData[planId];
        return plan?.cssColor || '#3b82f6';
    };

    const getPlanIcon = (planId: string) => {
        const plan = plansData[planId];
        const iconName = plan?.timelineIcon || 'Star';
        return iconMap[iconName] || 'Star';
    };

    return (
        <div className="timeline-wrapper mb-8">
            <div className="relative flex items-center gap-2 px-4 py-2">
                <div className="flex-1 relative h-1 bg-gray-200 rounded-full">
                    <div 
                        className="absolute top-0 left-0 h-full rounded-full transition-all duration-500"
                        style={{ 
                            width: `${planOrder.length > 1 ? ((activeIndex) / (planOrder.length - 1)) * 100 : 0}%`,
                            backgroundColor: getPlanColor(currentPlan)
                        }}
                    />
                </div>
            </div>
            
            <div 
                ref={containerRef}
                className="flex justify-between px-4 overflow-x-auto scrollbar-hide"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {planOrder.map((planId, idx) => {
                    const plan = plansData[planId];
                    if (!plan || !plan.isActive) return null;
                    
                    const isActive = idx === activeIndex;
                    const isPast = idx < activeIndex;
                    const color = getPlanColor(planId);
                    const iconName = getPlanIcon(planId);
                    
                    return (
                        <div 
                            key={planId}
                            className="flex flex-col items-center cursor-pointer group min-w-[80px]"
                            onClick={() => onPlanClick(planId)}
                        >
                            <div 
                                className={`w-14 h-14 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
                                    isActive 
                                        ? 'border-white shadow-lg scale-110' 
                                        : isPast
                                            ? 'border-gray-300 bg-gray-300'
                                            : 'border-gray-200 bg-white'
                                }`}
                                style={{ 
                                    backgroundColor: isActive ? color : (isPast ? color : 'white'),
                                    borderColor: isActive ? 'white' : (isPast ? color : '#e5e7eb')
                                }}
                            >
                                {isPast ? (
                                    <Icon name="Check" className="w-6 h-6 text-white" />
                                ) : (
                                    <Icon name={iconName as any} className={`w-6 h-6 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                                )}
                            </div>
                            <span className={`mt-2 text-xs font-semibold ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>
                                {plan.name}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export const Timeline = memo(forwardRef(TimelineComponent));
