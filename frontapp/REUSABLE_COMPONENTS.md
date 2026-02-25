# Componentes Reutilizables - Estado Actual

## ✅ COMPONENTES UI REUTILIZABLES (Listos para usar)

### Componentes de UI Base
| Componente | Archivo | Props | Estado |
|------------|---------|-------|--------|
| `BaseButton` | `src/components/ui/BaseButton.tsx` | ✅ Definidas | ✅ Listo |
| `BaseLoading` | `src/components/ui/BaseLoading.tsx` | ✅ Definidas | ✅ Listo |
| `ErrorState` | `src/components/ui/ErrorState.tsx` | ✅ Definidas | ✅ Listo |
| `BaseEmptyState` | `src/components/ui/BaseEmptyState.tsx` | ✅ Definidas | ✅ Listo |
| `DataTable<T>` | `src/components/ui/DataTable.tsx` | ✅ Definidas (Generic) | ✅ Listo |
| `StatusBadge` | `src/components/ui/StatusBadge.tsx` | ✅ Definidas | ✅ Listo |
| `Icon` | `src/components/ui/Icon.tsx` | ✅ Definidas | ✅ Listo |
| `InputField` | `src/components/ui/InputField.tsx` | ✅ Definidas | ✅ Listo |
| `SelectField` | `src/components/ui/SelectField.tsx` | ✅ Definidas | ✅ Listo |
| `BaseModal` | `src/components/ui/BaseModal.tsx` | ✅ Definidas | ✅ Listo |
| `BaseDrawer` | `src/components/ui/BaseDrawer.tsx` | ✅ Definidas | ✅ Listo |
| `BaseStatCard` | `src/components/ui/BaseStatCard.tsx` | ✅ Definidas | ✅ Listo |
| `StatsGrid` | `src/components/ui/StatsGrid.tsx` | ✅ Definidas | ✅ Listo |
| `Skeleton` | `src/components/ui/Skeleton.tsx` | ✅ Definidas | ✅ Listo |
| `ConfirmDialog` | `src/components/ui/confirm-dialog.tsx` | ✅ Definidas | ✅ Listo |

### Componentes de Layout
| Componente | Archivo | Props | Estado |
|------------|---------|-------|--------|
| `ModuleHeader` | `src/components/layout/shared/ModuleHeader.tsx` | ✅ Definidas | ✅ Listo |
| `BaseLayout` | `src/components/layout/shared/BaseLayout.tsx` | ✅ Definidas | ✅ Listo |
| `SmartSidebar` | `src/components/layout/shared/SmartSidebar.tsx` | ✅ Definidas | ✅ Listo |
| `Breadcrumb` | `src/components/layout/shared/Breadcrumb.tsx` | ✅ Definidas | ✅ Listo |
| `Footer` | `src/components/layout/shared/Footer.tsx` | ✅ Definidas | ✅ Listo |
| `Logo` | `src/components/layout/shared/Logo.tsx` | ✅ Definidas | ✅ Listo |
| `UserMenu` | `src/components/layout/shared/UserMenu.tsx` | ✅ Definidas | ✅ Listo |
| `NotificationBell` | `src/components/layout/shared/NotificationBell.tsx` | ✅ Definidas | ✅ Listo |
| `ThemeToggle` | `src/components/layout/shared/ThemeToggle.tsx` | ✅ Definidas | ✅ Listo |

### Componentes de Chat (Shared)
| Componente | Archivo | Props | Estado |
|------------|---------|-------|--------|
| `ChatLayout` | `src/components/shared/chat/ChatLayout.tsx` | ✅ Definidas | ✅ Listo |
| `ConversationList` | `src/components/shared/chat/ConversationList.tsx` | ✅ Definidas | ✅ Listo |
| `MessageBubble` | `src/components/shared/chat/MessageBubble.tsx` | ✅ Definidas | ✅ Listo |
| `MessageInput` | `src/components/shared/chat/MessageInput.tsx` | ✅ Definidas | ✅ Listo |

### Componentes de Helpdesk (Shared)
| Componente | Archivo | Props | Estado |
|------------|---------|-------|--------|
| `TicketList` | `src/components/shared/helpdesk/TicketList.tsx` | ✅ Definidas | ✅ Listo |
| `TicketStats` | `src/components/shared/helpdesk/TicketStats.tsx` | ✅ Definidas | ✅ Listo |

### Componentes de Sidebar/Header (Por Panel)
| Componente | Archivo | Propósito |
|------------|---------|-----------|
| `SellerSidebar` | `src/components/layout/seller/SellerSidebar.tsx` | Sidebar vendedor |
| `SellerHeader` | `src/components/layout/seller/SellerHeader.tsx` | Header vendedor |
| `LogisticsSidebar` | `src/components/layout/logistics/LogisticsSidebar.tsx` | Sidebar logística |
| `LogisticsHeader` | `src/components/layout/logistics/LogisticsHeader.tsx` | Header logística |
| `AdminSidebar` | `src/components/layout/admin/AdminSidebar.tsx` | Sidebar admin |
| `AdminHeader` | `src/components/layout/admin/AdminHeader.tsx` | Header admin |

