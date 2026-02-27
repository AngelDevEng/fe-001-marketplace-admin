# Comparación PHP vs React — Home de Lyrium

## Fecha: 26/02/2026

---

## Resumen Rápido

| Sección PHP | Componente React | Estado |
|------------|-----------------|--------|
| `top-banner.php` (marquee + línea decorativa) | `AnnouncementBar.tsx` | ⚠️ **Parcial** — falta línea decorativa superior |
| `header.php` (logo, nav, mega-menu, whatsapp) | `PublicHeader.tsx` + subcomps | ⚠️ **Parcial** — faltan items del nav y WhatsApp |
| `search_bar.php` (filtros, teclado digital) | `SearchBar.tsx` | ⚠️ **Parcial** — falta indicadores de estado y teclado digital |
| `hero_section.php` (banner superior + slider + banner inferior) | `TopBanner.tsx` + `HeroSection.tsx` | ⚠️ **Parcial** — falta banner INFERIOR, falta banner 6, falta modal clic |
| `services_grid.php` (carrusel horizontal) | `ServicesGrid.tsx` | ⚠️ **Parcial** — es grid estático, PHP es carrusel con scroll |
| `products_grid.php` (categorías de PRODUCTOS) | `ProductsGrid.tsx` | ❌ **Diferente** — PHP muestra categorías con label, React muestra productos |
| `brands_carousel.php` | `BrandsCarousel.tsx` | ⚠️ **Parcial** — imágenes de rutas diferentes |
| `offers_section.php` (3 secciones parallax) | `OffersSection.tsx` | ❌ **Simplificado** — PHP tiene 3 bloques con parallax + cards con acciones |
| `ad_banners.php` (4 bloques de banners) | `AdBanners.tsx` | ❌ **Simplificado** — PHP tiene 4 bloques (sliders + estáticos), React solo 2 imágenes |
| `product_sliders.php` (4 sliders dinámicos) | `ProductSlider.tsx` x3 | ⚠️ **Parcial** — falta slider "Servicios en medicina natural" |
| `benefits_section.php` (parallax + marquee infinito) | `BenefitsSection.tsx` | ❌ **Diferente** — PHP tiene fondo parallax + scroll infinito, React es grid estático |
| `newsletter.php` (suscripción + checkbox) | `NewsletterSection.tsx` | ⚠️ **Parcial** — falta checkbox de política de privacidad |
| `footer.php` (5 cols + accordion + pago + WhatsApp) | `PublicFooter.tsx` | ❌ **Simplificado** — PHP tiene 5 columnas, accordion mobile, métodos de pago |
| Modal producto (`footer.php`) | — | ❌ **Falta** — no migrado |
| WhatsApp flotante (`header.php` + `footer.php`) | — | ❌ **Falta** — no migrado |

---

## Detalle por Sección

### 1. AnnouncementBar / `top-banner.php`

**PHP tiene y React NO tiene:**
- Línea decorativa superior `w-full h-1 bg-[#c7d93b]` antes del marquee
- El hover pausa la animación (`animation-play-state: paused`)

---

### 2. Header / `header.php`

**PHP tiene y React NO tiene:**
- **Fuente Outfit** de Google Fonts (el React usa Geist)
- Menú desktop tiene iconos Phosphor al lado de cada item: 🛍️ PRODUCTOS, 🎧 SERVICIOS, ℹ️ NOSOTROS, etc.
- **BIOBLOG** (link en el nav): `bioblog.php`
- **BIOFORO** (link en el nav): `bioforo.php`
- **WhatsApp flotante** (solo móvil): botón verde fijo `bottom-6 right-6`
- Menú móvil tiene **footer con Mi Cuenta + Carrito + Theme toggle**
- Menú móvil tiene **header de navegación secundaria** con botón "atrás" para drill-down
- **Animación de logo**: rotación 360° en hover y bounce al abrir menú móvil
- **Dark mode completo**: Forest theme con colores personalizados

---

### 3. SearchBar / `search_bar.php`

