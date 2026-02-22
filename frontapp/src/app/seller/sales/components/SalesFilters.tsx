'use client';

import React from 'react';
import Icon from '@/components/ui/Icon';

interface SalesFiltersProps {
    dateStart: string | null;
    dateEnd: string | null;
    onDateChange: (type: 'dateStart' | 'dateEnd', value: string) => void;
    onClear: () => void;
    onExport: (type: 'excel' | 'pdf') => void;
}

export default function SalesFilters({ dateStart, dateEnd, onDateChange, onClear, onExport }: SalesFiltersProps) {
    return (
        <div className="glass-card bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm mt-8">
            <div className="flex flex-col lg:flex-row items-end gap-6 justify-between">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 w-full max-w-2xl">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Fecha Inicio</label>
                        <div className="relative">
                            <Icon name="Calendar" className="absolute left-5 top-1/2 -translate-y-1/2 text-sky-500 w-5 h-5" />
                            <input
                                type="date"
                                value={dateStart || ''}
                                onChange={(e) => onDateChange('dateStart', e.target.value)}
                                className="w-full pl-14 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-sky-500/20 transition-all font-bold text-gray-700 outline-none shadow-inner"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Fecha Fin</label>
                        <div className="relative">
                            <Icon name="Calendar" className="absolute left-5 top-1/2 -translate-y-1/2 text-sky-500 w-5 h-5" />
                            <input
                                type="date"
                                value={dateEnd || ''}
                                onChange={(e) => onDateChange('dateEnd', e.target.value)}
                                className="w-full pl-14 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-sky-500/20 transition-all font-bold text-gray-700 outline-none shadow-inner"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 w-full lg:w-auto">
                    <button
                        onClick={onClear}
                        className="w-14 h-14 bg-gray-50 text-gray-400 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all flex items-center justify-center border border-gray-100 shadow-sm active:scale-95"
                        title="Limpiar filtros"
                    >
                        <Icon name="Trash2" className="w-5 h-5" />
                    </button>

                    <div className="flex gap-3">
                        <button
                            onClick={() => onExport('excel')}
                            className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-emerald-50 text-emerald-600 font-black text-[11px] border border-emerald-100 hover:bg-emerald-500 hover:text-white transition-all shadow-sm uppercase tracking-widest active:scale-95"
                        >
                            <Icon name="FileSpreadsheet" className="w-5 h-5" />
                            <span className="hidden sm:inline">Excel</span>
                        </button>
                        <button
                            onClick={() => onExport('pdf')}
                            className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-rose-50 text-rose-600 font-black text-[11px] border border-rose-100 hover:bg-rose-500 hover:text-white transition-all shadow-sm uppercase tracking-widest active:scale-95"
                        >
                            <Icon name="FileText" className="w-5 h-5" />
                            <span className="hidden sm:inline">PDF</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
