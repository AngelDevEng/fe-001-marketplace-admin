'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { getDetailStore } from '@/lib/api';
import { ShopConfig, Branch } from '@/lib/types/seller/shop';

export function useSellerStore() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    // --- Query: Fetch Shop Data ---
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['seller', 'store', user?.id],
        queryFn: async () => {
            if (!user?.id) throw new Error("No authenticated user");

            const storeData = await getDetailStore(user.id.toString());

            const config: ShopConfig = {
                name: storeData.store_name || "Mi Tienda",
                category: "Bienestar emocional y medicina natural",
                activity: "Comercio en línea",
                description: (storeData as any).description || "Sin descripción",
                email: storeData.show_email ? storeData.email || "" : "",
                phone: storeData.phone || "",
                address: storeData.address?.street_1 || "",
                social: {
                    instagram: storeData.social?.instagram || "",
                    facebook: storeData.social?.fb || "",
                    whatsapp: storeData.phone || ""
                },
                policies: {
                    shippingPdf: "envio_v2.pdf",
                    returnPdf: "devoluciones.pdf"
                },
                visual: {
                    logo: storeData.gravatar || "https://lyriumbiomarketplace.com/wp-content/uploads/2024/09/ICON.png",
                    banner1: storeData.banner || "https://lyriumbiomarketplace.com/wp-content/uploads/2024/10/1-BG.webp",
                    gallery: [
                        "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800",
                        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800"
                    ]
                },
                layout: '2',
                medals: [
                    {
                        id: '1',
                        name: 'Identidad Verificada',
                        description: 'Otorgada al validar satisfactoriamente los documentos oficiales (RUC y DNI) del titular.',
                        icon: 'BadgeCheck',
                        date: '2024-01-15'
                    }
                ]
            };

            const branches: Branch[] = [
                {
                    id: '1',
                    name: 'Sede Principal - ' + (storeData.address?.city || 'Piura'),
                    address: storeData.address?.street_1 || 'Urb. Los Educadores Mz M Lt 04',
                    city: storeData.address?.city || 'Piura, Peru',
                    phone: storeData.phone || '+51 987 654 321',
                    hours: '08:00 - 20:00',
                    isPrincipal: true,
                    mapsUrl: '#'
                }
            ];

            return { config, branches };
        },
        enabled: !!user?.id,
        staleTime: 5 * 60 * 1000,
    });

    // --- Mutation: Update Shop Config ---
    const updateStoreMutation = useMutation({
        mutationFn: async ({ updates, branches }: { updates: Partial<ShopConfig>, branches?: Branch[] }) => {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            return { updates, branches };
        },
        onSuccess: (variables) => {
            queryClient.setQueryData(['seller', 'store', user?.id], (old: any) => {
                if (!old) return old;
                return {
                    config: { ...old.config, ...variables.updates },
                    branches: variables.branches || old.branches
                };
            });
        }
    });

    return {
        config: data?.config || null,
        branches: data?.branches || [],
        loading: isLoading,
        saving: updateStoreMutation.isPending,
        handleUpdateConfig: (updates: Partial<ShopConfig>) =>
            updateStoreMutation.mutateAsync({ updates }),
        updateBranches: (newBranches: Branch[]) =>
            updateStoreMutation.mutateAsync({ updates: {}, branches: newBranches }),
        handleSave: async (onSuccess: () => void) => {
            if (data?.config) {
                await updateStoreMutation.mutateAsync({ updates: data.config, branches: data.branches });
                onSuccess();
            }
        },
        refresh: refetch
    };
}
