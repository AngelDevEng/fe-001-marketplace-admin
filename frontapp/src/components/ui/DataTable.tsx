'use client';

import React from 'react';
import Icon from './Icon';
import BaseLoading from './BaseLoading';
import ErrorState from './ErrorState';
import BaseEmptyState from './BaseEmptyState';

export interface Column<T> {
    key: string;
    header: string;
    render?: (item: T) => React.ReactNode;
    className?: string;
    align?: 'left' | 'center' | 'right';
}

export interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    loading?: boolean;
    error?: string | null;
    loadingMessage?: string;
    errorTitle?: string;
    emptyTitle?: string;
    emptyDescription?: string;
    emptyIcon?: string;
    emptySuggestion?: string;
    onRetry?: () => void;
    onRowClick?: (item: T) => void;
    keyField: keyof T;
    countLabel?: string;
}

export default function DataTable<T>({
    data,
    columns,
    loading = false,
    error = null,
    loadingMessage = 'Cargando datos...',
    errorTitle = 'Error',
    emptyTitle = 'Sin datos',
    emptyDescription = 'No hay elementos para mostrar',
    emptyIcon = 'Inbox',
    emptySuggestion,
    onRetry,
    onRowClick,
    keyField,
    countLabel = 'Items'
}: DataTableProps<T>) {
    if (loading) {
        return <BaseLoading message={loadingMessage} variant="card" />;
    }

    if (error) {
        return (
            <ErrorState
                title={errorTitle}
                message={error}
                icon="AlertCircle"
                onRetry={onRetry}
            />
        );
    }

    if (data.length === 0) {
        return (
            <BaseEmptyState
                title={emptyTitle}
                description={emptyDescription}
                icon={emptyIcon}
                suggestion={emptySuggestion}
            />
        );
    }

    const getAlignClass = (align?: 'left' | 'center' | 'right') => {
        switch (align) {
            case 'center': return 'text-center';
            case 'right': return 'text-right';
            default: return 'text-left';
        }
    };

    return (
        <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm transition-all hover:shadow-md">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50">
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    className={`px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 ${getAlignClass(column.align)} ${column.className || ''}`}
                                >
                                    {column.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {data.map((item) => (
                            <tr
                                key={String(item[keyField])}
                                className={`group hover:bg-gray-50/50 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                                onClick={() => onRowClick?.(item)}
                            >
                                {columns.map((column) => (
                                    <td
                                        key={column.key}
                                        className={`px-8 py-5 ${getAlignClass(column.align)} ${column.className || ''}`}
                                    >
                                        {column.render
                                            ? column.render(item)
                                            : String((item as Record<string, unknown>)[column.key] ?? '')}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
