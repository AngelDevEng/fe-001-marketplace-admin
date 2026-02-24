export enum PaymentDirection {
    IN = 'CASH_IN',   // From Customer to Lyrium
    OUT = 'CASH_OUT'  // From Lyrium to Seller
}

export enum CashInStatus {
    PENDING_VALIDATION = 'PENDING_VALIDATION', // Voucher uploaded, waiting for human/bank check
    VALIDATED = 'VALIDATED',                  // Confirmed in bank, triggers Rapifac
    REJECTED = 'REJECTED',                    // Invalid voucher or amount
    EXPIRED = 'EXPIRED',                      // Timeline for payment exceeded
    CANCELED = 'CANCELED'                     // Order canceled before payment
}

export enum CashOutStatus {
    SCHEDULED = 'SCHEDULED',   // Within liquidation window, waiting for batch processing
    PROCESSING = 'PROCESSING', // Sent to bank/transfer system
    PAID = 'PAID',             // Confirmed transfer
    DISPUTED = 'DISPUTED',     // Seller claims not received or incorrect amount
    FAILED = 'FAILED'          // Bank rejected transfer (invalid CBU/CCI)
}

export interface Money {
    amount: number;
    currency: 'PEN' | 'USD';
}

export interface PaymentTimelineEvent {
    id: string;
    timestamp: string;
    previousStatus: string;
    newStatus: string;
    actor: {
        id: string;
        name: string;
        role: 'ADMIN' | 'SYSTEM' | 'SELLER';
    };
    reason: string;
    metadata?: Record<string, any>;
}

export interface BasePayment {
    id: string;
    referenceId: string;
    direction: PaymentDirection;
    amount: Money;
    createdAt: string;
    updatedAt: string;
    timeline: PaymentTimelineEvent[];
    auditTrail: string;
}

export interface CashInPayment extends BasePayment {
    direction: PaymentDirection.IN;
    status: CashInStatus;
    customer: {
        id: string;
        name: string;
        taxId?: string;
    };
    voucherUrl?: string;
    rapifacDocumentUrl?: string;
    orderHierarchy: {
        company: string;
        seller: string;
        customer: string;
    };
}

export interface CashOutPayment extends BasePayment {
    direction: PaymentDirection.OUT;
    status: CashOutStatus;
    seller: {
        id: string;
        name: string;
        bankName: string;
        accountNumber: string;
        cci?: string;
    };
    commission: Money;
    netAmount: Money;
    disbursementVoucherUrl?: string;
    liquidationPeriod: {
        start: string;
        end: string;
    };
}

export type Payment = CashInPayment | CashOutPayment;

// Finanzas Globales Types (Redundancy fix)
export interface FinanceSummary {
    ventas_totales: number;
    ventas_mes_actual: number;
    crecimiento_mensual: number;
    total_vendedores: number;
    comisiones_totales: number;
    costos_operativos: number;
    utilidad_neta: number;
    margen_operativo: number;
}

export interface MonthlyLiquidation {
    mes: string;
    cashIn: number;
    cashOut: number;
    comisiones: number;
}

export interface TreasuryData {
    resumen: FinanceSummary;
    liquidacionesMensuales: MonthlyLiquidation[];
    cashIn: CashInPayment[];
    cashOut: CashOutPayment[];
    windowOpen: boolean;
}

export type TreasuryTab = 'balance' | 'cashin' | 'cashout';

export interface TreasuryFilters {
    status: string;
    search: string;
}

export interface TreasuryKPI {
    label: string;
    val: string;
    icon: string;
    color: string;
}
