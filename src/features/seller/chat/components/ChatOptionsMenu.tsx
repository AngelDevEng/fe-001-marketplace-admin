import React, { useEffect, useState, useRef } from 'react';
import Icon from '@/components/ui/Icon';

interface ChatOptionsMenuProps {
    onClear: () => void;
    onDelete: () => void;
}

export default function ChatOptionsMenu({ onClear, onDelete }: ChatOptionsMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-3 bg-gray-50 text-gray-400 rounded-2xl hover:bg-gray-100 transition-all active:scale-90"
            >
                <Icon name="MoreVertical" className="font-bold w-5 h-5" />
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-100 rounded-[2rem] shadow-2xl shadow-gray-200 overflow-hidden z-50 animate-fadeInUp">
                    <button
                        onClick={() => { onClear(); setIsOpen(false); }}
                        className="w-full text-left p-4 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                    >
                        <Icon name="Trash2" className="text-gray-400 text-lg w-5 h-5" />
                        <span className="text-xs font-black text-gray-700 uppercase tracking-tight">Vaciar Historial</span>
                    </button>
                    <button
                        onClick={() => { if (confirm('¿Eliminar ticket permanentemente?')) { onDelete(); setIsOpen(false); } }}
                        className="w-full text-left p-4 hover:bg-rose-50 flex items-center gap-3 border-t border-gray-50 transition-colors"
                    >
                        <Icon name="AlertOctagon" className="text-rose-400 text-lg w-5 h-5" />
                        <span className="text-xs font-black text-rose-500 uppercase tracking-tight">Cerrar y Eliminar</span>
                    </button>
                </div>
            )}
        </div>
    );
}