---

## 🔄 HOOKS REUTILIZABLES

| Hook | Archivo | Uso |
|------|---------|-----|
| `useFilteredList<T,F>` | `src/hooks/useFilteredList.ts` | Listas con filtros simples |
| API_CONFIG | `src/lib/config/api.ts` | URLs centralizadas |

---

## ⚠️ COMPONENTES NO REUTILIZABLES (Por ahora)

Estos componentes tienen lógica de negocio específica y requieren modificaciones individuales:

### Listas Admin (Migran a DataTable gradualmente)
- `CategoryList.tsx`
- `ProductList.tsx`
- `OrderList.tsx`
- `StoreList.tsx`
- `ReviewList.tsx`
- `InventoryList.tsx`
- `WithdrawalList.tsx`

### Componentes de Panels Específicos
- `HelpDeskSections.tsx` (admin/helpdesk)
- `ModuleSections.tsx` (admin/sellers)
- `OperationsTabs.tsx` (admin/operations)
- `TreasuryTabs.tsx` (admin/treasury)
- `ChatView.tsx` (admin/helpdesk)
- `LoginForm.tsx` (login)

### Componentes de Charts
- `SalesChart.tsx` (general)
- `AnalyticsCharts.tsx` (admin)
- `FinanceCharts.tsx` (admin)

---

## 🎨 ESTILOS Y UTILIDADES REUTILIZABLES

### En `globals.css`
- `custom-scrollbar` - Scrollbar estilizado
- `glass-card` - Efecto glassmorphism
- `animate-fadeIn` - Animación fade
- `animate-bounceIn` - Animación bounce
- Variables CSS para colores de tema

### Clases de Tailwind por Panel
| Panel | Color Principal | Clase |
|-------|-----------------|-------|
| Admin | Violet | `text-violet-500`, `bg-violet-600`, etc. |
| Logística | Sky | `text-sky-500`, `bg-sky-600`, etc. |
| Vendedor | Emerald | `text-emerald-500`, `bg-emerald-600`, etc. |

---

## 📋 CÓMO USAR COMPONENTES REUTILIZABLES

### Ejemplo 1: Nueva página con DataTable
```tsx
import DataTable from '@/components/ui/DataTable';
import ErrorState from '@/components/ui/ErrorState';
import BaseLoading from '@/components/ui/BaseLoading';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Nombre' },
  { key: 'status', label: 'Estado' },
];

{loading && <BaseLoading message="Cargando..." />}
{error && <ErrorState title="Error" message={error} onRetry={refetch} />}
{data?.length === 0 && <BaseEmptyState title="Sin datos" />}
<DataTable data={data} columns={columns} keyField="id" />
```

### Ejemplo 2: Nueva página con Chat
```tsx
import ChatLayout from '@/components/shared/chat/ChatLayout';
import MessageBubble from '@/components/shared/chat/MessageBubble';
import MessageInput from '@/components/shared/chat/MessageInput';

<div className="h-[calc(100vh-8rem)] overflow-hidden">
  <ChatLayout
    list={<ListaConversaciones />}
    detail={
      <>
        <div className="flex-1 min-h-0 overflow-y-auto">
          <MessageBubble messages={messages} />
        </div>
        <div className="flex-shrink-0">
          <MessageInput onSend={sendMessage} />
        </div>
      </>
    }
  />
</div>
```

### Ejemplo 3: Página con Módulo
```tsx
import ModuleHeader from '@/components/layout/shared/ModuleHeader';

<ModuleHeader
  title="Mis Pedidos"
  subtitle="Gestiona tus pedidos"
  icon="Package"
/>
```

---

## 🔧 QUÉ CAMBIAR EN UN SOLO LUGAR

### Para cambiar estilos globales:
| Cambio | Dónde |
|--------|-------|
| Color de accent | `globals.css` :root |
| Scrollbar | `globals.css` .custom-scrollbar |
| Animaciones | `globals.css` @keyframes |
| Breakpoints | `tailwind.config.ts` |

### Para cambiar layout base:
| Cambio | Dónde |
|--------|-------|
| Sidebar vendedor | `SellerSidebar.tsx` |
| Header vendedor | `SellerHeader.tsx` |
| Sidebar logística | `LogisticsSidebar.tsx` |
| Sidebar admin | `AdminSidebar.tsx` |

### Para cambiar iconos:
| Cambio | Dónde |
|--------|-------|
| Agregar icono | `Icon.tsx` - agregar al switch |
| Todos los iconos | Usar nombres del paquete phosphor-icons |

---

## 📊 RESUMEN

| Categoría | Total | Reutilizables |
|-----------|-------|---------------|
| UI Base | 15 | 15 ✅ |
| Layout | 9 | 9 ✅ |
| Chat Shared | 4 | 4 ✅ |
| Helpdesk Shared | 2 | 2 ✅ |
| Sidebar/Header | 6 | 6 ✅ |
| Hooks | 2 | 2 ✅ |
| **TOTAL** | **38** | **38 ✅** |

**No reutilizables por ahora:** ~40 componentes con lógica de negocio específica (listas admin, charts complejos, modales específicos)
