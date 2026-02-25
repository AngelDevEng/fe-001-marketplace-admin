# Guía de Migración - Páginas Estáticas y Componentes

## 1. Estructura de Componentes Compartidos

### Componentes Existentes (Listos para Usar)

| Componente | Ubicación | Propósito |
|------------|-----------|-----------|
| `ChatLayout` | `src/components/shared/chat/ChatLayout.tsx` | Grid 2 columnas para chat |
| `ConversationList` | `src/components/shared/chat/ConversationList.tsx` | Lista de conversaciones |
| `MessageBubble` | `src/components/shared/chat/MessageBubble.tsx` | Burbujas de mensaje |
| `MessageInput` | `src/components/shared/chat/MessageInput.tsx` | Input para enviar mensajes |
| `TicketList` | `src/components/shared/helpdesk/TicketList.tsx` | Lista de tickets |
| `TicketStats` | `src/components/shared/helpdesk/TicketStats.tsx` | Estadísticas de tickets |
| `DataTable` | `src/components/ui/DataTable.tsx` | Tabla genérica |
| `ErrorState` | `src/components/ui/ErrorState.tsx` | Estado de error |
| `BaseLoading` | `src/components/ui/BaseLoading.tsx` | Spinner de carga |

---

## 2. Patrón Obligatorio para Contenedores de Chat

**SIEMPRE usar esta estructura:**

```tsx
// Página con ChatLayout
<div className="h-[calc(100vh-8rem)] overflow-hidden">
  <ChatLayout
    list={<ListContent />}
    detail={<DetailContent />}
    listWidth="col-span-4"
  />
</div>
```

```tsx
// DetailContent con mensajes
<>
  <div className="flex-shrink-0 p-4 border-b bg-gray-50">
    {/* Header del chat */}
  </div>
  
  <div className="flex-1 min-h-0 overflow-y-auto p-4 custom-scrollbar">
    {/* Mensajes */}
  </div>
  
  <div className="flex-shrink-0">
    <MessageInput onSend={handleSend} />
  </div>
</>
```

**Reglas clave:**
- Contenedor principal: `h-[calc(100vh-8rem)] overflow-hidden`
- Área mensajes: `flex-1 min-h-0 overflow-y-auto`
- Input: `flex-shrink-0`

---

## 3. Migración de Páginas Estáticas (contactanos, nosotros, etc.)

### Estructura Base para Página Estándar

```tsx
// src/app/[pagina]/page.tsx
'use client';

import React from 'react';
import ModuleHeader from '@/components/layout/shared/ModuleHeader';

export default function PageNamePage() {
  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-fadeIn">
      <ModuleHeader
        title="Título de la Página"
        subtitle="Descripción breve"
        icon="IconName"
      />
      
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Contenido de la página */}
      </div>
    </div>
  );
}
```

### Con Múltiples Secciones/Tabs

```tsx
// src/app/[pagina]/page.tsx
'use client';

import React, { useState } from 'react';
import ModuleHeader from '@/components/layout/shared/ModuleHeader';

export default function PageNamePage() {
  const [activeTab, setActiveTab] = useState('seccion1');

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-fadeIn">
      <ModuleHeader
        title="Título"
        subtitle="Subtítulo"
        icon="IconName"
      />

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button onClick={() => setActiveTab('a')}>
          Sección A
        </button>
        <button onClick={() => setActiveTab('b')}>
          Sección B
        </button>
      </div>

      {/* Contenido */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'a' && <SeccionA />}
        {activeTab === 'b' && <SeccionB />}
      </div>
    </div>
  );
}
```

---

## 4. Migración de Listas/CRUD

### Usando DataTable (Recomendado para listas simples)

```tsx
import DataTable from '@/components/ui/DataTable';

const columns = [
  { key: 'name', label: 'Nombre' },
  { key: 'email', label: 'Email' },
  { key: 'status', label: 'Estado' },
];

<DataTable
  data={data}
  columns={columns}
  loading={loading}
  emptyTitle="Sin elementos"
  keyField="id"
/>
```

### Lista Personalizada (Para lógica compleja)

```tsx
<div className="grid grid-cols-12 gap-6 h-full">
  {/* Filtros */}
  <div className="col-span-3 bg-white rounded-2xl p-4">
    <FiltersComponent />
  </div>
  
  {/* Tabla/Listado */}
  <div className="col-span-9 bg-white rounded-2xl overflow-hidden flex flex-col">
    <div className="flex-1 overflow-y-auto">
      {/* Items */}
    </div>
    <div className="flex-shrink-0 p-4 border-t">
      <Pagination />
    </div>
  </div>
</div>
```

---

## 5. Hooks Disponibles

| Hook | Uso |
|------|-----|
| `useFilteredList` | Para listas con filtros simples (search + select) |
| **NO usar** para lógica de negocio compleja |

### Ejemplo useFilteredList

```tsx
import { useFilteredList } from '@/hooks/useFilteredList';

interface Item {
  id: string;
  name: string;
  status: 'active' | 'inactive';
}

const { filteredData, filters, setFilter } = useFilteredList<Item, { search: string; status: string }>({
  data: items,
  config: {
    search: { enabled: true, fields: ['name'] },
    fields: { status: { type: 'select', options: [...] } }
  },
  initialFilters: { search: '', status: 'all' }
});
```

---

## 6. AccentColor por Panel

| Panel | Color | Valor |
|-------|-------|-------|
| Admin | violet | `accentColor="violet"` |
| Logística | sky | `accentColor="sky"` |
| Vendedor | emerald | `accentColor="emerald"` |
| Cliente | configurable | Pasar como prop |

---

## 7. Checklist de Migración

- [ ] Usar `ModuleHeader` para títulos
- [ ] Contenedor principal con `h-[calc(100vh-8rem)] overflow-hidden`
- [ ] Área de contenido con `flex-1 min-h-0 overflow-y-auto`
- [ ] Si hay input/footer: `flex-shrink-0`
- [ ] Usar `custom-scrollbar` en lugar de `no-scrollbar`
- [ ] Colores: `sky` (logística), `emerald` (vendedor), `violet` (admin)
- [ ] Auto-scroll: usar ref + useEffect con control de prevLength
- [ ] Ejecutar `npm run build` después de cambios

---

## 8. Archivos de Referencia

Para ver ejemplos funcionales:
- `src/app/seller/chat/page.tsx` - Chat con estructura correcta
- `src/app/seller/help/page.tsx` - Helpdesk con grid
- `src/app/logistics/chat-vendors/page.tsx` - Chat logistics
- `src/components/shared/chat/ChatLayout.tsx` - Componente compartido
