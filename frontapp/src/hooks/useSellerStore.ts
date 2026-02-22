import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getDetailStore } from '@/lib/api';
import { ShopConfig, Branch } from '@/lib/types/seller/shop';

export function useSellerStore() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [config, setConfig] = useState<ShopConfig | null>(null);
    const [branches, setBranches] = useState<Branch[]>([]);

    useEffect(() => {
        const loadInitialData = async () => {
            if (!user?.id) return;

            setLoading(true);
            try {
                const storeData = await getDetailStore(user.id.toString());

                setConfig({
                    name: storeData.store_name || "Mi Tienda",
                    category: "Bienestas emocional y medicina natural", // Mock
                    activity: "Comercio en línea", // Mock
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
                });

                setBranches([
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
                ]);
            } catch (error) {
                console.error('Failed to load shop data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadInitialData();
    }, [user?.id]);

    const handleUpdateConfig = (updates: Partial<ShopConfig>) => {
        if (!config) return;
        setConfig({ ...config, ...updates });
    };

    const handleSave = async (onSuccess: () => void) => {
        setSaving(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setSaving(false);
        onSuccess();
    };

    return {
        config,
        branches,
        setBranches,
        loading,
        saving,
        handleUpdateConfig,
        handleSave
    };
}
