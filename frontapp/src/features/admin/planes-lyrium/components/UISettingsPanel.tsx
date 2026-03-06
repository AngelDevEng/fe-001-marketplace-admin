'use client';
import type { ButtonColors } from '@/features/seller/plans-lyrium/types';

interface Props {
  colors: ButtonColors;
  onChange: (key: keyof ButtonColors, value: string) => void;
  onSave: () => void;
  onReset: () => void;
}

const COLOR_FIELDS: { id: keyof ButtonColors; label: string; section: string }[] = [
  { id:'subscribeBg',    label:'Fondo botón',     section:'Botones de Suscripción — Normal' },
  { id:'subscribeColor', label:'Texto botón',      section:'' },
  { id:'currentBg',      label:'Fondo (activo)',   section:'Botones de Suscripción — Plan Actual' },
  { id:'currentColor',   label:'Texto (activo)',   section:'' },
  { id:'lockedBg',       label:'Fondo bloqueado',  section:'Botones — Bloqueado / Ya Reclamado' },
  { id:'lockedColor',    label:'Texto bloqueado',  section:'' },
  { id:'warningColor',   label:'Color del texto',  section:'Texto de Advertencia / Bloqueo' },
];

export default function UISettingsPanel({ colors: c, onChange, onSave, onReset }: Props) {
  const sections = COLOR_FIELDS.reduce<{ section: string; fields: typeof COLOR_FIELDS }[]>((acc, f) => {
    if (f.section) acc.push({ section: f.section, fields: [] });
    acc[acc.length - 1].fields.push(f);
    return acc;
  }, []);

  return (
    <>
      <div className="settings-header">
        <h2>Apariencia del Panel de Usuario</h2>
        <p>Personaliza los colores de los botones de suscripción</p>
      </div>
      <div className="settings-section">
        {sections.map(s => (
          <div key={s.section}>
            <h3 style={{ marginTop:'20px' }}>{s.section}</h3>
            {s.section === 'Texto de Advertencia / Bloqueo' && (
              <p className="form-hint">Es el texto que aparece debajo del botón bloqueado (ej: "⚠ Este plan solo puede reclamarse una vez")</p>
            )}
            <div className="settings-row">
              {s.fields.map(f => (
                <div key={f.id} className="setting-item">
                  <label>{f.label}</label>
                  <div className="color-input-wrapper">
                    <input type="color" value={c[f.id] ?? '#ffffff'} onChange={e => onChange(f.id, e.target.value)} />
                    <div className="color-preview-dot" style={{ background: c[f.id] ?? '#ffffff', border: f.id === 'subscribeColor' ? '1px solid #e5e7eb' : undefined }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="settings-preview">
          <p>Vista previa de botones:</p>
          <div className="btn-preview-row">
            <button className="btn-preview-item" style={{ pointerEvents:'none', background:c.subscribeBg, color:c.subscribeColor }}>Suscribirse</button>
            <button className="btn-preview-item" style={{ pointerEvents:'none', background:c.currentBg, color:c.currentColor }}>Plan Actual</button>
            <button className="btn-preview-item" style={{ pointerEvents:'none', background:c.lockedBg, color:c.lockedColor }}>Ya reclamado</button>
          </div>
          <p className="btn-preview-warning-text" style={{ color:c.warningColor }}>⚠ Este plan solo puede ser reclamado una única vez.</p>
        </div>

        <div className="settings-actions">
          <button className="btn-save-settings" onClick={onSave}>Guardar Colores</button>
          <button className="btn-reset-settings" onClick={onReset}>Restablecer</button>
        </div>
      </div>
    </>
  );
}
