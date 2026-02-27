# 🏗️ Guía de Arquitectura — Lyrium BioMarketplace (React)

## Fecha: 26/02/2026
## Autor: Code Review — Migración PHP → React

---

## PARTE 1: Code Review de la Integración Home

### ✅ Lo que está bien hecho

| Aspecto | Evaluación | Detalle |
|---------|-----------|---------|
| **Componentización** | ⭐⭐⭐⭐⭐ | 13 componentes atómicos para Home, cada uno con responsabilidad única |
| **Barrel exports** | ⭐⭐⭐⭐⭐ | `components/home/index.ts` permite imports limpios |
| **TypeScript** | ⭐⭐⭐⭐ | Interfaces definidas en `types/public.ts` con campos opcionales bien usados |
| **Layout público** | ⭐⭐⭐⭐ | `PublicLayout` encapsula Header + Footer + children correctamente |
| **Separación datos/vista** | ⭐⭐⭐⭐ | `data/homeData.ts` separa datos mock de la UI |
| **Props tipadas** | ⭐⭐⭐⭐ | Cada componente define su `interface XxxProps` |
| **SSR fix** | ⭐⭐⭐⭐ | `BrandsCarousel` usa `useEffect` para acceder a `window` (evita SSR crash) |
| **`page.tsx` limpio** | ⭐⭐⭐⭐⭐ | Solo orquesta componentes, sin lógica de negocio |
| **Responsive** | ⭐⭐⭐⭐ | Breakpoints mobile/desktop en todos los componentes |

### ⚠️ Problemas Críticos y Mejoras

---

#### 🔴 CRÍTICO 1: `PublicHeader.tsx` — 504 líneas, datos hardcodeados

**Archivo:** `components/layout/public/PublicHeader.tsx`

**Problema:** El componente contiene ~165 líneas de datos del mega-menú (`megaMenuData`) embebidos directamente. Esto viola **SRP (Single Responsibility Principle)** y **OCP (Open/Closed Principle)**.

**Impacto:** Cuando la API de Laravel devuelva las categorías dinámicamente, tendrás que reescribir gran parte de este archivo.

**Solución propuesta:**

```
📦 Extraer datos a:
   src/data/menuData.ts        ← datos estáticos del mega-menú
   
📦 Extraer subcomponentes a:
   src/components/layout/public/
   ├── PublicHeader.tsx          ← orquestador (~80 líneas)
   ├── DesktopNav.tsx            ← menú desktop con mega-menu
   ├── MobileMenu.tsx            ← menú lateral móvil
   └── MegaMenu.tsx              ← panel del mega-menú
```

---

#### 🔴 CRÍTICO 2: Bug en `ProductSlider.tsx` — Cálculo de transform incorrecto

**Archivo:** `components/home/ProductSlider.tsx` — Línea 49

```diff
- style={{ transform: `translateX(-${(current / productos.length) * 100 * current}%)` }}
+ style={{ transform: `translateX(-${current * (100 / productos.length)}%)` }}
```

La fórmula actual `(current / productos.length) * 100 * current` produce valores cuadráticos incorrectos. Por ejemplo, con 4 productos y `current=2`: `(2/4)*100*2 = 100%`, cuando debería ser `50%`.

---

#### 🟡 MEDIO 3: `BenefitsSection` ignora los datos de `homeData.ts`

**Problema:** En `homeData.ts` defines `beneficios[]`, pero `BenefitsSection.tsx` tiene sus datos hardcodeados internamente (líneas 10-14). Los datos de `homeData` nunca se usan.

**Solución:**
```tsx
// BenefitsSection.tsx — antes
const beneficios = [/* datos hardcodeados aquí */];
export default function BenefitsSection() {

// BenefitsSection.tsx — después
interface BenefitsSectionProps {
  beneficios: Beneficio[];
}
export default function BenefitsSection({ beneficios }: BenefitsSectionProps) {
```

Y en `page.tsx`:
```tsx
<BenefitsSection beneficios={homeData.beneficios} />
```

---

#### 🟡 MEDIO 4: `AnnouncementBar` está en `components/home/` pero se usa en `PublicLayout`

**Problema:** `AnnouncementBar` es parte del **layout** (se renderiza en TODAS las páginas públicas a través de `PublicLayout`), pero vive en `components/home/`. Cuando crees `/contacto` o `/nosotros`, seguirá mostrándose, lo cual está bien, pero su ubicación en la carpeta `home/` es confusa.

**Solución:** Mover `AnnouncementBar.tsx` a `components/layout/public/`:

