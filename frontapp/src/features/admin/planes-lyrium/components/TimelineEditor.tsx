'use client';
import { availableIcons } from '@/features/seller/plans-lyrium/lib/icons';
import type { PlansMap } from '@/features/seller/plans-lyrium/types';

interface Props {
  plansData: PlansMap;
  onSelectIcon: (planId: string, iconKey: string) => void;
}

export default function TimelineEditor({ plansData, onSelectIcon }: Props) {
  return (
    <>
      <div className="timeline-editor-header">
        <h2>Iconos de Planes</h2>
        <p>Personaliza los iconos de cada plan en la línea de tiempo de progresión</p>
      </div>
      <div className="timeline-points-editor" id="timelinePointsEditor">
        {Object.values(plansData).map(plan => (
          <div key={plan.id} className="timeline-point-editor">
            <div className="point-editor-header">
              <h3>{plan.name}</h3>
              <div className="color-dot" style={{ background: plan.cssColor }} />
            </div>
            <label>Seleccionar Icono:</label>
            <div className="icon-selector" id={`iconSel_${plan.id}`}>
              {Object.entries(availableIcons).map(([ik, path]) => (
                <div key={ik} className={`icon-option ${plan.timelineIcon === ik ? 'active' : ''}`} onClick={() => onSelectIcon(plan.id, ik)}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" dangerouslySetInnerHTML={{ __html: path }} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