**PHP tiene y React NO tiene:**
- **Indicadores de estado** (5 pills): Buscador, Teclado, Precio, Categoría, Ofertas — que se activan visualmente cuando se selecciona un filtro
- **Teclado digital** (toggle switch) para pantallas táctiles
- **Slider de rango dual** (min y max) con Labels dinámicos: `S/ 0` a `S/ 2000`
- **Hidden input** para `max_price` además de `category`
- **Animación de entrada** del dropdown: `cubic-bezier(0.34, 1.56, 0.64, 1)` con `translate-y`
- **Categorías dinámicas** desde el backend (`$categoriasReales` del HomeController)

---

### 4. Hero Section / `hero_section.php`

**PHP tiene y React NO tiene:**
- **6 banners** (el React solo tiene 5, falta `6.png`)
- **Banner INFERIOR** (`BANNER_INFERIOR.png`) debajo del carrusel (separado del banner superior)
- **Variantes dark mode** de ambos banners (`BANNER-SUPERIOR3.png`, `BANNER-INFERIOR3.png`)
- **`scaleX(1.05)`** en cada banner para efecto "sin bordes" visual
- **Data attributes** para abrir modal al hacer clic en un banner (`data-modal="producto"`)
- Botones de navegación con fondo `bg-black/40` semitransparente (React usa `bg-white/80`)

---

### 5. Products Grid / `products_grid.php` — ❌ ESTE ES DIFERENTE

**En PHP** esta sección muestra **CATEGORÍAS DE PRODUCTOS** (no productos individuales):
- 6 items con imagen + label abajo: "BIENESTAR FISICO Y DEPORTE", "MASCOTAS", "SUPLEMENTOS VITAMINICOS", etc.
- Las imágenes son de `img/Inicio/2/` (1-6.png)
- Fondo `bg-sky-400` en cada tarjeta
- Forma de carrusel horizontal

**En React** se muestra `ProductsGrid` que renderiza `ProductCard` con precio y estrellas — esto **no existe en el PHP original**.

---

### 6. Offers Section / `offers_section.php` — ❌ MUY SIMPLIFICADO

**El PHP tiene 3 secciones completas con parallax:**

1. **"Las mejores ofertas de Servicios"** — Fondo parallax con imágenes rotativas + 5 cards de servicio con botones de acción (carrito, vista rápida, ver producto) + indicadores de navegación
2. **"Las mejores ofertas de productos"** — Mismo formato con parallax, cards de producto con tags (NUEVO, OFERTA, PREMIUM), stock, y acciones hover
3. **"Productos Nuevos"** — Tercera sección parallax con productos nuevos

**Funcionalidades de las cards PHP que React no tiene:**
- Botones de acción hover: agregar al carrito, vista rápida (abre modal), ver producto
- Tags de estado: NUEVO, OFERTA, PREMIUM, SALUD, DENTAL
- Indicador de stock
- Rotación automática cada 3 minutos
- Drag to scroll en desktop
- Pagination dots en móvil
- **Fondos parallax** que cambian de imagen periódicamente

**El React solo tiene:** Un banner gradiente con texto "¡Ofertas Especiales!" y un botón "Ver ofertas".

---

### 7. Ad Banners / `ad_banners.php` — ❌ MUY SIMPLIFICADO

**PHP tiene 4 bloques:**
1. **Slider grande** (2 slides × 2 imágenes): `img/Inicio/7/1-4.png` con dots de navegación
2. **Banners estáticos** (4 pequeños): `banner_pequeno_2.1-2.4.webp`
3. **Otro slider grande** (2 slides × 2 imágenes): `banner_mediano_3.1-3.3.webp`
4. **Más banners estáticos** (4 pequeños): `banner_pequeno_4.1-4.4.webp`

**React solo tiene:** 2 imágenes estáticas (`BANNER_INFERIOR.png` y `BANNER_INFERIOR2.png`)

---

### 8. Benefits Section / `benefits_section.php` — ❌ DISEÑO DIFERENTE

