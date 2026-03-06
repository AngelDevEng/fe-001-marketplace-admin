'use client';
import { useEffect } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  className?: string;
  children: React.ReactNode;
  showClose?: boolean;
}

export default function Modal({ open, onClose, className = '', children, showClose = true }: Props) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-overlay show active" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={`modal-box ${className}`}>
        {showClose && <button className="modal-close" onClick={onClose}>×</button>}
        {children}
      </div>
    </div>
  );
}
