<?php
// C:\xampp\htdocs\lyrium\frontend\carrito.php
session_start();

if (!isset($_SESSION['cliente_id'])) {
  $_SESSION['cliente_id'] = 1; // DEMO
}
$clienteId = (int) $_SESSION['cliente_id'];
?>
<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lyrium Biomarketplace</title>

  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/phosphor-icons"></script>

  <link href="utils/css/index.css?v=<?= time() ?>" rel="stylesheet">
  <link rel="icon" type="image/png" href="img/logo.png?v=<?= time() ?>" />

  <!-- ✅ Estilo moderno + compacto + responsive + scroll en modales + estrellas alineadas + filtro por precio -->
  <style>
    :root {
      --brand: 35, 180, 254;
      /* #23B4FE */
      --lime: 132, 204, 22;
      --ink: 15, 23, 42;
      --muted: 100, 116, 139;
    }

    .text-ink {
      color: rgba(var(--ink), .92);
    }

    .text-muted {
      color: rgba(var(--muted), .95);
    }

    .icon-brand {
      color: rgba(var(--brand), 1);
    }

    .lyrium-hero {
      background:
        radial-gradient(900px 260px at 35% -10%, rgba(var(--brand), .16), transparent 60%),
        radial-gradient(900px 260px at 95% 0%, rgba(var(--lime), .14), transparent 55%),
        linear-gradient(90deg, rgba(var(--brand), .08), rgba(var(--lime), .08));
      border: 1px solid rgba(var(--brand), .16);
    }

    .lyrium-card {
      border: 1px solid rgba(var(--ink), .08);
      background:
        radial-gradient(900px 220px at 40% -10%, rgba(var(--brand), .08), transparent 60%),
        radial-gradient(900px 220px at 90% 0%, rgba(var(--lime), .07), transparent 55%),
        #fff;
      transition: box-shadow .18s ease, transform .18s ease, border-color .18s ease;
    }

    .lyrium-card:hover {
      border-color: rgba(var(--brand), .22);
      box-shadow: 0 18px 52px rgba(2, 132, 199, .10);
      transform: translateY(-2px);
    }

    .line-clamp-1 {
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .line-clamp-3 {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .soft-pill {
      border: 1px solid rgba(var(--brand), .16);
      background: rgba(255, 255, 255, .88);
      backdrop-filter: blur(8px);
    }

    .soft-chip {
      border: 1px solid rgba(var(--ink), .08);
      background: rgba(255, 255, 255, .75);
    }

    /* ✅ rating pill + estrellas completas */
    .rating-pill {
      border: 1px solid rgba(var(--brand), .18);
      background: linear-gradient(90deg, rgba(var(--brand), .10), rgba(var(--lime), .08));
      color: rgba(var(--ink), .90);
      display: inline-flex;
      align-items: center;
      gap: 6px;
      line-height: 1;
      white-space: nowrap;
      max-width: 100%;
      overflow: hidden;
      padding: 5px 8px !important;
      border-radius: 999px;
    }

    .stars-row {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      line-height: 1;
      white-space: nowrap;
      flex: 0 0 auto;
      vertical-align: middle;
    }

    .stars-row i {
      font-size: 14px;
      line-height: 1;
      display: inline-block;
      vertical-align: middle;
      transform: translateY(.5px);
    }

    @media (max-width: 420px) {
      .rating-pill .text-muted {
        display: none;
      }

      .stars-row i {
        font-size: 13px;
      }
    }

    .modal-backdrop {
      background: rgba(15, 23, 42, .58);
      backdrop-filter: blur(2px);
    }

    .btn-brand {
      background: rgba(var(--brand), 1);
      color: #fff;
    }

    .btn-brand:hover {
      filter: brightness(.96);
    }

    .btn-outline {
      border: 1px solid rgba(var(--brand), .26);
      background: rgba(255, 255, 255, .92);
      color: rgba(var(--ink), .92);
    }

    .btn-outline:hover {
      background: rgba(var(--brand), .06);
    }

    /* ✅ Botones pequeños + notorios */
    .btn-mini {
      padding: 10px 12px;
      border-radius: 14px;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: .2px;
      box-shadow: 0 14px 30px rgba(2, 132, 199, .14);
      transition: transform .15s ease, box-shadow .15s ease, filter .15s ease;
    }

    .btn-mini:hover {
      transform: translateY(-1px);
      box-shadow: 0 18px 38px rgba(2, 132, 199, .18);
      filter: brightness(.98);
    }

    .btn-mini:active {
      transform: translateY(0px) scale(.99);
    }

    .card-actions {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-top: 14px;
    }

    @media (max-width: 420px) {
      .card-actions {
        grid-template-columns: 1fr;
      }
    }

    /* ===================== MODALES COMPACTAS + SCROLL ===================== */
    .modal-compact .modal-card {
      border-radius: 22px;
    }

    .modal-compact .modal-head {
      padding: 10px 14px;
    }

    .modal-compact .modal-body {
      padding: 12px 14px;
    }

    .modal-compact .modal-foot {
      padding: 10px 14px;
    }

    .modal-shell {
      max-height: calc(100vh - 28px);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .modal-scroll {
      overflow: auto;
      -webkit-overflow-scrolling: touch;
    }

    @media (max-width: 640px) {
      .modal-compact .modal-head {
        padding: 10px 12px;
      }

      .modal-compact .modal-body {
        padding: 10px 12px;
      }

      .modal-compact .modal-foot {
        padding: 10px 12px;
      }
    }

    /* ===================== SUGERENCIAS (payModal más pequeñas) ===================== */
    .sug-card-sm {
      padding: 8px;
      border-radius: 16px;
    }

    .sug-card-sm .sug-img {
      border-radius: 14px;
      overflow: hidden;
      background: #f3f4f6;
      border: 1px solid rgba(var(--ink), .08);
    }

    .sug-card-sm .sug-title {
      font-size: 12px;
      line-height: 1.2;
      min-height: 30px;
    }

    .sug-card-sm .sug-price {
      font-size: 12px;
    }

    .sug-card-sm .sug-btn {
      padding: 8px 10px;
      border-radius: 12px;
      font-size: 12px;
    }

    @media (max-width: 640px) {
      .sug-card-sm .sug-title {
        min-height: 0;
      }
    }

    /* ===================== FILTROS (buscador/ordenar/precio) ===================== */
    .filterbar {
      border: 1px solid rgba(var(--brand), .16);
      background: rgba(255, 255, 255, .88);
      backdrop-filter: blur(10px);
    }

    .filter-card {
      border: 1px solid rgba(var(--ink), .08);
      background: rgba(255, 255, 255, .92);
      border-radius: 18px;
    }

    .range-wrap {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .range-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      flex-wrap: wrap;
    }

    .range-pill {
      border: 1px solid rgba(var(--ink), .10);
      background: rgba(248, 250, 252, .9);
      border-radius: 999px;
      padding: 6px 10px;
      font-size: 12px;
      color: rgba(var(--ink), .88);
      display: inline-flex;
      align-items: center;
      gap: 6px;
      white-space: nowrap;
    }

    .range-sliders {
      position: relative;
      height: 34px;
      display: flex;
      align-items: center;
    }

    .range-sliders input[type="range"] {
      -webkit-appearance: none;
      appearance: none;
      width: 100%;
      height: 6px;
      border-radius: 999px;
      background: rgba(var(--brand), .16);
      outline: none;
      position: absolute;
      left: 0;
      pointer-events: none;
    }

    .range-sliders input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 18px;
      height: 18px;
      border-radius: 999px;
      background: rgba(var(--brand), 1);
      border: 3px solid #fff;
      box-shadow: 0 10px 20px rgba(2, 132, 199, .18);
      cursor: pointer;
      pointer-events: auto;
    }

    .range-sliders input[type="range"]::-moz-range-thumb {
      width: 18px;
      height: 18px;
      border-radius: 999px;
      background: rgba(var(--brand), 1);
      border: 3px solid #fff;
      box-shadow: 0 10px 20px rgba(2, 132, 199, .18);
      cursor: pointer;
      pointer-events: auto;
    }

    .range-fill {
      position: absolute;
      left: 0;
      right: 0;
      height: 6px;
      border-radius: 999px;
      background: linear-gradient(90deg, rgba(var(--brand), .95), rgba(var(--lime), .85));
      pointer-events: none;
    }

    /* ✅ Checkout page usa mismo look */
    .checkout-shell {
      border: 1px solid rgba(var(--brand), .16);
      background:
        radial-gradient(900px 220px at 40% -10%, rgba(var(--brand), .08), transparent 60%),
        radial-gradient(900px 220px at 90% 0%, rgba(var(--lime), .07), transparent 55%),
        #fff;
      border-radius: 24px;
      box-shadow: 0 18px 52px rgba(2, 132, 199, .10);
    }
  </style>
</head>

<body class="bg-gray-50 min-h-screen flex flex-col">

  <?php include 'header.php'; ?>

  <main class="max-w-7xl mx-auto px-4 py-10 flex-1">

    <!-- Encabezado -->
    <div class="lyrium-hero rounded-3xl px-6 py-6 md:px-8 md:py-7 mb-7">

      <!-- ✅ Filtros (ÚNICOS) -->
      <div class="mt-1 grid grid-cols-1 lg:grid-cols-3 gap-3 filterbar rounded-3xl p-4">
        <!-- Buscador -->
        <div class="filter-card p-3">
          <p class="text-xs text-muted inline-flex items-center gap-2">
            <i class="ph-magnifying-glass icon-brand"></i> Buscar
          </p>

          <div class="mt-2 flex items-center gap-2">
            <input id="productSearch" type="text" placeholder="Buscar por nombre, SKU, categoría…"
              class="w-full outline-none text-sm bg-transparent text-ink" autocomplete="off">

            <button id="btnClearSearch" type="button"
              class="hidden text-xs px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-ink">
              <i class="ph-x"></i>
            </button>
          </div>

          <!-- Chips -->
          <div class="flex flex-wrap gap-2 mt-3">
            <button
              class="chipQuick inline-flex items-center gap-2 px-3 py-2 rounded-full bg-sky-50 text-sky-700 text-xs hover:bg-sky-100"
              data-q="oferta">
              <i class="ph-tag icon-brand text-base"></i> Ofertas
            </button>
            <button
              class="chipQuick inline-flex items-center gap-2 px-3 py-2 rounded-full bg-emerald-50 text-emerald-700 text-xs hover:bg-emerald-100"
              data-q="destacado">
              <i class="ph-star icon-brand text-base"></i> Destacados
            </button>
            <button
              class="chipQuick inline-flex items-center gap-2 px-3 py-2 rounded-full bg-lime-50 text-lime-700 text-xs hover:bg-lime-100"
              data-q="bio">
              <i class="ph-leaf icon-brand text-base"></i> Bio
            </button>
          </div>
        </div>

        <!-- Ordenar + Info -->
        <div class="filter-card p-3">
          <div class="flex items-center justify-between gap-3">
            <div>
              <p class="text-xs text-muted inline-flex items-center gap-2">
                <i class="ph-funnel icon-brand"></i> Ordenar
              </p>
              <select id="sortSelect"
                class="mt-2 w-full bg-white/90 border border-sky-100 rounded-xl px-3 py-2 text-sm shadow-sm outline-none text-ink">
                <option value="recent">Más recientes</option>
                <option value="priceAsc">Precio: menor a mayor</option>
                <option value="priceDesc">Precio: mayor a menor</option>
                <option value="nameAsc">Nombre: A-Z</option>
                <option value="ratingDesc">Mejor valorados</option>
              </select>
            </div>

            <div class="hidden md:block">
              <div class="text-sm text-ink flex items-center gap-2">
                <span class="w-9 h-9 rounded-xl bg-white/85 border border-sky-100 grid place-items-center text-sky-700">
                  <i class="ph-list-numbers icon-brand text-lg"></i>
                </span>
                <span>
                  <span class="icon-brand" id="countLabel">0</span> productos
                </span>
              </div>
            </div>
          </div>

          <div class="mt-3 md:hidden text-sm text-ink flex items-center gap-2">
            <span class="w-9 h-9 rounded-xl bg-white/85 border border-sky-100 grid place-items-center text-sky-700">
              <i class="ph-list-numbers icon-brand text-lg"></i>
            </span>
            <span><span class="icon-brand" id="countLabelMobile">0</span> productos</span>
          </div>
        </div>

        <!-- Precio -->
        <div class="filter-card p-3">
          <div class="flex items-center justify-between">
            <p class="text-xs text-muted inline-flex items-center gap-2">
              <i class="ph-currency-dollar icon-brand"></i> Precio
            </p>

            <button id="btnPriceReset" type="button"
              class="text-xs px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-ink inline-flex items-center gap-2">
              <i class="ph-arrow-counter-clockwise icon-brand"></i> Reset
            </button>
          </div>

          <div class="range-wrap mt-2">
            <div class="range-row">
              <span class="range-pill"><i class="ph-minus icon-brand"></i> Min: <b id="lblPriceMin">S/ 0</b></span>
              <span class="range-pill"><i class="ph-plus icon-brand"></i> Max: <b id="lblPriceMax">S/ 0</b></span>
            </div>

            <div class="range-sliders">
              <div id="rangeFill" class="range-fill"></div>
              <input id="priceMin" type="range" min="0" max="1000" step="1" value="0">
              <input id="priceMax" type="range" min="0" max="1000" step="1" value="1000">
            </div>

            <p class="text-[11px] text-muted inline-flex items-center gap-2">
              <i class="ph-mouse icon-brand"></i> Arrastra para filtrar (en tiempo real)
            </p>
          </div>
        </div>
      </div>

      <!-- Título -->
      <div class="mt-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
        <div>
          <div class="inline-flex items-center gap-2 text-xs text-ink soft-pill px-3 py-1 rounded-full">
            <i class="ph-shopping-bag icon-brand text-base"></i>
            Catálogo Lyrium
          </div>

          <h2 class="mt-3 text-2xl md:text-3xl text-ink tracking-tight flex items-center gap-2">
            <i class="ph-sparkle icon-brand"></i>
            Productos
          </h2>

          <p class="text-sm text-muted mt-1 flex items-center gap-2">
            <i class="ph-info icon-brand"></i>
            Busca, compara y añade al carrito en un clic.
          </p>
        </div>
      </div>
    </div>

    <!-- Grid Productos -->
    <div id="productsGrid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"></div>

    <!-- Estado vacío -->
    <div id="emptyStateProducts"
      class="hidden mt-8 bg-white border border-sky-50 rounded-3xl p-10 text-center shadow-sm">
      <div class="mx-auto w-14 h-14 rounded-2xl bg-sky-50 text-sky-700 grid place-items-center">
        <i class="ph-magnifying-glass icon-brand text-3xl"></i>
      </div>
      <p class="mt-4 text-ink text-lg">No encontramos productos</p>
      <p class="text-sm text-muted mt-1">Prueba con otro término o ajusta el precio.</p>
    </div>
  </main>

  <!-- ================= MODAL DETALLE PRODUCTO ================= -->
  <div id="prodModal" class="hidden fixed inset-0 z-[80] modal-compact">
    <div id="prodModalOverlay" class="absolute inset-0 modal-backdrop"></div>

    <div class="relative max-w-6xl mx-auto px-4 py-4 sm:py-8">
      <div class="bg-white shadow-2xl overflow-hidden border border-sky-100 modal-card modal-shell">
        <div class="flex items-center justify-between border-b border-sky-50 modal-head"
          style="background: linear-gradient(90deg, rgba(35,180,254,.10), rgba(132,204,22,.08));">
          <div class="flex items-center gap-2 text-ink">
            <i class="ph-image-square icon-brand text-xl"></i>
            <span class="text-sm text-ink" id="prodModalTitle">Detalle del producto</span>
          </div>
          <button id="prodModalClose"
            class="w-10 h-10 rounded-2xl bg-white/80 border border-sky-100 text-ink hover:bg-white grid place-items-center">
            <i class="ph-x text-xl"></i>
          </button>
        </div>

        <div class="modal-scroll">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-0">
            <div class="modal-body border-b lg:border-b-0 lg:border-r border-sky-50">
              <div class="rounded-2xl overflow-hidden bg-slate-50 border border-sky-100 relative select-none">
                <div id="zoomStage" class="relative w-full aspect-square overflow-hidden cursor-zoom-in">
                  <img id="zoomImg" src="" alt="Imagen producto" class="absolute inset-0 w-full h-full object-cover"
                    style="transform: translate(0px,0px) scale(1); transform-origin: 50% 50%; will-change: transform;">
                </div>

                <div class="absolute bottom-3 left-3 flex items-center gap-2">
                  <button id="zoomOut"
                    class="px-3 py-2 rounded-xl bg-white/90 border border-sky-100 text-ink hover:bg-white inline-flex items-center gap-2">
                    <i class="ph-minus icon-brand"></i><span class="text-xs">Zoom</span>
                  </button>
                  <button id="zoomIn"
                    class="px-3 py-2 rounded-xl bg-white/90 border border-sky-100 text-ink hover:bg-white inline-flex items-center gap-2">
                    <i class="ph-plus icon-brand"></i><span class="text-xs">Zoom</span>
                  </button>
                  <button id="zoomReset"
                    class="px-3 py-2 rounded-xl bg-white/90 border border-sky-100 text-ink hover:bg-white inline-flex items-center gap-2">
                    <i class="ph-arrows-out-cardinal icon-brand"></i><span class="text-xs">Reset</span>
                  </button>
                </div>

                <div
                  class="absolute top-3 left-3 px-3 py-2 rounded-xl bg-white/90 border border-sky-100 text-ink text-xs inline-flex items-center gap-2">
                  <i class="ph-mouse icon-brand"></i>
                  Rueda = zoom · Arrastra = mover
                </div>
              </div>

              <div id="thumbs" class="mt-4 grid grid-cols-6 gap-2"></div>
            </div>

            <div class="modal-body">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <h3 id="pNombre" class="text-xl text-ink"></h3>
                  <p class="mt-1 text-sm text-muted inline-flex items-center gap-2">
                    <span id="pCategoria" class="px-2 py-1 rounded-full bg-slate-50 border border-slate-100"></span>
                    <span id="pSku" class="px-2 py-1 rounded-full bg-slate-50 border border-slate-100"></span>
                  </p>
                </div>

                <div class="text-right">
                  <div id="pRating" class="inline-flex items-center gap-1"></div>
                  <p id="pStock" class="mt-2 text-xs text-muted"></p>
                </div>
              </div>

              <div class="mt-4 flex items-end justify-between">
                <div>
                  <p id="pPrecioFinal" class="text-2xl text-emerald-700 inline-flex items-center gap-2">
                    <i class="ph-currency-dollar icon-brand"></i><span></span>
                  </p>
                  <p id="pPrecioBase" class="text-sm text-slate-400 line-through"></p>
                  <p id="pAhorro" class="text-sm text-emerald-700"></p>
                </div>

                <div class="flex items-center gap-2">
                  <button id="btnModalAdd" class="px-4 py-3 rounded-2xl btn-brand inline-flex items-center gap-2">
                    <i class="ph-shopping-cart"></i>
                    Añadir
                  </button>
                  <button id="btnModalOpenCart"
                    class="px-4 py-3 rounded-2xl btn-outline inline-flex items-center gap-2">
                    <i class="ph-bag icon-brand"></i>
                    Ver carrito
                  </button>
                </div>
              </div>

              <div class="mt-5">
                <p class="text-sm text-ink" id="pDescCorta"></p>
              </div>

              <div class="mt-5">
                <div class="flex items-center gap-2 text-ink">
                  <i class="ph-list-checks icon-brand"></i>
                  <span class="text-sm">Atributos</span>
                </div>
                <div id="pAtributos" class="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2"></div>
              </div>

              <div class="mt-5" id="variacionesWrap" style="display:none;">
                <div class="flex items-center gap-2 text-ink">
                  <i class="ph-squares-four icon-brand"></i>
                  <span class="text-sm">Variaciones</span>
                </div>
                <div id="pVariaciones" class="mt-3 space-y-2"></div>
              </div>

              <div class="mt-5" id="descLargaWrap" style="display:none;">
                <div class="flex items-center gap-2 text-ink">
                  <i class="ph-text-aa icon-brand"></i>
                  <span class="text-sm">Detalle</span>
                </div>
                <p id="pDescLarga" class="mt-2 text-sm text-muted leading-relaxed"></p>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-foot border-t border-sky-50 bg-white">
          <p class="text-xs text-muted inline-flex items-center gap-2">
            <i class="ph-info icon-brand"></i>
            Tip: miniatura cambia imagen; rueda zoom; doble click reset.
          </p>
        </div>
      </div>
    </div>
  </div>

  <!-- ================= MODAL DETALLE PAGO ================= -->
  <div id="payModal" class="hidden fixed inset-0 z-[250] modal-compact">
    <div id="payModalOverlay" class="absolute inset-0 modal-backdrop"></div>

    <div class="relative max-w-3xl mx-auto px-4 py-4 sm:py-8">
      <div class="bg-white shadow-2xl overflow-hidden border border-sky-100 modal-card relative modal-shell">
        <div class="flex items-center justify-between border-b border-sky-50 modal-head"
          style="background: linear-gradient(90deg, rgba(35,180,254,.12), rgba(15,23,42,.02));">
          <div class="flex items-center gap-2 text-ink">
            <i class="ph-credit-card icon-brand text-xl"></i>
            <div>
              <p class="text-sm text-ink leading-tight">Detalle del pago</p>
              <p class="text-xs text-muted leading-tight">Revisa tu compra antes de confirmar</p>
            </div>
          </div>
          <button id="payModalClose"
            class="w-10 h-10 rounded-2xl bg-white/85 border border-sky-100 text-ink hover:bg-white grid place-items-center">
            <i class="ph-x text-xl"></i>
          </button>
        </div>

        <div class="modal-body modal-scroll">
          <div class="flex items-center justify-between">
            <p class="text-sm text-ink inline-flex items-center gap-2">
              <span class="w-8 h-8 rounded-xl bg-sky-50 grid place-items-center">
                <i class="ph-bag icon-brand"></i>
              </span>
              <span id="payItemsLabel">0 items</span>
            </p>

            <button id="payEditCart" class="text-xs px-3 py-2 rounded-xl btn-outline inline-flex items-center gap-2">
              <i class="ph-pencil-simple icon-brand"></i>
              Editar carrito
            </button>
          </div>

          <div id="payItems" class="mt-3 space-y-2"></div>
          <div id="paySuggestions" class="mt-4"></div>

          <div class="mt-4 rounded-2xl border border-sky-100 bg-white/90 p-4">
            <div class="flex items-center justify-between text-sm text-muted">
              <span class="inline-flex items-center gap-2">
                <i class="ph-calculator icon-brand"></i> Subtotal
              </span>
              <span id="paySubtotal">S/ 0.00</span>
            </div>

            <div class="mt-2 flex items-center justify-between text-sm text-muted">
              <span class="inline-flex items-center gap-2">
                <i class="ph-tag icon-brand"></i> Descuentos
              </span>
              <span class="text-emerald-700" id="payDiscount">- S/ 0.00</span>
            </div>

            <div class="mt-3 h-px bg-sky-50"></div>

            <div class="mt-3 flex items-center justify-between text-[15px] text-ink">
              <span class="inline-flex items-center gap-2">
                <i class="ph-receipt icon-brand"></i> Total a pagar
              </span>
              <span id="payTotal" class="text-ink">S/ 0.00</span>
            </div>

            <p class="mt-2 text-xs text-muted inline-flex items-center gap-2">
              <i class="ph-info icon-brand"></i>
              El IGV/envío se confirmará en checkout si aplica.
            </p>
          </div>

          <div class="mt-4">
            <p class="text-sm text-ink inline-flex items-center gap-2">
              <i class="ph-wallet icon-brand"></i> Método de pago
            </p>
            <div class="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button class="payMethod rounded-2xl border border-sky-100 bg-white hover:bg-sky-50 p-3 text-left"
                data-method="card">
                <p class="text-sm text-ink inline-flex items-center gap-2">
                  <i class="ph-credit-card icon-brand"></i> Tarjeta
                </p>
                <p class="text-xs text-muted mt-1">Visa / MasterCard</p>
              </button>
              <button class="payMethod rounded-2xl border border-sky-100 bg-white hover:bg-sky-50 p-3 text-left"
                data-method="yape">
                <p class="text-sm text-ink inline-flex items-center gap-2">
                  <i class="ph-device-mobile-camera icon-brand"></i> Yape/Plin
                </p>
                <p class="text-xs text-muted mt-1">Pago rápido</p>
              </button>
              <button class="payMethod rounded-2xl border border-sky-100 bg-white hover:bg-sky-50 p-3 text-left"
                data-method="transfer">
                <p class="text-sm text-ink inline-flex items-center gap-2">
                  <i class="ph-bank icon-brand"></i> Transferencia
                </p>
                <p class="text-xs text-muted mt-1">Banca por internet</p>
              </button>
            </div>
            <input type="hidden" id="payMethodSelected" value="card">
          </div>
        </div>

        <div
          class="modal-foot border-t border-sky-50 bg-white flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
          <button id="payContinueShopping"
            class="w-full sm:w-auto px-4 py-3 rounded-2xl btn-outline inline-flex items-center justify-center gap-2">
            <i class="ph-arrow-left icon-brand"></i>
            Seguir comprando
          </button>

          <div class="flex gap-2 w-full sm:w-auto">
            <button id="payGoToCheckout"
              class="flex-1 sm:flex-none px-4 py-3 rounded-2xl btn-brand inline-flex items-center justify-center gap-2">
              <i class="ph-check-circle"></i>
              Confirmar pago
            </button>
          </div>
        </div>

        <div id="payProcessing" class="hidden absolute inset-0 modal-backdrop grid place-items-center">
          <div class="bg-white rounded-3xl border border-sky-100 shadow-2xl p-6 w-full max-w-sm mx-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl bg-sky-50 grid place-items-center">
                <i class="ph-spinner-gap icon-brand text-2xl animate-spin"></i>
              </div>
              <div>
                <p class="text-sm text-ink">Procesando pago…</p>
                <p class="text-xs text-muted">No cierres esta ventana.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>



  <script>
    /* ================= CONFIG ================= */
    const ORIGIN = window.location.origin;
    let BASE_APP = `${ORIGIN}/LyriumAvance1-main`;
    let API_BASE = `${BASE_APP}/backend/api`;
    let FRONT_IMG = `${BASE_APP}/frontend/img`;

    const CLIENTE_ID = <?= (int) $clienteId ?>;

    async function ensureBaseApp() {
      // 1. Intentar detectar desde el pathname (ej: /Lyrium-main/frontend/...)
      const paths = window.location.pathname.split('/');
      const fIdx = paths.indexOf('frontend');
      if (fIdx > 0) {
        const detected = paths.slice(0, fIdx).join('/');
        const testBase = detected || '';
        try {
          const r = await fetch(`${testBase}/backend/api/producto.php`, { cache: "no-store" });
          if (r.ok) {
            BASE_APP = testBase;
            API_BASE = `${BASE_APP}/backend/api`;
            FRONT_IMG = `${BASE_APP}/frontend/img`;
            return;
          }
        } catch (e) { }
      }

      // 2. Fallbacks conocidos
      const fallbacks = [
        window.location.origin + '/Lyrium-main',
        '/Lyrium-main',
        '/LyriumAvance1-main',
        '/lyrium',
        ''
      ];

      for (const fb of fallbacks) {
        try {
          const r = await fetch(`${fb}/backend/api/producto.php`, { cache: "no-store" });
          if (r.ok) {
            BASE_APP = fb;
            API_BASE = `${BASE_APP}/backend/api`;
            FRONT_IMG = `${BASE_APP}/frontend/img`;
            return;
          }
        } catch (e) { }
      }
    }

    function money(n) { return "S/ " + Number(n || 0).toFixed(2); }
    function normalize(s) { return String(s || "").toLowerCase().trim(); }

    function resolveImg(url) {
      const fallback = `${FRONT_IMG}/no-image.png`;
      if (!url) return fallback;
      if (/^https?:\/\//i.test(url)) return url;
      if (String(url).startsWith("/")) return ORIGIN + url;
      if (String(url).includes("LYRIUM") || String(url).includes("lyrium")) return url;
      return `${BASE_APP}/${String(url).replace(/^\.?\//, "")}`;
    }

    /* ============================================================
       ✅ FIX: si header.php no trae el drawer, lo inyectamos
    ============================================================ */
    function ensureCartDrawerMarkup() {
      if (document.getElementById("cartOverlay") && document.getElementById("cartDrawer")) return;

      const wrap = document.createElement("div");
      wrap.innerHTML = `
    <div id="cartOverlay" class="hidden fixed inset-0 z-[200] modal-backdrop"></div>

    <aside id="cartDrawer"
      class="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-[220] shadow-2xl border-l border-gray-200 translate-x-full transition-transform duration-300 flex flex-col">
      
      <!-- Header -->
      <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
        <h2 class="text-base font-semibold text-gray-800" id="cartHeaderTitle">Ver su Carrito de compras (0)</h2>
        <button id="btnCloseCart" class="w-8 h-8 rounded-full hover:bg-gray-100 grid place-items-center text-gray-500 hover:text-gray-700 transition-colors">
          <i class="ph-x text-lg"></i>
        </button>
      </div>

      <!-- Cart Items List -->
      <div class="flex-1 overflow-auto px-5 py-4">
        <div id="cartList"></div>
      </div>

      <!-- Discount Code Section -->
      <div class="border-t border-gray-100">
        <button id="discountToggle" class="w-full px-5 py-3 flex items-center justify-between text-sm text-gray-700 hover:bg-gray-50 transition-colors">
          <span>¿Tienes un código de descuento?</span>
          <i class="ph-caret-down text-gray-500 transition-transform" id="discountCaret"></i>
        </button>
        <div id="discountContent" class="hidden px-5 pb-4">
          <div class="flex gap-2">
            <input type="text" id="discountCode" placeholder="Ingresa tu código" 
                   class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400">
            <button id="applyDiscount" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-lg transition-colors">
              Aplicar
            </button>
          </div>
        </div>
      </div>

      <!-- Subtotal & Footer -->
      <div class="border-t border-gray-100 px-5 py-4 bg-white">
        <div class="flex items-center justify-between mb-1">
          <span class="text-sm text-gray-800 font-medium">Subtotal</span>
          <span class="text-base font-semibold text-gray-800" id="cartSubtotal">S/ 0.00</span>
        </div>
        <p class="text-xs text-sky-600 mb-4">El envío y los impuestos pueden volver a calcularse al Finalizar compra</p>
        
        <!-- Action Buttons -->
        <div class="space-y-2">
          <button id="btnContinuarCompra"
                  class="w-full py-3 rounded-xl bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-500 hover:to-sky-600 text-white font-medium inline-flex items-center justify-center gap-2 shadow-lg shadow-sky-200/50 transition-all">
            <i class="ph-shopping-cart"></i>
            Continuar compra
          </button>
          
          <button id="btnSeguirComprando"
                  class="w-full py-3 rounded-xl bg-white border-2 border-gray-200 hover:border-sky-400 hover:bg-sky-50 text-gray-700 hover:text-sky-600 font-medium inline-flex items-center justify-center gap-2 transition-all">
            <i class="ph-arrow-left"></i>
            Seguir comprando
          </button>
        </div>
      </div>

    </aside>
  `;
      document.body.appendChild(wrap);
      
      // Discount toggle functionality
      const discountToggle = document.getElementById('discountToggle');
      const discountContent = document.getElementById('discountContent');
      const discountCaret = document.getElementById('discountCaret');
      
      discountToggle?.addEventListener('click', () => {
        discountContent?.classList.toggle('hidden');
        discountCaret?.classList.toggle('rotate-180');
      });
      
      // Bind "Continuar compra" button to go to checkout page
      document.getElementById("btnContinuarCompra")?.addEventListener("click", () => {
        window.location.href = 'checkout_steps.php';
      });
      
      // Bind "Seguir comprando" button to close cart and scroll to products
      document.getElementById("btnSeguirComprando")?.addEventListener("click", () => {
        closeCart();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }


    /* ================= DOM CARRITO ================= */
    function getCartDom() {
      return {
        overlay: document.getElementById("cartOverlay"),
        drawer: document.getElementById("cartDrawer"),
        btnOpen: document.getElementById("btnOpenCart"),
        btnOpenMobile: document.getElementById("btnOpenCartMobile"),
        btnClose: document.getElementById("btnCloseCart"),
        badge: document.getElementById("cartBadge"),
        badgeMobile: document.getElementById("cartBadgeMobile"),
        cartList: document.getElementById("cartList"),
        cartSubtotal: document.getElementById("cartSubtotal"),
        cartTotal: document.getElementById("cartTotal"),
        cartHeaderTitle: document.getElementById("cartHeaderTitle"),
      };
    }

    function openCart() {
      const { overlay, drawer } = getCartDom();
      overlay?.classList.remove("hidden");
      drawer?.classList.remove("translate-x-full");
    }
    function closeCart() {
      const { overlay, drawer } = getCartDom();
      overlay?.classList.add("hidden");
      drawer?.classList.add("translate-x-full");
    }

    /* ================= API ================= */
    async function apiGetCart() {
      const r = await fetch(`${API_BASE}/carrito.php?cliente_id=${CLIENTE_ID}&moneda=PEN`, { cache: "no-store" });
      return r.json();
    }
    async function apiGetProducts() {
      const r = await fetch(`${API_BASE}/producto.php`, { cache: "no-store" });
      return r.json();
    }
    async function apiGetProductDetail(id) {
      const r = await fetch(`${API_BASE}/producto.php?id=${encodeURIComponent(id)}`, { cache: "no-store" });
      return r.json();
    }
    async function apiAddItem(productoId) {
      const r = await fetch(`${API_BASE}/carrito_item.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cliente_id: CLIENTE_ID, producto_id: Number(productoId), cantidad: 1 })
      });
      return r.json();
    }
    async function apiSetItemCantidad(itemId, cantidad) {
      const r = await fetch(`${API_BASE}/carrito_item.php`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item_id: Number(itemId), cantidad: Number(cantidad) })
      });
      return r.json();
    }
    async function apiDeleteItem(itemId) {
      const r = await fetch(`${API_BASE}/carrito_item.php`, {
        method: "DELETE",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `id=${encodeURIComponent(itemId)}`
      });
      return r.json();
    }

    /* ================= BADGES ================= */
    function setBadges(n) {
      const { badge, badgeMobile } = getCartDom();
      if (badge) badge.textContent = n;
      if (badgeMobile) badgeMobile.textContent = n;
    }

    /* ================= Estrellas ================= */
    function renderStars(rating) {
      const r = Number(rating || 0);
      let html = `<span class="stars-row">`;
      for (let i = 1; i <= 5; i++) {
        const filled = r >= i - 0.25;
        html += `<i class="ph-star${filled ? '-fill' : ''} ${filled ? 'text-amber-400' : 'text-gray-300'}"></i>`;
      }
      html += `</span>`;
      return html;
    }

    /* ================= CARRITO ================= */
    let currentItems = [];
    let allProductsCache = [];

    function getProductFromCache(productoId) {
      return (allProductsCache || []).find(p => String(p.id) === String(productoId)) || null;
    }
    function pickSuggestionsFromProducts(products, excludeIds = [], max = 6) {
      const pool = (products || []).filter(p => !excludeIds.includes(Number(p.id)));
      const shuffled = pool.sort(() => Math.random() - 0.5);
      return shuffled.slice(0, max);
    }

    function renderSuggestionsHTML(list) {
      const { cartSuggestions } = getCartDom();
      if (!cartSuggestions) return;

      if (!list || !list.length) { cartSuggestions.innerHTML = ""; return; }

      cartSuggestions.innerHTML = `
    <div class="grid grid-cols-2 gap-3">
      ${list.map(p => {
        const price = getPrice(p);
        const cat = p.categoria_nombre ? ` • ${p.categoria_nombre}` : "";
        return `
          <div class="lyrium-card rounded-2xl p-2">
            <div class="aspect-square rounded-xl overflow-hidden bg-gray-100 relative">
              <img src="${resolveImg(p.imagen_url)}"
                   onerror="this.src='${FRONT_IMG}/no-image.png'"
                   class="w-full h-full object-cover">
              <span class="absolute bottom-2 left-2 text-[10px] px-2 py-1 rounded-full soft-pill text-ink">
                <i class="ph-leaf icon-brand"></i> Lyrium
              </span>
            </div>

            <p class="mt-2 text-xs text-ink line-clamp-2">${p.nombre}</p>

            <div class="mt-1 flex items-center justify-between gap-2">
              <span class="text-[12px] text-emerald-700 inline-flex items-center gap-1">
                <i class="ph-currency-dollar icon-brand"></i> ${money(price)}
              </span>

              <span class="rating-pill text-[11px]">
                ${renderStars(p.rating_promedio || 0)}
                <span class="text-muted">(${Number(p.rating_total || 0)})</span>
              </span>
            </div>

            <p class="text-[11px] text-muted mt-1 line-clamp-1"><i class="ph-hash icon-brand"></i> ${p.sku || "—"}${cat}</p>

            <button data-sug-add="${p.id}"
                    class="mt-2 w-full py-2 rounded-xl btn-brand text-xs inline-flex items-center justify-center gap-2">
              <i class="ph-plus-circle text-base"></i> Añadir
            </button>
          </div>
        `;
      }).join("")}
    </div>
  `;

      cartSuggestions.querySelectorAll("[data-sug-add]").forEach(b => {
        b.onclick = async () => {
          const id = b.getAttribute("data-sug-add");
          await apiAddItem(id);
          await refreshCart();
          openCart();
        };
      });

      document.getElementById("btnRefreshSugLeft")?.addEventListener("click", () => {
        const exclude = currentItems.map(i => Number(i.producto_id));
        renderSuggestionsHTML(pickSuggestionsFromProducts(allProductsCache, exclude, 6));
      });
    }

    function calcCartTotals(items) {
      let totalFinal = 0;
      let subtotalBase = 0;
      let baseFound = false;

      (items || []).forEach(it => {
        const cant = Number(it.cantidad || 0);
        const puFinal = Number(it.precio_unitario || 0);
        totalFinal += (puFinal * cant);

        const p = getProductFromCache(it.producto_id);
        if (p) {
          const base = Number(p.precio || 0);
          if (base > 0) {
            subtotalBase += (base * cant);
            baseFound = true;
          }
        }
      });

      const descuento = baseFound ? Math.max(0, subtotalBase - totalFinal) : 0;
      return { totalFinal, subtotalBase: baseFound ? subtotalBase : null, descuento: baseFound ? descuento : null };
    }

    function renderCart(data) {
      const { cartList, cartSubtotal, cartHeaderTitle } = getCartDom();
      const items = data.items || [];
      currentItems = items;

      const totalItems = data.cantidad_total || items.reduce((a, i) => a + Number(i.cantidad || 0), 0);
      setBadges(totalItems);
      
      // Update header title with item count
      if (cartHeaderTitle) cartHeaderTitle.textContent = `Ver su Carrito de compras (${totalItems})`;

      if (!cartList) return;

      if (!items.length) {
        cartList.innerHTML = `
      <div class="text-center py-10 text-gray-500">
        <div class="mx-auto w-14 h-14 rounded-2xl bg-gray-100 grid place-items-center">
          <i class="ph-shopping-cart text-gray-400 text-3xl"></i>
        </div>
        <p class="mt-3 text-gray-700">Tu carrito está vacío</p>
        <p class="text-xs mt-1">Agrega productos para verlos aquí.</p>
      </div>`;
        cartSubtotal && (cartSubtotal.textContent = money(0));
        return;
      }

      const totals = calcCartTotals(items);
      const apiTotal = (data.total !== undefined) ? Number(data.total) : null;
      const totalFinal = (apiTotal !== null) ? apiTotal : totals.totalFinal;

      // Enhanced item template - first product larger, rest standard
      cartList.innerHTML = `
    <div class="space-y-3">
      ${items.map((it, index) => {
        const cant = Number(it.cantidad || 0);
        const puFinal = Number(it.precio_unitario || 0);
        const lineTotal = cant * puFinal;
        const p = getProductFromCache(it.producto_id);
        const isFirst = index === 0;

        if (isFirst) {
          // First product - larger display
          return `
            <div class="relative border border-gray-200 rounded-2xl p-4 bg-gradient-to-br from-sky-50/30 to-white">
              <!-- Delete button -->
              <button data-del="${it.id}" class="absolute right-2 top-2 w-6 h-6 rounded-full bg-white hover:bg-red-50 text-gray-400 hover:text-red-600 grid place-items-center text-xs transition-all shadow-sm border border-gray-200" title="Eliminar">
                <i class="ph-x"></i>
              </button>
              
              <div class="flex gap-4">
                <!-- Large Product Image -->
                <button class="w-24 h-24 rounded-xl overflow-hidden bg-white shrink-0 border-2 border-sky-100 shadow-sm"
                        title="Ver detalle"
                        data-view="${it.producto_id}">
                  <img src="${resolveImg(it.imagen_url || p?.imagen_url)}"
                       onerror="this.src='${FRONT_IMG}/no-image.png'"
                       class="w-full h-full object-cover">
                </button>

                <div class="flex-1 min-w-0">
                  <!-- Product Name and Price -->
                  <div class="flex justify-between items-start gap-2 mb-2">
                    <div class="min-w-0">
                      <button class="text-left w-full" data-view="${it.producto_id}">
                        <p class="text-base font-semibold text-gray-900 line-clamp-2 leading-tight">${it.producto_nombre || p?.nombre || "Producto"}</p>
                      </button>
                      <p class="text-xs text-gray-500 mt-1">
                        <i class="ph-storefront text-sky-500"></i> Vendedor: nanobanana
                      </p>
                    </div>
                  </div>

                  <!-- Price and Quantity -->
                  <div class="flex items-center justify-between mt-3">
                    <!-- Quantity Controls -->
                    <div class="inline-flex items-center border-2 border-gray-200 rounded-lg overflow-hidden bg-white">
                      <button data-dec="${it.id}" class="w-9 h-9 hover:bg-gray-50 grid place-items-center text-gray-600 transition-colors">
                        <i class="ph-minus text-sm"></i>
                      </button>
                      <span class="w-12 h-9 grid place-items-center text-sm font-semibold text-gray-800 border-x-2 border-gray-200">${cant}</span>
                      <button data-inc="${it.id}" class="w-9 h-9 hover:bg-gray-50 grid place-items-center text-gray-600 transition-colors">
                        <i class="ph-plus text-sm"></i>
                      </button>
                    </div>
                    
                    <!-- Price -->
                    <span class="text-lg font-bold text-sky-600">${money(lineTotal)}</span>
                  </div>
                </div>
              </div>
            </div>
          `;
        } else {
          // Standard products - compact display
          return `
            <div class="relative border-b border-gray-100 pb-3">
              <!-- Delete button -->
              <button data-del="${it.id}" class="absolute -left-1 -top-1 w-5 h-5 rounded-full bg-gray-200 hover:bg-red-100 text-gray-500 hover:text-red-600 grid place-items-center text-xs transition-colors" title="Eliminar">
                <i class="ph-x"></i>
              </button>
              
              <div class="flex gap-3 pl-3">
                <!-- Standard Product Image -->
                <button class="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-200"
                        title="Ver detalle"
                        data-view="${it.producto_id}">
                  <img src="${resolveImg(it.imagen_url || p?.imagen_url)}"
                       onerror="this.src='${FRONT_IMG}/no-image.png'"
                       class="w-full h-full object-cover">
                </button>

                <div class="flex-1 min-w-0">
                  <!-- Product Name and Price -->
                  <div class="flex justify-between items-start gap-2">
                    <div class="min-w-0 flex-1">
                      <button class="text-left w-full" data-view="${it.producto_id}">
                        <p class="text-sm font-medium text-gray-800 line-clamp-1">${it.producto_nombre || p?.nombre || "Producto"}</p>
                      </button>
                      <p class="text-xs text-gray-500 mt-0.5">Vendedor: nanobanana</p>
                    </div>
                    <span class="text-sm font-semibold text-gray-800 whitespace-nowrap">${money(lineTotal)}</span>
                  </div>

                  <!-- Quantity Controls -->
                  <div class="mt-2 flex items-center">
                    <div class="inline-flex items-center border border-gray-300 rounded overflow-hidden">
                      <button data-dec="${it.id}" class="w-7 h-7 hover:bg-gray-100 grid place-items-center text-gray-600 transition-colors">
                        <i class="ph-minus text-xs"></i>
                      </button>
                      <span class="w-9 h-7 grid place-items-center text-xs text-gray-800 border-x border-gray-300 bg-gray-50">${cant}</span>
                      <button data-inc="${it.id}" class="w-7 h-7 hover:bg-gray-100 grid place-items-center text-gray-600 transition-colors">
                        <i class="ph-plus text-xs"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          `;
        }
      }).join("")}
    </div>
  `;

      if (cartSubtotal) cartSubtotal.textContent = money(totalFinal);


      cartList.querySelectorAll("[data-inc]").forEach(b => {
        b.onclick = () => {
          const it = currentItems.find(i => String(i.id) === String(b.dataset.inc));
          if (!it) return;
          apiSetItemCantidad(it.id, Number(it.cantidad) + 1).then(refreshCart);
        };
      });
      cartList.querySelectorAll("[data-dec]").forEach(b => {
        b.onclick = () => {
          const it = currentItems.find(i => String(i.id) === String(b.dataset.dec));
          if (!it) return;
          if (Number(it.cantidad) > 1) {
            apiSetItemCantidad(it.id, Number(it.cantidad) - 1).then(refreshCart);
          } else {
            // If quantity is 1, delete the item instead
            if (confirm('¿Eliminar este producto del carrito?')) {
              apiDeleteItem(it.id).then(refreshCart);
            }
          }
        };
      });
      cartList.querySelectorAll("[data-del]").forEach(b => {
        b.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          const itemId = b.dataset.del;
          if (confirm('¿Eliminar este producto del carrito?')) {
            apiDeleteItem(itemId).then(refreshCart).catch(err => {
              console.error('Error deleting item:', err);
              alert('Error al eliminar el producto');
            });
          }
        };
      });

      cartList.querySelectorAll("[data-view]").forEach(b => {
        b.onclick = async () => {
          const pid = b.getAttribute("data-view");
          if (!pid) return;
          await openProductDetailModal(pid);
        };
      });

      document.getElementById("btnOpenPayModalFromCart")?.addEventListener("click", async () => {
        await refreshCart();
        buildPaymentModalFromCart();
        renderPaySuggestions();
        closeCart();
        openPaymentModal();
      });
    }



    async function refreshCart() {
      const { cartList } = getCartDom();
      try {
        const data = await apiGetCart();
        if (data && data.success) {
          renderCart(data);
          bindProceedToPayButtons();
        } else {
          setBadges(0);
          if (cartList) cartList.innerHTML = `<p class="text-sm text-red-500">No se pudo cargar el carrito.</p>`;
        }
      } catch (e) {
        setBadges(0);
        if (cartList) cartList.innerHTML = `<p class="text-sm text-red-500">Error al conectar con el carrito.</p>`;
      }
    }

    /* ================= MODAL PAGO ================= */
    const payModal = document.getElementById("payModal");
    const payModalOverlay = document.getElementById("payModalOverlay");
    const payModalClose = document.getElementById("payModalClose");

    const payItemsLabel = document.getElementById("payItemsLabel");
    const payItems = document.getElementById("payItems");
    const paySubtotal = document.getElementById("paySubtotal");
    const payDiscount = document.getElementById("payDiscount");
    const payTotal = document.getElementById("payTotal");
    const payEditCart = document.getElementById("payEditCart");

    const payContinueShopping = document.getElementById("payContinueShopping");
    const payGoToCheckout = document.getElementById("payGoToCheckout");
    const payMethodSelected = document.getElementById("payMethodSelected");

    const paySuggestions = document.getElementById("paySuggestions");
    const payProcessing = document.getElementById("payProcessing");

    function openPaymentModal() { payModal?.classList.remove("hidden"); }
    function closePaymentModal() { payModal?.classList.add("hidden"); }
    function showPayProcessing() { payProcessing?.classList.remove("hidden"); }
    function hidePayProcessing() { payProcessing?.classList.add("hidden"); }

    payModalOverlay?.addEventListener("click", closePaymentModal);
    payModalClose?.addEventListener("click", closePaymentModal);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && payModal && !payModal.classList.contains("hidden")) closePaymentModal();
    });

    document.querySelectorAll(".payMethod").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".payMethod").forEach(x => x.classList.remove("ring-2", "ring-sky-200"));
        btn.classList.add("ring-2", "ring-sky-200");
        if (payMethodSelected) payMethodSelected.value = btn.dataset.method || "card";
      });
    });
    document.querySelector('.payMethod[data-method="card"]')?.classList.add("ring-2", "ring-sky-200");

    function buildPaymentModalFromCart() {
      const items = currentItems || [];
      const totalItems = items.reduce((a, i) => a + Number(i.cantidad || 0), 0);

      if (payItemsLabel) payItemsLabel.textContent = `${totalItems} items`;

      if (!items.length) {
        if (payItems) {
          payItems.innerHTML = `
        <div class="text-center py-8 text-muted">
          <div class="mx-auto w-14 h-14 rounded-2xl bg-sky-50 grid place-items-center">
            <i class="ph-warning-circle icon-brand text-3xl"></i>
          </div>
          <p class="mt-3 text-ink">Tu carrito está vacío</p>
          <p class="text-xs mt-1">Agrega productos antes de pagar.</p>
        </div>
      `;
        }
        paySubtotal && (paySubtotal.textContent = money(0));
        payDiscount && (payDiscount.textContent = `- ${money(0)}`);
        payTotal && (payTotal.textContent = money(0));
        if (paySuggestions) paySuggestions.innerHTML = "";
        return;
      }

      const totals = calcCartTotals(items);
      const { cartTotal, cartSubtotal } = getCartDom();

      const drawerTotal = Number((cartTotal?.textContent || "0").replace(/[^\d.]/g, "")) || totals.totalFinal;
      const drawerSub = Number((cartSubtotal?.textContent || "0").replace(/[^\d.]/g, "")) || (totals.subtotalBase ?? drawerTotal);
      const discount = Math.max(0, drawerSub - drawerTotal);

      if (payItems) {
        payItems.innerHTML = items.map(it => {
          const cant = Number(it.cantidad || 0);
          const pu = Number(it.precio_unitario || 0);
          const lt = cant * pu;

          const p = getProductFromCache(it.producto_id);
          const img = resolveImg(it.imagen_url || p?.imagen_url);

          return `
        <div class="rounded-2xl border border-sky-50 bg-white p-3 flex gap-3">
          <div class="w-12 h-12 rounded-2xl overflow-hidden bg-gray-100 border border-sky-100 shrink-0">
            <img src="${img}" onerror="this.src='${FRONT_IMG}/no-image.png'" class="w-full h-full object-cover">
          </div>

          <div class="flex-1 min-w-0">
            <p class="text-sm text-ink truncate">${it.producto_nombre || p?.nombre || "Producto"}</p>
            <p class="text-xs text-muted mt-1 inline-flex items-center gap-2">
              <span class="inline-flex items-center gap-1"><i class="ph-hash icon-brand"></i> ${p?.sku || "—"}</span>
              <span class="inline-flex items-center gap-1"><i class="ph-x icon-brand"></i> ${cant}</span>
              <span class="inline-flex items-center gap-1"><i class="ph-tag icon-brand"></i> ${money(pu)}</span>
            </p>
          </div>

          <div class="text-right">
            <p class="text-sm text-ink inline-flex items-center gap-1">
              <i class="ph-receipt icon-brand"></i> ${money(lt)}
            </p>
          </div>
        </div>
      `;
        }).join("");
      }

      paySubtotal && (paySubtotal.textContent = money(drawerSub));
      payDiscount && (payDiscount.textContent = `- ${money(discount)}`);
      payTotal && (payTotal.textContent = money(drawerTotal));
    }

    function renderPaySuggestions() {
      if (!paySuggestions) return;

      const exclude = (currentItems || []).map(i => Number(i.producto_id));
      const list = pickSuggestionsFromProducts(allProductsCache, exclude, 4);

      if (!list || !list.length) {
        paySuggestions.innerHTML = "";
        return;
      }

      paySuggestions.innerHTML = `
    <div class="rounded-2xl border border-sky-100 bg-white/90 p-4">
      <div class="flex items-center justify-between">
        <p class="text-sm text-ink inline-flex items-center gap-2">
          <span class="w-8 h-8 rounded-xl bg-sky-50 grid place-items-center">
            <i class="ph-sparkle icon-brand text-base"></i>
          </span>
          Sugerencias
        </p>
        <button id="btnPayRefreshSug"
                class="text-xs px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-ink inline-flex items-center gap-2">
          <i class="ph-arrows-clockwise icon-brand text-base"></i> Cambiar
        </button>
      </div>

      <div class="mt-3 grid grid-cols-2 gap-3">
        ${list.map(p => {
        const price = getPrice(p);
        const rating = Number(p.rating_promedio || 0);
        const ratingTotal = Number(p.rating_total || 0);

        return `
            <div class="lyrium-card sug-card-sm">
              <div class="sug-img aspect-[4/3]">
                <img src="${resolveImg(p.imagen_url)}"
                     onerror="this.src='${FRONT_IMG}/no-image.png'"
                     class="w-full h-full object-cover">
              </div>

              <p class="mt-2 sug-title text-ink line-clamp-2">${p.nombre}</p>

              <div class="mt-1 flex items-center justify-between gap-2">
                <span class="sug-price text-emerald-700 inline-flex items-center gap-1">
                  <i class="ph-currency-dollar icon-brand"></i> ${money(price)}
                </span>

                ${(ratingTotal > 0) ? `
                  <span class="rating-pill text-[11px]">
                    ${renderStars(rating)}
                    <span class="text-muted">(${ratingTotal})</span>
                  </span>
                ` : ``}
              </div>

              <button data-pay-sug-add="${p.id}"
                      class="mt-2 w-full btn-brand sug-btn inline-flex items-center justify-center gap-2">
                <i class="ph-plus-circle text-base"></i> Añadir
              </button>
            </div>
          `;
      }).join("")}
      </div>
    </div>
  `;

      paySuggestions.querySelectorAll("[data-pay-sug-add]").forEach(b => {
        b.onclick = async () => {
          const id = b.getAttribute("data-pay-sug-add");
          await apiAddItem(id);
          await refreshCart();
          buildPaymentModalFromCart();
          renderPaySuggestions();
        };
      });

      document.getElementById("btnPayRefreshSug")?.addEventListener("click", () => {
        renderPaySuggestions();
      });
    }

    payEditCart?.addEventListener("click", () => {
      closePaymentModal();
      openCart();
    });

    payContinueShopping?.addEventListener("click", () => {
      closePaymentModal();
      closeCart();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    payGoToCheckout?.addEventListener("click", async () => {
      const total = Number((payTotal?.textContent || "0").replace(/[^\d.]/g, "")) || 0;
      const items = (currentItems || []).reduce((a, i) => a + Number(i.cantidad || 0), 0);

      if (items <= 0 || total <= 0) {
        alert("Tu carrito está vacío. Agrega productos antes de pagar.");
        return;
      }

      // ✅ Guardar “resumen de compra” para que checkout.php lo use (misma UI)
      const payload = {
        cliente_id: CLIENTE_ID,
        method: (payMethodSelected?.value || "card"),
        items: (currentItems || []).map(it => ({
          id: it.id,
          producto_id: it.producto_id,
          nombre: it.producto_nombre,
          cantidad: it.cantidad,
          precio_unitario: it.precio_unitario,
          imagen_url: it.imagen_url
        })),
        totals: {
          subtotal: (paySubtotal?.textContent || "S/ 0.00"),
          descuento: (payDiscount?.textContent || "- S/ 0.00"),
          total: (payTotal?.textContent || "S/ 0.00")
        },
        ts: Date.now()
      };

      sessionStorage.setItem("ly_checkout_payload", JSON.stringify(payload));

      // ✅ OPCIÓN 1: seguir usando MODAL “processing” (tu mismo efecto)
      showPayProcessing();
      await new Promise(r => setTimeout(r, 650));

      // ✅ OPCIÓN 2: ir a página checkout (formulario web)
      const method = encodeURIComponent(payload.method);
      window.location.href = `${BASE_APP}/frontend/checkout.php?method=${method}`;
    });

    /* ✅ Hook universal a “PROCEDER AL PAGO” */
    function bindProceedToPayButtons() {
      const candidates = [
        document.getElementById("btnProceedToPay"),
        document.getElementById("btnOpenPayModalFromCart"),
      ].filter(Boolean);

      document.querySelectorAll("button,a").forEach(el => {
        const t = (el.textContent || "").toLowerCase().trim();
        if (t.includes("proceder") && t.includes("pago")) candidates.push(el);
      });

      const unique = Array.from(new Set(candidates));
      unique.forEach(btn => {
        if (btn.dataset.boundPayModal === "1") return;
        btn.dataset.boundPayModal = "1";

        btn.addEventListener("click", async (e) => {
          e.preventDefault();
          e.stopPropagation();

          await refreshCart();
          buildPaymentModalFromCart();
          renderPaySuggestions();
          closeCart();
          openPaymentModal();
        });
      });
    }

    /* ================= PRODUCTOS ================= */
    const searchInput = document.getElementById("productSearch");
    const btnClearSearch = document.getElementById("btnClearSearch");
    const sortSelect = document.getElementById("sortSelect");
    const emptyStateProducts = document.getElementById("emptyStateProducts");
    const countLabel = document.getElementById("countLabel");
    const countLabelMobile = document.getElementById("countLabelMobile");
    const grid = document.getElementById("productsGrid");

    let productsAll = [];
    let productsFiltered = [];

    function getPrice(p) { return Number(p.precio_final || p.precio_oferta || p.precio || 0); }
    function getBase(p) { return Number(p.precio || 0); }

    function applySort(list) {
      const v = sortSelect?.value || "recent";
      const arr = [...list];

      if (v === "priceAsc") arr.sort((a, b) => getPrice(a) - getPrice(b));
      else if (v === "priceDesc") arr.sort((a, b) => getPrice(b) - getPrice(a));
      else if (v === "nameAsc") arr.sort((a, b) => String(a.nombre || "").localeCompare(String(b.nombre || ""), "es"));
      else if (v === "ratingDesc") arr.sort((a, b) => Number(b.rating_promedio || 0) - Number(a.rating_promedio || 0));

      return arr;
    }

    /* ====== PRECIO: state ====== */
    let priceBounds = { min: 0, max: 0 };
    let priceFilter = { min: 0, max: 0 };

    const priceMinEl = document.getElementById("priceMin");
    const priceMaxEl = document.getElementById("priceMax");
    const lblPriceMin = document.getElementById("lblPriceMin");
    const lblPriceMax = document.getElementById("lblPriceMax");
    const rangeFill = document.getElementById("rangeFill");
    const btnPriceReset = document.getElementById("btnPriceReset");

    function fmtIntS(n) { return "S/ " + Math.round(Number(n || 0)); }

    function updateRangeFill() {
      if (!rangeFill || !priceMinEl || !priceMaxEl) return;
      const min = Number(priceMinEl.value);
      const max = Number(priceMaxEl.value);
      const a = Number(priceMinEl.min);
      const b = Number(priceMinEl.max);
      const left = ((min - a) / (b - a)) * 100;
      const right = ((max - a) / (b - a)) * 100;
      rangeFill.style.left = left + "%";
      rangeFill.style.right = (100 - right) + "%";
    }
    function setPriceUI(minVal, maxVal) {
      if (lblPriceMin) lblPriceMin.textContent = fmtIntS(minVal);
      if (lblPriceMax) lblPriceMax.textContent = fmtIntS(maxVal);
      updateRangeFill();
    }
    function initPriceFilterFromProducts(products) {
      if (!priceMinEl || !priceMaxEl) return;

      const prices = (products || []).map(getPrice).filter(n => !isNaN(n) && n > 0);
      const minP = prices.length ? Math.floor(Math.min(...prices)) : 0;
      const maxP = prices.length ? Math.ceil(Math.max(...prices)) : 0;

      priceBounds = { min: minP, max: maxP };
      priceFilter = { min: minP, max: maxP };

      priceMinEl.min = String(minP);
      priceMinEl.max = String(maxP);
      priceMaxEl.min = String(minP);
      priceMaxEl.max = String(maxP);

      priceMinEl.value = String(minP);
      priceMaxEl.value = String(maxP);

      setPriceUI(minP, maxP);
    }
    function bindPriceFilterEvents() {
      if (!priceMinEl || !priceMaxEl) return;

      const sync = () => {
        let minV = Number(priceMinEl.value);
        let maxV = Number(priceMaxEl.value);

        if (minV > maxV - 1) {
          minV = maxV - 1;
          priceMinEl.value = String(minV);
        }
        if (maxV < minV + 1) {
          maxV = minV + 1;
          priceMaxEl.value = String(maxV);
        }

        priceFilter = { min: minV, max: maxV };
        setPriceUI(minV, maxV);
        filterProducts();
      };

      priceMinEl.addEventListener("input", sync);
      priceMaxEl.addEventListener("input", sync);

      btnPriceReset?.addEventListener("click", () => {
        priceMinEl.value = String(priceBounds.min);
        priceMaxEl.value = String(priceBounds.max);
        priceFilter = { ...priceBounds };
        setPriceUI(priceBounds.min, priceBounds.max);
        filterProducts();
      });

      updateRangeFill();
    }

    function filterProducts() {
      const q = normalize(searchInput?.value);
      btnClearSearch?.classList.toggle("hidden", !q);

      // 1) texto
      let list = (!q)
        ? [...productsAll]
        : productsAll.filter(p => {
          const name = normalize(p.nombre);
          const sku = normalize(p.sku);
          const cat = normalize(p.categoria_nombre);
          const desc = normalize(p.descripcion_corta);
          return name.includes(q) || sku.includes(q) || cat.includes(q) || desc.includes(q);
        });

      // 2) precio
      if (priceMinEl && priceMaxEl) {
        const minP = Number(priceFilter.min);
        const maxP = Number(priceFilter.max);
        list = list.filter(p => {
          const pr = getPrice(p);
          return pr >= minP && pr <= maxP;
        });
      }

      // 3) sort
      productsFiltered = applySort(list);
      renderProductsGrid(productsFiltered);
    }

    function renderProductsGrid(list) {
      const items = list || [];
      if (countLabel) countLabel.textContent = items.length;
      if (countLabelMobile) countLabelMobile.textContent = items.length;

      if (!grid) return;

      if (!items.length) {
        grid.innerHTML = "";
        emptyStateProducts?.classList.remove("hidden");
        return;
      }
      emptyStateProducts?.classList.add("hidden");

      grid.innerHTML = items.map(p => {
        const finalPrice = getPrice(p);
        const base = getBase(p);
        const hasOffer = finalPrice > 0 && base > 0 && finalPrice < base;
        const pct = hasOffer ? (Number(p.descuento_pct || 0) || Math.round(((base - finalPrice) / base) * 100)) : 0;

        const stock = Number(p.stock || 0);
        const out = (p.estado_stock === "out_of_stock") || (stock <= 0);

        const cat = p.categoria_nombre ? p.categoria_nombre : "General";
        const rating = Number(p.rating_promedio || 0);
        const ratingTotal = Number(p.rating_total || 0);

        return `
      <article class="group lyrium-card rounded-3xl overflow-hidden">
        <div class="relative">
          <button data-view="${p.id}" class="block w-full text-left">
            <div class="aspect-square bg-gray-100 overflow-hidden">
              <img src="${resolveImg(p.imagen_url)}"
                   onerror="this.src='${FRONT_IMG}/no-image.png'"
                   class="w-full h-full object-cover group-hover:scale-[1.05] transition duration-300">
            </div>
          </button>

          <span class="absolute top-3 left-3 inline-flex items-center gap-1 text-[11px] px-3 py-1 rounded-full soft-pill text-ink shadow-sm">
            <i class="ph-leaf icon-brand text-sm"></i> Lyrium
          </span>

          ${hasOffer ? `
            <span class="absolute top-3 right-3 inline-flex items-center gap-1 text-[11px] px-3 py-1 rounded-full bg-emerald-600 text-white shadow">
              <i class="ph-tag text-sm"></i> -${pct}%
            </span>` : ``}

          <button data-quickadd="${p.id}"
                  title="Añadir rápido"
                  ${out ? "disabled" : ""}
                  class="absolute bottom-3 right-3 w-11 h-11 rounded-2xl bg-white/95 border border-sky-100 text-ink shadow-sm grid place-items-center hover:shadow transition disabled:opacity-50 disabled:cursor-not-allowed">
            <i class="ph-plus-circle icon-brand text-2xl"></i>
          </button>
        </div>

        <div class="p-4">
          <div class="flex items-start justify-between gap-2">
            <button data-view="${p.id}" class="text-left flex-1">
              <p class="text-ink leading-snug line-clamp-2 min-h-[42px]">${p.nombre}</p>
            </button>

            <span class="shrink-0 text-[11px] px-2 py-1 rounded-full bg-gray-100 text-ink inline-flex items-center gap-1">
              <i class="ph-barcode icon-brand text-sm"></i> ${p.sku ? p.sku : "—"}
            </span>
          </div>

          <p class="mt-2 text-[12px] text-muted line-clamp-2">
            ${p.descripcion_corta ? p.descripcion_corta : "Producto seleccionado para tu bienestar."}
          </p>

          <div class="mt-3 flex items-center justify-between gap-2">
            <span class="text-[12px] px-2 py-1 rounded-full soft-chip text-ink inline-flex items-center gap-1">
              <i class="ph-folder-simple icon-brand"></i> ${cat}
            </span>

            ${(ratingTotal > 0) ? `
              <span class="rating-pill text-[11px]">
                ${renderStars(rating)}
                <span class="text-muted">${rating.toFixed(1)} • ${ratingTotal}</span>
              </span>
            ` : `
              <span class="text-[11px] px-2 py-1 rounded-full soft-chip text-muted inline-flex items-center gap-1">
                <i class="ph-shield-check icon-brand"></i> Verificado
              </span>
            `}
          </div>

          <div class="mt-3 flex items-end justify-between">
            <div>
              <p class="text-emerald-700 text-xl inline-flex items-center gap-1">
                <i class="ph-currency-dollar icon-brand text-base"></i> ${money(finalPrice)}
              </p>
              ${hasOffer ? `<p class="text-xs text-gray-400 line-through">${money(base)}</p>` : `<p class="text-xs text-gray-400">&nbsp;</p>`}
            </div>

            <span class="text-xs ${out ? "text-rose-600" : "text-muted"} inline-flex items-center gap-1">
              <i class="ph-package icon-brand"></i>
              ${out ? "Agotado" : (stock ? `Stock: ${stock}` : "Disponible")}
            </span>
          </div>

          <div class="card-actions">
            <button data-add="${p.id}"
                    ${out ? "disabled" : ""}
                    class="btn-mini btn-brand inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
              <i class="ph-shopping-cart text-lg"></i>
              ${out ? "No disponible" : "Añadir"}
            </button>

            <button data-view="${p.id}"
                    class="btn-mini btn-outline inline-flex items-center justify-center gap-2">
              <i class="ph-magnifying-glass-plus icon-brand text-lg"></i>
              Ver
            </button>
          </div>
        </div>
      </article>
    `;
      }).join("");

      grid.querySelectorAll("[data-add]").forEach(b => {
        b.onclick = async () => {
          const id = b.getAttribute("data-add");
          if (!id) return;
          await apiAddItem(id);
          await refreshCart();
          openCart();
        };
      });

      grid.querySelectorAll("[data-quickadd]").forEach(b => {
        b.onclick = async () => {
          const id = b.getAttribute("data-quickadd");
          if (!id) return;
          await apiAddItem(id);
          await refreshCart();
        };
      });

      grid.querySelectorAll("[data-view]").forEach(b => {
        b.onclick = async () => {
          const id = b.getAttribute("data-view");
          if (!id) return;
          await openProductDetailModal(id);
        };
      });
    }

    async function loadProducts() {
      try {
        const data = await apiGetProducts();
        if (!data || !data.success) {
          productsAll = [];
          allProductsCache = [];
          filterProducts();
          return;
        }
        const productos = data.productos || [];
        productsAll = productos;
        allProductsCache = productos;

        initPriceFilterFromProducts(productsAll);
        bindPriceFilterEvents();

        filterProducts();
      } catch (e) {
        productsAll = [];
        allProductsCache = [];
        initPriceFilterFromProducts([]);
        bindPriceFilterEvents();
        filterProducts();
      }
    }

    /* ================= MODAL DETALLE (zoom + galería) ================= */
    const prodModal = document.getElementById("prodModal");
    const prodModalOverlay = document.getElementById("prodModalOverlay");
    const prodModalClose = document.getElementById("prodModalClose");

    const zoomStage = document.getElementById("zoomStage");
    const zoomImg = document.getElementById("zoomImg");
    const thumbs = document.getElementById("thumbs");

    const pNombre = document.getElementById("pNombre");
    const pCategoria = document.getElementById("pCategoria");
    const pSku = document.getElementById("pSku");
    const pRating = document.getElementById("pRating");
    const pStock = document.getElementById("pStock");
    const pPrecioFinal = document.getElementById("pPrecioFinal");
    const pPrecioBase = document.getElementById("pPrecioBase");
    const pAhorro = document.getElementById("pAhorro");
    const pDescCorta = document.getElementById("pDescCorta");

    const pAtributos = document.getElementById("pAtributos");
    const variacionesWrap = document.getElementById("variacionesWrap");
    const pVariaciones = document.getElementById("pVariaciones");

    const descLargaWrap = document.getElementById("descLargaWrap");
    const pDescLarga = document.getElementById("pDescLarga");

    const btnModalAdd = document.getElementById("btnModalAdd");
    const btnModalOpenCart = document.getElementById("btnModalOpenCart");

    const zoomInBtn = document.getElementById("zoomIn");
    const zoomOutBtn = document.getElementById("zoomOut");
    const zoomResetBtn = document.getElementById("zoomReset");

    let modalCurrentProductId = null;
    let modalImages = [];
    let zoom = { scale: 1, x: 0, y: 0, dragging: false, startX: 0, startY: 0 };

    function starsHTML(rating) {
      const r = Number(rating || 0);
      let html = `<span class="stars-row">`;
      for (let i = 1; i <= 5; i++) {
        const filled = r >= i - 0.25;
        html += `<i class="ph-star${filled ? '-fill' : ''} ${filled ? 'text-amber-400' : 'text-slate-300'}"></i>`;
      }
      html += `</span>`;
      return html;
    }

    function setZoomTransform() {
      if (!zoomImg) return;
      zoomImg.style.transform = `translate(${zoom.x}px, ${zoom.y}px) scale(${zoom.scale})`;
    }
    function zoomReset() { zoom.scale = 1; zoom.x = 0; zoom.y = 0; setZoomTransform(); }
    function zoomStep(delta) {
      const next = Math.max(1, Math.min(3, Number((zoom.scale + delta).toFixed(2))));
      zoom.scale = next;
      if (zoom.scale === 1) { zoom.x = 0; zoom.y = 0; }
      setZoomTransform();
    }
    function setMainImage(url) {
      if (!zoomImg) return;
      zoomImg.src = resolveImg(url);
      zoomReset();
    }
    function openProdModal() { prodModal?.classList.remove("hidden"); }
    function closeProdModal() {
      prodModal?.classList.add("hidden");
      modalCurrentProductId = null;
      modalImages = [];
      zoomReset();
    }
    prodModalOverlay?.addEventListener("click", closeProdModal);
    prodModalClose?.addEventListener("click", closeProdModal);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && prodModal && !prodModal.classList.contains("hidden")) closeProdModal();
    });

    zoomInBtn?.addEventListener("click", () => zoomStep(0.2));
    zoomOutBtn?.addEventListener("click", () => zoomStep(-0.2));
    zoomResetBtn?.addEventListener("click", zoomReset);

    zoomStage?.addEventListener("wheel", (e) => {
      e.preventDefault();
      const delta = (e.deltaY < 0) ? 0.12 : -0.12;
      zoomStep(delta);
    }, { passive: false });

    zoomStage?.addEventListener("dblclick", (e) => { e.preventDefault(); zoomReset(); });

    zoomStage?.addEventListener("mousedown", (e) => {
      if (zoom.scale <= 1) return;
      zoom.dragging = true;
      zoom.startX = e.clientX - zoom.x;
      zoom.startY = e.clientY - zoom.y;
    });
    document.addEventListener("mousemove", (e) => {
      if (!zoom.dragging) return;
      zoom.x = e.clientX - zoom.startX;
      zoom.y = e.clientY - zoom.startY;

      const limit = 220 * zoom.scale;
      zoom.x = Math.max(-limit, Math.min(limit, zoom.x));
      zoom.y = Math.max(-limit, Math.min(limit, zoom.y));

      setZoomTransform();
    });
    document.addEventListener("mouseup", () => { zoom.dragging = false; });

    function renderThumbs(images) {
      if (!thumbs) return;
      const list = (images || []).slice(0, 12);
      thumbs.innerHTML = list.map((img, idx) => {
        const url = img.url || img.imagen_url || img;
        return `
      <button class="rounded-xl overflow-hidden border border-sky-100 bg-slate-50 hover:bg-white"
              data-thumb="${idx}" title="Ver imagen">
        <div class="aspect-square">
          <img src="${resolveImg(url)}" onerror="this.src='${FRONT_IMG}/no-image.png'" class="w-full h-full object-cover">
        </div>
      </button>
    `;
      }).join("");

      thumbs.querySelectorAll("[data-thumb]").forEach(btn => {
        btn.addEventListener("click", () => {
          const i = Number(btn.getAttribute("data-thumb"));
          const it = list[i];
          const url = it?.url || it?.imagen_url || it;
          setMainImage(url);
        });
      });
    }

    function renderAtributos(attrs) {
      if (!pAtributos) return;
      if (!attrs || !attrs.length) {
        pAtributos.innerHTML = `<div class="text-sm text-muted">Sin atributos registrados.</div>`;
        return;
      }
      pAtributos.innerHTML = attrs.map(a => `
    <div class="rounded-2xl border border-sky-50 bg-white p-3">
      <div class="text-xs text-muted">${a.nombre}</div>
      <div class="text-sm text-ink mt-1">${a.valor}</div>
    </div>
  `).join("");
    }

    function renderVariaciones(vars) {
      if (!variacionesWrap || !pVariaciones) return;
      if (!vars || !vars.length) {
        variacionesWrap.style.display = "none";
        pVariaciones.innerHTML = "";
        return;
      }

      variacionesWrap.style.display = "block";
      pVariaciones.innerHTML = vars.map(v => {
        const precio = (v.precio !== null && v.precio !== undefined && v.precio !== "") ? Number(v.precio) : null;
        const stock = Number(v.stock || 0);
        const det = v.detalles_json ? String(v.detalles_json) : "";
        return `
      <div class="rounded-2xl border border-sky-50 bg-white p-3 flex items-center justify-between gap-3">
        <div>
          <div class="text-sm text-ink">${v.nombre || "Variación"}</div>
          <div class="text-xs text-muted mt-1 inline-flex items-center gap-2">
            <span class="px-2 py-1 rounded-full bg-slate-50 border border-slate-100"><i class="ph-barcode icon-brand"></i> ${v.sku || "—"}</span>
            <span class="px-2 py-1 rounded-full bg-slate-50 border border-slate-100"><i class="ph-package icon-brand"></i> stock: ${stock}</span>
          </div>
          ${det ? `<div class="text-xs text-muted mt-2 line-clamp-2">${det}</div>` : ``}
        </div>
        <div class="text-right">
          <div class="text-sm text-emerald-700">${precio !== null ? money(precio) : ""}</div>
        </div>
      </div>
    `;
      }).join("");
    }

    async function openProductDetailModal(productId) {
      modalCurrentProductId = productId;

      pNombre.textContent = "Cargando...";
      pCategoria.textContent = "";
      pSku.textContent = "";
      pRating.innerHTML = "";
      pStock.textContent = "";
      pPrecioFinal.querySelector("span").textContent = "";
      pPrecioBase.textContent = "";
      pAhorro.textContent = "";
      pDescCorta.textContent = "";
      pAtributos.innerHTML = "";
      renderVariaciones([]);

      thumbs.innerHTML = "";
      setMainImage(`${FRONT_IMG}/no-image.png`);
      openProdModal();

      const d = await apiGetProductDetail(productId);
      if (!d || !d.success) {
        pNombre.textContent = "No se pudo cargar el producto";
        pDescCorta.textContent = d?.error || "Error de servidor.";
        return;
      }

      const p = d.producto || {};
      modalImages = (d.imagenes && d.imagenes.length) ? d.imagenes : (p.imagen_url ? [{ url: p.imagen_url }] : []);

      const mainUrl = (modalImages[0]?.url) ? modalImages[0].url : (p.imagen_url || `${FRONT_IMG}/no-image.png`);
      setMainImage(mainUrl);
      renderThumbs(modalImages);

      pNombre.textContent = p.nombre || "Producto";
      pCategoria.textContent = p.categoria_nombre ? `Categoría: ${p.categoria_nombre}` : "Categoría: —";
      pSku.textContent = p.sku ? `SKU: ${p.sku}` : "SKU: —";

      const rating = Number(p.rating_promedio || 0);
      const totalR = Number(p.rating_total || 0);
      pRating.innerHTML = `
    <span class="rating-pill">
      ${starsHTML(rating)}
      <span class="text-xs text-muted ml-1">${rating.toFixed(1)} (${totalR})</span>
    </span>
  `;

      const stock = Number(p.stock || 0);
      const out = (p.estado_stock === "out_of_stock") || (stock <= 0);
      pStock.innerHTML = out
        ? `<span class="text-rose-600 inline-flex items-center gap-1"><i class="ph-warning"></i> Agotado</span>`
        : `<span class="text-muted inline-flex items-center gap-1"><i class="ph-package icon-brand"></i> Stock: ${stock}</span>`;

      const base = Number(p.precio || 0);
      const final = Number(p.precio_final || p.precio_oferta || p.precio || 0);
      pPrecioFinal.querySelector("span").textContent = money(final);

      if (base > 0 && final > 0 && final < base) {
        pPrecioBase.textContent = money(base);
        const ahorro = (base - final);
        pAhorro.innerHTML = `<span class="inline-flex items-center gap-2"><i class="ph-tag icon-brand"></i> Ahorra ${money(ahorro)}</span>`;
      } else {
        pPrecioBase.textContent = "";
        pAhorro.textContent = "";
      }

      pDescCorta.textContent = p.descripcion_corta || "Producto seleccionado para tu bienestar.";

      if (p.descripcion_larga && String(p.descripcion_larga).trim().length) {
        descLargaWrap.style.display = "block";
        pDescLarga.textContent = String(p.descripcion_larga);
      } else {
        descLargaWrap.style.display = "none";
        pDescLarga.textContent = "";
      }

      renderAtributos(d.atributos || []);
      renderVariaciones(d.variaciones || []);

      btnModalAdd.disabled = out;
      btnModalAdd.classList.toggle("opacity-50", out);
      btnModalAdd.classList.toggle("cursor-not-allowed", out);

      btnModalAdd.onclick = async () => {
        if (!modalCurrentProductId) return;
        await apiAddItem(modalCurrentProductId);
        await refreshCart();
        openCart();
      };

      btnModalOpenCart.onclick = async () => {
        await refreshCart();
        openCart();
      };
    }

    /* ================= EVENTOS FILTROS ================= */
    searchInput?.addEventListener("input", filterProducts);
    btnClearSearch?.addEventListener("click", () => {
      searchInput.value = "";
      filterProducts();
      searchInput.focus();
    });
    sortSelect?.addEventListener("change", filterProducts);

    document.querySelectorAll(".chipQuick").forEach(ch => {
      ch.addEventListener("click", () => {
        searchInput.value = ch.dataset.q || "";
        filterProducts();
        searchInput.focus();
      });
    });

    /* ================= INIT ================= */
    (async function init() {
      await ensureBaseApp();

      ensureCartDrawerMarkup();

      const dom = getCartDom();
      dom.overlay?.addEventListener("click", closeCart);
      dom.btnClose?.addEventListener("click", closeCart);

      // Si tu header trae botones con estos IDs, se conectan:
      dom.btnOpen?.addEventListener("click", async () => { await refreshCart(); openCart(); });
      dom.btnOpenMobile?.addEventListener("click", async () => { await refreshCart(); openCart(); });

      await loadProducts();
      await refreshCart();
      bindProceedToPayButtons();

      // Escape cierra carrito también
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && dom.drawer && !dom.drawer.classList.contains("translate-x-full")) closeCart();
      });

      // Botón del drawer inyectado
      document.getElementById("btnProceedToPay")?.addEventListener("click", async (e) => {
        e.preventDefault();
        await refreshCart();
        buildPaymentModalFromCart();
        renderPaySuggestions();
        closeCart();
        openPaymentModal();
      });
    })();
  </script>

  <?php include 'footer.php'; ?>
</body>

</html>