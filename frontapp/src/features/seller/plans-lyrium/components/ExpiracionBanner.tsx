'use client';
import { getDaysLeft } from '@/features/seller/plans-lyrium/lib/helpers';
import type { SubscriptionInfo, AvisoVencimientoResponse, PlansMap } from '@/features/seller/plans-lyrium/types';

interface Props {
  avisoPorVencer: AvisoVencimientoResponse | null;
  subscriptionInfo: SubscriptionInfo | null;
  currentPlan: string; plansData: PlansMap;
  onClose: () => void;
}

export default function ExpiracionBanner({ avisoPorVencer, subscriptionInfo, currentPlan, plansData, onClose }: Props) {
  let diasRestantes: number | null = null;
  let nombrePlan: string | null    = null;

  if (avisoPorVencer?.porVencer) {
    diasRestantes = avisoPorVencer.diasRestantes ?? null;
    nombrePlan    = avisoPorVencer.nombrePlan ?? null;
  } else if (subscriptionInfo?.expiryDate && currentPlan !== 'basic') {
    const diff = getDaysLeft(subscriptionInfo.expiryDate);
    if (diff > 0 && diff <= 15) { diasRestantes = diff; nombrePlan = plansData[currentPlan]?.name ?? currentPlan; }
  }

  if (!diasRestantes || diasRestantes <= 0) return null;

  const urgente = diasRestantes <= 5;
  const texto = urgente
    ? `🚨 ¡URGENTE! Tu plan <strong>${nombrePlan}</strong> vence en <strong>${diasRestantes} día${diasRestantes === 1 ? '' : 's'}</strong>. Renueva ahora para no perder el acceso.`
    : `⚠️ Tu plan <strong>${nombrePlan}</strong> vence en <strong>${diasRestantes} día${diasRestantes === 1 ? '' : 's'}</strong>. Te recomendamos renovar pronto.`;

  return (
    <div className={`expiracion-banner ${urgente ? 'banner-urgente' : 'banner-aviso'}`}>
      <div className="expiracion-banner-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      </div>
      <span dangerouslySetInnerHTML={{ __html: texto }} />
      <button className="expiracion-banner-close" onClick={onClose} title="Cerrar">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  );
}
