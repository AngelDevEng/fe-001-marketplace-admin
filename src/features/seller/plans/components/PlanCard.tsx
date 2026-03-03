'use client';

import { memo } from 'react';
import type { Plan } from '../types';
import Icon from '@/components/ui/Icon';

interface PlanCardProps {
    plan: Plan;
    isActive: boolean;
    isCurrentPlan: boolean;
    isClaimed: boolean;
    isTrialUsed: boolean;
    onSelect: () => void;
    onViewBenefits: () => void;
    buttonColors?: {
        subscribeBg: string;
        subscribeColor: string;
        currentBg: string;
        currentColor: string;
    };
}

function PlanCardComponent({
    plan,
    isActive,
    isCurrentPlan,
    isClaimed,
    isTrialUsed,
    onSelect,
    onViewBenefits,
    buttonColors
}: PlanCardProps) {
    const formatPrice = (price: number, currency: string) => {
        return `${currency} ${price.toFixed(2)}`;
    };

    const getButtonText = () => {
        if (isCurrentPlan) return 'Plan Actual';
        if ((isClaimed || isTrialUsed) && plan.claimedButtonText) return plan.claimedButtonText;
        return plan.subscribeButtonText || 'Suscribirse';
    };

    const getButtonStyle = () => {
        if (isCurrentPlan) {
            return {
                backgroundColor: buttonColors?.currentBg || '#e5e7eb',
                color: buttonColors?.currentColor || '#9ca3af'
            };
        }
        if (isClaimed || isTrialUsed) {
            return {
                backgroundColor: '#e5e7eb',
                color: '#9ca3af',
                cursor: 'not-allowed' as const
            };
        }
        return {
            backgroundColor: buttonColors?.subscribeBg || plan.cssColor || '#3b82f6',
            color: buttonColors?.subscribeColor || '#ffffff'
        };
    };

    const visibleFeatures = plan.features?.slice(0, 5) || [];

    return (
        <div 
            className={`bg-white rounded-2xl p-6 border-2 transition-all duration-300 cursor-pointer hover:shadow-xl hover:-translate-y-1 ${
                isActive ? 'border-blue-500' : 'border-transparent shadow-md'
            } ${isCurrentPlan ? 'border-green-200 bg-green-50' : ''}`}
            style={{ '--plan-color': plan.cssColor } as React.CSSProperties}
        >
            {plan.badge && (
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white mb-3" style={{ backgroundColor: plan.cssColor }}>
                    {plan.badge}
                </span>
            )}
            
            <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold" style={{ color: plan.cssColor }}>
                        {plan.usePriceMode && plan.priceText ? plan.priceText : formatPrice(plan.price, plan.currency)}
                    </span>
                    <span className="text-gray-500 text-sm">{plan.usePriceMode ? plan.priceSubtext : plan.period}</span>
                </div>
                {plan.description && (
                    <p className="text-gray-500 text-sm mt-2">{plan.description}</p>
                )}
            </div>

            <div className="space-y-2 mb-4">
                {visibleFeatures.map((feature, idx) => (
                    <div key={idx} className={`flex items-center gap-2 text-sm ${feature.active ? '' : 'text-gray-400 line-through'}`}>
                        <Icon name="Check" className={`w-4 h-4 shrink-0 ${feature.active ? 'text-green-500' : 'text-gray-300'}`} />
                        <span>{feature.text}</span>
                    </div>
                ))}
            </div>

            <div className="space-y-3">
                <button
                    className="w-full py-3 px-4 rounded-xl font-semibold transition-all disabled:cursor-not-allowed"
                    style={getButtonStyle()}
                    onClick={(e) => {
                        e.stopPropagation();
                        if (!isCurrentPlan && !isClaimed && !isTrialUsed) {
                            onSelect();
                        }
                    }}
                    disabled={isCurrentPlan || isClaimed || isTrialUsed}
                >
                    {getButtonText()}
                </button>
                
                <button 
                    className="w-full flex items-center justify-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors py-2"
                    onClick={(e) => {
                        e.stopPropagation();
                        onViewBenefits();
                    }}
                >
                    <span>Ver beneficios</span>
                    <Icon name="ChevronRight" className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

export const PlanCard = memo(PlanCardComponent);
