import {
    SearchBar,
    HeroSection,
    ServicesGrid,
    ProductsGrid,
    BrandsCarousel,
    OffersSection,
    AdBanners,
    ProductSlider,
    BenefitsSection,
    NewsletterSection,
} from '@/components/home';
import { homeData } from '@/data/homeData';

export default function HomePage() {
    return (
        <div className="space-y-8 md:space-y-16 pb-8 md:pb-12">
            {/* Buscador con Filtros */}
            <SearchBar categorias={homeData.categorias} />

            {/* Banner Superior + Carrusel + Banner Inferior */}
            <HeroSection banners={homeData.banners} />

            {/* Grilla de Servicios (Categorías de servicios saludables) */}
            <ServicesGrid categorias={homeData.categorias} />

            {/* Categorías de Productos Saludables */}
            <ProductsGrid categorias={homeData.categoriasProductos} titulo="Categorías de productos saludables" />

            {/* Carrusel de Marcas */}
            <BrandsCarousel marcas={homeData.marcas} />

            {/* Secciones de Ofertas con Parallax (Servicios + Productos + Nuevos) */}
            <OffersSection
                ofertasServicios={homeData.ofertasServicios}
                ofertasProductos={homeData.ofertasProductos}
                productosNuevos={homeData.productosNuevos}
            />

            {/* Banners Publicitarios (4 bloques) */}
            <AdBanners bannersPub={homeData.bannersPub} />

            {/* Sliders de Productos por Categoría */}
            <ProductSlider
                productos={homeData.productosDigestion}
                titulo="Digestión saludable"
                bannerImage="/img/Inicio/8/1.png"
            />
            <ProductSlider
                productos={homeData.productosBelleza}
                titulo="Belleza"
                bannerImage="/img/Inicio/9/1.png"
            />
            <ProductSlider
                productos={homeData.productosServicios}
                titulo="Servicios médicos"
                bannerImage="/img/Inicio/10/1.png"
            />
            <ProductSlider
                productos={homeData.productosMedicina}
                titulo="Servicios en medicina natural"
                bannerImage="/img/Servicios/MedicinaNatural/SERVICIOS DE MEDICINA NATURAL.webp"
            />

            {/* Beneficios (Scroll Infinito + Parallax) */}
            <BenefitsSection beneficios={homeData.beneficios} />

            {/* Newsletter */}
            <NewsletterSection />
        </div>
    );
}
