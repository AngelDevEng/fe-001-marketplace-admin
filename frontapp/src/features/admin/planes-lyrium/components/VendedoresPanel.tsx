'use client';
import { formatAdminDate } from '@/features/seller/plans-lyrium/lib/helpers';
import Modal from '@/features/seller/plans-lyrium/shared/Modal';
import type { Vendedor } from '@/features/seller/plans-lyrium/types';

function getEstado(v: Vendedor): 'activo' | 'por_vencer' | 'vencido' | 'indefinido' {
  if (!v.fecha_expiracion || v.plan_actual === 'basic') return 'indefinido';
  const days = Math.ceil((new Date(v.fecha_expiracion).getTime() - Date.now()) / 86400000);
  if (days <= 0) return 'vencido';
  if (days <= 15) return 'por_vencer';
  return 'activo';
}

interface Props {
  vendedores: Vendedor[]; loading: boolean;
  filter: string; search: string;
  selectedVendedor: Vendedor | null;
  modalOpen: boolean;
  onFilterChange: (f: string) => void;
  onSearchChange: (s: string) => void;
  onOpenModal: (uid: string) => void;
  onCloseModal: () => void;
}

const ESTADO_DOT: Record<string, string> = { activo:'#22c55e', por_vencer:'#f59e0b', vencido:'#ef4444', indefinido:'#9ca3af' };
const ESTADO_LABEL: Record<string, string> = { activo:'Activo', por_vencer:'Por vencer', vencido:'Vencido', indefinido:'Sin vencimiento' };

