/**
 * ═══════════════════════════════════════════════════════════════════════════
 * LOADING STATE - Dashboard
 * 
 * Skeletons para streaming del dashboard
 * ═══════════════════════════════════════════════════════════════════════════
 */

import ModuleHeader from '@/components/layout/shared/ModuleHeader';

function KPICardSkeleton() {
  return (
    <div className="glass-card p-6 rounded-3xl bg-white border border-gray-100 shadow-lg animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-gray-200 rounded-2xl"></div>
        <div className="w-16 h-4 bg-gray-100 rounded"></div>
      </div>
      <div>
        <div className="h-3 w-24 bg-gray-100 rounded mb-2"></div>
        <div className="h-8 w-32 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="glass-card p-6 rounded-3xl bg-white border border-gray-100 shadow-lg h-96 animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div className="h-5 w-48 bg-gray-200 rounded"></div>
        <div className="h-4 w-20 bg-gray-100 rounded"></div>
      </div>
      <div className="h-56 bg-gray-100 rounded"></div>
    </div>
  );
}

function OrdersSkeleton() {
  return (
    <div className="glass-card p-6 rounded-3xl bg-white border border-gray-100 shadow-lg animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-5 w-32 bg-gray-200 rounded"></div>
        <div className="h-4 w-16 bg-gray-100 rounded"></div>
      </div>
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-xl"></div>
              <div className="space-y-1">
                <div className="h-3 w-24 bg-gray-100 rounded"></div>
                <div className="h-2 w-16 bg-gray-50 rounded"></div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="h-3 w-16 bg-gray-100 rounded"></div>
              <div className="h-4 w-12 bg-gray-50 rounded ml-auto"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-fadeIn pb-20">
      <ModuleHeader
        title="Dashboard"
        subtitle="Resumen de tu tienda en tiempo real"
        icon="LayoutDashboard"
      />

      {/* KPIs Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <KPICardSkeleton key={i} />
        ))}
      </div>

      {/* Charts & Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartSkeleton />
        </div>
        <OrdersSkeleton />
      </div>

      {/* Top Products */}
      <div className="glass-card p-6 rounded-3xl bg-white border border-gray-100 shadow-lg animate-pulse">
        <div className="h-5 w-48 bg-gray-200 rounded mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
              <div className="space-y-1">
                <div className="h-3 w-32 bg-gray-100 rounded"></div>
                <div className="h-2 w-16 bg-gray-50 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
