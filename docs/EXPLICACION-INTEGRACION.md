# 🌿 Lyrium BioMarketplace — Frontend React

> **Migración del frontend de Lyrium** de PHP + Tailwind CDN a **Next.js 16 + React 19 + TypeScript + Tailwind v4**.
> Este documento describe la arquitectura, las decisiones de diseño y la estructura de carpetas resultante de la **refactorización del Home**.

---

## 📋 Tabla de Contenidos

- [Tecnologías](#-tecnologías)
- [Cómo ejecutar](#-cómo-ejecutar)
- [Estructura general del proyecto](#-estructura-general-del-proyecto)
- [Refactorización del Home — Decisiones y arquitectura](#-refactorización-del-home--decisiones-y-arquitectura)
- [Descripción de carpetas creadas](#-descripción-de-carpetas-creadas)
- [Flujo de datos del Home](#-flujo-de-datos-del-home)
- [Componentes del Home](#-componentes-del-home)
- [Layout público](#-layout-público-reutilizable)
- [Convenciones del proyecto](#-convenciones-del-proyecto)
- [Documentos complementarios](#-documentos-complementarios)

---

## 🛠 Tecnologías

| Tecnología | Versión | Uso |
|---|---|---|
| **Next.js** | 16 | Framework React con App Router |
| **React** | 19 | Librería de UI |
| **TypeScript** | 5+ | Tipado estático |
| **Tailwind CSS** | v4 | Estilos utilitarios |
| **Lucide React** | — | Iconografía (reemplazo de Phosphor Icons del PHP) |
| **Docker** | — | Entorno de desarrollo containerizado |

---

## 🚀 Cómo ejecutar

### Opción 1: Con Docker (recomendado)

```bash
docker-compose up
```

### Opción 2: Sin Docker

```bash
cd frontapp
npm install
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

---

## 📁 Estructura general del proyecto

```
marketplace-admin-features/
├── 📄 README.md                         ← Este archivo
├── 📄 METODOLOGIA_MIGRACION.md          ← Guía paso a paso para migrar cada página PHP
├── 📄 COMPARACION_PHP_VS_REACT.md       ← Diferencias detalladas PHP vs React
├── 📄 GUIA_ARQUITECTURA.md              ← Arquitectura completa del proyecto
├── 📄 docker-compose.yml                ← Configuración Docker
├── 📂 docker/                           ← Archivos Dockerfile
└── 📂 frontapp/                         ← ⭐ Aplicación Next.js (aquí vive todo el código)
    ├── 📄 package.json
    ├── 📄 next.config.ts
    ├── 📄 tsconfig.json
    ├── 📂 public/                       ← Imágenes y assets estáticos
    └── 📂 src/                          ← Código fuente principal
        ├── 📂 app/                      ← Páginas y rutas (App Router)
        ├── 📂 components/               ← Componentes reutilizables
        ├── 📂 constants/                ← Constantes globales (rutas, etc.)
        ├── 📂 context/                  ← Contextos React (Auth, Toast, Notificaciones)
        ├── 📂 data/                     ← Datos mock (serán reemplazados por API)
        ├── 📂 hooks/                    ← Custom hooks
        ├── 📂 lib/                      ← Utilidades y lógica compartida
        ├── 📂 services/                 ← Capa de servicios API
        └── 📂 types/                    ← Interfaces y tipos TypeScript
```

---

## 🏠 Refactorización del Home — Decisiones y arquitectura

### El problema original

El archivo `index.php` del proyecto PHP contenía **todo el Home en un solo archivo monolítico**:
- HTML, CSS y JavaScript mezclados
- Datos hardcodeados directamente en el HTML
- Sin separación de responsabilidades
- Difícil de mantener y escalar

### La solución: Arquitectura modular por secciones

Se tomó la decisión de **descomponer el Home en componentes independientes y reutilizables**, siguiendo los principios de React y las mejores prácticas de Next.js:

1. **Cada sección visual del Home = 1 componente React**
2. **Los datos se separan del componente** (carpeta `data/`)
3. **Los tipos se definen aparte** (carpeta `types/`)
4. **La página solo orquesta** — no contiene lógica ni estilos propios
5. **El layout (Header + Footer) se aplica automáticamente** vía Route Group

---

## 📂 Descripción de carpetas creadas

### `frontapp/src/app/(public)/` — Route Group público

```
app/(public)/
├── layout.tsx    ← Aplica PublicLayout (Header + Footer) automáticamente
└── page.tsx      ← Home: orquesta los 13 componentes del Home
```

**¿Por qué `(public)`?** Es un [Route Group](https://nextjs.org/docs/app/building-your-application/routing/route-groups) de Next.js. Los paréntesis `()` indican que **no afecta la URL** — la ruta sigue siendo `/`, no `/public/`. Se usa para que todas las páginas públicas compartan el mismo layout (Header + Footer) sin repetir código.

**`page.tsx`** es la página del Home. Su única responsabilidad es:
- Importar los componentes del Home
- Importar los datos mock
- Pasar los datos como props a cada componente

```tsx
// Así de limpio queda el Home:
import { SearchBar, HeroSection, ServicesGrid, ... } from '@/components/home';
import { homeData } from '@/data/homeData';

export default function HomePage() {
    return (
        <div className="space-y-8 md:space-y-16 pb-8 md:pb-12">
            <SearchBar categorias={homeData.categorias} />
            <HeroSection banners={homeData.banners} />
            <ServicesGrid categorias={homeData.categorias} />
            {/* ... más secciones */}
        </div>
    );
}
```

---

### `frontapp/src/components/home/` — Componentes del Home

```
components/home/
├── index.ts              ← Barrel export (re-exporta todos los componentes)
├── SearchBar.tsx          ← Buscador con filtros por categoría
├── HeroSection.tsx        ← Banner superior + carrusel de slides + banner inferior
├── TopBanner.tsx          ← Línea decorativa superior con marquee
├── BottomBanner.tsx       ← Banner inferior del hero
├── ServicesGrid.tsx       ← Grilla/carrusel de categorías de servicios
├── ProductsGrid.tsx       ← Grilla de categorías de productos saludables
├── ProductCard.tsx        ← Card individual de producto (hover con acciones)
├── ProductSlider.tsx      ← Slider horizontal de productos por categoría
├── BrandsCarousel.tsx     ← Carrusel infinito de marcas
├── OffersSection.tsx      ← Secciones de ofertas con efecto parallax
├── AdBanners.tsx          ← 4 bloques de banners publicitarios
├── BenefitsSection.tsx    ← Beneficios con scroll infinito + parallax
└── NewsletterSection.tsx  ← Formulario de suscripción al newsletter
```

**¿Por qué un `index.ts` barrel export?** Permite importar múltiples componentes en una sola línea:
```tsx
// ✅ Con barrel export — limpio
import { SearchBar, HeroSection, ServicesGrid } from '@/components/home';

// ❌ Sin barrel export — verboso
import SearchBar from '@/components/home/SearchBar';
import HeroSection from '@/components/home/HeroSection';
import ServicesGrid from '@/components/home/ServicesGrid';
```

---

### `frontapp/src/components/layout/public/` — Layout público

```
components/layout/public/
├── PublicLayout.tsx       ← Wrapper: AnnouncementBar + Header + children + Footer
├── PublicHeader.tsx       ← Header con logo, navegación y acciones de usuario
├── PublicFooter.tsx       ← Footer completo con links, redes sociales, etc.
├── AnnouncementBar.tsx    ← Barra de anuncio superior
├── DesktopNav.tsx         ← Menú de navegación desktop horizontal
├── MegaMenu.tsx           ← Mega menú desplegable con subcategorías
└── MobileMenu.tsx         ← Menú hamburguesa para móvil
```

**¿Por qué separar el layout?** Porque el Header y Footer son **compartidos por todas las páginas públicas**. Separándolos en su propia carpeta:
- Se configura 1 sola vez en `app/(public)/layout.tsx`
- Cada nueva página pública los hereda automáticamente
- No se necesita importar `<PublicLayout>` manualmente en cada página

---

### `frontapp/src/components/layout/shared/` — Componentes compartidos

```
components/layout/shared/
├── BaseLayout.tsx         ← Layout base (para admin/seller/logistics)
├── SmartSidebar.tsx       ← Sidebar inteligente con navegación
├── Breadcrumb.tsx         ← Navegación tipo breadcrumb
├── ModuleHeader.tsx       ← Header de módulos internos
├── NotificationBell.tsx   ← Campana de notificaciones
├── UserMenu.tsx           ← Menú desplegable de usuario
├── ThemeToggle.tsx        ← Toggle de modo claro/oscuro
├── Footer.tsx             ← Footer para paneles internos
├── Logo.tsx               ← Componente del logo
└── ModalsPortal.tsx       ← Portal para modales globales
```

---

### `frontapp/src/data/` — Datos mock

```
data/
├── homeData.ts    ← Datos del Home (categorías, banners, productos, beneficios, etc.)
└── menuData.ts    ← Items del menú de navegación con subcategorías
```

**¿Por qué datos mock?** El backend en Laravel aún no está listo. Los datos mock replican exactamente la estructura de datos del PHP original para que:
- El frontend se pueda desarrollar independientemente del backend
- Cuando la API está lista, solo se cambia `homeData.ts` por llamadas a `homeService.ts`
- Las rutas de imágenes se conservan exactas del PHP para mantener compatibilidad

---

### `frontapp/src/types/` — Tipos TypeScript

```
types/
└── public.ts     ← Interfaces: Categoria, Banner, Producto, Beneficio, Marca, etc.
```

Define las interfaces de todos los objetos de datos que usan los componentes públicos. Garantiza tipado estricto y autocompletado en el IDE.

---

### `frontapp/src/services/` — Capa de servicios API

```
services/
└── homeService.ts  ← Funciones preparadas para conectar con la API de Laravel
```

Capa intermedia entre los componentes y la API. Actualmente devuelve datos mock, pero está estructurada para hacer `fetch()` al backend cuando esté disponible.

---

### `frontapp/src/constants/` — Constantes globales

```
constants/
└── routes.ts    ← Todas las URLs centralizadas en un solo objeto ROUTES
```

```typescript
export const ROUTES = {
    HOME: '/',
    NOSOTROS: '/nosotros',
    CONTACTO: '/contacto',
    // ...
};
```

**¿Por qué centralizar rutas?** Evita strings sueltos por todo el código. Si una URL cambia, se actualiza en un solo lugar.

---

### `frontapp/src/context/` — Contextos React

```
context/
├── AuthContext.tsx           ← Estado de autenticación del usuario
├── NotificationContext.tsx   ← Sistema de notificaciones en tiempo real
└── ToastContext.tsx          ← Notificaciones tipo toast (feedback visual)
```

---

### `frontapp/src/components/ui/` — Componentes UI base

```
components/ui/
├── BaseButton.tsx      ← Botón reutilizable con variantes
├── BaseModal.tsx       ← Modal genérico
├── BaseDrawer.tsx      ← Drawer/panel lateral
├── BaseLoading.tsx     ← Spinner de carga
├── BaseEmptyState.tsx  ← Estado vacío genérico
├── BaseStatCard.tsx    ← Card de estadísticas
├── Icon.tsx            ← Wrapper de iconos
├── InputField.tsx      ← Campo de texto con label y validación
├── SelectField.tsx     ← Select con label
├── Skeleton.tsx        ← Placeholder de carga tipo skeleton
├── StatsGrid.tsx       ← Grilla de estadísticas
├── StatusBadge.tsx     ← Badge de estado con colores
└── confirm-dialog.tsx  ← Diálogo de confirmación
```

---

## 🔄 Flujo de datos del Home

```
┌─────────────────────────────────────────────────────────────┐
│                     app/(public)/page.tsx                    │
│                      (Orquestador)                          │
│                                                             │
│  1. Importa datos:  homeData  ← data/homeData.ts           │
│  2. Importa componentes: ← components/home/index.ts        │
│  3. Pasa datos como props a cada componente                 │
└─────────────┬───────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────────┐
│                   components/home/                          │
│                                                             │
│  SearchBar ──── recibe: categorias[]                        │
│  HeroSection ── recibe: banners{}                           │
│  ServicesGrid ─ recibe: categorias[]                        │
│  ProductsGrid ─ recibe: categoriasProductos[], titulo       │
│  BrandsCarousel recibe: marcas[]                            │
│  OffersSection  recibe: ofertasServicios[], ofertasProductos│
│  AdBanners ──── recibe: bannersPub[]                        │
│  ProductSlider  recibe: productos[], titulo                 │
│  BenefitsSection recibe: beneficios[]                       │
│  NewsletterSection (sin props, auto-contenido)              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🧱 Componentes del Home

| # | Componente | Tipo | Descripción | Efectos especiales |
|---|---|---|---|---|
| 1 | `SearchBar` | Client | Buscador con dropdown de categorías, búsqueda por voz | `useState`, dropdown animado |
| 2 | `HeroSection` | Client | Carrusel principal con auto-play + banners superior/inferior | `useState`, `useEffect`, auto-slide |
| 3 | `ServicesGrid` | Client | Carrusel horizontal de categorías de servicios | Scroll horizontal |
| 4 | `ProductsGrid` | Server | Grilla de categorías de productos saludables | — |
| 5 | `BrandsCarousel` | Server | Scroll infinito de logos de marcas | CSS `animate-scroll-infinite` |
| 6 | `OffersSection` | Server | 3 secciones de ofertas con fondo parallax | `background-attachment: fixed` |
| 7 | `AdBanners` | Server | 4 banners publicitarios en cuadrícula | — |
| 8 | `ProductSlider` | Client | Slider con flechas de navegación por categoría | `useState`, scroll controlado |
| 9 | `BenefitsSection` | Server | Beneficios con scroll infinito y parallax | CSS marquee + parallax |
| 10 | `NewsletterSection` | Server | Formulario de suscripción | — |
| 11 | `ProductCard` | Server | Card individual con hover overlay (carrito + vista) | CSS `group-hover` |
| 12 | `TopBanner` | Server | Línea decorativa gradient | — |
| 13 | `BottomBanner` | Server | Banner inferior del hero | — |

> **Client** = usa `'use client'` (tiene hooks como `useState`, `useEffect`)
> **Server** = Server Component (renderizado en el servidor, mejor performance)

---

## 🔧 Layout público reutilizable

El layout público se aplica **automáticamente** a todas las páginas dentro de `app/(public)/`. La estructura es:

```
AnnouncementBar  ← Barra de anuncio promocional
PublicHeader     ← Logo + DesktopNav/MobileMenu + Iconos usuario
  ├── DesktopNav ← Menú horizontal (desktop)
  │   └── MegaMenu ← Desplegable con subcategorías
  └── MobileMenu ← Menú hamburguesa (mobile)
main             ← {children} — el contenido de cada página
PublicFooter     ← Links, contacto, redes sociales, copyright
```

**Para agregar una nueva página pública**, solo se necesita crear `app/(public)/nueva-pagina/page.tsx` — el Header y Footer se incluyen automáticamente.

---

## 📏 Convenciones del proyecto

| Regla | Detalle |
|---|---|
| **1 componente = 1 archivo** | Cada componente es un archivo `.tsx` independiente |
| **Barrel exports** | Cada carpeta de componentes tiene un `index.ts` |
| **Props tipadas** | Todo componente define `interface XxxProps` |
| **Datos por props** | Los componentes NO hacen fetch ni hardcodean datos |
| **`'use client'` solo si necesario** | Solo cuando usa hooks (`useState`, `useEffect`, etc.) |
| **Lucide React** | Iconos: `import { Heart } from 'lucide-react'` (no Phosphor) |
| **next/image** | Todas las imágenes usan `<Image>` de Next.js |
| **next/link** | Todos los enlaces internos usan `<Link>` |
| **Rutas centralizadas** | Usar `ROUTES.HOME` en vez de `'/'` |
| **Nombres en español** | Variables y props en español para mantener consistencia con los datos |

---

## 🧪 Ejemplo práctico: Implementación de la página "Nosotros"

A continuación se muestra **paso a paso** cómo se implementaría la página `/nosotros` siguiendo la arquitectura establecida. Este ejemplo sirve como referencia para migrar cualquier otra página PHP.

### Paso 1: Análisis del archivo PHP original (`nosotros.php`)

El archivo `nosotros.php` (268 líneas, ~15KB) contiene **7 secciones visuales**:

| # | Sección en PHP | Líneas | Descripción | Imágenes |
|---|---|---|---|---|
| 1 | **Hero Parallax** | 7-20 | Banner full-width con texto "¿Qué es Lyrium BioMarketplace?" sobre fondo parallax | `img/nosotros/1.png` |
| 2 | **Texto + Doctora** | 22-36 | Grid 2 columnas: texto descriptivo izq + imagen doctora der | `img/nosotros/2.png` |
| 3 | **Nuestros Valores** | 38-56 | Imagen con overlay card "Nuestros Valores" (integridad, competitividad, orientación) | URL externa |
| 4 | **Nuestra Relación Contigo** | 58-76 | Imagen con overlay card posición izquierda | URL externa |
| 5 | **Timeline "Así Cuidamos de Ti"** | 80-191 | Línea de tiempo con 6 tarjetas alternadas + iconos SVG centrales | Sin imágenes |
| 6 | **Hero Parallax 2** | 195-208 | Banner "Mucho más que un Marketplace: un estilo de vida" | `img/nosotros/Mucho.jpg` |
| 7 | **Iconos de Pilares** | 210-261 | 4 pilares: Orgánico, Natural, Bienestar, Saludable con imágenes circulares | 4 `.avif` |

**CSS propio:** `utils/css/nosotros.css` (930 líneas) con estilos para hero parallax, timeline, overlay cards, responsive.

---

### Paso 2: Estructura de archivos a crear

```
frontapp/src/
├── app/(public)/nosotros/
│   └── page.tsx                    ← Página /nosotros
├── components/nosotros/
│   ├── index.ts                    ← Barrel export
│   ├── NosotrosHero.tsx            ← Sección 1: Hero parallax
│   ├── AboutDescription.tsx        ← Sección 2: Texto + Doctora
│   ├── ValuesCard.tsx              ← Sección 3: Nuestros Valores (overlay)
│   ├── RelationCard.tsx            ← Sección 4: Nuestra Relación (overlay)
│   ├── CareTimeline.tsx            ← Sección 5: Timeline "Así Cuidamos de Ti"
│   ├── LifestyleHero.tsx           ← Sección 6: Hero parallax 2
│   └── PillarsGrid.tsx             ← Sección 7: 4 pilares (Orgánico, Natural, etc.)
├── data/
│   └── nosotrosData.ts             ← Datos mock de la página
└── types/
    └── nosotros.ts                 ← Interfaces TypeScript (o agregar a public.ts)
```

---

### Paso 3: Definir tipos TypeScript

```typescript
// frontapp/src/types/nosotros.ts

export interface TimelineItem {
  id: number;
  titulo: string;
  descripcion: string;
  iconoSvg: string;       // path SVG o nombre de icono Lucide
  posicion: 'left' | 'right';
}

export interface ValorCard {
  id: number;
  titulo: string;
  items: string[];
  imagenUrl: string;
  posicionOverlay: 'left' | 'right';
}

export interface Pilar {
  id: number;
  titulo: string;
  descripcion: string;
  imagenUrl: string;
}

export interface NosotrosData {
  heroImage: string;
  heroSubtitulo: string;
  heroTitulo: string;
  descripcionTextos: string[];
  doctoraImage: string;
  valores: ValorCard;
  relacion: ValorCard;
  timelineItems: TimelineItem[];
  lifestyleHeroImage: string;
  pilares: Pilar[];
}
```

---

### Paso 4: Crear datos mock

```typescript
// frontapp/src/data/nosotrosData.ts

import { NosotrosData } from '@/types/nosotros';

export const nosotrosData: NosotrosData = {
  heroImage: '/img/nosotros/1.png',
  heroSubtitulo: 'VIDA · SALUD · BIENESTAR',
  heroTitulo: '¿QUÉ ES LYRIUM BIOMARKETPLACE?',

  descripcionTextos: [
    'En LYRIUM BIOMARKETPLACE somos VIDA y SALUD. En un mundo cada vez más saturado por los productos dañinos y enfermedades, surge esta oportunidad para mejorar tu estilo de vida y el de tu familia.',
    'Nos dedicamos a ofrecerte productos 100% orgánicos y naturales, cuidadosamente seleccionados para promover tu bienestar físico y emocional.',
    'Únete a nuestra comunidad y descubre cómo LYRIUM BIOMARKETPLACE puede transformar tu vida hacia un camino más saludable y equilibrado.',
  ],
  doctoraImage: '/img/nosotros/2.png',

  valores: {
    id: 1,
    titulo: 'NUESTROS VALORES',
    items: ['Integridad moral', 'Competitividad empresarial', 'Orientación al cliente'],
    imagenUrl: 'https://lyriumbiomarketplace.com/wp-content/uploads/2025/05/miembros-familia-tiro-medio-posando-juntos-1-1024x683.jpg',
    posicionOverlay: 'right',
  },

  relacion: {
    id: 2,
    titulo: 'NUESTRA RELACIÓN CONTIGO',
    items: [
      'Nuestra bio comunidad LYRIUM',
      'BIOMARKETPLACE fomenta que sus',
      'tiendas vendedoras:',
    ],
    imagenUrl: 'https://lyriumbiomarketplace.com/wp-content/uploads/2025/05/familia-de-tiro-completo-con-lindo-perro-al-aire-libre-1024x683.jpg',
    posicionOverlay: 'left',
  },

  timelineItems: [
    { id: 1, titulo: '¿Por Qué Elegirnos?', descripcion: 'Lleven tus productos a tu hogar con calidad y excelencia en el servicio.', iconoSvg: 'Star', posicion: 'left' },
    { id: 2, titulo: 'Tu Tranquilidad es Importante', descripcion: 'Siempre reciban tus consultas con mucha alegría, solucionando todas tus dudas.', iconoSvg: 'Headphones', posicion: 'right' },
    { id: 3, titulo: 'Reclamos y Devoluciones', descripcion: 'Respeten siempre a tu persona brindándote opción al reclamo y/o devolución.', iconoSvg: 'Scale', posicion: 'left' },
    { id: 4, titulo: 'Comprendemos tus Necesidades', descripcion: 'Intenten siempre ponerse en tus zapatos como comprador.', iconoSvg: 'HandHeart', posicion: 'right' },
    { id: 5, titulo: 'Transparencia y Confianza', descripcion: 'Utilicen siempre la honradez en tu atención y servicio.', iconoSvg: 'Handshake', posicion: 'left' },
    { id: 6, titulo: 'Tu Tiempo, Nuestra Prioridad', descripcion: 'Manden los productos a tu hogar en el tiempo prometido.', iconoSvg: 'Truck', posicion: 'right' },
  ],

  lifestyleHeroImage: '/img/nosotros/Mucho.jpg',

  pilares: [
    { id: 1, titulo: 'Orgánico', descripcion: 'Libre de químicos y pesticidas, cultivado respetando la naturaleza.', imagenUrl: '/img/nosotros/organic-1024x1024.avif' },
    { id: 2, titulo: 'Natural', descripcion: 'Ingredientes que conservan su pureza y propiedades originales.', imagenUrl: '/img/nosotros/natural-1024x1024.avif' },
    { id: 3, titulo: 'Bienestar', descripcion: 'Apoya tu salud física y emocional de manera equilibrada.', imagenUrl: '/img/nosotros/Bienestar.avif' },
    { id: 4, titulo: 'Saludable', descripcion: 'Promueve hábitos sanos y un estilo de vida activo.', imagenUrl: '/img/nosotros/Saludable.avif' },
  ],
};
```

---

### Paso 5: Crear componentes React

**Ejemplo: `NosotrosHero.tsx`** (Sección 1 — Hero Parallax)

```tsx
// frontapp/src/components/nosotros/NosotrosHero.tsx

import Image from 'next/image';

interface NosotrosHeroProps {
  imagen: string;
  subtitulo: string;
  titulo: string;
}

export default function NosotrosHero({ imagen, subtitulo, titulo }: NosotrosHeroProps) {
  return (
    <section className="relative h-[420px] md:h-[520px] flex items-center justify-center text-center text-white rounded-3xl overflow-hidden">
      <Image
        src={imagen}
        alt={titulo}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative z-10 px-4">
        <p className="text-[11px] md:text-xs tracking-[0.35em] uppercase mb-3">
          {subtitulo}
        </p>
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-semibold leading-tight">
          {titulo}
        </h1>
      </div>
    </section>
  );
}
```

**Ejemplo: `CareTimeline.tsx`** (Sección 5 — Timeline) — componente más complejo con CSS custom

```tsx
// frontapp/src/components/nosotros/CareTimeline.tsx

import { Star, Headphones, Scale, Heart, Handshake, Truck } from 'lucide-react';
import { TimelineItem } from '@/types/nosotros';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Star, Headphones, Scale, HandHeart: Heart, Handshake, Truck,
};

interface CareTimelineProps {
  titulo: string;
  items: TimelineItem[];
}

export default function CareTimeline({ titulo, items }: CareTimelineProps) {
  return (
    <section className="py-16 bg-white rounded-3xl shadow-sm">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-700 mb-12">
          {titulo}
        </h2>

        <div className="relative">
          {/* Línea central */}
          <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-slate-200 -translate-x-1/2 hidden md:block" />

          {items.map((item, index) => {
            const IconComponent = iconMap[item.iconoSvg] || Star;
            return (
              <div key={item.id} className="grid grid-cols-1 md:grid-cols-[1fr_80px_1fr] items-center mb-12">
                {/* Lado izquierdo */}
                <div className={item.posicion === 'left' ? '' : 'hidden md:block'}>
                  {item.posicion === 'left' && (
                    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-md hover:-translate-y-1 transition-transform">
                      <h3 className="text-lg font-bold text-slate-800 mb-2">{item.titulo}</h3>
                      <p className="text-slate-500 text-sm leading-relaxed">{item.descripcion}</p>
                    </div>
                  )}
                </div>

                {/* Icono central */}
                <div className="hidden md:flex justify-center">
                  <div className="w-12 h-12 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center z-10">
                    <IconComponent className="w-5 h-5 text-sky-500" />
                  </div>
                </div>

                {/* Lado derecho */}
                <div className={item.posicion === 'right' ? '' : 'hidden md:block'}>
                  {item.posicion === 'right' && (
                    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-md hover:-translate-y-1 transition-transform">
                      <h3 className="text-lg font-bold text-slate-800 mb-2">{item.titulo}</h3>
                      <p className="text-slate-500 text-sm leading-relaxed">{item.descripcion}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

**Ejemplo: `PillarsGrid.tsx`** (Sección 7 — Pilares) — Server Component sin hooks

```tsx
// frontapp/src/components/nosotros/PillarsGrid.tsx

import Image from 'next/image';
import { Pilar } from '@/types/nosotros';

interface PillarsGridProps {
  pilares: Pilar[];
}

export default function PillarsGrid({ pilares }: PillarsGridProps) {
  return (
    <section className="py-20 bg-white rounded-3xl shadow-sm">
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {pilares.map((pilar) => (
            <div key={pilar.id} className="flex flex-col items-center text-center group">
              <div className="relative w-28 h-28 mb-6 rounded-full overflow-hidden shadow-lg group-hover:scale-105 transition-transform">
                <Image
                  src={pilar.imagenUrl}
                  alt={pilar.titulo}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-emerald-700 font-bold text-xl mb-3">{pilar.titulo}</h3>
              <p className="text-xs md:text-sm text-slate-500 leading-relaxed max-w-[200px]">
                {pilar.descripcion}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

### Paso 6: Barrel export

```typescript
// frontapp/src/components/nosotros/index.ts

export { default as NosotrosHero } from './NosotrosHero';
export { default as AboutDescription } from './AboutDescription';
export { default as ValuesCard } from './ValuesCard';
export { default as RelationCard } from './RelationCard';
export { default as CareTimeline } from './CareTimeline';
export { default as LifestyleHero } from './LifestyleHero';
export { default as PillarsGrid } from './PillarsGrid';
```

---

### Paso 7: Crear la página

```tsx
// frontapp/src/app/(public)/nosotros/page.tsx

import { Metadata } from 'next';
import {
  NosotrosHero,
  AboutDescription,
  ValuesCard,
  RelationCard,
  CareTimeline,
  LifestyleHero,
  PillarsGrid,
} from '@/components/nosotros';
import { nosotrosData } from '@/data/nosotrosData';

export const metadata: Metadata = {
  title: 'Nosotros | Lyrium BioMarketplace',
  description: 'Conoce Lyrium BioMarketplace: productos orgánicos y naturales para mejorar tu estilo de vida.',
};

export default function NosotrosPage() {
  return (
    <div className="space-y-8 md:space-y-16 pb-8 md:pb-12">
      {/* Hero parallax */}
      <NosotrosHero
        imagen={nosotrosData.heroImage}
        subtitulo={nosotrosData.heroSubtitulo}
        titulo={nosotrosData.heroTitulo}
      />

      {/* Texto descriptivo + imagen de doctora */}
      <AboutDescription
        textos={nosotrosData.descripcionTextos}
        doctoraImage={nosotrosData.doctoraImage}
      />

      {/* Overlay: Nuestros Valores */}
      <ValuesCard datos={nosotrosData.valores} />

      {/* Overlay: Nuestra Relación Contigo */}
      <RelationCard datos={nosotrosData.relacion} />

      {/* Timeline: Así Cuidamos de Ti */}
      <CareTimeline
        titulo="Así Cuidamos de Ti y del Mundo"
        items={nosotrosData.timelineItems}
      />

      {/* Hero parallax 2: Estilo de vida */}
      <LifestyleHero imagen={nosotrosData.lifestyleHeroImage} />

      {/* 4 Pilares: Orgánico, Natural, Bienestar, Saludable */}
      <PillarsGrid pilares={nosotrosData.pilares} />
    </div>
  );
}
```

> ⚠️ **Notas importantes:**
> - **NO** se importa `<PublicLayout>` — se aplica automáticamente por estar dentro de `app/(public)/`
> - Los datos se pasan siempre por **props**, nunca hardcodeados dentro del componente
> - Las imágenes del PHP (`img/nosotros/`) deben copiarse a `frontapp/public/img/nosotros/`
> - Los SVG inline del PHP se reemplazan por iconos de **Lucide React**

---

### Paso 8: Copiar imágenes

```bash
# Copiar las imágenes del PHP al proyecto React
cp -r c:/xampp/htdocs/LyriumAvance1/frontend/img/nosotros/ frontapp/public/img/nosotros/
```

Imágenes necesarias:
| Archivo | Uso | Tamaño |
|---|---|---|
| `1.png` | Hero parallax principal | ~1.2 MB |
| `2.png` | Imagen doctora | ~930 KB |
| `Mucho.jpg` | Hero parallax 2 | ~93 KB |
| `organic-1024x1024.avif` | Pilar Orgánico | ~16 KB |
| `natural-1024x1024.avif` | Pilar Natural | ~10 KB |
| `Bienestar.avif` | Pilar Bienestar | ~8 KB |
| `Saludable.avif` | Pilar Saludable | ~11 KB |

---

### Paso 9: Verificar

```bash
cd frontapp
npx next build
```

Debe aparecer `/nosotros` en el listado de rutas generadas.

---

### Resumen visual de la migración

```
📂 nosotros.php (268 líneas, monolítico)
│
│  Análisis → 7 secciones identificadas
│
├──→ 📂 types/nosotros.ts           (interfaces: TimelineItem, ValorCard, Pilar, etc.)
├──→ 📂 data/nosotrosData.ts        (datos extraídos del PHP → TypeScript)
├──→ 📂 components/nosotros/        (7 componentes + index.ts barrel)
│    ├── NosotrosHero.tsx            ← Hero parallax (Server Component)
│    ├── AboutDescription.tsx        ← Texto + Doctora (Server Component)
│    ├── ValuesCard.tsx              ← Overlay card derecha (Server Component)
│    ├── RelationCard.tsx            ← Overlay card izquierda (Server Component)
│    ├── CareTimeline.tsx            ← Timeline 6 cards (Server Component)
│    ├── LifestyleHero.tsx           ← Hero parallax 2 (Server Component)
│    ├── PillarsGrid.tsx             ← 4 pilares (Server Component)
│    └── index.ts                    ← Barrel export
├──→ 📂 app/(public)/nosotros/page.tsx (orquestador)
└──→ 📂 public/img/nosotros/        (7 imágenes copiadas del PHP)
```

> **Este mismo proceso se replica para cada página pendiente de migrar.** Consultar `METODOLOGIA_MIGRACION.md` para la guía completa y el checklist.

---

## 📚 Documentos complementarios

| Documento | Descripción |
|---|---|
| [`METODOLOGIA_MIGRACION.md`](METODOLOGIA_MIGRACION.md) | Guía paso a paso para migrar cada página PHP a React |
| [`COMPARACION_PHP_VS_REACT.md`](COMPARACION_PHP_VS_REACT.md) | Tabla de equivalencias PHP → React (iconos, sintaxis, patrones) |
| [`GUIA_ARQUITECTURA.md`](GUIA_ARQUITECTURA.md) | Arquitectura completa incluyendo paneles admin, seller y logistics |

---

## 👤 Autor

**PierreCodex** — [GitHub](https://github.com/PierreCodex)

---

## 📄 Licencia

Proyecto privado — Lyrium BioMarketplace © 2026
