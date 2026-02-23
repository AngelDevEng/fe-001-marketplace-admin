'use client';

import { useState } from 'react';
import { Bell, AlertTriangle, ShieldAlert, Activity, Check } from 'lucide-react';
import { useNotifications } from '@/context/NotificationContext';
import { ProactiveNotification } from '@/lib/types/notifications';
import { useAuth } from '@/context/AuthContext';

export default function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false);
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
    const { user } = useAuth();

    const getPanelInfo = () => {
        switch (user?.role) {
            case 'administrator':
                return { title: 'Centro de Monitoreo', subtitle: 'Sistemas de Alerta Temprana', cta: 'Abrir Consola Forense de Eventos' };
            case 'seller':
                return { title: 'Notificaciones de Mi Tienda', subtitle: 'Actualizaciones en tiempo real', cta: 'Ver todas mis notificaciones' };
            case 'logistics_operator':
                return { title: 'Panel de Envíos', subtitle: 'Seguimiento de entregas', cta: 'Ir a Mis Envíos' };
            default:
                return { title: 'Centro de Monitoreo', subtitle: 'Sistemas de Alerta Temprana', cta: 'Abrir Consola Forense de Eventos' };
        }
    };

    const panelInfo = getPanelInfo();

    const getLevelUI = (level: ProactiveNotification['level']) => {
        switch (level) {
            case 'CRITICAL':
                return { color: 'bg-red-50 border-red-200', text: 'text-red-600', icon: <AlertTriangle className="w-5 h-5 text-red-500" /> };
            case 'SECURITY':
                return { color: 'bg-orange-50 border-orange-200', text: 'text-orange-600', icon: <ShieldAlert className="w-5 h-5 text-orange-500" /> };
            case 'OPERATIONAL':
                return { color: 'bg-blue-50 border-blue-200', text: 'text-blue-600', icon: <Activity className="w-5 h-5 text-blue-500" /> };
        }
    };

    return (
        <div className="relative font-industrial">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`relative p-2.5 rounded-xl transition-all ${isOpen ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500 hover:bg-gray-100'}`}
                aria-label="Centro de Notificaciones"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 mt-3 w-[400px] bg-white rounded-[2rem] shadow-2xl border border-gray-100 z-50 overflow-hidden animate-fadeIn">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/80 flex justify-between items-center">
                            <div>
                                <h3 className="font-black text-xs uppercase tracking-widest text-gray-800">{panelInfo.title}</h3>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{panelInfo.subtitle}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                {unreadCount > 0 && (
                                    <button
                                        onClick={markAllAsRead}
                                        className="text-[9px] font-black uppercase text-indigo-500 hover:bg-indigo-50 px-2 py-1 rounded-lg transition-all"
                                    >
                                        Limpiar Todo
                                    </button>
                                )}
                                <span className="px-2 py-1 bg-gray-200 text-gray-600 text-[10px] font-black rounded-lg uppercase">{unreadCount} no leídas</span>
                            </div>
                        </div>
                        <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-gray-400 text-xs font-bold uppercase tracking-widest">
                                    No hay alertas activas
                                </div>
                            ) : (
                                <div className="p-2 space-y-2">
                                    {notifications.map((notification) => {
                                        const ui = getLevelUI(notification.level);
                                        return (
                                            <div
                                                key={notification.id}
                                                className={`p-4 rounded-2xl border transition-all ${!notification.read ? ui.color : 'bg-white border-transparent opacity-60'}`}
                                            >
                                                <div className="flex gap-4">
                                                    <div className="flex-shrink-0 mt-1">
                                                        {ui.icon}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-start gap-2">
                                                            <p className={`font-black text-[11px] uppercase tracking-wide leading-tight ${ui.text}`}>
                                                                {notification.title}
                                                            </p>
                                                            {!notification.read && (
                                                                <button onClick={() => markAsRead(notification.id)} className="text-gray-400 hover:text-indigo-500 p-1 bg-white rounded-md shadow-sm border border-gray-100 transition-colors" title="Marcar leída">
                                                                    <Check className="w-3 h-3" />
                                                                </button>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-gray-600 font-medium mt-1 leading-snug">
                                                            {notification.message}
                                                        </p>
                                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2 flex items-center gap-2">
                                                            {notification.time} • Nivel: {notification.level}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                        <div className="p-4 border-t border-gray-100 bg-gray-50/50 text-center">
                            <button className="text-[10px] font-black uppercase tracking-widest text-indigo-500 hover:text-indigo-700 transition-colors">
                                {panelInfo.cta}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
