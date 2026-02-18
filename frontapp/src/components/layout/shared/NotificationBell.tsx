'use client';

import { useState } from 'react';
import { NotificationItem } from '@/lib/types/navigation';

export default function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications] = useState<NotificationItem[]>([
        {
            id: '1',
            title: 'Nuevo pedido',
            message: 'Tienes un nuevo pedido #1234',
            time: 'Hace 5 min',
            read: false,
            type: 'info',
        },
        {
            id: '2',
            title: 'Pago recibido',
            message: 'Se ha procesado el pago de $150.00',
            time: 'Hace 1 hora',
            read: false,
            type: 'success',
        },
        {
            id: '3',
            title: 'Stock bajo',
            message: 'Producto "Camiseta Azul" tiene stock bajo',
            time: 'Hace 2 horas',
            read: true,
            type: 'warning',
        },
    ]);

    const unreadCount = notifications.filter(n => !n.read).length;

    const getTypeColor = (type: NotificationItem['type']) => {
        const colors = {
            info: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
            success: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300',
            warning: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300',
            error: 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300',
        };
        return colors[type];
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Notifications"
            >
                <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20">
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="font-semibold text-gray-900 dark:text-white">Notificaciones</h3>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                                    No hay notificaciones
                                </div>
                            ) : (
                                notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${!notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`w-2 h-2 rounded-full mt-2 ${getTypeColor(notification.type)}`} />
                                            <div className="flex-1">
                                                <p className="font-medium text-sm text-gray-900 dark:text-white">
                                                    {notification.title}
                                                </p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                    {notification.message}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                                    {notification.time}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                            <button className="w-full text-sm text-blue-600 dark:text-blue-400 hover:underline">
                                Ver todas las notificaciones
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