```diff
- import { AnnouncementBar } from '@/components/home';
+ import AnnouncementBar from './AnnouncementBar';
```

---

#### 🟡 MEDIO 5: `SearchBar` usa `window.location.href` para navegación

**Archivo:** `components/home/SearchBar.tsx` — Línea 19

```diff
- window.location.href = `/buscar?q=${encodeURIComponent(searchTerm)}&category=${selectedCategory}`;
+ import { useRouter } from 'next/navigation';
+ const router = useRouter();
+ router.push(`/buscar?q=${encodeURIComponent(searchTerm)}&category=${selectedCategory}`);
```

`window.location.href` fuerza una recarga completa de la página, perdiendo el estado de React y haciendo un full roundtrip. Next.js usa `useRouter` para navegación SPA.

---

#### 🟡 MEDIO 6: `OffersSection` y `AdBanners` tienen datos hardcodeados

Ambos componentes tienen textos e imágenes embebidos sin posibilidad de configuración. Para la API de Laravel, deberían recibir props.

---

#### 🟢 MENOR 7: `HeroSection` tiene warning de ESLint

**Archivo:** `components/home/HeroSection.tsx` — Línea 23

```tsx
useEffect(() => {
  const timer = setInterval(() => { next(); }, 5000);
  return () => clearInterval(timer);
}, []); // ⚠️ `next` no está en el dependency array
```

**Fix:** Usar `useCallback` para `next` o incluirlo en las dependencias.

---

#### 🟢 MENOR 8: Falta una capa de servicios (`services/`)

No existe carpeta `services/` para las futuras llamadas a la API de Laravel. El proyecto ya tiene `lib/api.ts`, pero no hay una separación clara entre "llamar al endpoint" y "transformar la respuesta".

---

### 📊 Resumen — Scorecard

| Principio | Nota | Comentario |
|-----------|------|-----------|
| **SRP** | 7/10 | Excelente en componentes pequeños; `PublicHeader` necesita descomposición |
| **OCP** | 6/10 | Datos hardcodeados en varios componentes impiden extensión sin modificación |
| **DRY** | 8/10 | Buen reúso de `ProductCard` en grid y slider |
| **Separación de concerns** | 7/10 | Datos mock bien separados, pero falta capa de servicios |
| **Preparación para API** | 5/10 | No hay hooks ni servicios listos para consumir Laravel |
| **Escalabilidad** | 7/10 | Base sólida para nuevas páginas con `PublicLayout` |

**Nota general: 7/10** — Buen trabajo para una primera iteración. Con los ajustes propuestos, queda preparado para escalar.

---

## PARTE 2: Arquitectura Escalable para Nuevas Páginas

### 📁 Estructura de Carpetas Propuesta

