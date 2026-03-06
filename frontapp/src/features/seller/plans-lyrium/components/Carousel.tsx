'use client';
import { useEffect, useRef, useCallback } from 'react';
import { hexToRgba, lightenColor, formatPrice } from '@/features/seller/plans-lyrium/lib/helpers';
import { availableIcons } from '@/features/seller/plans-lyrium/lib/icons';
import type { PlansMap } from '@/features/seller/plans-lyrium/types';

function getPlanIconSvg(planKey: string, size: number, plansData: PlansMap): string {
  const data = plansData[planKey];
  const iconKey = (data?.timelineIcon && availableIcons[data.timelineIcon]) ? data.timelineIcon : 'star';
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${availableIcons[iconKey]}</svg>`;
}

interface Props {
  planOrder: string[]; plansData: PlansMap; showcasePlan: string;
  carouselIndex: number; currentPlan: string; claimedPlans: string[];
  expandedCards: Record<string, boolean>;
  onSelect: (plan: string) => void;
  onStep: (delta: number) => void;
  onToggleCard: (key: string) => void;
  onFeatureClick: (key: string) => void;
}

export default function Carousel({ planOrder, plansData, showcasePlan, carouselIndex, currentPlan, claimedPlans, expandedCards, onSelect, onStep, onToggleCard, onFeatureClick }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);

  const apply3D = useCallback(() => {
    const cards = trackRef.current?.querySelectorAll<HTMLDivElement>('.carousel-card');
    if (!cards) return;
    const isMob  = window.innerWidth <= 768;
    const step   = isMob ? 180 : 260;
    const rotAngles = [0, 38, 55, 65];
    const scales    = [1, 0.84, 0.68, 0.52];
    const zDepths   = [0, -90, -200, -280];
    const opacities = [1, 0.88, 0.60, 0.28];

    cards.forEach((card, i) => {
      const offset = i - carouselIndex;
      const absOff = Math.abs(offset);
      if (absOff > 2) {
        card.style.transform = `translateX(${offset * step}px) translateZ(-400px) scale(0.3)`;
        card.style.opacity = '0'; card.style.zIndex = '0'; card.style.pointerEvents = 'none'; return;
      }
      const idx = Math.min(absOff, rotAngles.length - 1);
      const rotY = (offset > 0 ? -1 : 1) * rotAngles[idx];
      card.style.transform = `translateX(${offset * step}px) translateZ(${zDepths[idx]}px) rotateY(${rotY}deg) scale(${scales[idx]})`;
      card.style.opacity = String(opacities[idx]);
      card.style.zIndex  = String(20 - absOff);
      card.style.pointerEvents = absOff <= 1 ? 'auto' : 'none';
    });

    const prev = document.getElementById('carouselArrowPrev') as HTMLButtonElement | null;
    const next = document.getElementById('carouselArrowNext') as HTMLButtonElement | null;
    if (prev) prev.disabled = carouselIndex <= 0;
    if (next) next.disabled = carouselIndex >= planOrder.length - 1;
  }, [carouselIndex, planOrder.length]);

  useEffect(() => { apply3D(); }, [apply3D]);

  useEffect(() => {
    const onResize = () => apply3D();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [apply3D]);

  // Touch swipe
  useEffect(() => {
    const track = trackRef.current; if (!track) return;
    let startX = 0;
    const onTouchStart = (e: TouchEvent) => { startX = e.touches[0].clientX; };
    const onTouchEnd   = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 45) onStep(dx < 0 ? 1 : -1);
    };
    track.addEventListener('touchstart', onTouchStart, { passive: true });
    track.addEventListener('touchend',   onTouchEnd,   { passive: true });
    return () => { track.removeEventListener('touchstart', onTouchStart); track.removeEventListener('touchend', onTouchEnd); };
  }, [onStep]);

  return (
    <div className="carousel-section">
      <h3 className="carousel-section-title">Todos los Planes</h3>
      <div className="carousel-indicators">
        {planOrder.map(key => {
          const data = plansData[key]; if (!data) return null;
          const isActive = key === showcasePlan;
          return (
            <button key={key} className={`carousel-dot ${isActive ? 'active' : ''}`}
              style={isActive ? { background:data.cssColor, width:'28px', borderRadius:'5px' } : {}}
              onClick={() => onSelect(key)} />
          );
        })}
      </div>
      <div className="carousel-track-wrapper">
        {planOrder.length > 1 && (
          <>
            <button id="carouselArrowPrev" className="carousel-nav-btn prev" onClick={() => onStep(-1)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <button id="carouselArrowNext" className="carousel-nav-btn next" onClick={() => onStep(1)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </>
        )}
        <div className="carousel-track" ref={trackRef}>
          {planOrder.length === 0
            ? <div style={{ textAlign:'center', padding:'40px', color:'#9ca3af', fontSize:'14px', width:'100%' }}>No hay planes configurados aún.</div>
            : planOrder.map(key => <CarouselCard key={key} planKey={key} plansData={plansData} showcasePlan={showcasePlan} currentPlan={currentPlan} claimedPlans={claimedPlans} expanded={!!expandedCards[key]} onSelect={onSelect} onToggle={onToggleCard} onFeatureClick={onFeatureClick} />)
          }
        </div>
      </div>
    </div>
  );
}

interface CardProps {
  planKey: string; plansData: PlansMap; showcasePlan: string; currentPlan: string;
  claimedPlans: string[]; expanded: boolean;
  onSelect: (k: string) => void; onToggle: (k: string) => void; onFeatureClick: (k: string) => void;
}

function CarouselCard({ planKey, plansData, showcasePlan, currentPlan, claimedPlans, expanded, onSelect, onToggle, onFeatureClick }: CardProps) {
  const data      = plansData[planKey]; if (!data) return null;
  const isCurrent = planKey === currentPlan;
  const isActive  = planKey === showcasePlan;
  const planColor = data.cssColor;
  const lightBg1  = lightenColor(planColor, 0.75);
  const lightBg2  = lightenColor(planColor, 0.55);
  const lightBg3  = lightenColor(planColor, 0.35);
  const iconTextColor = data.accentColor ?? planColor;
  const showMax = expanded ? data.features.length : (data.compactVisibleCount ?? 5);
  const carouselLimit = data.compactVisibleCount ?? 5;

  let priceNode: React.ReactNode;
  if (data.usePriceMode === false && data.priceText) {
    priceNode = <><span className="c-amount" style={{ color:planColor }}>{data.priceText}</span>{data.priceSubtext && <span className="c-period">{data.priceSubtext}</span>}</>;
  } else {
    const carouselPrice = (planKey === 'basic' && data.price === 0) ? 'GRATIS' : (!data.requiresPayment && data.price === 0) ? 'Prueba gratuita' : formatPrice(data.price, data.currency);
    priceNode = <><span className="c-amount">{carouselPrice}</span>{(data.price > 0 || data.requiresPayment) ? <span className="c-period">{data.period ?? '/mes'}</span> : (planKey !== 'basic' && !data.requiresPayment ? <span className="c-period">/6 meses</span> : null)}</>;
  }

  const borderStyle: React.CSSProperties = isActive
    ? { borderColor:planColor, boxShadow:`0 0 0 1px ${planColor}, 0 8px 25px ${hexToRgba(planColor, 0.45)}` }
    : { borderColor:'transparent', boxShadow:'0 4px 16px rgba(0,0,0,0.05)' };

  return (
    <div className={`carousel-card ${isActive ? 'active-card' : ''}`} data-plan={planKey}
      style={{ '--plan-color': planColor, ...borderStyle } as React.CSSProperties}
      onClick={() => onSelect(planKey)}>
      {data.showBgInCard && data.bgImage ? (
        <div className="carousel-card-visual" style={{ backgroundImage:`url('${data.bgImage}')`, backgroundSize: data.bgImageFit === 'contain' ? 'contain' : 'cover', backgroundPosition: data.bgImagePosition ?? 'center', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom,rgba(0,0,0,0.08) 0%,rgba(0,0,0,0.55) 100%)', pointerEvents:'none' }} />
          {data.badge && <span style={{ position:'absolute', top:8, left:8, zIndex:2, fontSize:'9px', fontWeight:800, letterSpacing:'0.5px', color:'#fff', background:'rgba(0,0,0,0.35)', padding:'2px 7px', borderRadius:'20px', backdropFilter:'blur(4px)' }}>{data.badge}</span>}
          <span style={{ position:'absolute', bottom:8, left:10, zIndex:2, fontSize:'29px', fontWeight:800, color:'#fff', textShadow:'0 1px 6px rgba(0,0,0,0.7)', letterSpacing:'0.3px' }}>{data.name}</span>
          <div style={{ position:'absolute', top:8, right:8, zIndex:2, color:'rgba(255,255,255,0.85)', filter:'drop-shadow(0 1px 3px rgba(0,0,0,0.5))' }} dangerouslySetInnerHTML={{ __html: getPlanIconSvg(planKey, 20, plansData) }} />
        </div>
      ) : (
        <div className="carousel-card-visual" style={{ background:`linear-gradient(135deg,${lightBg1} 0%,${lightBg2} 50%,${lightBg3} 100%)` }}>
          <span className="visual-plan-name" style={{ color:iconTextColor }}>{data.name}</span>
          <div className="card-visual-icon" style={{ color:iconTextColor }} dangerouslySetInnerHTML={{ __html: getPlanIconSvg(planKey, 24, plansData) }} />
        </div>
      )}
      <div className="carousel-card-info">
        <div className="carousel-card-price">{priceNode}</div>
        {planKey === 'basic' && data.price === 0 && <div className="carousel-card-annual"><span>Única vez</span></div>}
        {data.enableClaimLock && <div className="carousel-card-annual"><span>Solo disponible una única vez</span></div>}
        {data.priceAnnual > 0 && !data.enableClaimLock && data.usePriceMode !== false && <div className="carousel-card-annual"><span>{formatPrice(data.priceAnnual, data.currency)}{data.periodAnnual ?? '/año'}</span></div>}
        <div className="carousel-card-features">
          {data.features.slice(0, showMax).map((f, i) => (
            <div key={`${planKey}-cf-${i}-${f.text.slice(0,8)}`} className={`c-feature ${f.active ? 'cf-active' : 'cf-inactive'} feature-clickable`} onClick={e => { e.stopPropagation(); onFeatureClick(planKey); }}>
              <span className={`c-icon ${f.active ? 'active' : 'inactive'}`}>{f.active ? '✓' : '✕'}</span>
              <span>{f.text}</span>
            </div>
          ))}
          {data.features.length > carouselLimit && (
            <button className="c-toggle-btn" onClick={e => { e.stopPropagation(); onToggle(planKey); }}>
              {expanded ? 'Ver menos' : `+${data.features.length - carouselLimit} beneficios más`}
            </button>
          )}
        </div>
        {isCurrent && <div className="current-plan-tag">Tu plan actual</div>}
        {data.enableClaimLock && claimedPlans.includes(planKey) && !isCurrent && <div className="current-plan-tag" style={{ color:'#ef4444', borderColor:'rgba(239,68,68,0.15)' }}>Ya reclamado</div>}
      </div>
    </div>
  );
}
