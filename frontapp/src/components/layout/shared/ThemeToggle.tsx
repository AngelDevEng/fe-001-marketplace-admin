'use client';

import { useEffect } from 'react';

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
            <i className="ph-bold ph-sun-dim text-xl text-amber-500"></i>
        </button>
    );
}
