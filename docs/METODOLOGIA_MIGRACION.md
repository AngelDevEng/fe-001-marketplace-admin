# Guía de Migración PHP → React — Metodología de Trabajo

> **Para:** Cualquier agente o desarrollador que continúe la migración de Lyrium PHP a React.
> **Contexto:** Este documento describe el proceso exacto seguido para migrar el Home y debe replicarse para cada página restante.

---

## 1. Contexto del Proyecto

| Aspecto | Detalle |
|---------|---------|
| **Origen** | `c:\xampp\htdocs\LyriumAvance1\frontend\` — PHP + Tailwind CDN + Phosphor Icons + JS vanilla |
| **Destino** | `f:\PERSONAL_JEAN\marketplace-admin-features\frontapp\src\` — Next.js 16 + React 19 + TypeScript + Tailwind v4 + Lucide React |
| **Backend futuro** | Laravel API (variable `NEXT_PUBLIC_API_URL`) |
| **Layout público** | Se aplica automáticamente via Route Group `app/(public)/layout.tsx` |

---

## 2. Proceso de Migración (Paso a Paso)

### Paso 1: Leer y mapear el archivo PHP completo

**Qué hacer:**
- Abrir el archivo `.php` de la página a migrar (ej. `nosotros.php`, `contactanos.php`, `bioblog.php`)
- Abrir también `header.php` y `footer.php` para entender el contexto global (ya migrados)
- Identificar TODAS las secciones visuales del archivo
- Documentar cada sección con: nombre, líneas, qué datos usa, qué imágenes referencia

**Ejemplo de mapeo del `index.php`:**
```
1. top-banner.php → Línea decorativa + marquee
2. header.php → Logo, nav, mega-menu, whatsapp flotante
3. search_bar.php → Buscador con filtros avanzados
4. hero_section.php → Banner superior + carrusel 6 slides + banner inferior
5. services_grid.php → Carrusel de categorías de servicios
...etc
```

### Paso 2: Comparar con lo existente en React

**Qué hacer:**
- Revisar si ya existe un componente React equivalente
- Si existe, comparar sección por sección: ¿qué tiene el PHP que falta en React?
- Crear un listado tipo diff de diferencias

**Puntos clave a verificar:**
- ¿El diseño visual es idéntico? (colores, bordes, sombras, tamaños)
- ¿Los datos son dinámicos (props) o hardcodeados?
- ¿Falta alguna interacción? (hover, click, animación, scroll)
- ¿Las imágenes referencian las mismas rutas?
- ¿El responsive es equivalente? (mobile vs desktop breakpoints)

### Paso 3: Definir tipos TypeScript

**Ubicación:** `frontapp/src/types/`

**Reglas:**
```typescript
// ✅ CORRECTO — interfaces tipadas, sin any
export interface ContactFormData {
  nombre: string;
  email: string;
  mensaje: string;
}

