'use client';

import React from 'react';

interface SalesFiltersProps {
    dateStart: string | null;
    dateEnd: string | null;
    onDateChange: (type: 'dateStart' | 'dateEnd', value: string) => void;
    onClear: () => void;
    onExport: (type: 'excel' | 'pdf') => void;
}

export default function SalesFilters({ dateStart, dateEnd, onDateChange, onClear, onExport }: SalesFiltersProps) {
    return (
        <div className="glass-card p-6">
            <div className="flex flex-col lg:flex-row items-end gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 w-full">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Fecha Inicio</label>
                        <div className="relative">
                            <i className="ph ph-calendar-blank absolute left-4 top-1/2 -translate-y-1/2 text-sky-500 text-lg"></i>
                            <input
                                type="date"
                                value={dateStart || ''}
                                onChange={(e) => onDateChange('dateStart', e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border-none rounded-2xl focus:ring-2 focus:ring-sky-500/20 transition-all font-bold text-gray-700"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Fecha Fin</label>
                        <div className="relative">
                            <i className="ph ph-calendar-blank absolute left-4 top-1/2 -translate-y-1/2 text-sky-500 text-lg"></i>
                            <input
                                type="date"
                                value={dateEnd || ''}
                                onChange={(e) => onDateChange('dateEnd', e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border-none rounded-2xl focus:ring-2 focus:ring-sky-500/20 transition-all font-bold text-gray-700"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 w-full lg:w-auto">
                    <button
                        onClick={onClear}
                        className="p-3 bg-gray-100 text-gray-400 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all flex items-center justify-center min-w-[3rem]"
                        title="Limpiar filtros"
                    >
                        <i className="ph ph-trash text-xl"></i>
                    </button>

                    <div className="flex gap-2">
                        <button
                            onClick={() => onExport('excel')}
                            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-gray-700 font-bold text-xs border border-gray-100 hover:text-sky-600 transition-all shadow-sm"
                        >
                            <i className="ph ph-file-xls text-xl"></i>
                            <span className="hidden sm:inline">Excel</span>
                        </button>
                        <button
                            onClick={() => onExport('pdf')}
                            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-gray-700 font-bold text-xs border border-gray-100 hover:text-sky-600 transition-all shadow-sm"
                        >
                            <i className="ph ph-file-pdf text-xl"></i>
                            <span className="hidden sm:inline">PDF</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