```
frontapp/src/
├── app/
│   ├── (public)/                   # ← Route Group para páginas públicas
│   │   ├── layout.tsx              # ← PublicLayout aplicado automáticamente
│   │   ├── page.tsx                # ← Home (/)
│   │   ├── nosotros/
│   │   │   └── page.tsx            # ← /nosotros
│   │   ├── contacto/
│   │   │   └── page.tsx            # ← /contacto
│   │   ├── blog/
│   │   │   ├── page.tsx            # ← /blog (listado)
│   │   │   └── [slug]/
│   │   │       └── page.tsx        # ← /blog/:slug (artículo)
│   │   ├── tiendas/
│   │   │   └── page.tsx            # ← /tiendas
│   │   ├── productos/
│   │   │   ├── page.tsx            # ← /productos (catálogo)
│   │   │   └── [id]/
│   │   │       └── page.tsx        # ← /productos/:id (detalle)
│   │   ├── buscar/
│   │   │   └── page.tsx            # ← /buscar?q=...
│   │   └── carrito/
│   │       └── page.tsx            # ← /carrito
│   │
│   ├── (auth)/                     # ← Route Group para auth
│   │   ├── login/page.tsx
│   │   └── registro/page.tsx
│   │
│   ├── admin/                      # ← Ya existente (otro programador)
│   ├── seller/                     # ← Ya existente (otro programador)
│   ├── layout.tsx                  # ← Root layout (providers globales)
│   └── globals.css
│
├── components/
│   ├── home/                       # Componentes SOLO del Home
│   │   ├── index.ts
│   │   ├── HeroSection.tsx
│   │   ├── SearchBar.tsx
│   │   ├── ServicesGrid.tsx
│   │   ├── ProductsGrid.tsx
│   │   ├── ProductSlider.tsx
│   │   ├── BrandsCarousel.tsx
│   │   ├── OffersSection.tsx
│   │   ├── AdBanners.tsx
│   │   ├── BenefitsSection.tsx
│   │   ├── NewsletterSection.tsx
│   │   └── TopBanner.tsx
│   │
│   ├── nosotros/                   # Componentes SOLO de Nosotros
│   │   ├── index.ts
│   │   ├── TeamSection.tsx
│   │   ├── MissionVision.tsx
│   │   └── Timeline.tsx
│   │
│   ├── contacto/                   # Componentes SOLO de Contacto
│   │   ├── index.ts
│   │   ├── ContactForm.tsx
│   │   ├── ContactInfo.tsx
│   │   └── MapSection.tsx
│   │
│   ├── productos/                  # Componentes de catálogo
│   │   ├── index.ts
│   │   ├── ProductDetail.tsx
│   │   ├── ProductFilters.tsx
│   │   └── ProductCatalog.tsx
│   │
│   ├── layout/
│   │   ├── public/                 # Layout público compartido
│   │   │   ├── PublicLayout.tsx
│   │   │   ├── PublicHeader.tsx
│   │   │   ├── PublicFooter.tsx
│   │   │   ├── AnnouncementBar.tsx  # ← Movido desde home/
│   │   │   ├── DesktopNav.tsx       # ← Extraído de PublicHeader
│   │   │   ├── MobileMenu.tsx       # ← Extraído de PublicHeader
│   │   │   └── MegaMenu.tsx         # ← Extraído de PublicHeader
│   │   ├── admin/
│   │   ├── seller/
│   │   └── shared/
│   │
│   ├── shared/                     # Componentes reutilizables globales
│   │   ├── SectionTitle.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── SEOHead.tsx
│   │
│   └── ui/                         # Ya existente
│
├── services/                       # ★ NUEVA CAPA — Llamadas a API Laravel
│   ├── api.ts                      # Cliente axios/fetch base
│   ├── homeService.ts              # Endpoints de Home
│   ├── productService.ts           # Endpoints de productos
│   ├── contactService.ts           # Envío de formulario contacto
│   └── newsletterService.ts        # Suscripción newsletter
│
├── hooks/
│   ├── useHome.ts                  # ★ NUEVO — Hook para datos del Home
│   ├── useProducts.ts              # ★ NUEVO — Hook para productos
│   └── ... (existentes)
│
├── data/                           # Datos mock (temporal hasta conectar API)
│   ├── homeData.ts
│   ├── menuData.ts                 # ★ NUEVO — Datos del mega-menú extraídos
│   └── nosotrosData.ts             # ★ NUEVO — Datos mock para nosotros
│
├── types/
│   ├── public.ts                   # Tipos del sitio público
│   ├── product.ts                  # ★ NUEVO — Tipos de producto detallado
│   └── contact.ts                  # ★ NUEVO — Tipos del formulario contacto
│
└── constants/
    └── routes.ts                   # ★ NUEVO — Constantes de rutas
```

---

### 🔑 Concepto Clave: Route Groups de Next.js

La mejora más importante es usar **Route Groups** `(public)` para que el `PublicLayout` se aplique automáticamente a todas las páginas públicas sin necesidad de envolver cada `page.tsx` manualmente:

```tsx
// app/(public)/layout.tsx
import PublicLayout from '@/components/layout/public/PublicLayout';

export default function PublicPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PublicLayout>{children}</PublicLayout>;
}
```

```tsx
// app/(public)/page.tsx — Home (YA NO necesita importar PublicLayout)
import {
  SearchBar, TopBanner, HeroSection, ServicesGrid,
  ProductsGrid, BrandsCarousel, OffersSection, AdBanners,
  ProductSlider, BenefitsSection, NewsletterSection,
} from '@/components/home';
import { homeData } from '@/data/homeData';

export default function HomePage() {
  return (
    <div className="space-y-8 md:space-y-16 pb-8 md:pb-12">
      <SearchBar categorias={homeData.categorias} />
      <TopBanner />
      <HeroSection banners={homeData.banners} />
      {/* ... resto igual */}
    </div>
  );
}
```

> **Beneficio:** Cuando crees `/nosotros`, `/contacto`, o cualquier otra página dentro de `(public)/`, automáticamente tendrá el Header + Footer + AnnouncementBar sin repetir código.

---

## PARTE 3: Receta para Crear Nuevas Páginas

### 📋 Checklist — "Quiero crear la página `/contacto`"

#### Paso 1: Crear la carpeta de componentes