// ❌ INCORRECTO
const data: any = ...
```

- Si la interfaz ya existe en `types/public.ts`, reutilizarla
- Si es nueva, crear archivo `types/[pagina].ts`
- Extender `HomeData` o crear una interfaz `[Pagina]Data` equivalente

### Paso 4: Crear datos mock

**Ubicación:** `frontapp/src/data/[pagina]Data.ts`

**Reglas:**
- Copiar los datos hardcodeados del PHP (arrays de `$beneficios`, `$marcas`, etc.)
- Convertirlos a TypeScript con los tipos del paso 3
- Las rutas de imágenes deben conservarse EXACTAS del PHP (ej. `/img/Inicio/1/1.png`)
- Estos datos mock serán reemplazados por la API de Laravel en el futuro

**Ejemplo de conversión:**
```php
// PHP (origin)
$beneficios = [
    ['icon' => 'ph-heart-fill', 'title' => 'Todo salud', 'sub' => 'Tiendas saludables'],
];
```
```typescript
// TypeScript (destino)
export const beneficios: Beneficio[] = [
    { id: 1, icono: 'heart', titulo: 'Todo salud', descripcion: 'Tiendas saludables' },
];
```

### Paso 5: Crear componentes React

**Ubicación:** `frontapp/src/components/[pagina]/`

**Estructura obligatoria:**
```
components/[pagina]/
├── index.ts              ← Barrel export (SIEMPRE)
├── SeccionUno.tsx
├── SeccionDos.tsx
└── SeccionTres.tsx
```

**Reglas de conversión PHP → React:**

| PHP | React |
|-----|-------|
| `<img src="img/...">` | `<Image src="/img/..." width={W} height={H} alt="..." />` (de `next/image`) |
| `<a href="pagina.php">` | `<Link href="/pagina">` (de `next/link`) |
| `<i class="ph-heart">` (Phosphor) | `<Heart className="w-5 h-5" />` (Lucide React) |
| `class="..."` | `className="..."` |
| `<?= $variable ?>` | `{variable}` (interpolación JSX) |
| `<?php foreach(...): ?>` | `{array.map((item) => (...))}` |
| `<?php if(...): ?>` | `{condition && (...)}` o ternario |
| `onclick="funcion()"` | `onClick={funcion}` |
| `style="color: red"` | `style={{ color: 'red' }}` |
| `document.getElementById()` | `useRef()` o `useState()` |
| `window.location.href = ...` | `useRouter().push(...)` (de `next/navigation`) |
| `setInterval(...)` | `useEffect(() => { const t = setInterval(...); return () => clearInterval(t); }, [])` |

**Mapeo de iconos Phosphor → Lucide:**

| Phosphor (PHP) | Lucide (React) |
|----------------|----------------|
| `ph-heart-fill` | `Heart` |
| `ph-storefront-fill` | `Store` |
| `ph-tag-fill` | `Tag` |
| `ph-shield-check-fill` | `ShieldCheck` |
| `ph-lightning-fill` | `Zap` |
| `ph-clock-fill` | `Clock` |
| `ph-globe-hemisphere-west-fill` | `Globe` |
| `ph-shopping-cart` | `ShoppingCart` |
| `ph-user-circle` | `User` |
| `ph-magnifying-glass` | `Search` |
| `ph-caret-down` | `ChevronDown` |
| `ph-caret-left` | `ChevronLeft` |
| `ph-caret-right` | `ChevronRight` |
| `ph-phone-call` | `Phone` |
| `ph-envelope-simple` | `Mail` |
| `ph-x` | `X` |
| `ph-list` | `Menu` |
| `ph-eye` | `Eye` |
| `ph-link` | `ExternalLink` |
| `ph-funnel` | `Filter` |
| `ph-microphone` | `Mic` |
| `ph-lock-key` | `Lock` |
| `ph-whatsapp-logo` | SVG inline (no existe en Lucide) |
| `ph-facebook-logo` | SVG inline |
| `ph-instagram-logo` | `Instagram` (de Lucide) |
| `ph-tiktok-logo` | SVG inline |

**Reglas del componente:**
- Usar `'use client';` SOLO si usa hooks (`useState`, `useEffect`, etc.)
- Sin hooks = Server Component (no poner `'use client'`)
- Props tipadas con `interface XxxProps { ... }`
- `export default function NombreComponente`
- Datos vía props, NO hardcodeados internamente

### Paso 6: Manejar animaciones y efectos JS

**Conversión de animaciones CSS:**
```css
/* PHP (en un <style> tag) */
@keyframes scroll-infinite {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
}
.animate-scroll-infinite {
    animation: scroll-infinite 40s linear infinite;
}
```
```css
/* React — agregar a globals.css dentro de @theme inline { ... } */
@keyframes scroll-infinite {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
}

/* Y en @layer utilities { ... } */
.animate-scroll-infinite {
    animation: scroll-infinite 40s linear infinite;
}
```

**Conversión de JS vanilla a hooks React:**

```javascript
// PHP — JS vanilla
document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('bannersTrack');
    let current = 0;
    setInterval(() => {
        current = (current + 1) % total;
        track.style.transform = `translateX(-${current * 100}%)`;
    }, 5000);
});
```

```tsx
// React — hooks
'use client';
import { useState, useEffect, useCallback } from 'react';

