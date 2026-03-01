'use client';

import { useState, memo } from 'react';
import type { Plan, SubscriptionInfo } from '../types';
import Icon from '@/components/ui/Icon';

interface CurrentPlanCardProps {
    plan: Plan;
    subscription: SubscriptionInfo | null;
    onToggleDetails: () => void;
    isDetailsExpanded: boolean;
}

function CurrentPlanCardComponent({
    plan,
    subscription,
    onToggleDetails,
    isDetailsExpanded
}: CurrentPlanCardProps) {
    const formatPrice = (price: number, currency: string) => {
        return `${currency} ${price.toFixed(2)}`;
    };

    const getDaysRemaining = () => {
        if (!subscription?.expiryDate) return null;
        const expiry = new Date(subscription.expiryDate);
        const now = new Date();
        const diff = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return diff > 0 ? diff : 0;
    };

    const daysRemaining = getDaysRemaining();

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('es-PE', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <div 
            className="bg-white rounded-2xl shadow-lg border border-gray-100 relative overflow-hidden"
            style={{
                '--plan-color': plan.cssColor
            } as React.CSSProperties}
        >
            {plan.bgImage && (
                <div 
                    className="absolute inset-0 bg-cover bg-center opacity-5 pointer-events-none"
                    style={{
                        backgroundImage: `url(${plan.bgImage})`
                    }}
                />
            )}
            
            <div className="relative z-10 p-6">
                <div className="flex justify-between items-center mb-4">
                    <span className="px-3 py-1.5 rounded-full text-xs font-bold text-white" style={{ backgroundColor: plan.cssColor }}>
                        {plan.badge || plan.name}
                    </span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-extrabold text-gray-900">
                            {plan.usePriceMode && plan.priceText 
                                ? plan.priceText 
                                : formatPrice(plan.price, plan.currency)
                            }
                        </span>
                        <span className="text-gray-500 text-sm">
                            {plan.usePriceMode ? plan.priceSubtext : plan.period}
                        </span>
                    </div>
                </div>

                {subscription && (
                    <div className="mb-4 space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Icon name="Calendar" className="w-4 h-4" />
                            <span>Vence: {formatDate(subscription.expiryDate)}</span>
                        </div>
                        {daysRemaining !== null && daysRemaining > 0 && (
                            <div className="flex items-center gap-2 text-sm text-amber-600">
                                <Icon name="Clock" className="w-4 h-4" />
                                <span>{daysRemaining} días restantes</span>
                            </div>
                        )}
                    </div>
                )}

                <div className="flex flex-wrap gap-2 mb-4">
                    {plan.features?.slice(0, 5).map((feature, idx) => (
                        <div 
                            key={idx} 
                            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs ${
                                feature.active ? 'bg-gray-100' : 'bg-gray-50 text-gray-400 line-through'
                            }`}
                        >
                            <Icon name="Check" className="w-3 h-3" />
                            <span>{feature.text}</span>
                        </div>
                    ))}
                </div>

                <button 
                    className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
                    onClick={onToggleDetails}
                >
                    <span>{isDetailsExpanded ? 'Ver menos' : 'Ver detalles'}</span>
                    <Icon 
                        name="ChevronDown" 
                        className={`w-4 h-4 transition-transform ${isDetailsExpanded ? 'rotate-180' : ''}`}
                    />
                </button>
            </div>

            {isDetailsExpanded && (
                <div className="px-6 pb-6 border-t border-gray-100 mt-2 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-80 overflow-y-auto">
                        {plan.features?.map((feature, idx) => (
                            <div 
                                key={idx} 
                                className={`flex items-center gap-2.5 text-sm p-2.5 rounded-xl border ${
                                    feature.active 
                                        ? 'border-gray-200 bg-gray-50 text-gray-700' 
                                        : 'border-gray-100 bg-gray-50 text-gray-400 line-through'
                                }`}
                            >
                                <Icon 
                                    name={feature.active ? 'CheckCircle' : 'XCircle'} 
                                    className={`w-5 h-5 shrink-0 ${feature.active ? 'text-green-500' : 'text-gray-300'}`}
                                />
                                <span>{feature.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export const CurrentPlanCard = memo(CurrentPlanCardComponent);
