'use client';
import { useState } from 'react';
import { hexToRgba, formatPrice, formatDate, getDaysLeft } from '@/features/seller/plans-lyrium/lib/helpers';
import type { PlansMap, SubscriptionInfo } from '@/features/seller/plans-lyrium/types';

interface Props {
  currentPlan: string; plansData: PlansMap;
  subscriptionInfo: SubscriptionInfo | null;
  isDetailsExpanded: boolean; onToggleDetails: () => void;
  onFeatureClick: (planKey: string) => void;
}

const checkSvg = <svg className="feature-icon active" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>;
const crossSvg = <svg className="feature-icon inactive" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>;
const detailCheckSvg = <svg className="detail-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
const detailCrossSvg = <svg className="detail-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>;

export default function CurrentPlanCard({ currentPlan, plansData, subscriptionInfo, isDetailsExpanded, onToggleDetails, onFeatureClick }: Props) {
  const data = plansData[currentPlan];
  if (!data) return null;

  const visibleLimit = data.compactVisibleCount ?? 5;
  let daysLeft = 0;
  let expiryBadge: React.ReactNode = null;

  if (currentPlan === 'basic') {
    expiryBadge = (
      <div className="expiry-badge expiry-indefinite">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
        <span>Vigencia: Indefinida</span>
      </div>
    );
  } else if (subscriptionInfo?.plan === currentPlan) {
    daysLeft = getDaysLeft(subscriptionInfo.expiryDate);
    const cls = daysLeft <= 15 ? 'expiry-warning' : 'expiry-active';
    expiryBadge = (
      <div className={`expiry-badge ${cls}`}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
        <span>Vence: {formatDate(subscriptionInfo.expiryDate)} ({daysLeft} días restantes)</span>
      </div>
    );
  } else {
    expiryBadge = (
      <div className="expiry-badge expiry-active">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
        <span>Vigencia: Activa</span>
      </div>
    );
  }

  return (
    <div className="current-plan-card" id="currentPlanCard"
      onMouseEnter={e => (e.currentTarget.style.borderColor = hexToRgba(data.cssColor, 0.4))}
      onMouseLeave={e => (e.currentTarget.style.borderColor = '#e5e7eb')}>
      {data.bgImage && (
        <div className="plan-background-image" style={{
          backgroundImage: `url('${data.bgImage}')`,
          backgroundSize: data.bgImageFit === 'contain' ? 'contain' : (data.bgImageFit ?? 'cover'),
          backgroundPosition: data.bgImagePosition ?? 'center',
        }} />
      )}
      <div className="plan-content">
        <div className="plan-header-compact">
          <span className="plan-badge-mini" style={{ background: data.cssColor }}>{data.name}</span>
          <div className="plan-price-compact">
            <span className="amount">
              {data.usePriceMode === false && data.priceText ? data.priceText : (currentPlan === 'basic' ? 'GRATIS' : formatPrice(data.price, data.currency))}
            </span>
            <span className="period">
              {data.usePriceMode === false && data.priceText ? (data.priceSubtext ?? '') : (currentPlan === 'basic' ? '' : (data.period ?? '/mes'))}
            </span>
          </div>
        </div>

        <div className="plan-features-compact" id="currentPlanFeatures">
          <div className="plan-expiry-info">{expiryBadge}</div>
          {data.features.slice(0, visibleLimit).map((f, i) => (
            <div key={`feat-${i}-${f.text.slice(0,8)}`} className={`feature-row ${f.active ? 'active-feature' : 'inactive-feature'} feature-clickable`} onClick={() => onFeatureClick(currentPlan)}>
              {f.active ? checkSvg : crossSvg}
              <span>{f.text}</span>
            </div>
          ))}
        </div>

        <button className={`details-btn ${isDetailsExpanded ? 'expanded' : ''}`} onClick={onToggleDetails}>
          <span>{isDetailsExpanded ? 'Ver menos' : 'Ver detalles'}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>
      </div>

      <div className={`plan-details-expanded ${isDetailsExpanded ? 'show' : ''}`}>
        <div className="details-divider" />
        <div className="details-grid">
          {data.features.slice(visibleLimit).length > 0 ? data.features.slice(visibleLimit).map((f, i) => (
            <div key={`detail-${i}-${f.text.slice(0,8)}`} className={`detail-item ${f.active ? 'detail-active' : 'detail-inactive'}`}>
              {f.active ? detailCheckSvg : detailCrossSvg}
              <span>{f.text}</span>
            </div>
          )) : <p style={{ textAlign:'center', color:'#9ca3af', padding:'16px', fontSize:'13px' }}>No hay más beneficios para mostrar.</p>}
        </div>
      </div>
    </div>
  );
}
