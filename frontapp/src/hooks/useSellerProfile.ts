import { useState, useRef, useEffect, ChangeEvent } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { getDetailStore } from '@/lib/api';
import { validateRUC, validateDNI, validateBCPAccount, validateCCI } from '@/lib/utils/validation';

export interface VendorProfileData {
    razon_social: string;
    ruc: string;
    nombre_comercial: string;
    rep_legal_nombre: string;
    rep_legal_dni: string;
    experience_years: number;
    location: {
        department: string;
        province: string;
    };
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
    rrss: {
        instagram: string;
        facebook: string;
        tiktok: string;
    };
    rep_legal_photo?: string;
}

const INITIAL_DATA: VendorProfileData = {
    razon_social: "",
    ruc: "",
    nombre_comercial: "",
    rep_legal_nombre: "",
    rep_legal_dni: "",
    experience_years: 0,
    location: {
        department: "Piura",
        province: "Piura"
    },
    tax_condition: "Régimen General",
    admin_nombre: "",
    admin_dni: "",
    admin_email: "",
    phone_1: "",
    phone_2: "",
    direccion_fiscal: "",
    cuenta_bcp: "",
    cci: "",
    bank_secondary: "",
    rrss: {
        instagram: "",
        facebook: "",
        tiktok: ""
    },
    rep_legal_photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=100&auto=format&fit=crop"
};

export function useSellerProfile() {
    const { user } = useAuth();
    const { showToast } = useToast();

    const [data, setData] = useState<VendorProfileData>(INITIAL_DATA);
    const [loading, setLoading] = useState(true);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user?.id) return;

            try {
                setLoading(true);
                const store = await getDetailStore(user.id.toString());

                setData({
                    razon_social: store.company_name || store.store_name.toUpperCase(),
                    ruc: store.vat_number || "20000000001",
                    nombre_comercial: store.store_name,
                    rep_legal_nombre: `${store.first_name} ${store.last_name}`,
                    rep_legal_dni: "40000001",
                    experience_years: 2,
                    location: {
                        department: store.address.state || "Piura",
                        province: store.address.city || "Piura"
                    },
                    tax_condition: "Régimen General",
                    admin_nombre: `${store.first_name} ${store.last_name}`,
                    admin_dni: "40000001",
                    admin_email: store.email || "",
                    phone_1: store.phone,
                    phone_2: "",
                    direccion_fiscal: store.address.street_1 || "Dirección no especificada",
                    cuenta_bcp: "19100000000000",
                    cci: "00219100000000000000",
                    bank_secondary: store.bank_name || "",
                    rrss: {
                        instagram: store.social.instagram || "",
                        facebook: store.social.fb || "",
                        tiktok: store.social.threads || ""
                    },
                    rep_legal_photo: store.gravatar
                });
            } catch (err) {
                console.error("Error cargando perfil:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user?.id]);

    const validateForm = (): boolean => {
        if (!validateRUC(data.ruc)) {
            showToast("El RUC debe tener exactamente 11 dígitos numéricos.", "error");
            return false;
        }
        if (!validateDNI(data.rep_legal_dni)) {
            showToast("El DNI del Representante Legal debe tener exactamente 8 dígitos numéricos.", "error");
            return false;
        }
        if (data.admin_dni && !validateDNI(data.admin_dni)) {
            showToast("El DNI del Administrador debe tener exactamente 8 dígitos numéricos.", "error");
            return false;
        }
        if (!validateBCPAccount(data.cuenta_bcp)) {
            showToast("La Cuenta BCP debe tener exactamente 14 dígitos numéricos.", "error");
            return false;
        }
        if (!validateCCI(data.cci)) {
            showToast("El CCI debe tener exactamente 20 dígitos numéricos.", "error");
            return false;
        }
        return true;
    };

    const toggleEditMode = async () => {
        if (isEditMode) {
            if (!validateForm()) return;

            setIsSaving(true);
            await new Promise(resolve => setTimeout(resolve, 1500));
            setIsSaving(false);
            setIsEditMode(false);
            showToast("Información de perfil actualizada exitosamente.", "success");
        } else {
            setIsEditMode(true);
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setData(prev => {
            const newData = { ...prev };

            if (name.startsWith('location_')) {
                const key = name.replace('location_', '') as keyof typeof prev.location;
                newData.location = { ...prev.location, [key]: value };
            } else if (name.startsWith('rrss_')) {
                const key = name.replace('rrss_', '') as keyof typeof prev.rrss;
                newData.rrss = { ...prev.rrss, [key]: value };
            } else {
                // @ts-ignore
                newData[name] = value;
            }
            return newData;
        });
    };

    const handlePhotoClick = () => {
        if (isEditMode && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    setData(prev => ({ ...prev, rep_legal_photo: event.target?.result as string }));
                }
            };
            reader.readAsDataURL(file);
        }
    };

    return {
        data,
        loading,
        isEditMode,
        isSaving,
        fileInputRef,
        toggleEditMode,
        handleInputChange,
        handlePhotoClick,
        handlePhotoChange
    };
}
