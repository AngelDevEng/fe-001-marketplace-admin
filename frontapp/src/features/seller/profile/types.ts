export interface VendorProfileData {
    razon_social: string;
    ruc: string;
    nombre_comercial: string;
    rep_legal_nombre: string;
    rep_legal_dni: string;
    experience_years: number;
    location: { department: string; province: string };
    tax_condition: string;
    admin_nombre: string;
    admin_dni: string;
    admin_email: string;
    phone_1: string;
    phone_2: string;
    direccion_fiscal: string;
    cuenta_bcp: string;
    cci: string;
    bank_secondary: string;
    rrss: { instagram: string; facebook: string; tiktok: string };
    rep_legal_photo?: string;
}
