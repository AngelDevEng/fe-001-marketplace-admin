'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_KEY = 'lyrium-theme';
const TRANSITION_DURATION = 400;

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>('light');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const stored = localStorage.getItem(THEME_KEY) as Theme | null;
        const initialTheme = stored || 'light';
        setTheme(initialTheme);
        applyTheme(initialTheme, false);
    }, []);

    const applyTheme = useCallback((newTheme: Theme, withTransition: boolean = true) => {
        const root = document.documentElement;
        
        if (withTransition) {
            root.style.setProperty('--theme-transition', `${TRANSITION_DURATION}ms`);
            setTimeout(() => {
                root.style.removeProperty('--theme-transition');
            }, TRANSITION_DURATION);
        }

        if (newTheme === 'dark') {
            root.classList.add('dark');
            root.setAttribute('data-theme', 'dark');
            root.style.colorScheme = 'dark';
        } else {
            root.classList.remove('dark');
            root.setAttribute('data-theme', 'light');
            root.style.colorScheme = 'light';
        }
    }, []);

    const toggleTheme = useCallback(() => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem(THEME_KEY, newTheme);
        applyTheme(newTheme, true);
    }, [theme, applyTheme]);

    const value = {
        theme,
        toggleTheme,
        isDark: theme === 'dark',
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
