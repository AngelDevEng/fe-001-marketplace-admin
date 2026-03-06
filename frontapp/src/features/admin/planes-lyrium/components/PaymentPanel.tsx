'use client';
import type { VendedorPago, PaymentTotals } from '@/features/admin/planes-lyrium/hooks/useAdmin';
import { useState } from 'react';

interface Props {
  vendedorPagos: VendedorPago[]; totales: PaymentTotals;
  filter: string; onFilterChange: (f: string) => void;
}

// Iconos de método de pago
function MetodoIcon({ metodo }: { metodo: string }) {
  if (metodo === 'Yape') return (
    <span className="boleta-metodo-badge boleta-metodo-yape">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
      Yape
    </span>
  );
  if (metodo === 'Plin') return (
    <span className="boleta-metodo-badge boleta-metodo-plin">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
      Plin
    </span>
  );
  // Default: tarjeta
  return (
    <span className="boleta-metodo-badge boleta-metodo-card">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
      Tarjeta
    </span>
  );
}

function BoletaGrid({ vendedor, filter }: { vendedor: VendedorPago; filter: string }) {
  const [open, setOpen] = useState(false);
  const txs = filter === 'all' ? vendedor.transacciones : vendedor.transacciones.filter(t => t.estado === filter);
  if (txs.length === 0) return null;
  const initials = (vendedor.username ?? 'VE').substring(0, 2).toUpperCase();
  const exitosos = txs.filter(t => t.estado === 'paid').length;

  return (
    <div className="pago-vend-bloque">
      <div className="pago-vend-header">
        <div className="pago-vend-avatar">{initials}</div>
        <div className="pago-vend-info">
          <div className="pago-vend-nombre">{vendedor.username ?? 'Vendedor'}</div>
          <div className="pago-vend-correo">{vendedor.correo ?? ''}</div>
        </div>
        <div className="pago-vend-resumen">
          <div className="pago-vend-total-monto">S/ {vendedor.total_monto.toFixed(2)}</div>
          <div className="pago-vend-total-label">{exitosos} exitoso(s) · {txs.length} registro(s)</div>
        </div>
        <button className="pago-vend-toggle" onClick={() => setOpen(!open)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            {open ? <polyline points="18 15 12 9 6 15"/> : <polyline points="6 9 12 15 18 9"/>}
          </svg>
          {open ? 'Ocultar' : 'Ver boletas'}
        </button>
      </div>
      {open && (
        <div className="pago-boletas-grid">
          {txs.map(tx => {
            const eColor = tx.estado === 'paid' ? '#10b981' : tx.estado === 'failed' ? '#ef4444' : '#f59e0b';
            const eLabel = tx.estado === 'paid' ? 'EXITOSO' : tx.estado === 'failed' ? 'FALLIDO' : 'PENDIENTE';
            const isYape = tx.metodoPago === 'YAPE' || tx.metodoPago === 'yape';
            const isPlin = tx.metodoPago === 'PLIN' || tx.metodoPago === 'plin';
            const metodo = isYape ? 'Yape' : isPlin ? 'Plin' : 'Tarjeta';
            const fechaObj = tx.fecha ? new Date(tx.fecha) : null;
            const locOpts: Intl.DateTimeFormatOptions = { day:'2-digit', month:'2-digit', year:'numeric' };
            const timeOpts: Intl.DateTimeFormatOptions = { hour:'2-digit', minute:'2-digit' };
            const fechaStr = fechaObj ? fechaObj.toLocaleDateString('es-PE', locOpts) : '—';
            const horaStr  = fechaObj ? fechaObj.toLocaleTimeString('es-PE', timeOpts) : '';
            return (
              <div key={tx.id} className="boleta-card">
                <div className="boleta-status-bar" style={{ background: eColor }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="boleta-status-icon">
                    {tx.estado === 'paid'
                      ? <polyline points="20 6 9 17 4 12"/>
                      : tx.estado === 'failed'
                        ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                        : <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>
                    }
                  </svg>
                  <span className="boleta-status-label">{eLabel}</span>
                  <span className="boleta-orden">N° {tx.orderId ?? ('#' + tx.id)}</span>
                </div>
                <div className="boleta-body">
                  <div className="boleta-monto-row">
                    <div className="boleta-monto" style={{ color: eColor }}>S/ {tx.monto.toFixed(2)}</div>
                    <MetodoIcon metodo={metodo} />
                  </div>
                  <div className="boleta-sep" />
                  <div className="boleta-row"><span className="boleta-key">Plan</span><span className="boleta-val" style={{ color:tx.planColor, fontWeight:800 }}>{tx.planNombre ?? tx.planId}</span></div>
                  <div className="boleta-row"><span className="boleta-key">Vendedor</span><span className="boleta-val">{vendedor.username ?? '—'}</span></div>
                  <div className="boleta-row"><span className="boleta-key">Duración</span><span className="boleta-val">{tx.meses} mes(es)</span></div>
                  <div className="boleta-row"><span className="boleta-key">Fecha</span><span className="boleta-val">{fechaStr}</span></div>
                  <div className="boleta-row"><span className="boleta-key">Hora</span><span className="boleta-val">{horaStr}</span></div>
                  {tx.procesadoEn && (() => {
                    const p = new Date(tx.procesadoEn!);
                    return <div className="boleta-row"><span className="boleta-key">Procesado</span><span className="boleta-val">{p.toLocaleDateString('es-PE', locOpts)} {p.toLocaleTimeString('es-PE', timeOpts)}</span></div>;
                  })()}
                  {tx.transactionId && <div className="boleta-row"><span className="boleta-key">ID Izipay</span><span className="boleta-val boleta-mono">{tx.transactionId}</span></div>}
                </div>
                <div className="boleta-footer">Procesado por <strong>Izipay</strong></div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function PaymentPanel({ vendedorPagos, totales, filter, onFilterChange }: Props) {
  const visible = filter === 'all' ? vendedorPagos : vendedorPagos.filter(v => v.transacciones.some(t => t.estado === filter));

  return (
    <>
      <div className="settings-header">
        <h2>Historial de Pagos</h2>
        <p>Transacciones procesadas por Izipay — ordenadas por fecha</p>
      </div>
      <div className="pagos-totales-grid">
        <div className="pagos-total-card pagos-card-total"><div className="pt-label">Total recaudado</div><div className="pt-value">S/ {totales.total_monto.toFixed(2)}</div></div>
        <div className="pagos-total-card pagos-card-ok"><div className="pt-label">Pagos exitosos</div><div className="pt-value pt-green">{totales.pagos_exitosos}</div></div>
        <div className="pagos-total-card pagos-card-fail"><div className="pt-label">Pagos fallidos</div><div className="pt-value pt-red">{totales.pagos_fallidos}</div></div>
        <div className="pagos-total-card pagos-card-pend"><div className="pt-label">Pendientes</div><div className="pt-value pt-yellow">{totales.pagos_pending}</div></div>
      </div>
      <div className="admin-filters" style={{ marginTop:'20px' }}>
        {(['all','paid','failed','pending'] as const).map(f => (
          <button key={f} className={`filter-btn ${filter === f ? 'active' : ''}`} onClick={() => onFilterChange(f)}>
            {f !== 'all' && <span className={`rf-dot rf-dot-${f === 'paid' ? 'green' : f === 'failed' ? 'red' : 'yellow'}`} />}
            {f === 'all' ? 'Todos' : f === 'paid' ? 'Exitosos' : f === 'failed' ? 'Fallidos' : 'Pendientes'}
          </button>
        ))}
      </div>
      <div id="pagosHistorialContainer" style={{ marginTop:'16px' }}>
        {visible.length === 0
          ? <div className="empty-state"><svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg><p>No hay transacciones aún</p></div>
          : visible.map(v => <BoletaGrid key={v.usuario_id} vendedor={v} filter={filter} />)
        }
      </div>
    </>
  );
}
