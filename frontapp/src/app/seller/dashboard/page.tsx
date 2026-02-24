/**
 * ═══════════════════════════════════════════════════════════════════════════
 * DASHBOARD PAGE - Server Component con Paralelización
 * 
 * Usa Promise.all para cargar KPIs (Laravel) y Pedidos (WooCommerce)
 * en paralelo - la página no espera a uno para empezar el otro.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { Suspense } from 'react';
import { getDashboardData, SalesKPIs, RecentOrder } from '@/lib/actions/dashboard';
import DashboardClient from './DashboardClient';
import BaseLoading from '@/components/ui/BaseLoading';

export default async function DashboardPage() {
  // Paralelización: ambas requestsstartan al mismo tiempo
  // Next.js espera ambas antes de renderizar, pero ambas corren en paralelo
  const { kpis, orders } = await getDashboardData();

  return (
    <Suspense fallback={<BaseLoading message="Cargando Dashboard..." />}>
      <DashboardClient initialKPIs={kpis} initialOrders={orders} />
    </Suspense>
  );
}
