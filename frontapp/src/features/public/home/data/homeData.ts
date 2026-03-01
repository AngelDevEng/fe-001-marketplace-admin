import { HomeData } from '../types';

export const homeData: HomeData = {
  banners: [
    { id: 1, imagen: '/img/Inicio/1.png', imagenMobile: '/img/Inicio/movil/1.webp', titulo: 'Campaña Especial 1', descripcion: 'Promoción especial de temporada.' },
    { id: 2, imagen: '/img/Inicio/2.png', imagenMobile: '/img/Inicio/movil/2.webp', titulo: 'Campaña Especial 2', descripcion: 'Descubre nuestras ofertas exclusivas.' },
    { id: 3, imagen: '/img/Inicio/3.png', imagenMobile: '/img/Inicio/movil/3.webp', titulo: 'Campaña Especial 3', descripcion: 'Novedades para tu bienestar.' },
    { id: 4, imagen: '/img/Inicio/4.png', imagenMobile: '/img/Inicio/movil/4.webp', titulo: 'Campaña Especial 4', descripcion: 'Ofertas por tiempo limitado.' },
    { id: 5, imagen: '/img/Inicio/5.png', imagenMobile: '/img/Inicio/movil/5.webp', titulo: 'Campaña Especial 5', descripcion: 'Marcas destacadas.' },
    { id: 6, imagen: '/img/Inicio/6.png', imagenMobile: '/img/Inicio/movil/6.webp', titulo: 'Campaña Especial 6', descripcion: 'Compra fácil y segura.' },
  ],
  categorias: [
    { id: 1, nombre: 'Servicios Saludables', imagen: '/img/Inicio/1/1.png', descripcion: 'Servicios y tratamientos orientados al bienestar' },
    { id: 2, nombre: 'Ofertas', imagen: '/img/Inicio/1/2.png', descripcion: 'Productos con descuentos especiales' },
    { id: 3, nombre: 'Servicios Promo', imagen: '/img/Inicio/1/3.png', descripcion: 'Medicina natural y bienestar' },
    { id: 4, nombre: 'Nuevos', imagen: '/img/Inicio/1/4.png', descripcion: 'Lanzamientos recientes' },
    { id: 5, nombre: 'Marcas', imagen: '/img/Inicio/1/1.png', descripcion: 'Marcas aliadas' },
    { id: 6, nombre: 'Digestión', imagen: '/img/Inicio/1/2.png', descripcion: 'Salud digestiva' },
  ],
  categoriasProductos: [
    { id: 1, nombre: 'BIENESTAR FÍSICO Y DEPORTE', imagen: '/img/Inicio/2/1.png' },
    { id: 2, nombre: 'MASCOTAS', imagen: '/img/Inicio/2/2.png' },
    { id: 3, nombre: 'SUPLEMENTOS VITAMÍNICOS', imagen: '/img/Inicio/2/3.png' },
    { id: 4, nombre: 'DIGESTIÓN SALUDABLE', imagen: '/img/Inicio/2/4.png' },
    { id: 5, nombre: 'EQUIPOS Y DISPOSITIVOS MÉDICOS', imagen: '/img/Inicio/2/5.png' },
    { id: 6, nombre: 'PROTECCIÓN LIMPIEZA Y DESINFECCIÓN', imagen: '/img/Inicio/2/6.png' },
  ],
  productos: [
    { id: 1, titulo: 'Colágeno Marino', precio: 100, imagen: '/img/Inicio/8/2.png', estrellas: '★★★★★' },
    { id: 2, titulo: 'Bebida Instantánea de Habas', precio: 25, imagen: '/img/Inicio/8/3.png', estrellas: '★★★★★' },
    { id: 3, titulo: 'Melatonina 10mg', precio: 130, imagen: '/img/Inicio/8/4.png', estrellas: '★★★★★' },
    { id: 4, titulo: 'Colágeno Marino', precio: 100, imagen: '/img/Inicio/8/1.png', estrellas: '★★★★★' },
    { id: 5, titulo: 'Bebida Instantánea', precio: 25, imagen: '/img/Inicio/8/2.png', estrellas: '★★★★★' },
    { id: 6, titulo: 'Melatonina', precio: 130, imagen: '/img/Inicio/8/3.png', estrellas: '★★★★★' },
  ],
  marcas: [
    { id: 1, nombre: 'Marca 1', logo: '/img/Inicio/3/1.png' },
    { id: 2, nombre: 'Marca 2', logo: '/img/Inicio/3/2.png' },
    { id: 3, nombre: 'Marca 3', logo: '/img/Inicio/3/3.png' },
    { id: 4, nombre: 'Marca 4', logo: '/img/Inicio/3/4.png' },
    { id: 5, nombre: 'Marca 5', logo: '/img/Inicio/3/5.png' },
    { id: 6, nombre: 'Marca 6', logo: '/img/Inicio/3/6.png' },
  ],
  ofertasServicios: [
    { id: 1, nombre: 'Oferta Servicio 1', imagen: '/img/Inicio/4/1.png', descripcion: 'Descuento especial' },
    { id: 2, nombre: 'Oferta Servicio 2', imagen: '/img/Inicio/4/2.png', descripcion: 'Promoción limitada' },
  ],
  ofertasProductos: [
    { id: 1, titulo: 'Producto en Oferta', precio: 50, imagen: '/img/Inicio/5/1.png', descuento: 20, estrellas: '★★★★★' },
    { id: 2, titulo: 'Otro Producto', precio: 80, imagen: '/img/Inicio/5/2.png', descuento: 15, estrellas: '★★★★☆' },
  ],
  productosNuevos: [
    { id: 1, titulo: 'Nuevo Producto 1', precio: 45, imagen: '/img/Inicio/6/1.png', tag: 'NUEVO', estrellas: '★★★★★' },
    { id: 2, titulo: 'Nuevo Producto 2', precio: 60, imagen: '/img/Inicio/6/2.png', tag: 'NUEVO', estrellas: '★★★★★' },
  ],
  bannersPub: {
    slider1: [{ id: 1, imagenes: ['/img/Inicio/banner1/1.png', '/img/Inicio/banner1/2.png'] }],
    pequenos1: ['/img/Inicio/banner1/small1.png', '/img/Inicio/banner1/small2.png'],
    slider2: [{ id: 2, imagenes: ['/img/Inicio/banner2/1.png', '/img/Inicio/banner2/2.png'] }],
    pequenos2: ['/img/Inicio/banner2/small1.png', '/img/Inicio/banner2/small2.png'],
  },
  productosDigestion: [
    { id: 1, titulo: 'Suplemento Digestión', precio: 35, imagen: '/img/Inicio/8/1.png', estrellas: '★★★★★' },
    { id: 2, titulo: 'Enzimas Digestivas', precio: 45, imagen: '/img/Inicio/8/2.png', estrellas: '★★★★★' },
    { id: 3, titulo: 'Probiótico', precio: 55, imagen: '/img/Inicio/8/3.png', estrellas: '★★★★☆' },
  ],
  productosBelleza: [
    { id: 1, titulo: 'Crema Antioxidante', precio: 65, imagen: '/img/Inicio/9/1.png', estrellas: '★★★★★' },
    { id: 2, titulo: 'Sérum Vitaminas', precio: 89, imagen: '/img/Inicio/9/2.png', estrellas: '★★★★★' },
    { id: 3, titulo: 'Mascarilla Facial', precio: 35, imagen: '/img/Inicio/9/3.png', estrellas: '★★★★☆' },
  ],
  productosServicios: [
    { id: 1, titulo: 'Consulta Médica', precio: 120, imagen: '/img/Inicio/10/1.png', estrellas: '★★★★★' },
    { id: 2, titulo: 'Terapia Alternativa', precio: 150, imagen: '/img/Inicio/10/2.png', estrellas: '★★★★★' },
    { id: 3, titulo: 'Tratamiento Facial', precio: 200, imagen: '/img/Inicio/10/3.png', estrellas: '★★★★★' },
  ],
  productosMedicina: [
    { id: 1, titulo: 'Medicina Natural 1', precio: 40, imagen: '/img/Servicios/MedicinaNatural/1.png', estrellas: '★★★★★' },
    { id: 2, titulo: 'Medicina Natural 2', precio: 55, imagen: '/img/Servicios/MedicinaNatural/2.png', estrellas: '★★★★☆' },
  ],
  beneficios: [
    { id: 1, icono: 'truck', titulo: 'Envíos a todo el Perú', descripcion: 'Delivery gratis en pedidos mayores a S/100' },
    { id: 2, icono: 'shield-check', titulo: 'Productos 100% Naturales', descripcion: 'Certificados y garantizados' },
    { id: 3, icono: 'headphones', titulo: 'Atención 24/7', descripcion: 'Soporte personalizado' },
    { id: 4, icono: 'refresh', titulo: 'Devoluciones fáciles', descripcion: 'Hasta 7 días para cambios' },
  ],
};
