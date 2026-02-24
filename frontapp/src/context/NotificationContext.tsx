'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { ProactiveNotification, NotificationLevel } from '@/lib/types/notifications';
import { useSyncNotifications } from '@/hooks/useSyncNotifications';
import { useAuth } from './AuthContext';

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
    const { user } = useAuth();
    const role = user?.role;

    const [notifications, setNotifications] = useState<ProactiveNotification[]>([]);
    const [loading] = useState(false);

    useEffect(() => {
        const mockNotifications: ProactiveNotification[] = [];
        
        if (role === 'administrator') {
            mockNotifications.push(
                {
                    id: '1',
                    level: 'CRITICAL',
                    title: 'Baja masiva de stock detectada',
                    message: 'El vendedor "ElectroAgro" ha puesto a 0 el stock de 45 productos estrella.',
                    time: 'Hace 2 min',
                    read: false,
                },
                {
                    id: '2',
                    level: 'SECURITY',
                    title: 'Nuevo vendedor requiere verificación',
                    message: 'Tienda "TechPeru" ha solicitado verificación de documentos.',
                    time: 'Hace 15 min',
                    read: false,
                },
                {
                    id: '3',
                    level: 'OPERATIONAL',
                    title: 'Retiro pendiente de aprobación',
                    message: 'El vendedor "Fisio Center" ha solicitado un retiro de S/ 2,500.',
                    time: 'Hace 1 hora',
                    read: true,
                }
            );
        } else if (role === 'seller') {
            mockNotifications.push(
                {
                    id: '1',
                    level: 'CRITICAL',
                    title: 'Nuevo pedido recibido',
                    message: 'El cliente Carlos M. ha realizado un pedido por S/ 450.00',
                    time: 'Hace 5 min',
                    read: false,
                },
                {
                    id: '2',
                    level: 'OPERATIONAL',
                    title: 'Stock bajo en productos',
                    message: '5 productos de tu catálogo tienen stock menor a 10 unidades.',
                    time: 'Hace 30 min',
                    read: false,
                },
                {
                    id: '3',
                    level: 'OPERATIONAL',
                    title: 'Factura emitida exitosamente',
                    message: 'La factura N° 001-0000125 ha sido aceptada por SUNAT.',
                    time: 'Hace 2 horas',
                    read: true,
                }
            );
        } else if (role === 'logistics_operator') {
            mockNotifications.push(
                {
                    id: '1',
                    level: 'CRITICAL',
                    title: 'Nuevo envío asignado',
                    message: 'Tienes 3 nuevos envíos pendientes de recojo en "ElectroAgro".',
                    time: 'Hace 3 min',
                    read: false,
                },
                {
                    id: '2',
                    level: 'OPERATIONAL',
                    title: 'Excepción de entrega',
                    message: 'El cliente en Jr. Amazonas 234 no fue encontrado. Teléfono no responde.',
                    time: 'Hace 45 min',
                    read: false,
                },
                {
                    id: '3',
                    level: 'OPERATIONAL',
                    title: 'Envío entregado',
                    message: 'El pedido #45892 fue entregado exitosamente en Lima Centro.',
                    time: 'Hace 1 hora',
                    read: true,
                }
            );
        }

        setNotifications(mockNotifications);
    }, [role]);

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
