import React from 'react';
import { ContractStatus, ContractKPI, ContractModality, AuditEvent, ExpiryUrgency } from '@/lib/types/admin/contracts';
import { CheckCircle, AlertTriangle, AlertOctagon, CheckCircle2, Clock, XCircle, Handshake, Cloud } from 'lucide-react';

export const StatusBadge: React.FC<{ status: ContractStatus, large?: boolean }> = ({ status, large }) => {
    const configs = {
        ACTIVE: { label: 'Vigente', class: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
        PENDING: { label: 'En Revisión / Pendiente', class: 'bg-amber-50 text-amber-600 border-amber-100' },
        EXPIRED: { label: 'Vencido / Expirado', class: 'bg-red-50 text-red-600 border-red-100' }
    };
    const config = configs[status] || configs.PENDING;
    return (
        <span className={`${large ? 'px-4 py-1.5 text-xs' : 'px-2 py-0.5 text-[9px]'} rounded-full font-black uppercase tracking-wider border font-industrial ${config.class}`}>
            {config.label}
        </span>
    );
};

export const ExpiryTrafficLight: React.FC<{ urgency?: ExpiryUrgency }> = ({ urgency }) => {
    if (!urgency) return null;
    const configs = {
        normal: { class: 'bg-emerald-500', label: 'Vigente' },
        warning: { class: 'bg-orange-500 animate-pulse', label: 'Vence Pronto' },
        critical: { class: 'bg-red-500', label: 'Vencido' }
    };
    const config = configs[urgency];
    return (
        <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${config.class}`}></div>
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-tighter font-industrial">{config.label}</span>
        </div>
    );
};

export const AuditTimeline: React.FC<{ events?: AuditEvent[] }> = ({ events }) => {
    if (!events || events.length === 0) {
        return (
            <div className="p-10 text-center border-2 border-dashed border-gray-100 rounded-[2rem]">
                <Clock className="w-10 h-10 text-gray-200 mb-2 mx-auto" />
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-industrial">Sin historial registrado</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100 font-industrial">
            {[...events].map((event, idx) => (
                <div key={idx} className="relative pl-10">
                    <div className="absolute left-2.5 top-1 w-3 h-3 bg-indigo-500 rounded-full border-4 border-white shadow-sm -ml-0.5"></div>
                    <div>
                        <p className="text-[10px] font-black text-gray-800 leading-none mb-1 uppercase tracking-tight">{event.action}</p>
                        <div className="flex items-center gap-2">
                            <span className="text-[9px] font-bold text-gray-400 uppercase">{new Date(event.timestamp).toLocaleString()}</span>
                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                            <span className="text-[9px] font-bold text-indigo-500 uppercase">{event.user}</span>
                        </div>
                    </div>
                </div>
            )).reverse()}
        </div>
    );
};

export const ModalityBadge: React.FC<{ modality: ContractModality }> = ({ modality }) => {
    const isVirtual = modality === 'VIRTUAL';
    return (
        <span className={`text-[10px] font-black ${isVirtual ? 'text-blue-600' : 'text-amber-600'} flex items-center gap-1 font-industrial`}>
            {isVirtual ? <Cloud className="w-4 h-4" /> : <Handshake className="w-4 h-4" />}
            {isVirtual ? 'VIRTUAL' : 'PRESENCIAL'}
        </span>
    );
};

export const KpiCard: React.FC<{ kpi: ContractKPI }> = ({ kpi }) => (
    <div className={`bg-white p-4 border-l-4 border-${kpi.color}-500 flex items-center justify-between rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-md font-industrial`}>
        <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{kpi.label}</p>
            <p className="text-2xl font-black text-gray-800 tracking-tighter">{kpi.val}</p>
        </div>
        <div className={`p-3 bg-${kpi.color}-50 text-${kpi.color}-600 rounded-xl`}>
            {kpi.icon === 'Files' && <Clock className="w-6 h-6" />}
            {kpi.icon === 'CheckCircle' && <CheckCircle className="w-6 h-6" />}
            {kpi.icon === 'Hourglass' && <Clock className="w-6 h-6" />}
            {kpi.icon === 'AlertOctagon' && <AlertOctagon className="w-6 h-6" />}
        </div>
    </div>
);
