import { HomeData } from '@/types/public';

export const homeData: HomeData = {
  banners: [
    {
      id: 1,
      imagen: '/img/Inicio/1.png',
      imagenMobile: '/img/Inicio/movil/1.webp',
      titulo: 'Campaña Especial 1',
      descripcion: 'Promoción especial de temporada.',
    },
    {
      id: 2,
      imagen: '/img/Inicio/2.png',
      imagenMobile: '/img/Inicio/movil/2.webp',
      titulo: 'Campaña Especial 2',
      descripcion: 'Descubre nuestras ofertas exclusivas.',
    },
    {
      id: 3,
      imagen: '/img/Inicio/3.png',
      imagenMobile: '/img/Inicio/movil/3.webp',
      titulo: 'Campaña Especial 3',
      descripcion: 'Novedades para tu bienestar.',
    },
    {
      id: 4,
      imagen: '/img/Inicio/4.png',
      imagenMobile: '/img/Inicio/movil/4.webp',
      titulo: 'Campaña Especial 4',
      descripcion: 'Ofertas por tiempo limitado.',
    },
    {
      id: 5,
      imagen: '/img/Inicio/5.png',
      imagenMobile: '/img/Inicio/movil/5.webp',
      titulo: 'Campaña Especial 5',
      descripcion: 'Marcas destacadas.',
    },
    {
      id: 6,
      imagen: '/img/Inicio/6.png',
      imagenMobile: '/img/Inicio/movil/6.webp',
      titulo: 'Campaña Especial 6',
      descripcion: 'Compra fácil y segura.',
    },
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
    { id: 1, nombre: 'BIENESTAR FISICO Y DEPORTE', imagen: '/img/Inicio/2/1.png' },
    { id: 2, nombre: 'MASCOTAS', imagen: '/img/Inicio/2/2.png' },
    { id: 3, nombre: 'SUPLEMENTOS VITAMINICOS', imagen: '/img/Inicio/2/3.png' },
    { id: 4, nombre: 'DIGESTION SALUDABLE', imagen: '/img/Inicio/2/4.png' },
    { id: 5, nombre: 'EQUIPOS Y DISPOSITIVOS MEDICOS', imagen: '/img/Inicio/2/5.png' },
    { id: 6, nombre: 'PROTECCION LIMPIEZA Y DESINFECCION', imagen: '/img/Inicio/2/6.png' },
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

  beneficios: [
    { id: 1, icono: 'heart', titulo: 'Todo salud', descripcion: 'Tiendas saludables y ecoamigables para tu bienestar' },
    { id: 2, icono: 'storefront', titulo: 'Tiendas selectas', descripcion: 'Tiendas de calidad cuidadosamente seleccionadas para ti' },
    { id: 3, icono: 'tag', titulo: 'Mejores precios', descripcion: 'Mejores ofertas, promociones y descuentos' },
    { id: 4, icono: 'shield-check', titulo: 'Seguridad', descripcion: 'Biomarketplace 100% seguro' },
    { id: 5, icono: 'lightning', titulo: 'Rapidez', descripcion: 'Mayor rapidez en tus compras' },
    { id: 6, icono: 'clock', titulo: 'Más tiempo', descripcion: 'Ahorra tiempo en transportarte y en colas presenciales' },
    { id: 7, icono: 'globe', titulo: 'Donde quieras', descripcion: 'Envíos a todo el Perú' },
  ],

  ofertasServicios: [
    { id: 1, titulo: 'Limpieza Profunda', precio: 45, imagen: '/img/Inicio/5/1.png', estrellas: '★★★★★' },
    { id: 2, titulo: 'Consulta Nutricional', precio: 60, imagen: '/img/Inicio/5/2.png', estrellas: '★★★★★' },
    { id: 3, titulo: 'Masaje Relajante', precio: 70, imagen: '/img/Inicio/5/3.png', estrellas: '★★★★★' },
    { id: 4, titulo: 'Limpieza Profunda', precio: 45, imagen: '/img/Inicio/5/1.png', estrellas: '★★★★★' },
    { id: 5, titulo: 'Consulta Nutricional', precio: 60, imagen: '/img/Inicio/5/2.png', estrellas: '★★★★★' },
  ],

  ofertasProductos: [
    { id: 1, titulo: 'EXTRACTO DE ALGARROBO', precio: 38, imagen: '/img/Inicio/4/1.png', estrellas: '★★★★★' },
    { id: 2, titulo: 'Profilaxis Dental', precio: 50, imagen: '/img/Inicio/4/2.png', estrellas: '★★★★★' },
    { id: 3, titulo: 'Ecografía Obstétrica', precio: 80, imagen: '/img/Inicio/4/3.png', estrellas: '★★★★★' },
    { id: 4, titulo: 'EXTRACTO DE ALGARROBO', precio: 38, imagen: '/img/Inicio/4/1.png', estrellas: '★★★★★' },
    { id: 5, titulo: 'Profilaxis Dental', precio: 50, imagen: '/img/Inicio/4/2.png', estrellas: '★★★★★' },
  ],

  productosNuevos: [
    { id: 1, titulo: 'Nuevo Producto 1', precio: 40, imagen: '/img/Inicio/4/1.png', estrellas: '★★★★★' },
    { id: 2, titulo: 'Nuevo Producto 2', precio: 55, imagen: '/img/Inicio/4/2.png', estrellas: '★★★★★' },
    { id: 3, titulo: 'Nuevo Producto 3', precio: 85, imagen: '/img/Inicio/4/3.png', estrellas: '★★★★★' },
    { id: 4, titulo: 'Nuevo Producto 4', precio: 42, imagen: '/img/Inicio/4/1.png', estrellas: '★★★★★' },
    { id: 5, titulo: 'Nuevo Producto 5', precio: 58, imagen: '/img/Inicio/4/2.png', estrellas: '★★★★★' },
  ],

  productosDigestion: [
    { id: 1, titulo: 'Colágeno Marino', precio: 100, imagen: '/img/Inicio/8/2.png', estrellas: '★★★★★' },
    { id: 2, titulo: 'Bebida Instantánea de Habas', precio: 25, imagen: '/img/Inicio/8/3.png', estrellas: '★★★★★' },
    { id: 3, titulo: 'Melatonina de liberación rápida de 10 mg', precio: 130, imagen: '/img/Inicio/8/4.png', estrellas: '★★★★★' },
    { id: 4, titulo: 'Colágeno Marino', precio: 100, imagen: '/img/Inicio/8/1.png', estrellas: '★★★★★' },
  ],

  productosBelleza: [
    { id: 1, titulo: 'Espuma Limpiadora', precio: 55, imagen: '/img/Inicio/9/2.png', estrellas: '★★★★★' },
    { id: 2, titulo: 'Espuma Limpiadora', precio: 55, imagen: '/img/Inicio/9/2.png', estrellas: '★★★★★' },
    { id: 3, titulo: 'Espuma Limpiadora', precio: 55, imagen: '/img/Inicio/9/2.png', estrellas: '★★★★★' },
    { id: 4, titulo: 'Espuma Limpiadora', precio: 55, imagen: '/img/Inicio/9/2.png', estrellas: '★★★★★' },
  ],

  productosServicios: [
    { id: 1, titulo: 'Masajes Corporales', precio: 30, imagen: '/img/Inicio/10/3.png', estrellas: '★★★★★' },
    { id: 2, titulo: 'Blanqueamiento Dental', precio: 120, imagen: '/img/Inicio/10/2.png', estrellas: '★★★★★' },
    { id: 3, titulo: 'Diagnóstico unipolar', precio: 120, imagen: '/img/Inicio/10/4.png', estrellas: '★★★★★' },
  ],

  productosMedicina: [
    { id: 1, titulo: 'Masajes Corporales', precio: 30, imagen: '/img/Servicios/MedicinaNatural/MASAJE CORPORAL.webp', estrellas: '★★★★★' },
    { id: 2, titulo: 'Pedicura', precio: 40, imagen: '/img/Servicios/MedicinaNatural/4-PEDICURA-1-300x300.webp', estrellas: '★★★★★' },
    { id: 3, titulo: 'Exfoliación Corporal', precio: 150, imagen: '/img/Servicios/MedicinaNatural/4-EXFOLIACION-CORPORAL-1-300x300.webp', estrellas: '★★★★★' },
  ],

  bannersPub: {
    slider1: [
      { id: 1, imagenes: ['/img/Inicio/7/1.png', '/img/Inicio/7/2.png'] },
      { id: 2, imagenes: ['/img/Inicio/7/3.png', '/img/Inicio/7/4.png'] },
    ],
    pequenos1: [
      '/img/banners_publicitarios/banner_pequeno/banner_pequeno_2.1.webp',
      '/img/banners_publicitarios/banner_pequeno/banner_pequeno_2.2.webp',
      '/img/banners_publicitarios/banner_pequeno/banner_pequeno_2.3.webp',
      '/img/banners_publicitarios/banner_pequeno/banner_pequeno_2.4.webp',
    ],
    slider2: [
      { id: 1, imagenes: ['/img/banners_publicitarios/banner_mediano/banner_mediano_3.1.webp', '/img/banners_publicitarios/banner_mediano/banner_mediano_3.2.webp'] },
      { id: 2, imagenes: ['/img/banners_publicitarios/banner_mediano/banner_mediano_3.3.webp', '/img/banners_publicitarios/banner_mediano/banner_mediano_3.1.webp'] },
    ],
    pequenos2: [
      '/img/banners_publicitarios/banner_pequeno/banner_pequeno_4.1.webp',
      '/img/banners_publicitarios/banner_pequeno/banner_pequeno_4.2.webp',
      '/img/banners_publicitarios/banner_pequeno/banner_pequeno_4.3.webp',
      '/img/banners_publicitarios/banner_pequeno/banner_pequeno_4.4.webp',
    ],
  },
};