```
src/components/contacto/
├── index.ts                 # Barrel export
├── ContactForm.tsx          # Formulario de contacto
├── ContactInfo.tsx          # Información de la empresa
└── MapSection.tsx           # Mapa de ubicación
```

**Archivo `index.ts`:**
```tsx
export { default as ContactForm } from './ContactForm';
export { default as ContactInfo } from './ContactInfo';
export { default as MapSection } from './MapSection';
```

#### Paso 2: Definir tipos

```tsx
// src/types/contact.ts
export interface ContactFormData {
  nombre: string;
  email: string;
  telefono?: string;
  asunto: string;
  mensaje: string;
}

export interface ContactInfo {
  direccion: string;
  telefono: string;
  email: string;
  horario: string;
  coordenadas: { lat: number; lng: number };
}
```

#### Paso 3: Crear datos mock (temporal)

```tsx
// src/data/contactoData.ts
import { ContactInfo } from '@/types/contact';

export const contactInfo: ContactInfo = {
  direccion: 'Av. La Marina 2000, Lima, Perú',
  telefono: '+51 937 093 420',
  email: 'ventas@lyriumbiomarketplace.com',
  horario: 'Lun-Vie 9:00 - 18:00',
  coordenadas: { lat: -12.0464, lng: -77.0428 },
};
```

#### Paso 4: Crear el servicio (para la API futura)

```tsx
// src/services/contactService.ts
import { ContactFormData } from '@/types/contact';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const contactService = {
  async enviarFormulario(data: ContactFormData): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/contacto`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
};
```

#### Paso 5: Crear un componente ejemplo

```tsx
// src/components/contacto/ContactForm.tsx
'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { ContactFormData } from '@/types/contact';
// import { contactService } from '@/services/contactService'; // cuando la API esté lista

interface ContactFormProps {
  onSubmit?: (data: ContactFormData) => void;
}

export default function ContactForm({ onSubmit }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    nombre: '',
    email: '',
    telefono: '',
    asunto: '',
    mensaje: '',
  });
  const [enviado, setEnviado] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Futuro: await contactService.enviarFormulario(formData);
    onSubmit?.(formData);
    setEnviado(true);
  };

  if (enviado) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
        <p className="text-green-700 font-semibold">¡Mensaje enviado! Te contactaremos pronto.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          placeholder="Tu nombre"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-400 focus:outline-none"
          required
        />
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Tu correo"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-400 focus:outline-none"
          required
        />
      </div>
      <textarea
        name="mensaje"
        value={formData.mensaje}
        onChange={handleChange}
        placeholder="Tu mensaje"
        rows={5}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-400 focus:outline-none resize-none"
        required
      />
      <button
        type="submit"
        className="bg-sky-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-sky-600 transition-colors flex items-center gap-2"
      >
        <Send className="w-5 h-5" />
        Enviar mensaje
      </button>
    </form>
  );
}
```

#### Paso 6: Crear la página

```tsx
// src/app/(public)/contacto/page.tsx
import { Metadata } from 'next';
import { ContactForm, ContactInfo, MapSection } from '@/components/contacto';
import { contactInfo } from '@/data/contactoData';

export const metadata: Metadata = {
  title: 'Contáctanos | Lyrium BioMarketplace',
  description: 'Ponte en contacto con nuestro equipo.',
};

export default function ContactoPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Contáctanos
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Estamos aquí para ayudarte
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <ContactForm />
        <ContactInfo info={contactInfo} />
      </div>

      <MapSection coordenadas={contactInfo.coordenadas} />
    </div>
  );
}
```

> **Nota:** `PublicLayout` (Header, Footer, AnnouncementBar) se aplica automáticamente por estar dentro del route group `(public)`.

---

## PARTE 4: Preparación para la API de Laravel

### Patrón Service → Hook → Component

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   SERVICE    │────▶│    HOOK      │────▶│  COMPONENT   │
│ (fetch/axios)│     │ (React Query)│     │    (UI)      │
└──────────────┘     └──────────────┘     └──────────────┘
  productService.ts    useProducts.ts      ProductsGrid.tsx
```

#### Service (capa HTTP)

```tsx
// src/services/homeService.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const homeService = {
  async getBanners() {
    const res = await fetch(`${API_BASE}/banners`);
    return res.json();
  },
  async getProductosDestacados() {
    const res = await fetch(`${API_BASE}/productos/destacados`);
    return res.json();
  },
  async getCategorias() {
    const res = await fetch(`${API_BASE}/categorias`);
    return res.json();
  },
  async getMarcas() {
    const res = await fetch(`${API_BASE}/marcas`);
    return res.json();
  },
};
```