export default function Carousel({ items }) {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((c) => (c === items.length - 1 ? 0 : c + 1));
  }, [items.length]);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <div className="flex transition-transform duration-700"
         style={{ transform: `translateX(-${current * 100}%)` }}>
      {items.map(...)}
    </div>
  );
}
```

### Paso 7: Crear la página

**Ubicación:** `frontapp/src/app/(public)/[pagina]/page.tsx`

```tsx
import { Metadata } from 'next';
import { Seccion1, Seccion2 } from '@/components/[pagina]';
import { paginaData } from '@/data/[pagina]Data';

export const metadata: Metadata = {
  title: 'Título | Lyrium BioMarketplace',
  description: 'Descripción SEO.',
};

export default function PaginaPage() {
  return (
    <div className="space-y-8 md:space-y-16 pb-8 md:pb-12">
      <Seccion1 datos={paginaData.seccion1} />
      <Seccion2 datos={paginaData.seccion2} />
    </div>
  );
}
```

**CRÍTICO:**
- ❌ NO importar ni usar `<PublicLayout>` — se aplica automáticamente
- ✅ SIEMPRE definir `metadata` con title y description
- ✅ La página solo orquesta componentes

### Paso 8: Actualizar constantes

Agregar la nueva ruta en `frontapp/src/constants/routes.ts`:
```typescript
NOSOTROS: '/nosotros',
```

### Paso 9: Verificar build

```bash
npx next build
```

Debe mostrar:
- `✓ Compiled successfully`
- `✓ Generating static pages (N/N)`
- La nueva ruta debe aparecer en el listado

---

## 3. Patrones Específicos de Diseño Lyrium

### Parallax Sections (como Offers y Benefits)

```tsx
<div className="relative min-h-[480px] rounded-[30px] shadow-2xl overflow-hidden">
  {/* Fondo parallax */}
  <div
    className="absolute inset-0 z-0 bg-fixed bg-center bg-cover"
    style={{ backgroundImage: `url('${bgImage}')`, backgroundPosition: 'center 20%' }}
  />
  <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px] z-10 pointer-events-none" />
  
  {/* Contenido */}
  <div className="relative z-20 p-4 md:p-8 min-h-[480px] flex items-center">
    {/* ... */}
  </div>
</div>
```

### Product Cards con Hover Actions

```tsx
<article className="group rounded-2xl shadow-lg overflow-hidden">
  <div className="relative overflow-hidden h-[200px]">
    <Image src={img} alt={title} fill className="object-cover group-hover:scale-110 transition-transform" />
    
    {/* Hover overlay con botones */}
    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
      <button className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
        <ShoppingCart className="w-5 h-5" />
      </button>
      <button className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
        <Eye className="w-5 h-5" />
      </button>
    </div>
  </div>
  <div className="p-3 text-center">
    <h3>{title}</h3>
    <p>S/ {price}</p>
    <div>★★★★★</div>
  </div>
</article>
```

### Infinite Scroll Marquee

```tsx
{/* Duplicar el array para efecto seamless */}
const allItems = [...items, ...items];

<div style={{
  maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
  WebkitMaskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
}}>
  <div className="flex animate-scroll-infinite group-hover:[animation-play-state:paused]"
       style={{ width: 'max-content' }}>
    {allItems.map((item, i) => (
      <div key={`${item.id}-${i}`} className="w-[250px] mx-1 flex-shrink-0">
        {/* contenido */}
      </div>
    ))}
  </div>
</div>
```

### Banner Slider con Dots

```tsx
const [current, setCurrent] = useState(0);

<div className="relative overflow-hidden">
  <div className="flex transition-transform duration-700"
       style={{ transform: `translateX(-${current * 100}%)` }}>
    {slides.map(slide => <div key={slide.id} className="min-w-full">...</div>)}
  </div>
  
  {/* Dots de navegación */}
  <div className="flex justify-center gap-2 mt-3">
    {slides.map((_, i) => (
      <button key={i} onClick={() => setCurrent(i)}
        className={`h-2 rounded-full transition-all ${i === current ? 'w-6 bg-sky-500' : 'w-2 bg-gray-300'}`} />
    ))}
  </div>