**PHP tiene:**
- Fondo **parallax** con imagen `img/Inicio/11/1.png` y color base `#8BC34A` (verde lima)
- **7 beneficios** (React solo tiene 4):
  1. Todo salud / 2. Tiendas selectas / 3. Mejores precios / 4. Seguridad / 5. Rapidez / 6. Más tiempo / 7. Donde quieras
- **Scroll horizontal infinito** (marquee) con bloques duplicados
- Círculos grandes con iconos Phosphor multicolor
- Texto blanco con `text-shadow` y `drop-shadow`
- Hover pausa el scroll
- Fade mask en los bordes laterales (`mask-image: linear-gradient`)

**React tiene:** Grid estático 2×4 con 4 beneficios simples.

---

### 9. Newsletter / `newsletter.php`

**PHP tiene y React NO tiene:**
- **Checkbox** de política de privacidad: "He leído y acepto la Política de Privacidad"
- Color de fondo `bg-teal-300` (el React usa gradiente `from-sky-500 to-emerald-500`)
- Layout grid 2 columnas (texto izquierda, form derecha). React tiene todo centrado.

---

### 10. Footer / `footer.php` — ❌ MUY DIFERENTE

**PHP tiene:**
- **5 columnas**: Logo/Redes, Contáctanos, ¿Te ayudamos?, Información, Métodos de pago
- **Accordion en móvil**: cada sección se colapsa/expande con chevron
- **Redes sociales**: Instagram, Facebook, TikTok, WhatsApp (React solo tiene Facebook, Instagram, YouTube)
- **Métodos de pago**: VISA, MasterCard, AmEx con badges + "Tienda 100% segura"
- **Logo blanco**: `logo_lyrium_blanco_01-scaled.webp`
- Color de fondo `bg-sky-500` (React usa `bg-gray-900`)
- **WhatsApp flotante desktop**: botón con texto "¿Cómo puedo ayudarte?"
- **Modal de producto**: modal global para vista rápida de productos

**Links específicos que faltan en React:**
- `/preguntasfrecuentes`
- `/politicasdeprivacidad`
- `/terminoscondiciones`
- `/libroreclamaciones`

---

### 11. Elementos Globales que Faltan

| Elemento PHP | Descripción |
|-------------|-------------|
| **Modal de producto** | Modal global que se abre al hacer clic en banners/productos |
| **WhatsApp flotante** (mobile) | Botón verde fijo en bottom-right con pulse animation |
| **WhatsApp flotante** (desktop) | Botón con texto "¿Cómo puedo ayudarte?" fijo en bottom-right |
| **Dark mode (Forest Theme)** | Sistema de dark mode completo con colores personalizados forest-* |
| **Fuente Outfit** | Google Font usada en todo el sitio PHP |
| **Live Search** (`live-search.js`) | Búsqueda en tiempo real con resultados dropdown |
| **Iconos Phosphor** | Set de iconos usado en PHP (React usa Lucide) |

---

## Prioridades para completar la migración

### 🔴 Alta (cambian la experiencia visual significativamente)

1. **Offers Section completa** — 3 bloques con parallax y product cards con acciones
2. **Products Grid** — Cambiar a categorías de productos con labels (no productos individuales)  
3. **Ad Banners completo** — 4 bloques con sliders y banners estáticos
4. **Benefits Section** — Rediseñar con scroll infinito, parallax y 7 items
5. **Footer completo** — 5 columnas, accordion mobile, métodos de pago

### 🟡 Media (funcionalidad importante)

6. **Modal de producto** — Global, se abre desde banners y cards
7. **WhatsApp flotante** — Ambas versiones (mobile y desktop)
8. **Banner 6** faltante en el HeroSection
9. **Banner INFERIOR** entero (separado de los ad banners)
10. **Slider de rango dual** en SearchBar

### 🟢 Baja (refinamiento)

11. Línea decorativa superior del AnnouncementBar
12. Hover pause en marquee
13. Iconos en items del nav desktop (BIOBLOG, BIOFORO)
14. Dark mode / Forest theme
15. Fuente Outfit