#### Hook (con React Query, ya instalado en el proyecto)

```tsx
// src/hooks/useHome.ts
import { useQuery } from '@tanstack/react-query';
import { homeService } from '@/services/homeService';
// Fallback a datos mock mientras no haya API:
import { homeData } from '@/data/homeData';

export function useBanners() {
  return useQuery({
    queryKey: ['banners'],
    queryFn: homeService.getBanners,
    placeholderData: homeData.banners,   // datos mock como fallback
    staleTime: 5 * 60 * 1000,           // 5 minutos de caché
  });
}

export function useProductosDestacados() {
  return useQuery({
    queryKey: ['productos', 'destacados'],
    queryFn: homeService.getProductosDestacados,
    placeholderData: homeData.productos,
  });
}
```

#### Component (consume el hook)

```tsx
// Futuro ProductsGrid.tsx con API
'use client';

import { useProductosDestacados } from '@/hooks/useHome';
import ProductCard from './ProductCard';

export default function ProductsGrid({ titulo = 'Productos Destacados' }) {
  const { data: productos, isLoading } = useProductosDestacados();

  if (isLoading) return <ProductsGridSkeleton />;

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-6">
        {titulo}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {productos?.map((producto) => (
          <ProductCard key={producto.id} producto={producto} />
        ))}
      </div>
    </section>
  );
}
```

---

## PARTE 5: Constantes de Rutas

Centralizar las rutas evita errores y facilita refactoring:

```tsx
// src/constants/routes.ts
export const ROUTES = {
  HOME: '/',
  NOSOTROS: '/nosotros',
  CONTACTO: '/contacto',
  BLOG: '/blog',
  TIENDAS: '/tiendas',
  PRODUCTOS: '/productos',
  PRODUCTO_DETALLE: (id: string | number) => `/productos/${id}`,
  BUSCAR: '/buscar',
  CARRITO: '/carrito',
  LOGIN: '/login',
  REGISTRO: '/registro',

  // Admin (existente)
  ADMIN: '/admin',
  SELLER: '/seller',
} as const;
```

Uso:
```tsx
import { ROUTES } from '@/constants/routes';
<Link href={ROUTES.CONTACTO}>Contáctanos</Link>
<Link href={ROUTES.PRODUCTO_DETALLE(42)}>Ver producto</Link>
```

---

## PARTE 6: Checklist de Acciones Inmediatas

> Prioridad de los cambios para aplicar en tu siguiente sprint.

### Prioridad ALTA (antes de seguir con más páginas)

- [ ] Crear `app/(public)/layout.tsx` con `PublicLayout` para route group
- [ ] Mover `page.tsx` actual a `app/(public)/page.tsx`
- [ ] Mover `AnnouncementBar.tsx` de `components/home/` a `components/layout/public/`
- [ ] Corregir bug del `transform` en `ProductSlider.tsx`
- [ ] Usar `useRouter` en lugar de `window.location.href` en `SearchBar.tsx`

### Prioridad MEDIA (antes de conectar la API)

- [ ] Extraer `megaMenuData` de `PublicHeader.tsx` a `data/menuData.ts`
- [ ] Dividir `PublicHeader.tsx` en `DesktopNav`, `MobileMenu`, `MegaMenu`
- [ ] Hacer que `BenefitsSection` reciba props en lugar de datos internos
- [ ] Crear carpeta `services/` con `homeService.ts` base
- [ ] Crear `constants/routes.ts`

### Prioridad BAJA (mejora continua)

- [ ] Hacer que `OffersSection` y `AdBanners` reciban props dinámicas
- [ ] Agregar `useCallback` al `next` del `HeroSection` para evitar warning ESLint
- [ ] Crear componente `SectionTitle` compartido (muchos componentes repiten el mismo `<h2>`)
- [ ] Agregar skeletons de loading para cuando la API tarde

---

## Resumen — Regla de Oro

> **Para cada nueva página que migres, sigue esta fórmula:**
>
> 1. **`types/`** — Define las interfaces TypeScript
> 2. **`data/`** — Crea datos mock temporales
> 3. **`components/<pagina>/`** — Crea componentes con barrel export
> 4. **`services/`** — Prepara el service (comentado hasta tener API)
> 5. **`app/(public)/<pagina>/page.tsx`** — Ensamble final (composición)
>
> El layout se aplica automáticamente. Los datos fluyen **Service → Hook → Component**.

---

*Documento generado como guía de arquitectura para la migración PHP → React del proyecto Lyrium BioMarketplace.*
