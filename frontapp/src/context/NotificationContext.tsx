'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ProactiveNotification, NotificationLevel } from '@/lib/types/notifications';
import { useSyncNotifications } from '@/hooks/useSyncNotifications';

interface NotificationContextType {
    notifications: ProactiveNotification[];
    unreadCount: number;
    loading: boolean;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    addNotification: (notification: Omit<ProactiveNotification, 'id' | 'read' | 'time'>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Movemos la sincronización a un componente hijo externo para evitar recreación en cada render
const SyncManager = () => {
    useSyncNotifications();
    return null;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<ProactiveNotification[]>([
        {
            id: '1',
            level: 'CRITICAL',
            title: 'Baja masiva de stock detectada',
            message: 'El vendedor "ElectroAgro" ha puesto a 0 el stock de 45 productos estrella.',
            time: 'Hace 2 min',
            read: false,
        }
    ]);
    const [loading] = useState(false);

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAsRead = useCallback((id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    }, []);

    const markAllAsRead = useCallback(() => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }, []);

    const addNotification = useCallback((n: Omit<ProactiveNotification, 'id' | 'read' | 'time'>) => {
        const newNotification: ProactiveNotification = {
            ...n,
            id: Date.now().toString(),
            read: false,
            time: 'Ahora mismo'
        };
        setNotifications(prev => [newNotification, ...prev]);

        // Efecto de sonido (opcional pero recomendado para admin panels)
        try {
            const audio = new Audio('/sounds/notification.mp3');
            audio.play().catch(() => { }); // Ignorar si el navegador bloquea el auto-play
        } catch (e) { }
    }, []);

    // Simulación de Polling Real (Cada 30 segundos)
    useEffect(() => {
        const pollNotifications = async () => {
            // Aquí iría la llamada real a: GET /wp-json/lyrium/v1/notifications
            // const newItems = await fetchNotifications();
            // if (newItems.length > 0) processNewItems(newItems);

            console.log("Sincronizando notificaciones en tiempo real...");
        };

        const interval = setInterval(pollNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            loading,
            markAsRead,
            markAllAsRead,
            addNotification
        }}>
            <SyncManager />
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};
