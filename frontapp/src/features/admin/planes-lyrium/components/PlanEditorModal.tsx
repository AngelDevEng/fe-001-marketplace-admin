'use client';
import { useState } from 'react';
import Modal from '@/features/seller/plans-lyrium/shared/Modal';
import type { PlanData, PlanFeature, DetailedBenefit } from '@/features/seller/plans-lyrium/types';

interface Props {
  open: boolean; title: string; activeTab: string;
  editingPlan: Partial<PlanData>;
  editFeatures: PlanFeature[];
  editDetailedBenefits: DetailedBenefit[];
  onClose: () => void; onSave: () => void;
  onTabChange: (tab: string) => void;
  onUpdatePlan: (patch: Partial<PlanData>) => void;
  onAddFeature: () => void;
  onUpdateFeature: (idx: number, patch: Partial<PlanFeature>) => void;
  onRemoveFeature: (idx: number) => void;
  onAddDetailedBenefit: () => void;
  onUpdateDetailedBenefit: (idx: number, patch: Partial<DetailedBenefit>) => void;
  onRemoveDetailedBenefit: (idx: number) => void;
  onImageUpload: (file: File) => void;
}

const EDITOR_TABS = [
  { key: 'basic',    label: 'Básico',      icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
  { key: 'pricing',  label: 'Precios',     icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v12M9 8h6M9 16h6"/></svg> },
  { key: 'design',   label: 'Diseño',      icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg> },
  { key: 'features', label: 'Beneficios',  icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg> },
  { key: 'detailed', label: 'Detallados',  icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/></svg> },
  { key: 'config',   label: 'Configuración',icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24"/></svg> },
];

const FIT_OPTIONS = [['cover','Cubrir (llenar)'],['contain','Contener'],['fill','Estirar']];
const POS_OPTIONS = [['center','Centro'],['top','Arriba'],['bottom','Abajo'],['left','Izquierda'],['right','Derecha'],['top center','Arriba centro'],['bottom center','Abajo centro']];

export default function PlanEditorModal({ open, title, activeTab, editingPlan: ep, editFeatures, editDetailedBenefits, onClose, onSave, onTabChange, onUpdatePlan, onAddFeature, onUpdateFeature, onRemoveFeature, onAddDetailedBenefit, onUpdateDetailedBenefit, onRemoveDetailedBenefit, onImageUpload }: Props) {
  const [featFilter, setFeatFilter] = useState<'all'|'active'|'inactive'>('all');
  const p = ep;
  const showNumeric = p.usePriceMode !== false;
  const activeCount   = editFeatures.filter(f => f.active).length;
  const inactiveCount = editFeatures.filter(f => !f.active).length;
  const visibleCount  = p.compactVisibleCount ?? 5;
  const filteredFeatures = featFilter === 'all' ? editFeatures
    : featFilter === 'active' ? editFeatures.filter(f => f.active)
    : editFeatures.filter(f => !f.active);

  return (
    <Modal open={open} onClose={onClose} className="plan-editor-modal">
      <h2 className="modal-title">{title}</h2>
      <div className="editor-tabs">
        {EDITOR_TABS.map(t => (
          <button key={t.key} className={`editor-tab ${activeTab === t.key ? 'active' : ''}`} onClick={() => onTabChange(t.key)}>
            {t.icon}{t.label}
          </button>
        ))}
      </div>
      <div className="editor-content">

        {/* BÁSICO */}
        {activeTab === 'basic' && (
          <div className="editor-tab-content active">
            <div className="form-section">
              <input type="hidden" value={p.id ?? ''} readOnly />
              <div className="form-group">
                <label>ID del Plan</label>
                <input type="text" value={p.id ?? ''} placeholder="ej: plan_pro (sin espacios)" onChange={e => onUpdatePlan({ id: e.target.value })} disabled={['basic','standard','premium'].includes(p.id ?? '')} />
              </div>
              <div className="form-group">
                <label>Nombre del Plan *</label>
                <input type="text" value={p.name ?? ''} placeholder="Ej: Plan Profesional" onChange={e => onUpdatePlan({ name: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Badge / Etiqueta</label>
                <input type="text" value={p.badge ?? ''} placeholder="Ej: MÁS POPULAR" onChange={e => onUpdatePlan({ badge: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <textarea value={p.description ?? ''} rows={3} placeholder="Descripción breve del plan" onChange={e => onUpdatePlan({ description: e.target.value })} />
              </div>
            </div>
          </div>
        )}

        {/* PRECIOS */}
        {activeTab === 'pricing' && (
          <div className="editor-tab-content active">
            <div className="form-section">
              <h3>Modo de Precio</h3>
              <div className="toggle-wrapper">
                <label className="toggle-label">
                  <input type="checkbox" checked={p.usePriceMode !== false} onChange={e => onUpdatePlan({ usePriceMode: e.target.checked })} />
                  <span className="toggle-slider" /><span className="toggle-text">Usar precio numérico</span>
                </label>
                <p className="form-hint">Desactiva para usar texto personalizado (ej: "Prueba gratuita")</p>
              </div>
              {showNumeric ? (
                <>
                  <div className="form-row">
                    <div className="form-group"><label>Moneda</label><input type="text" value={p.currency ?? 'S/'} placeholder="S/" maxLength={10} onChange={e => onUpdatePlan({ currency: e.target.value })} /></div>
                  </div>
                  <div className="form-row">
                    <div className="form-group"><label>Precio Mensual</label><input type="number" value={p.price ?? 0} placeholder="0.00" step={0.01} min={0} onChange={e => onUpdatePlan({ price: parseFloat(e.target.value) || 0 })} /></div>
                    <div className="form-group"><label>Precio Anual</label><input type="number" value={p.priceAnnual ?? 0} placeholder="0.00" step={0.01} min={0} onChange={e => onUpdatePlan({ priceAnnual: parseFloat(e.target.value) || 0 })} /></div>
                  </div>
                  <div className="form-row">
                    <div className="form-group"><label>Etiqueta Mensual</label><input type="text" value={p.period ?? '/mes'} placeholder="/mes" maxLength={20} onChange={e => onUpdatePlan({ period: e.target.value })} /></div>
                    <div className="form-group"><label>Etiqueta Anual</label><input type="text" value={p.periodAnnual ?? '/año'} placeholder="/año" maxLength={20} onChange={e => onUpdatePlan({ periodAnnual: e.target.value })} /></div>
                  </div>
                </>
              ) : (
                <>
                  <div className="form-group"><label>Texto Principal de Precio</label><input type="text" value={p.priceText ?? ''} placeholder="Ej: Prueba gratuita" onChange={e => onUpdatePlan({ priceText: e.target.value })} /></div>
                  <div className="form-group"><label>Subtexto (opcional)</label><input type="text" value={p.priceSubtext ?? ''} placeholder="Ej: 6 meses" onChange={e => onUpdatePlan({ priceSubtext: e.target.value })} /></div>
                </>
              )}
            </div>
          </div>
        )}

        {/* DISEÑO */}
        {activeTab === 'design' && (
          <div className="editor-tab-content active">
            <div className="form-section">
              <h3>Colores del Plan</h3>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
                <div className="form-group" style={{ marginBottom:0 }}>
                  <label>Color Principal</label>
                  <div className="color-picker-row">
                    <div className="color-swatch" style={{ background: p.cssColor ?? '#3b82f6' }}>
                      <input type="color" value={p.cssColor ?? '#3b82f6'} onChange={e => onUpdatePlan({ cssColor: e.target.value })} />
                    </div>
                    <input type="text" className="color-hex-input" value={p.cssColor ?? '#3b82f6'} maxLength={7}
                      onChange={e => { if (/^#[0-9a-fA-F]{0,6}$/.test(e.target.value)) onUpdatePlan({ cssColor: e.target.value }); }} />
                    <span className="color-bar" style={{ background: p.cssColor ?? '#3b82f6' }} />
                  </div>
                </div>
                <div className="form-group" style={{ marginBottom:0 }}>
                  <label>Color de Acento</label>
                  <div className="color-picker-row">
                    <div className="color-swatch" style={{ background: p.accentColor ?? '#2563eb' }}>
                      <input type="color" value={p.accentColor ?? '#2563eb'} onChange={e => onUpdatePlan({ accentColor: e.target.value })} />
                    </div>
                    <input type="text" className="color-hex-input" value={p.accentColor ?? '#2563eb'} maxLength={7}
                      onChange={e => { if (/^#[0-9a-fA-F]{0,6}$/.test(e.target.value)) onUpdatePlan({ accentColor: e.target.value }); }} />
                    <span className="color-bar" style={{ background: p.accentColor ?? '#2563eb' }} />
                  </div>
                </div>
              </div>
            </div>
            <div className="form-section" style={{ marginTop:'16px' }}>
              <h3>Imagen de Fondo</h3>
              <div className="image-upload-wrapper">
                <input type="file" id="editPlanImageUpload" accept="image/*,.heic,.heif,.avif,.tiff,.bmp,.ico" style={{ display:'none' }}
                  onChange={e => { const f = e.target.files?.[0]; if (f) onImageUpload(f); }} />
                <button className="btn-upload" onClick={() => document.getElementById('editPlanImageUpload')?.click()}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
                  Subir Imagen
                </button>
                <input type="text" value={p.bgImage ?? ''} placeholder="URL o ruta de la imagen" style={{ marginTop:'4px' }} onChange={e => onUpdatePlan({ bgImage: e.target.value })} />
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginTop:'10px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                    <label style={{ fontSize:'12px', fontWeight:600, color:'#6b7280', whiteSpace:'nowrap' }}>Ajuste:</label>
                    <select className="img-fit-select" style={{ flex:1 }} value={p.bgImageFit ?? 'cover'} onChange={e => onUpdatePlan({ bgImageFit: e.target.value as 'cover'|'contain' })}>
                      {FIT_OPTIONS.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                    <label style={{ fontSize:'12px', fontWeight:600, color:'#6b7280', whiteSpace:'nowrap' }}>Posición:</label>
                    <select className="img-fit-select" style={{ flex:1 }} value={p.bgImagePosition ?? 'center'} onChange={e => onUpdatePlan({ bgImagePosition: e.target.value })}>
                      {POS_OPTIONS.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                  </div>
                </div>
                <label style={{ display:'flex', alignItems:'center', gap:'10px', padding:'10px 12px', background:'white', borderRadius:'8px', border:'1px solid #e5e7eb', cursor:'pointer', marginTop:'10px' }}>
                  <input type="checkbox" checked={!!p.showBgInCard} style={{ width:'18px', height:'18px', accentColor:'#3b82f6', cursor:'pointer' }} onChange={e => onUpdatePlan({ showBgInCard: e.target.checked })} />
                  <span style={{ fontSize:'13px', fontWeight:600, color:'#374151' }}>Mostrar imagen en tarjeta pequeña del carrusel</span>
                </label>
                {p.bgImage && (
                  <div style={{ marginTop:'10px', borderRadius:'10px', overflow:'hidden', height:'160px', background:'#f3f4f6' }}>
                    <img src={p.bgImage} alt="Preview" style={{ width:'100%', height:'100%', objectFit:p.bgImageFit ?? 'cover', objectPosition:p.bgImagePosition ?? 'center' }} />
                  </div>
                )}
                {p.bgImage && p.showBgInCard && (
                  <div style={{ marginTop:'10px' }}>
                    <p style={{ fontSize:'12px', fontWeight:600, color:'#6b7280', marginBottom:'6px' }}>Vista previa en tarjeta pequeña:</p>
                    <div style={{ width:'160px', height:'90px', borderRadius:'10px', overflow:'hidden', position:'relative', background:'#1a1a2e' }}>
                      <img src={p.bgImage} alt="Mini preview" style={{ width:'100%', height:'100%', objectFit:p.bgImageFit ?? 'cover', objectPosition:p.bgImagePosition ?? 'center' }} />
                      <div style={{ position:'absolute', bottom:6, left:8, background:'rgba(0,0,0,0.55)', color:'#fff', fontSize:'9px', fontWeight:800, padding:'2px 6px', borderRadius:'4px', letterSpacing:'0.5px', textTransform:'uppercase' }}>
                        {p.name ?? 'PLAN'}
                      </div>
                    </div>
                  </div>
                )}
                <p className="form-hint" style={{ marginTop:'6px' }}>Acepta PNG, JPG, WebP, SVG, GIF, AVIF, HEIC y más.</p>
              </div>
            </div>
          </div>
        )}

        {/* BENEFICIOS */}
        {activeTab === 'features' && (
          <div className="editor-tab-content active">
            <div className="form-section">
              <h3>Beneficios Compactos (Tarjeta)</h3>
              <p className="form-hint">Aparecen en la tarjeta del plan. Elige cuántos mostrar antes del "Ver más".</p>
              {/* Controles: visible count + filtros */}
              <div className="feat-controls">
                <div className="feat-visible-row">
                  <span>Mostrar</span>
                  <input type="number" value={visibleCount} min={1} max={20}
                    onChange={e => onUpdatePlan({ compactVisibleCount: parseInt(e.target.value) || 5 })} />
                  <span>antes del "Ver más"</span>
                </div>
                <div className="feat-filter-pills">
                  <button className={`feat-pill ${featFilter === 'all' ? 'fp-active fp-blue' : ''}`}
                    onClick={() => setFeatFilter('all')}>Todos</button>
                  <button className={`feat-pill ${featFilter === 'active' ? 'fp-active fp-green' : ''}`}
                    onClick={() => setFeatFilter('active')}>
                    <span className="fp-dot" style={{ background:'#22c55e' }}/>Activos
                  </button>
                  <button className={`feat-pill ${featFilter === 'inactive' ? 'fp-active fp-red' : ''}`}
                    onClick={() => setFeatFilter('inactive')}>
                    <span className="fp-dot" style={{ background:'#ef4444' }}/>No incluidos
                  </button>
                </div>
              </div>
              {/* Lista */}
              <div id="featuresListCompact">
                {filteredFeatures.map((f) => {
                  const realIdx = editFeatures.indexOf(f);
                  return (
                    <div key={`k-${realIdx}`} className={`feature-item ${f.active ? 'fi-active' : 'fi-inactive'}`}>
                      <button type="button" className={`feat-toggle ${f.active ? 'toggle-on' : 'toggle-off'}`}
                        onClick={() => onUpdateFeature(realIdx, { active: !f.active })}>
                        {f.active ? '✓ Activo' : '✕ No incluido'}
                      </button>
                      <input type="text" value={f.text ?? ''} placeholder="Texto del beneficio"
                        onChange={e => onUpdateFeature(realIdx, { text: e.target.value })} />
                      <button className="btn-remove-feature" onClick={() => onRemoveFeature(realIdx)}>×</button>
                    </div>
                  );
                })}
              </div>
              {/* Stats */}
              <div className="feat-stats">
                <span className="fs-active">✓ {activeCount} activos</span>
                <span className="fs-sep">·</span>
                <span className="fs-inactive">✕ {inactiveCount} no incluidos</span>
                <span className="fs-sep">·</span>
                <span className="fs-info">Mostrando {visibleCount} en "Ver más"</span>
              </div>
              <button className="btn-add-feature" onClick={onAddFeature}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                + Agregar Beneficio
              </button>
            </div>
          </div>
        )}

        {/* DETALLADOS */}
        {activeTab === 'detailed' && (
          <div className="editor-tab-content active">
            <div className="form-section">
              <h3>Beneficios Detallados (Modal)</h3>
              <p className="form-hint">Aparecen en el modal de detalles al hacer clic en cualquier beneficio.</p>
              <div id="detailedBenefitsList">
                {editDetailedBenefits.map((b, i) => (
                  <div key={`k-${i}`} className="detailed-benefit-item" style={{ borderLeft:`4px solid ${b.color ?? '#3b82f6'}` }}>
                    <div className="db-row">
                      {/* emoji — se muestra como ícono en un cuadro */}
                      <div className="db-emoji-box" style={{ background:`${b.color ?? '#3b82f6'}22`, border:`1.5px solid ${b.color ?? '#3b82f6'}55` }}>
                        <span>{b.emoji || '✓'}</span>
                        <input type="text" value={b.emoji ?? ''} placeholder="😀" maxLength={4}
                          title="Emoji o símbolo" onChange={e => onUpdateDetailedBenefit(i, { emoji: e.target.value })} />
                      </div>
                      <input type="text" className="db-title" value={b.title ?? ''} placeholder="Título del beneficio"
                        onChange={e => onUpdateDetailedBenefit(i, { title: e.target.value })} />
                      {/* color swatch */}
                      <div className="db-color-swatch" style={{ background: b.color ?? '#3b82f6' }}>
                        <input type="color" value={b.color ?? '#3b82f6'}
                          onChange={e => onUpdateDetailedBenefit(i, { color: e.target.value })} />
                      </div>
                      <button className="btn-remove-feature" onClick={() => onRemoveDetailedBenefit(i)}>×</button>
                    </div>
                    <textarea className="db-description" placeholder="Descripción detallada del beneficio…"
                      value={b.description ?? ''} onChange={e => onUpdateDetailedBenefit(i, { description: e.target.value })} />
                  </div>
                ))}
              </div>
              <button className="btn-add-feature" onClick={onAddDetailedBenefit}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Agregar Beneficio Detallado
              </button>
            </div>
          </div>
        )}

        {/* CONFIGURACIÓN */}
        {activeTab === 'config' && (
          <div className="editor-tab-content active">
            <div className="form-section">
              <h3>Configuración de Pago</h3>
              <div className="toggle-wrapper">
                <label className="toggle-label">
                  <input type="checkbox" checked={!!p.requiresPayment} onChange={e => onUpdatePlan({ requiresPayment: e.target.checked })} />
                  <span className="toggle-slider" /><span className="toggle-text">Requiere pago</span>
                </label>
                <p className="form-hint">Desactiva para planes completamente gratuitos o de prueba</p>
              </div>
            </div>
            <div className="form-section" style={{ marginTop:'20px' }}>
              <h3>Bloqueo de Reclamación</h3>
              <div className="toggle-wrapper">
                <label className="toggle-label">
                  <input type="checkbox" checked={!!p.enableClaimLock} onChange={e => onUpdatePlan({ enableClaimLock: e.target.checked })} />
                  <span className="toggle-slider" /><span className="toggle-text">Bloquear después de reclamar (solo una vez)</span>
                </label>
              </div>
              <div className="form-group"><label>Texto del Botón Bloqueado</label><input type="text" value={p.claimedButtonText ?? ''} placeholder="Este plan ya ha sido reclamado con anterioridad" onChange={e => onUpdatePlan({ claimedButtonText: e.target.value })} /></div>
              <div className="form-group"><label>Mensaje de advertencia</label><input type="text" value={p.claimedWarningText ?? ''} placeholder="⚠ Este plan solo puede ser reclamado una única vez." onChange={e => onUpdatePlan({ claimedWarningText: e.target.value })} /></div>
              <div className="form-group"><label>Duración del plan gratuito (meses)</label><input type="number" value={p.claimMonths ?? 1} min={1} max={120} onChange={e => onUpdatePlan({ claimMonths: parseInt(e.target.value) || 1 })} /></div>
            </div>
            <div className="form-section" style={{ marginTop:'20px' }}>
              <h3>Textos Personalizables</h3>
              <div className="form-group"><label>Texto del Botón de Suscripción</label><input type="text" value={p.subscribeButtonText ?? 'Suscribirse'} placeholder="Suscribirse" onChange={e => onUpdatePlan({ subscribeButtonText: e.target.value })} /></div>
              <div className="form-group"><label>Título del Modal de Éxito</label><input type="text" value={p.trialSuccessTitle ?? ''} placeholder="¡Solicitud enviada!" onChange={e => onUpdatePlan({ trialSuccessTitle: e.target.value })} /></div>
              <div className="form-group"><label>Mensaje Principal del Modal</label><textarea value={p.trialSuccessMessage ?? ''} rows={2} placeholder="Prueba gratuita de 6 meses..." onChange={e => onUpdatePlan({ trialSuccessMessage: e.target.value })} /></div>
              <div className="form-group"><label>Mensaje de Espera</label><textarea value={p.trialWaitMessage ?? ''} rows={2} placeholder="Espere la aceptación del administrador..." onChange={e => onUpdatePlan({ trialWaitMessage: e.target.value })} /></div>
            </div>
          </div>
        )}

        <div className="editor-actions">
          <button className="btn-cancel" onClick={onClose}>Cancelar</button>
          <button className="btn-save" onClick={onSave}>Guardar Cambios</button>
        </div>
      </div>
    </Modal>
  );
}
