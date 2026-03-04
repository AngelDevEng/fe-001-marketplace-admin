import { Banner, Categoria, Producto, Marca, Beneficio, BannersPub } from '@/types/public';

export interface IHomeRepository {
    getBannersPub(): Promise<BannersPub>;
}
