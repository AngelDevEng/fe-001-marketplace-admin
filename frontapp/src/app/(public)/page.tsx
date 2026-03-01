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
} from '@/features/public/home/components';
import { homeData } from '@/features/public/home/data/homeData';

export default function HomePage() {
    return (
        <div className="space-y-8 md:space-y-16 pb-8 md:pb-12">
            <SearchBar categorias={homeData.categorias} />
            <HeroSection banners={homeData.banners} />
            <ServicesGrid categorias={homeData.categorias} />
            <ProductsGrid categorias={homeData.categoriasProductos} titulo="Categorías de productos saludables" />
            <BrandsCarousel marcas={homeData.marcas} />
            <OffersSection
                ofertasServicios={homeData.ofertasServicios}
                ofertasProductos={homeData.ofertasProductos}
                productosNuevos={homeData.productosNuevos}
            />
            <AdBanners bannersPub={homeData.bannersPub} />
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
            <BenefitsSection beneficios={homeData.beneficios} />
            <NewsletterSection />
        </div>
    );
}
