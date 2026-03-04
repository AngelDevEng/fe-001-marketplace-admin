import { IHomeRepository } from '../contracts/IHomeRepository';
import { BannersPub, BannerSlide } from '@/types/public';
import { homeData } from '@/data/homeData';

export class WPHomeRepository implements IHomeRepository {
    async getBannersPub(): Promise<BannersPub> {
        const baseUrl = process.env.NEXT_PUBLIC_WP_API_URL ?? 'https://lyriumbiomarketplace.com/wp-json';

        // 1. Intentar /wp/v2/media?include=... (endpoint real de banners)
        try {
            const res = await fetch(
                `${baseUrl}/wp/v2/media?include=85437,85436,85435,85209,85611,85612&orderby=include`,
                { headers: { 'Content-Type': 'application/json' } }
            );
            
            if (res.ok) {
                const mediaItems = await res.json();
                
                if (Array.isArray(mediaItems) && mediaItems.length > 0) {
                    const imageUrls = mediaItems.map((item: { source_url: string }) => item.source_url);
                    
                    console.log(`[WPHome] ✅ Banners obtenidos: ${imageUrls.length} imágenes`);
                    
                    // Mapear al formato BannersPub
                    // slider1: 2 imágenes, pequenos1: 2 imágenes, slider2: 2 imágenes
                    const bannersPub: BannersPub = {
                        slider1: [
                            { id: 1, imagenes: imageUrls.slice(0, 2) }
                        ],
                        pequenos1: imageUrls.slice(2, 4),
                        slider2: [
                            { id: 2, imagenes: imageUrls.slice(4, 6) }
                        ],
                        pequenos2: [],
                    };
                    
                    return bannersPub;
                }
                
                console.warn('[WPHome] /wp/v2/media retorn array vacío');
            } else {
                console.warn(`[WPHome] /wp/v2/media respondió: ${res.status} ${res.statusText}`);
            }
        } catch (e) {
            console.warn(`[WPHome] /wp/v2/media error:`, e);
        }

        // 2. Intentar /custom/v1/home
        try {
            const res = await fetch(`${baseUrl}/custom/v1/home`, {
                headers: { 'Content-Type': 'application/json' },
            });
            
            if (res.ok) {
                console.log('[WPHome] ✅ Endpoint /custom/v1/home respondió correctamente');
                const data = await res.json();
                return data.bannersPub || data;
            }
            console.warn(`[WPHome] /custom/v1/home respondió: ${res.status} ${res.statusText}`);
        } catch (e) {
            console.warn(`[WPHome] /custom/v1/home error:`, e);
        }

        // 3. Si ambos fallan → fallback directo
        console.warn('[WPHome] ❌ Todos los endpoints fallaron, usando fallback homeData.bannersPub');
        return homeData.bannersPub;
    }
}
