'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { getDetailStore } from '@/lib/api';
import { validateRUC, validateDNI, validateBCPAccount, validateCCI } from '@/lib/utils/validation';
import { USE_MOCKS } from '@/lib/config/flags';
import { api } from '@/lib/api';

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

export function useSellerProfile() {
    const { user } = useAuth();
    const { showToast } = useToast();
    const queryClient = useQueryClient();

    const { data, isLoading: loading, error } = useQuery({
        queryKey: ['seller', 'profile', user?.id],
        queryFn: async () => {
            if (!user?.id) throw new Error("No authenticated user");

            const store = await getDetailStore(user.id.toString());

            return {
                razon_social: store.company_name || store.store_name?.toUpperCase() || "",
                ruc: store.vat_number || "20000000001",
                nombre_comercial: store.store_name || "",
                rep_legal_nombre: `${store.first_name || ""} ${store.last_name || ""}`.trim(),
                rep_legal_dni: "40000001",
                experience_years: 2,
                location: { department: store.address?.state || "Piura", province: store.address?.city || "Piura" },
                tax_condition: "Régimen General",
                admin_nombre: `${store.first_name || ""} ${store.last_name || ""}`.trim(),
                admin_dni: "40000001",
                admin_email: store.email || "",
                phone_1: store.phone || "",
                phone_2: "",
                direccion_fiscal: store.address?.street_1 || "Dirección no especificada",
                cuenta_bcp: "19100000000000",
                cci: "00219100000000000000",
                bank_secondary: store.bank_name || "",
                rrss: { instagram: store.social?.instagram || "", facebook: store.social?.fb || "", tiktok: store.social?.threads || "" },
                rep_legal_photo: store.gravatar || "https://images.unsplash.com/photo-1560250097-0b93528c311a"
            } as VendorProfileData;
        },
        enabled: !!user?.id,
        staleTime: 10 * 60 * 1000,
    });

    const updateMutation = useMutation({
        mutationFn: async (updatedData: VendorProfileData) => {
            if (!USE_MOCKS) {
                await api.users.updateUser(user!.id, updatedData as any);
            }
            return updatedData;
        },
        onSuccess: (newData) => {
            queryClient.setQueryData(['seller', 'profile', user?.id], newData);
            showToast("Información de perfil actualizada exitosamente.", "success");
        },
        onError: (err) => {
            showToast("Error al actualizar el perfil: " + (err as Error).message, "error");
        }
    });

    const validateForm = (formData: VendorProfileData): boolean => {
        if (!validateRUC(formData.ruc)) { showToast("El RUC debe tener exactamente 11 dígitos numéricos.", "error"); return false; }
        if (!validateDNI(formData.rep_legal_dni)) { showToast("El DNI del Representante Legal debe tener exactamente 8 dígitos numéricos.", "error"); return false; }
        if (formData.admin_dni && !validateDNI(formData.admin_dni)) { showToast("El DNI del Administrador debe tener exactamente 8 dígitos numéricos.", "error"); return false; }
        if (!validateBCPAccount(formData.cuenta_bcp)) { showToast("La Cuenta BCP debe tener exactamente 14 dígitos numéricos.", "error"); return false; }
        if (!validateCCI(formData.cci)) { showToast("El CCI debe tener exactamente 20 dígitos numéricos.", "error"); return false; }
        if (!formData.direccion_fiscal) { showToast("La dirección fiscal es obligatoria.", "error"); return false; }
        return true;
    };

    return {
        data: data || null,
        loading,
        isSaving: updateMutation.isPending,
        error,
        updateProfile: async (formData: VendorProfileData) => {
            if (validateForm(formData)) {
                await updateMutation.mutateAsync(formData);
            }
        },
        validateForm
    };
}
