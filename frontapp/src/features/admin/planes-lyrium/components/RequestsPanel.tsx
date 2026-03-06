'use client';
import type { AdminRequest, PlansMap } from '@/features/seller/plans-lyrium/types';
import type { PaymentNotif } from '@/features/admin/planes-lyrium/hooks/useAdmin';

interface Props {
  requests: AdminRequest[]; plansData: PlansMap;
  filter: string; onFilterChange: (f: string) => void;
  notifs: PaymentNotif[]; onDismissNotif: (id: string) => void;
}

export default function RequestsPanel({ requests, plansData, filter, onFilterChange, notifs, onDismissNotif }: Props) {
  const filtered = filter === 'all' ? requests : requests.filter(r => r.status === filter);

  return (
    <>
      <div className="admin-filters" id="requestsFilters">
        {(['all','approved','pending','rejected'] as const).map(f => (
          <button key={f} className={`req-filter-btn ${filter === f ? 'active' : ''}`} data-filter={f} onClick={() => onFilterChange(f)}>
            {f !== 'all' && <span className={`rf-dot rf-dot-${f === 'approved' ? 'green' : f === 'pending' ? 'yellow' : 'red'}`} />}
            {f === 'all' ? 'Todas' : f === 'approved' ? 'Exitosos' : f === 'pending' ? 'Pendientes' : 'Fallidos'}
          </button>
        ))}
      </div>

      <div id="paymentNotifContainer">
        {notifs.map(n => (
          <div key={n.id} className={`pago-notif pago-notif-${n.type}`} style={{ borderLeftColor: n.type === 'success' ? '#10b981' : '#ef4444' }}>
            <span className="pago-notif-icon" style={{ color: n.type === 'success' ? '#10b981' : '#ef4444' }}>
              {n.type === 'success'
                ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              }
            </span>
            <div className="pago-notif-body">
              <strong className="pago-notif-title">{n.title}</strong>
              <span className="pago-notif-msg" dangerouslySetInnerHTML={{ __html: n.body }} />
            </div>
            <button className="pago-notif-close" onClick={() => onDismissNotif(n.id)}>×</button>
          </div>
        ))}
      </div>

      <div className="requests-list" id="requestsList">
        <div id="requestsContainer">
          {filtered.length === 0
            ? <div className="empty-state" id="emptyState">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/></svg>
                <p>No hay solicitudes</p>
              </div>
            : filtered.map((r, i) => {
              const fromName  = plansData[r.fromPlan]?.name ?? r.fromPlan;
              const toName    = plansData[r.toPlan]?.name   ?? r.toPlan;
              const fromColor = plansData[r.fromPlan]?.cssColor ?? '#9ca3af';
              const toColor   = plansData[r.toPlan]?.cssColor   ?? '#9ca3af';
              const statusClass = r.status === 'pending' ? 'status-pending' : r.status === 'approved' ? 'status-approved' : 'status-rejected';
              const statusText  = r.status === 'pending' ? 'PENDIENTE' : r.status === 'approved' ? 'EXITOSO' : 'FALLIDO';
              return (
                <div key={r.id ?? i} className="request-card">
                  <div className="request-header">
                    <span className={`request-status ${statusClass}`}>{statusText}</span>
                    <span className="request-date">{new Date(r.date).toLocaleDateString()}</span>
                  </div>
                  <div className="request-plan-change">
                    <span className="plan-tag" style={{ background:`${fromColor}22`, color:fromColor, borderColor:`${fromColor}44` }}>{fromName}</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                    <span className="plan-tag" style={{ background:`${toColor}22`, color:toColor, borderColor:`${toColor}44` }}>{toName}</span>
                  </div>
                  <div className="request-details">
                    <div className="detail-box"><div className="detail-label">USUARIO</div><div className="detail-value">{r.userName ?? '—'}</div></div>
                    <div className="detail-box"><div className="detail-label">DURACIÓN</div><div className="detail-value">{r.duration ?? '—'}</div></div>
                    <div className="detail-box"><div className="detail-label">MONTO</div><div className="detail-value">S/ {(r.amount ?? 0).toFixed(2)}</div></div>
                    <div className="detail-box"><div className="detail-label">TIPO</div><div className="detail-value">{r.type === 'upgrade' ? 'Upgrade' : r.type === 'downgrade' ? 'Downgrade' : 'Trial'}</div></div>
                    {r.paymentMethod && r.paymentMethod !== 'trial' && <div className="detail-box"><div className="detail-label">MÉTODO</div><div className="detail-value">{r.paymentMethod}</div></div>}
                  </div>
                </div>
              );
            })
          }
        </div>
      </div>
    </>
  );
}
