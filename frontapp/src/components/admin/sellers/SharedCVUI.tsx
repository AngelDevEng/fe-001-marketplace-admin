import React from 'react';

export const CVStatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const map: Record<string, string> = {
        'activa': 'bg-emerald-400 text-white border-transparent',
        'ACTIVE': 'bg-emerald-400 text-white border-transparent',
        'suspendida': 'bg-orange-400 text-white border-transparent',
        'SUSPENDED': 'bg-orange-400 text-white border-transparent',
        'baja_logica': 'bg-red-500 text-white border-transparent',
        'REJECTED': 'bg-red-500 text-white border-transparent',
        'aprobado': 'bg-emerald-400 text-white border-transparent',
        'APPROVED': 'bg-emerald-400 text-white border-transparent',
        'en_espera': 'bg-lime-400 text-white border-transparent',
        'PENDING': 'bg-lime-400 text-white border-transparent',
        'rechazado': 'bg-red-500 text-white border-transparent',
    };

    return (
        <span className={`px-3 py-1 rounded-lg text-[10px] font-black border uppercase ${map[status] || 'bg-gray-100 text-gray-400'}`}>
            {status}
        </span>
    );
};

export const CVCard: React.FC<{ children: React.ReactNode, className?: string, border?: string }> = ({ children, className = "", border = "" }) => (
    <div className={`overflow-hidden bg-white/40 backdrop-blur-md border ${border || 'border-gray-100/50'} rounded-[2rem] ${className}`}>
        {children}
    </div>
);
