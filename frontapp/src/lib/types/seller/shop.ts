export interface Branch {
    id: string;
    name: string;
    address: string;
    city: string;
    phone: string;
    hours: string;
    isPrincipal: boolean;
    mapsUrl?: string;
}

export interface SocialLinks {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    whatsapp?: string;
    youtube?: string;
    twitter?: string;
    linkedin?: string;
    website?: string;
}

export interface ShopPolicies {
    shippingPdf?: string;
    returnPdf?: string;
    privacyPdf?: string;
}

export interface VisualIdentity {
    logo: string;
    banner1: string;
    banner2?: string;
    gallery: string[];
}

export interface Medal {
    id: string;
    name: string;
    description: string;
    icon: string;
    date: string;
}

export interface ShopConfig {
    name: string;
    category: string;
    activity: string;
    description: string;
    email: string;
    phone: string;
    address: string;
    social: SocialLinks;
    policies: ShopPolicies;
    visual: VisualIdentity;
    layout: '1' | '2' | '3';
    medals: Medal[];
}
