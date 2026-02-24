'use client';

import React, { useState, useTransition } from 'react';
import dynamic from 'next/dynamic';
import { SalesKPIs, RecentOrder, refreshDashboard } from '@/lib/actions/dashboard';
import ModuleHeader from '@/components/layout/shared/ModuleHeader';
import Icon from '@/components/ui/Icon';
import { useToast } from '@/context/ToastContext';
import { formatCurrency } from '@/lib/utils/formatters';

// Carga diferida de gráficos - no pesan el bundle inicial
const SalesChart = dynamic(() => import('@/components/charts/SalesChart'), {
  ssr: false,
  loading: () => <ChartSkeleton />,
});

interface DashboardClientProps {
  initialKPIs: SalesKPIs;
  initialOrders: RecentOrder[];
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * Componentes de UI del Dashboard
 * ═══════════════════════════════════════════════════════════════════════════
 */

function KPICard({ 
  title, 
  value, 
  icon, 
  trend,
  trendValue 
}: { 
  title: string; 
  value: string | number; 
  icon: string;
  trend?: 'up' | 'down';
  trendValue?: string;
}) {
  return (
    <div className="glass-card p-6 rounded-3xl bg-white border border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-2xl ${
          title.includes('Ventas') ? 'bg-emerald-50' :
          title.includes('Pedidos') ? 'bg-sky-50' :
          title.includes('Ticket') ? 'bg-amber-50' :
          'bg-purple-50'
        }`}>
          <Icon 
            name={icon as any} 
            className={`w-6 h-6 ${
              title.includes('Ventas') ? 'text-emerald-500' :
              title.includes('Pedidos') ? 'text-sky-500' :
              title.includes('Ticket') ? 'text-amber-500' :
              'text-purple-500'
            }`} 
          />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-bold ${
            trend === 'up' ? 'text-emerald-500' : 'text-red-500'
          }`}>
            <Icon name={trend === 'up' ? 'TrendingUp' : 'TrendingDown'} className="w-4 h-4" />
            {trendValue}
          </div>
        )}
      </div>
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{title}</p>
        <p className="text-2xl font-black text-gray-800">{value}</p>
      </div>
    </div>
  );
}

function OrderRow({ order }: { order: RecentOrder }) {
  const statusConfig = {
    pendiente: { color: 'bg-amber-100 text-amber-700', label: 'Pendiente' },
    procesando: { color: 'bg-sky-100 text-sky-700', label: 'Procesando' },
    enviado: { color: 'bg-purple-100 text-purple-700', label: 'Enviado' },
    entregado: { color: 'bg-emerald-100 text-emerald-700', label: 'Entregado' },
    cancelado: { color: 'bg-red-100 text-red-700', label: 'Cancelado' },
  };

  const config = statusConfig[order.estado];

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors -mx-4 px-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
          <Icon name="ShoppingBag" className="w-5 h-5 text-gray-400" />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-800">{order.cliente}</p>
          <p className="text-xs text-gray-400">{order.id} • {order.items} items</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-black text-gray-800">{formatCurrency(order.total)}</p>
        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${config.color}`}>
          {config.label}
        </span>
      </div>
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="glass-card p-6 rounded-3xl bg-white border border-gray-100 shadow-lg h-80 animate-pulse">
      <div className="h-6 w-48 bg-gray-200 rounded mb-4"></div>
      <div className="h-56 bg-gray-100 rounded"></div>
    </div>
  );
}

export default function DashboardClient({ initialKPIs, initialOrders }: DashboardClientProps) {
  const [kpis, setKpis] = useState(initialKPIs);
  const [orders, setOrders] = useState(initialOrders);
  const [isRefreshing, startTransition] = useTransition();
  const { showToast } = useToast();

  const handleRefresh = async () => {
    startTransition(async () => {
      await refreshDashboard();
      showToast('Dashboard actualizado', 'success');
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-20">
      <ModuleHeader
        title="Dashboard"
        subtitle="Resumen de tu tienda en tiempo real"
        icon="LayoutDashboard"
        actions={
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <Icon name="RefreshCw" className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="text-sm font-bold">Actualizar</span>
          </button>
        }
      />

      {/* KPIs Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KPICard
          title="Ventas del Mes"
          value={formatCurrency(kpis.totalVentas)}
          icon="Banknote"
          trend="up"
          trendValue="+12%"
        />
        <KPICard
          title="Pedidos Hoy"
          value={kpis.pedidosHoy}
          icon="ShoppingCart"
          trend="up"
          trendValue="+3"
        />
        <KPICard
          title="Pedidos Mes"
          value={kpis.pedidosMes}
          icon="Package"
        />
        <KPICard
          title="Ticket Promedio"
          value={formatCurrency(kpis.ticketPromedio)}
          icon="Receipt"
        />
        <KPICard
          title="Conversión"
          value={`${kpis.conversionRate}%`}
          icon="TrendingUp"
          trend="up"
          trendValue="+0.5%"
        />
        <KPICard
          title="Clientes Nuevos"
          value={kpis.clientesNuevos}
          icon="Users"
        />
      </div>

      {/* Charts & Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className="lg:col-span-2">
          <SalesChart data={kpis} />
        </div>

        {/* Recent Orders */}
        <div className="glass-card p-6 rounded-3xl bg-white border border-gray-100 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black text-gray-800 uppercase">Pedidos Recientes</h3>
            <button className="text-xs font-bold text-sky-500 hover:text-sky-600">
              Ver todos
            </button>
          </div>
          <div className="space-y-1">
            {orders.slice(0, 5).map(order => (
              <OrderRow key={order.id} order={order} />
            ))}
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="glass-card p-6 rounded-3xl bg-white border border-gray-100 shadow-lg">
        <h3 className="text-sm font-black text-gray-800 uppercase mb-4">Productos Más Vendidos</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {kpis.productosTop.map((product, idx) => (
            <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 font-black text-sm">
                {idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-800 truncate">{product.nombre}</p>
                <p className="text-xs text-gray-400">{product.ventas} ventas</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
