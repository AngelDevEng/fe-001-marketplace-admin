// Helpers y tipos compartidos del módulo carrito (sin llamadas a backend)

const FRONT_IMG = process.env.NEXT_PUBLIC_FRONT_IMG ?? '/img';

export const NO_IMAGE = `${FRONT_IMG}/no-image.png`;

export function money(n?: number | string | null): string {
    return 'S/ ' + Number(n ?? 0).toFixed(2);
}

export function resolveImg(url?: string | null): string {
    if (!url) return NO_IMAGE;
    if (/^https?:\/\//i.test(url)) return url;
    if (url.startsWith('/')) return url;
    return NO_IMAGE;
}

// ── Tipos ─────────────────────────────────────────────────────────────────────

export interface ApiProduct {
    id: number | string;
    nombre: string;
    sku?: string;
    categoria_nombre?: string;
    imagen_url?: string;
    descripcion_corta?: string;
    descripcion_larga?: string;
    precio: number | string;
    precio_final?: number | string;
    precio_oferta?: number | string;
    descuento_pct?: number | string;
    stock?: number | string;
    estado_stock?: string;
    rating_promedio?: number | string;
    rating_total?: number | string;
}

export interface ApiCartItem {
    id: number | string;
    producto_id: number | string;
    producto_nombre?: string;
    imagen_url?: string;
    precio_unitario: number | string;
    cantidad: number | string;
}
