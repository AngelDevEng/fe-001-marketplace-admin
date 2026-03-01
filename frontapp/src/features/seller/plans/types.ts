export interface Plan {
    id: string;
    name: string;
    price: number;
    priceAnnual: number;
    period: string;
    periodAnnual: string;
    currency: string;
    usePriceMode: boolean;
    priceText: string;
    priceSubtext: string;
    description: string;
    badge: string;
    cssColor: string;
    accentColor: string;
    bgImage: string;
    bgImageFit: string;
    bgImagePosition: string;
    showBgInCard: boolean;
    requiresPayment: boolean;
    subscribeButtonText: string;
    trialSuccessTitle: string;
    trialSuccessMessage: string;
    trialWaitMessage: string;
    enableClaimLock: boolean;
    claimedButtonText: string;
    claimedWarningText: string;
    timelineIcon: string;
    compactVisibleCount: number;
    isActive: boolean;
    order: number;
    claimMonths: number;
    features: PlanFeature[];
    detailedBenefits: DetailedBenefit[];
}

export interface PlanFeature {
    text: string;
    active: boolean;
}

export interface DetailedBenefit {
    emoji: string;
    title: string;
    description: string;
    color: string;
}

export interface SubscriptionInfo {
    planId: string;
    startDate: string;
    expiryDate: string;
    status: 'active' | 'pending' | 'expired';
}

export interface PlanRequest {
    id?: string;
    type: 'upgrade' | 'downgrade' | 'free_claim';
    fromPlan: string;
    toPlan: string;
    planName: string;
    duration: string;
    durationId: string;
    months: number;
    amount: number;
    originalAmount?: number;
    discountPercent?: number;
    userName: string;
    status: 'pending' | 'approved' | 'rejected';
    date?: string;
}

export interface DurationPreset {
    id: string;
    label: string;
    months: number;
    isTrial: boolean;
}

export interface PaymentSummary {
    planName: string;
    duration: string;
    originalPrice: number;
    discount: number;
    total: number;
    perMonth: number;
}

export interface ButtonColors {
    subscribeBg: string;
    subscribeColor: string;
    currentBg: string;
    currentColor: string;
    lockedBg: string;
    lockedColor: string;
    warningColor: string;
}

export interface ExpirationWarning {
    porVencer: boolean;
    dias: number;
    fechaVencimiento: string;
}

export type PlanTab = 'my-plan' | 'all-plans';