export default function VendedoresPanel({ vendedores, loading, filter, search, selectedVendedor: sv, modalOpen, onFilterChange, onSearchChange, onOpenModal, onCloseModal }: Props) {
  const filtered = vendedores.filter(v => {
    if (filter !== 'all' && getEstado(v) !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (v.username ?? '').toLowerCase().includes(q) || (v.correo ?? v.email ?? '').toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <>
      {/* Toolbar */}
      <div className="vend-toolbar">
        <div className="vend-search-wrap">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input type="text" placeholder="Buscar por nombre o correo…" value={search} onChange={e => onSearchChange(e.target.value)} />
        </div>
        <div className="vend-filters-row">
          <div className="vend-filters">
            {[['all','Todos'],['activo','Activos'],['por_vencer','Por vencer'],['vencido','Vencidos'],['indefinido','Sin plan']].map(([f, l]) => (
              <button key={f}
                data-vf={f}
                className={`vf-btn ${filter === f ? 'active' : ''} ${f === 'por_vencer' ? 'vf-warn' : f === 'vencido' ? 'vf-danger' : f === 'indefinido' ? 'vf-gray' : ''}`}
                onClick={() => onFilterChange(f)}>
                {l}
              </button>
            ))}
          </div>
          <span className="vend-count">{filtered.length} vendedor{filtered.length !== 1 ? 'es' : ''}</span>
        </div>
      </div>

      {/* Grid de tarjetas */}
      <div className="vend-grid" id="vendedoresList">
        {loading && (
          <div className="vendedores-loading"><div className="v-spinner" /><span>Cargando vendedores…</span></div>
        )}
        {!loading && filtered.length === 0 && (
          <div className="vend-empty">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
            </svg>
            <p>No se encontraron vendedores</p>
          </div>
        )}
        {!loading && filtered.map(v => {
          const est         = getEstado(v);
          const planColor   = v.css_color ?? '#9ca3af';
          const initials    = (v.username ?? 'V').substring(0, 2).toUpperCase();
          const estadoColor = ESTADO_DOT[est] ?? '#9ca3af';
          const histCount   = v.historial?.length ?? 0;
          const correo      = v.correo ?? v.email ?? '';

          let venceBadge: React.ReactNode = null;
          if (est === 'por_vencer' && v.fecha_expiracion) {
            const days = Math.ceil((new Date(v.fecha_expiracion).getTime() - Date.now()) / 86400000);
            venceBadge = <span className="vc-vence-badge vc-warn">Vence en {days}d</span>;
          } else if (est === 'vencido') {
            venceBadge = <span className="vc-vence-badge vc-expired">Expirado</span>;
          } else if (v.fecha_expiracion) {
            venceBadge = <span className="vc-vence-badge">Vence: {formatAdminDate(v.fecha_expiracion)}</span>;
          }

          return (
            <div key={v.usuario_id} className="vend-card" onClick={() => onOpenModal(String(v.usuario_id))}
              style={{ '--plan-color': planColor, '--estado-color': estadoColor } as React.CSSProperties}>
              {/* Stripe de color del plan */}
              <div className="vc-stripe" style={{ background: planColor }} />
              {/* Avatar */}
              <div className="vc-avatar" style={{ background: planColor }}>{initials}</div>
              {/* Info */}
              <div className="vc-body">
                <div className="vc-name">{v.username ?? 'Vendedor'}</div>
                <div className="vc-email">{correo}</div>
                {/* Badge del plan con color */}
                <span className="vc-plan-badge" style={{ color: planColor, background: `${planColor}18`, border:`1px solid ${planColor}40` }}>
                  {v.nombre_plan ?? 'Emprende'}
                </span>
                {/* Estado + cambios */}
                <div className="vc-meta-row">
                  <span className="vc-estado-dot" style={{ background: estadoColor }} />
                  <span className="vc-estado-txt">{ESTADO_LABEL[est]}</span>
                  {histCount > 0 && (
                    <span className="vc-hist-chip">{histCount} cambio{histCount !== 1 ? 's' : ''}</span>
                  )}
                </div>
                {venceBadge}
              </div>
              {/* CTA */}
              <div className="vc-cta">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 8 12 12 14 14"/>
                </svg>
                Historial
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal historial */}
      <Modal open={modalOpen} onClose={onCloseModal} className="vend-modal-box">
        {sv && (() => {
          const est       = getEstado(sv);
          const planColor = sv.css_color ?? '#9ca3af';
          const correo    = sv.correo ?? sv.email ?? '';
          const historial = (sv.historial ?? []) as Record<string, unknown>[];
          const firstHist = historial[0];

          return (
            <div>
              <div className="vd-header" style={{ borderBottom:`3px solid ${planColor}` }}>
                <div className="vd-avatar" style={{ background: planColor }}>
                  {(sv.username ?? 'V').substring(0, 2).toUpperCase()}
                </div>
                <div className="vd-header-info">
                  <h3>{sv.username ?? 'Vendedor'}</h3>
                  <span className="vd-correo">{correo}</span>
                </div>
              </div>

              <div className="vd-modal-body">
                {/* Card plan actual */}
                <div className="vd-plan-card" style={{ borderLeft:`4px solid ${planColor}` }}>
                  <div className="vd-plan-top">
                    <span className="vd-plan-label">Plan actual</span>
                    <span className="vc-estado-badge" style={{ background:`${ESTADO_DOT[est]}22`, color: ESTADO_DOT[est] }}>
                      <span style={{ width:6, height:6, borderRadius:'50%', background:ESTADO_DOT[est], display:'inline-block', marginRight:5 }}/>
                      {ESTADO_LABEL[est]}
                    </span>
                  </div>
                  <div className="vd-plan-nombre" style={{ color: planColor }}>{sv.nombre_plan ?? 'Emprende'}</div>
                  <div className="vd-plan-dates">
                    {(firstHist?.fecha_inicio ?? firstHist?.cambiado_en) && (
                      <div className="vd-plan-meta">
                        <span>📅</span>
                        <span>Desde: <strong>{formatAdminDate(String(firstHist.fecha_inicio ?? firstHist.cambiado_en ?? ''))}</strong></span>
                      </div>
                    )}
                    {sv.fecha_expiracion && (() => {
                      const daysLeft = Math.ceil((new Date(sv.fecha_expiracion).getTime() - Date.now()) / 86400000);
                      const isExpired = daysLeft <= 0;
                      return (
                        <div className="vd-plan-meta">
                          <span>⏱</span>
                          <span>
                            Vence: <strong>{formatAdminDate(sv.fecha_expiracion)}</strong>
                            {!isExpired && <span style={{ color:'#f59e0b', fontWeight:700, marginLeft:'6px' }}>({daysLeft} días restantes)</span>}
                            {isExpired  && <span style={{ color:'#ef4444', fontWeight:700, marginLeft:'6px' }}>(vencido)</span>}
                          </span>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Historial */}
                <div className="vd-section">
                  <h4>Historial de cambios</h4>
                  <div className="vd-historial">
                    {historial.length === 0
                      ? <p style={{ textAlign:'center', color:'#9ca3af', fontSize:'12px', padding:'20px 0' }}>Sin historial de cambios</p>
                      : historial.map((h, i) => {
                          const motivoMap: Record<string,string> = { manual:'Cambio manual', vencido:'Venció — bajó a Emprende', eliminado:'Plan eliminado' };
                          const motivo = String(h.motivo ?? '');
                          const mColor = motivo === 'vencido' ? '#f59e0b' : motivo === 'eliminado' ? '#ef4444' : '#6b7280';
                          return (
                            <div key={`h-${i}`} className="hist-row">
                              <div className="hist-dot" style={{ background: mColor }} />
                              <div className="hist-body">
                                <span className="hist-planes">
                                  {String(h.nombre_desde ?? h.plan_desde ?? '?')} → {String(h.nombre_hasta ?? h.plan_hasta ?? '?')}
                                </span>
                                <span className="hist-motivo" style={{ color: mColor }}>{motivoMap[motivo] ?? motivo}</span>
                                <span className="hist-fecha">{formatAdminDate(String(h.cambiado_en ?? ''))}</span>
                              </div>
                            </div>
                          );
                        })
                    }
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </Modal>
    </>
  );
}
