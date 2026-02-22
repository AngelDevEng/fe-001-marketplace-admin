'use client';

import { useEffect } from 'react';
import Icon from '@/components/ui/Icon';

export default function ThemeToggle() {
    // Forzar modo claro siempre — eliminar cualquier vestigio de dark mode
    useEffect(() => {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    }, []);

    return (
        <button
            className="p-2.5 rounded-xl hover:bg-gray-100 transition-colors"
            aria-label="Tema claro activo"
            title="Modo claro (forzado)"
        >
            <Icon name="Sun" className="w-5 h-5 text-amber-500" />
        </button>
    );
}
