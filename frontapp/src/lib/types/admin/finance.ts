/**
 * FINANCE & STATS TYPES (RF-07, RF-08)
 */

export interface TopBuyer {
    id: string;
    name: string;
    clv: number;       // Customer Lifetime Value
    purchases: number; // Total count
    lastPurchase: string;
    avatar?: string;
}

export interface HeatmapData {
    day: string;  // Lun, Mar, Mie, etc.
    hour: number; // 0-23
    value: number; // Sales volume or count
}

export interface FinanceStats {
    totalRevenue: number;
    growthPercentage: number;
    netProfit: number;
    commissionRate: number;
    topBuyers: TopBuyer[];
    heatmap: HeatmapData[];
}
