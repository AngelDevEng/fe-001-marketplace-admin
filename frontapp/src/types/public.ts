export interface Banner {
  id: number;
  imagen: string;
  imagenMobile?: string;
  titulo: string;
  descripcion?: string;
  precio?: string;
}

export interface Categoria {
  id: number;
  nombre: string;
  imagen: string;
  descripcion?: string;
}

export interface Producto {
  id: number;
  titulo: string;
  precio: number;
  imagen: string;
  categoria?: string;
  estrellas?: string;
  descuento?: number;
  tag?: string;
}

export interface Marca {
  id: number;
  nombre: string;
  logo: string;
}

export interface Beneficio {
  id: number;
  icono: string;
  titulo: string;
  descripcion: string;
}

export interface BannerSlide {
  id: number;
  imagenes: string[];
}

export interface BannersPub {
  slider1: BannerSlide[];
  pequenos1: string[];
  slider2: BannerSlide[];
  pequenos2: string[];
}

export interface HomeData {
  banners: Banner[];
  categorias: Categoria[];
  categoriasProductos: Categoria[];
  productos: Producto[];
  marcas: Marca[];
  beneficios: Beneficio[];
  ofertasServicios: Producto[];
  ofertasProductos: Producto[];
  productosNuevos: Producto[];
  productosDigestion: Producto[];
  productosBelleza: Producto[];
  productosServicios: Producto[];
  productosMedicina: Producto[];
  bannersPub: BannersPub;
}