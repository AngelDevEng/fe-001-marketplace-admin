# Refactorización - Marketplace App

## Resumen

Este documento describe las refactorizaciones realizadas durante la limpieza del codebase y las decisiones tomadas sobre qué NO refactorizar.

---

## Componentes y Hooks Creados

### 1. Componentes UI de Estado

**Archivos creados:**
- `src/components/ui/ErrorState.tsx`
- `src/components/ui/DataTable.tsx` (usando BaseLoading existente)

**Propósito:** Eliminar código duplicado en los 8+ componentes de lista del panel admin.

**Cuándo usar:**
- `<ErrorState />` - Para mostrar errores con título, mensaje, icono y botón de reintentar
- `<BaseLoading variant="card" />` - Spinner de carga en cards
- `<BaseEmptyState />` - Estado vacío con sugerencia
- `<DataTable<T> />` - Tabla genérica para lists simples (sin lógica compleja de filtros)

**Ejemplo:**
```tsx
<DataTable
  data={products}
  columns={columns}
  loading={loading}
  error={error}
  emptyTitle="Sin productos"
  keyField="id"
/>
```

---

### 2. Hook useFilteredList<T, F>

**Archivo:** `src/hooks/useFilteredList.ts`

**Propósito:** Hook genérico para filtrar listas con search, select y dateRange.

**Cuándo usar:**
- Listas con filtros simples (search + select)
- NO usar si hay lógica de negocio compleja en el filtrado

**Ejemplo:**
```tsx
interface ProductFilters {
  search: string;
  status: 'all' | 'active' | 'inactive';
}

const { filteredData, filters, setFilter, clearFilters } = useFilteredList<Product, ProductFilters>({
  data: products,
  config: {
    search: { enabled: true, fields: ['name', 'sku'] },
    fields: { status: { type: 'select', options: [...] } }
  },
  initialFilters: { search: '', status: 'all' }
});
```

---

### 3. API URLs Centralizadas

**Archivo:** `src/lib/config/api.ts`

**Propósito:** Unificar las URLs hardcodeadas de la API (12+ ocurrencias).

**Uso:**
```ts
import { API_CONFIG } from '@/lib/config/api';

// En lugar de:
const url = process.env.NEXT_PUBLIC_WC_API_URL || 'https://lyriumbiomarketplace.com/wp-json/wc/v3';

// Usar:
const url = API_CONFIG.wcApiUrl;
```

---

##Qué NO Migrar y Por Qué

### 1. Hooks "Complejos"

Los siguientes hooks NO fueron migrados a useFilteredList porque tienen lógica de negocio específica que no debe generalizarse:

| Hook | Razón |
|------|--------|
| `useSellerChat` | Sorting por fecha + auto-response + mobile UI state |
| `useLogisticsChat` | Similar a useSellerChat |
| `useSellerHelp` | Lógica de categorías combinada |
| `useLogisticsHelpdesk` | 2 hooks ya migrados de forma simple |
| `useInventory` | Filtro de seller es objeto complejo |
| `useMesaAyuda` | Tabs + múltiples filtros |
| `useControlVendedores` | Filtros complejos específicos |
| `useSellerSales` | DateRange con lógica personalizada |
| `useTreasury` | Múltiples tabs y filtros |
| `useAnalytics` | Lógica de agregación de datos |
| `useContratos` | Filtros con estructuras personalizadas |

**Decisión:** El hook `useFilteredList` está disponible para hooks NUEVOS que se creen en el futuro. No tiene sentido reescribir lógica de negocio existente que ya funciona.

---

### 2. Status Badges

**Estado actual:** 
- Existe `src/components/ui/StatusBadge.tsx` con mappings predefinidos
- ~10 archivos definen sus propios estilos inline o funciones helper

**Por qué NO migrar:**
- La mayoría ya usan helpers (`getStatusColor`, `getStatusStyles`)
- Los inline ternaries son simples y expresivos
- Algunos tienen statuses únicos que no encajan en el componente genérico
- ROI medio-bajo: esfuerzo de migración ≈ beneficio

**Decisión:** Dejar como está. El componente existe para casos nuevos.

---

### 4. Chat y Mesa de Ayuda - Componentes Compartidos

**Componentes creados en `src/components/shared/`:**
- `chat/ChatLayout.tsx` - Contenedor grid 2 columnas
- `chat/ConversationList.tsx` - Lista de conversaciones
- `chat/MessageBubble.tsx` - Burbuja de mensajes (emerald enviado, sky recibido - fijo)
- `chat/MessageInput.tsx` - Input de envío de mensajes
- `helpdesk/TicketList.tsx` - Lista de tickets
- `helpdesk/TicketStats.tsx` - Tarjetas de estadísticas

**Props configurables:**
- `accentColor?: 'emerald' | 'violet' | 'sky'` - Color del panel
- `features` - Objeto para activar/desactivar features por panel

**Matriz de adopción:**

| Panel | Módulos | Componentes Compartidos | Notas |
|-------|----------|------------------------|-------|
| Logística | chat | 4/4 | ChatLayout, ConversationList, MessageBubble, MessageInput |
| Logística | helpdesk | 4/4 | TicketList, TicketStats, MessageBubble, MessageInput |
| Vendedor | chat | 3/4 | ChatLayout, MessageBubble, MessageInput - ConversationList nativo por features específicas |
| Vendedor | helpdesk | 2/4 | MessageBubble, MessageInput - layout corregido a grid cols-12 |
| Admin | helpdesk | 0/4 | 4 tabs + FAQ + Auditoría, rebuild no justificado |