</div>
```

---

## 4. Páginas Pendientes de Migrar

| Archivo PHP | Ruta React Propuesta | Complejidad |
|------------|---------------------|-------------|
| `nosotros.php` (14KB) | `/nosotros` | Media |
| `contactanos.php` (5KB) | `/contacto` | Baja |
| `bioblog.php` (54KB) | `/bioblog` | Alta |
| `bioforo.php` (49KB) | `/bioforo` | Alta |
| `tiendasregistradas.php` (13KB) | `/tiendas` | Media |
| `tienda.php` (34KB) | `/tienda/[id]` | Alta |
| `buscar.php` (7KB) | `/buscar` | Media |
| `carrito.php` (89KB) | `/carrito` | Muy Alta |
| `checkout_steps.php` (32KB) | `/checkout` | Alta |
| `preguntasfrecuentes.php` (21KB) | `/preguntas-frecuentes` | Media |
| `politicasdeprivacidad.php` (15KB) | `/politicas-de-privacidad` | Baja |
| `terminoscondiciones.php` (13KB) | `/terminos-y-condiciones` | Baja |
| `libroreclamaciones.php` (8KB) | `/libro-de-reclamaciones` | Baja |
| `login.php` (7KB) | `/login` (ya existe) | — |
| `loginTienda.php` (9KB) | `/login-tienda` | Media |
| `registro.php` (4KB) | `/registro` | Baja |

### Orden recomendado de migración:
1. **Páginas estáticas simples** (políticas, términos, FAQ) — para ganar velocidad
2. **Nosotros y Contacto** — páginas informativas con formulario
3. **Tiendas registradas** — listado con datos dinámicos
4. **Buscar** — conecta con productos
5. **BioBlog y BioForo** — contenido complejo
6. **Carrito y Checkout** — funcionalidad crítica (dejar para el final)

---

## 5. Estructura de Archivos Actual (Referencia)

```
frontapp/src/
├── app/
│   ├── (public)/
│   │   ├── layout.tsx          ← PublicLayout (Header+Footer automático)
│   │   ├── page.tsx            ← Home (/)
│   │   └── [nueva-pagina]/     ← Crear aquí cada nueva página
│   ├── layout.tsx              ← Root layout (providers globales)
│   └── globals.css             ← Animaciones y utilidades CSS
├── components/
│   ├── home/                   ← 13 componentes del Home + index.ts
│   ├── layout/public/          ← Header, Footer, MegaMenu, etc. (NO TOCAR)
│   └── [nueva-pagina]/         ← Crear carpeta por página
├── data/
│   ├── homeData.ts             ← Datos mock del Home
│   ├── menuData.ts             ← Items del menú
│   └── [pagina]Data.ts         ← Crear por página
├── types/
│   └── public.ts               ← Interfaces compartidas
├── services/
│   └── homeService.ts          ← Capa API (preparada para Laravel)
└── constants/
    └── routes.ts               ← URLs centralizadas
```

---

## 6. Checklist por Página (Copiar y Marcar)

```
## Migración de [NOMBRE_PAGINA].php

- [ ] Leí el archivo PHP completo y mapeé todas las secciones
- [ ] Comparé con lo existente en React (si aplica)
- [ ] Creé/actualicé tipos en types/
- [ ] Creé datos mock en data/[pagina]Data.ts
- [ ] Creé componentes en components/[pagina]/ con index.ts barrel
- [ ] Cada componente recibe datos por props (no hardcodeados)
- [ ] Usé Image de next/image para todas las imágenes
- [ ] Usé Link de next/link para todos los enlaces internos
- [ ] Usé Lucide React en vez de Phosphor icons
- [ ] Animaciones CSS agregadas en globals.css si es necesario
- [ ] JS vanilla convertido a hooks React (useState, useEffect, useCallback)
- [ ] Creé la página en app/(public)/[pagina]/page.tsx con metadata
- [ ] NO usé PublicLayout manualmente (se aplica solo)
- [ ] Actualicé constants/routes.ts
- [ ] Build exitoso: npx next build
- [ ] Revisé visualmente en el navegador
```
