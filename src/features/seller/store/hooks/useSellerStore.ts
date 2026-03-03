'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/shared/lib/context/AuthContext';
import { getDetailStore } from '@/shared/lib/api';
import { ShopConfig, Branch } from '../types';
import { USE_MOCKS } from '@/shared/lib/config/flags';

export function useSellerStore() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

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
                    tiktok: storeData.social?.threads || "",
                    youtube: storeData.social?.youtube || "",
                    website: (storeData.social as any)?.web || ""
                },
                policies: { shippingPdf: '', returnPdf: '', privacyPdf: '' },
                visual: { logo: '', banner1: '', gallery: [] },
                layout: '1',
                medals: []
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

    const updateStoreMutation = useMutation({
        mutationFn: async ({ updates, branches }: { updates: Partial<ShopConfig>, branches?: Branch[] }) => {
            if (!USE_MOCKS) {
            }
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
        handleUpdateConfig: (updates: Partial<ShopConfig>) => updateStoreMutation.mutate({ updates, branches: undefined }),
        handleSave: (callback?: () => void) => {
            if (callback) callback();
        },
        updateBranches: (branches: Branch[]) => updateStoreMutation.mutate({ updates: {}, branches }),
        refresh: refetch
    };
}
