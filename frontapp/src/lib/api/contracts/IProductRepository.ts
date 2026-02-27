import { Product, ProductSticker } from '@/lib/types/seller/product';

export interface ProductFilters {
    category?: string;
    search?: string;
    sticker?: ProductSticker;
    inStock?: boolean;
}

export interface CreateProductInput {
    name: string;
    category: string;
    price: number;
    stock: number;
    description: string;
    image?: string;
    weight?: number;
    dimensions?: string;
    discountPercentage?: number;
}

export interface UpdateProductInput {
    name?: string;
    category?: string;
    price?: number;
    stock?: number;
    description?: string;
    image?: string;
    sticker?: ProductSticker;
    discountPercentage?: number;
}

export interface IProductRepository {
    getProducts(filters?: ProductFilters): Promise<Product[]>;
    getProductById(id: string): Promise<Product | null>;
    createProduct(input: CreateProductInput): Promise<Product>;
    updateProduct(id: string, input: UpdateProductInput): Promise<Product>;
    deleteProduct(id: string): Promise<boolean>;
    updateStock(id: string, quantity: number): Promise<Product>;
}
