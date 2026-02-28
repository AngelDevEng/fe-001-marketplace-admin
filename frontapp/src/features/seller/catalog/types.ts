export interface ProductAttribute {
    values: string[];
}

export type ProductSticker = 'liquidacion' | 'oferta' | 'descuento' | 'nuevo' | 'bestseller' | 'envio_gratis' | null;

export interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    stock: number;
    weight?: number;
    dimensions?: string;
    description: string;
    image: string;
    sticker: ProductSticker;
    discountPercentage?: number;
    mainAttributes: ProductAttribute[];
    additionalAttributes: ProductAttribute[];
    createdAt: string;
}