**Por qué seller/help y admin/helpdesk comparten parcialmente:**
- **seller/help:** 2/4 componentes compartidos (MessageBubble, MessageInput). Visual bugs corregidos: max-w[75%], cyan→sky, no-scrollbar→custom-scrollbar. Layout actualizado a grid cols-12. остальные (tabs, Survey) nativos por incompatibilidad.
- **admin/helpdesk:** 4 tabs (Todos/Asignados/FAQ/Auditoría), FAQ completo, Auditoría Forense

**Decisión:** Mantener implementación nativa en estos módulos. MessageBubble y MessageInput disponibles si en el futuro se refactorizan.

**Panel Cliente (futuro):**
- Usar ChatLayout + ConversationList + MessageBubble + MessageInput
- accentColor disponible: 'emerald' | 'violet' | 'sky'
- Agregar nuevo color si el diseño lo requiere en accentColorMap

**Patrón obligatorio para contenedores de chat:**
```
<!-- Contenedor principal -->
<div className="flex flex-col h-[calc(100vh-8rem)] overflow-hidden">

  <!-- Área de mensajes: scroll interno -->
  <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
    {messages}
  </div>

  <!-- Input: nunca se comprime -->
  <div className="flex-shrink-0">
    <MessageInput />
  </div>
</div>
```
- **Contenedor:** `flex flex-col` + `overflow-hidden` + altura fija
- **Área mensajes:** `flex-1` + `min-h-0` + `overflow-y-auto`
- **Input:** `flex-shrink-0` (OBLIGATORIO para que no se comprima)

> Sin `min-h-0`, el área de mensajes crece infinitamente y empuja el input fuera de la vista.

---

## Estructura de Componentes Recomendada

### Para Lists Nuevas:

```
1. Si es una list simple (CRUD básico):
   → Usar <DataTable />

2. Si tiene filtros complejos pero simples:
   → Usar useFilteredList<T, Filtros>

3. Si tiene lógica de negocio específica:
   → Crear hook propio con lógica inline
```

### Para Estados UI:

```
1. Loading: <BaseLoading variant="card" />
2. Error: <ErrorState title="..." message="..." onRetry={...} />
3. Empty: <BaseEmptyState title="..." description="..." />
```

---

## Métricas Finales del Proyecto

| Métrica | Valor |
|---------|-------|
| **Fase 1: Componentes UI** | |
| Componentes creados | 2 (ErrorState, DataTable) |
| Listas migradas | 8+ (CategoryList, ProductList, OrderList, etc.) |
| **Fase 2: Hooks** | |
| Hooks creados | 1 (useFilteredList) |
| Hooks migrados | 2 (useSellerInvoices, useLogisticsHelpdesk) |
| Hooks NO migrados | 11 (lógica de negocio compleja) |
| **Fase 3: API Centralizada** | |
| Archivo creado | 1 (src/lib/config/api.ts) |
| Archivos modificados | 4 (api.ts, base-client.ts, orders.ts, product-form.ts) |
| URLs centralizadas | 12+ |
| **Fase 4: Chat/Helpdesk Compartidos** | |
| Componentes shared/chat | 4 (ChatLayout, ConversationList, MessageBubble, MessageInput) |
| Componentes shared/helpdesk | 2 (TicketList, TicketStats) |
| **Migraciones completadas** | |
| logistics/chat-vendors | 4/4 componentes compartidos |
| logistics/helpdesk | 4/4 componentes compartidos |
| seller/chat | 3/4 componentes compartidos (híbrido) |
| seller/help | 2/4 componentes compartidos (MessageBubble, MessageInput) |
| admin/helpdesk | 0/4 (arquitectura incompatible) |
| **Correcciones visuales** | |
| seller/help | max-w-[75%], cyan→sky, no-scrollbar→custom-scrollbar, grid cols-12 |
| **Totales** | |
| Líneas de código duplicado eliminadas | ~800+ |
| Archivos modificados | ~30 |
| Archivos nuevos creados | 11 |
| Build | ✅ PASSED |

---

## Histórico de Decisiones

- **Fase 1:** Componentes UI de estado → Completado ✅
- **Fase 2:** DataTable genérico → Completado ✅
- **Fase 3:** API URLs + useFilteredList → Completado ✅
- **Fase 4:** Chat/Helpdesk compartidos → Completado ✅
  - 6 componentes compartidos creados
  - 4 módulos migrados (logistics/chat, logistics/helpdesk, seller/chat, seller/help parcial)
  - admin/helpdesk descartado por complejidad
- **StatusBadge:** Descartado → ROI bajo

---

## AccentColor por Panel

| Panel | Color | Usage |
|-------|-------|-------|
| Admin | violet | Sidebar, badges, acentos |
| Logística | sky | Mensajes recibidos, iconos |
| Vendedor | emerald | Botones primarios, estados activos |
| Cliente (futuro) | Configurable | Chat con accentColor prop |

---

*Documento generado durante la refactorización del codebase - 2026*
