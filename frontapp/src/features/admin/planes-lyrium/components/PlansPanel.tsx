'use client';
import type { PlansMap } from '@/features/seller/plans-lyrium/types';
import type { PlanStatusFilter } from '@/features/admin/planes-lyrium/hooks/useAdmin';

const FIXED_ORDER = ['basic', 'standard', 'premium'];

const SvgEdit = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const SvgDelete = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>;
const SvgRestore = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>;

interface Props {
  plansData: PlansMap;
  statusFilter: PlanStatusFilter;
  onFilterChange: (f: PlanStatusFilter) => void;
  onOpenEditor: (planId: string) => void;
  onToggleActive: (planId: string) => void;
  onOpenDelete: (planId: string) => void;
  onOpenRestore: (planId: string) => void;
}

export default function PlansPanel({ plansData, statusFilter, onFilterChange, onOpenEditor, onToggleActive, onOpenDelete, onOpenRestore }: Props) {
  const allKeys     = Object.keys(plansData);
  const orderedKeys = FIXED_ORDER.filter(k => allKeys.includes(k)).concat(allKeys.filter(k => !FIXED_ORDER.includes(k)));
  const filtered    = orderedKeys.filter(k => {
    const isActive = plansData[k]?.isActive !== false;
    if (statusFilter === 'active')   return isActive;
    if (statusFilter === 'inactive') return !isActive;
    return true;
  });

  return (
    <div className="tab-panel active" id="plansPanel">
      <div className="plans-header">
        <h2>Gestión de Planes</h2>
        <button className="btn-add-plan" onClick={() => onOpenEditor('new')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Crear Nuevo Plan
        </button>
      </div>

      <div className="plans-status-filters" id="plansStatusFilters">
        {(['all', 'active', 'inactive'] as PlanStatusFilter[]).map(f => (
          <button key={f} className={`plan-filter-btn ${statusFilter === f ? 'active' : ''}`}
            data-status={f} onClick={() => onFilterChange(f)}>
            {f === 'all' ? 'Todos' : f === 'active' ? 'Activos' : 'Inactivos'}
          </button>
        ))}
      </div>

      <div className="plans-grid" id="plansGrid">
        {filtered.length === 0
          ? <div style={{ gridColumn:'1/-1', textAlign:'center', padding:'50px', color:'#9ca3af', fontSize:'15px' }}>No hay planes en esta categoría.</div>
          : filtered.map(key => <PlanCard key={key} planKey={key} plansData={plansData} onEdit={onOpenEditor} onToggle={onToggleActive} onDelete={onOpenDelete} onRestore={onOpenRestore} />)
        }
      </div>
    </div>
  );
}

const IS_FIXED = (id: string) => ['basic', 'standard', 'premium'].includes(id);

function PlanCard({ planKey, plansData, onEdit, onToggle, onDelete, onRestore }: {
  planKey: string; plansData: PlansMap;
  onEdit: (id: string) => void; onToggle: (id: string) => void;
  onDelete: (id: string) => void; onRestore: (id: string) => void;
}) {
  const plan     = plansData[planKey]; if (!plan) return null;
  const isActive = plan.isActive !== false;

  let priceHtml: React.ReactNode;
  if (plan.usePriceMode === false && plan.priceText) {
    priceHtml = <div className="plan-card-price" style={{ color:plan.cssColor }}>{plan.priceText}{plan.priceSubtext && <small> {plan.priceSubtext}</small>}</div>;
  } else {
    priceHtml = <div className="plan-card-price" style={{ color:plan.cssColor }}>{plan.currency ?? 'S/'} {(parseFloat(String(plan.price)) || 0).toFixed(2)}<small> {plan.period ?? '/mes'}</small></div>;
  }

  const ToggleIcon = isActive
    ? () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="7" width="20" height="10" rx="5"/><circle cx="7" cy="12" r="3" fill="currentColor"/></svg>
    : () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="7" width="20" height="10" rx="5"/><circle cx="17" cy="12" r="3" fill="currentColor"/></svg>;

  return (
    <div className={`plan-card${isActive ? '' : ' plan-card-inactive'}`} style={{ '--plan-color': plan.cssColor } as React.CSSProperties}>
      <div className="plan-card-header">
        <div className="plan-card-badge" style={{ color:plan.cssColor, background:`${plan.cssColor}22` }}>{plan.badge}</div>
        <div className="plan-card-name">{plan.name}</div>
        {priceHtml}
        {!isActive && <div className="plan-inactive-badge">INACTIVO</div>}
      </div>
      <div className="plan-card-description">{plan.description}</div>
      <div className="plan-card-features">
        <h4>Beneficios ({plan.features?.length ?? 0})</h4>
        <ul>
          {plan.features?.slice(0, 3).filter(f => f.active).map((f, i) => <li key={`k-${i}`}>{f.text}</li>)}
          {(plan.features?.length ?? 0) > 3 && <li style={{ color:'#6b7280' }}>+ {(plan.features?.length ?? 0) - 3} más...</li>}
        </ul>
      </div>
      <div className="plan-card-actions">
        <button className={`btn-plan-action ${isActive ? 'btn-plan-toggle-off' : 'btn-plan-toggle-on'}`}
          title={isActive ? 'Desactivar plan' : 'Activar plan'} onClick={() => onToggle(plan.id)}>
          <ToggleIcon />
        </button>
        <button className="btn-plan-action btn-plan-edit" title="Editar" onClick={() => onEdit(plan.id)}><SvgEdit /></button>
        {IS_FIXED(plan.id) && (
          <button className="btn-plan-action btn-plan-restore" title="Restaurar" onClick={() => onRestore(plan.id)}><SvgRestore /></button>
        )}
        {!IS_FIXED(plan.id) && (
          <button className="btn-plan-action btn-plan-delete" title="Eliminar" onClick={() => onDelete(plan.id)}><SvgDelete /></button>
        )}
      </div>
    </div>
  );
}
