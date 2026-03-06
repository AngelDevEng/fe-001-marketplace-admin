'use client';
// FIXED: botones usan useRef (no getElementById) → evita colisiones con 2 Timelines en la misma página
// FIXED: updateArrows() se llama al montar Y cuando cambia activePlan
import { useEffect, useRef, useMemo, useCallback } from 'react';
import { availableIcons } from '@/features/seller/plans-lyrium/lib/icons';
import type { PlansMap } from '@/features/seller/plans-lyrium/types';

interface Props {
  planOrder: string[]; plansData: PlansMap; activePlan: string;
  suffix: 'MyPlan' | 'Plans'; onPointClick: (plan: string) => void;
}

const TL_VISIBLE = 3;

export default function Timeline({ planOrder, plansData, activePlan, suffix, onPointClick }: Props) {
  const offsetRef   = useRef(0);
  const trackRef    = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const leftBtnRef  = useRef<HTMLButtonElement>(null);
  const rightBtnRef = useRef<HTMLButtonElement>(null);
  const onClickRef  = useRef(onPointClick);
  onClickRef.current = onPointClick;

  const n   = planOrder.length;
  const idx = planOrder.indexOf(activePlan);

  // ── Helpers — siempre usan refs, nunca getElementById ──────────────────
  const applyScroll = useCallback(() => {
    const track = trackRef.current; if (!track) return;
    track.style.transform = `translateX(${-(offsetRef.current / n) * 100}%)`;
  }, [n]);

  const updateArrows = useCallback(() => {
    const max      = Math.max(0, n - TL_VISIBLE);
    const leftBtn  = leftBtnRef.current;
    const rightBtn = rightBtnRef.current;
    if (n <= TL_VISIBLE) {
      leftBtn?.classList.add('tl-hidden');
      rightBtn?.classList.add('tl-hidden');
      return;
    }
    leftBtn?.classList.toggle('tl-hidden',  offsetRef.current <= 0);
    rightBtn?.classList.toggle('tl-hidden', offsetRef.current >= max);
  }, [n]);

  // ── Track width + inicialización de flechas ─────────────────────────────
  useEffect(() => {
    const track = trackRef.current; if (!track) return;
    track.style.width = `${(n / TL_VISIBLE) * 100}%`;
    const halfStep = (100 / n) / 2;
    const line = track.querySelector<HTMLElement>('.timeline-line');
    if (line) { line.style.left = `${halfStep}%`; line.style.right = `${halfStep}%`; }
    updateArrows();
  }, [n, updateArrows]);

  // ── Centrar en plan activo ───────────────────────────────────────────────
  useEffect(() => {
    if (idx === -1) return;
    const max = Math.max(0, n - TL_VISIBLE);
    offsetRef.current = Math.max(0, Math.min(max, idx - Math.floor(TL_VISIBLE / 2)));
    applyScroll();
    updateArrows();
  }, [activePlan, planOrder, idx, n, applyScroll, updateArrows]);

  // ── Barra de progreso ────────────────────────────────────────────────────
  useEffect(() => {
    const el = progressRef.current; if (!el || n <= 1) return;
    // halfStep = el porcentaje del centro del primer/último punto dentro del track
    const halfStep   = (1 / (2 * n)) * 100;
    const trackRange = 100 - 2 * halfStep;           // rango entre primer y último centro
    const progress   = idx < 0 ? 0 : (idx / (n - 1));
    const firstColor = plansData[planOrder[0]]?.cssColor ?? '#cee86b';
    const thisColor  = plansData[activePlan]?.cssColor  ?? firstColor;
    el.style.left       = `${halfStep}%`;
    el.style.width      = `${progress * trackRange}%`;
    el.style.background = `linear-gradient(90deg, ${firstColor}, ${thisColor})`;
  }, [activePlan, planOrder, plansData, n, idx]);

  const scrollTimeline = (dir: number) => {
    const max = Math.max(0, n - TL_VISIBLE);
    offsetRef.current = Math.max(0, Math.min(max, offsetRef.current + dir));
    applyScroll(); updateArrows();
  };

  const points = useMemo(() => planOrder.map(key => {
    const data    = plansData[key];
    const iconKey = (data?.timelineIcon && availableIcons[data.timelineIcon]) ? data.timelineIcon : 'star';
    return { key, data, iconKey };
  }), [planOrder, plansData]);

  return (
    <div className="timeline-wrapper">
      <div className="timeline-viewport" id={`tlViewport${suffix}`}>
        <div className="timeline-track" id={`tlTrack${suffix}`} ref={trackRef}>
          <div className="timeline-line" id={`tlLine${suffix}`} />
          <div className="timeline-progress" id={`timelineProgress${suffix}`} ref={progressRef} />
          <div className="timeline-points" id={`timelinePoints${suffix}`}>
            {points.map(({ key, data, iconKey }) => {
              const isActive = key === activePlan;
              const color    = plansData[key]?.cssColor ?? '';
              return (
                <div
                  key={key}
                  className={`timeline-point${isActive ? ' active' : ''}`}
                  data-plan={key}
                  onClick={() => onClickRef.current(key)}
                >
                  <div
                    className="point-circle"
                    style={isActive ? { background: color, borderColor: color, color: '#fff' } : {}}
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2"
                      dangerouslySetInnerHTML={{ __html: availableIcons[iconKey] }} />
                  </div>
                  <span className="point-label">{data?.name ?? key}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <button ref={leftBtnRef} id={`tlArrowLeft${suffix}`} className="tl-arrow tl-hidden" onClick={() => scrollTimeline(-1)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <button ref={rightBtnRef} id={`tlArrowRight${suffix}`} className="tl-arrow tl-hidden" onClick={() => scrollTimeline(1)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  );
}
