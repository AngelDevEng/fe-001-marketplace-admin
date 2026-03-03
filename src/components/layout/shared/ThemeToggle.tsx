'use client';

import { useTheme } from 'next-themes';
import Icon from '@/components/ui/Icon';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="p-2.5 rounded-xl">
                <Icon name="Sun" className="w-5 h-5 text-amber-500" />
            </div>
        );
    }

    return (
        <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            title={theme === 'dark' ? 'Modo oscuro' : 'Modo claro'}
        >
            {theme === 'dark' ? (
                <Icon name="Moon" className="w-5 h-5 text-sky-400" />
            ) : (
                <Icon name="Sun" className="w-5 h-5 text-amber-500" />
            )}
        </button>
    );
}
