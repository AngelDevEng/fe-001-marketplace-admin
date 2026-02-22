'use client';

import React from 'react';
import ModuleHeader from '@/components/layout/shared/ModuleHeader';
import { useAdminInvoices } from '@/hooks/useAdminInvoices';
import {
    Receipt, Search, RefreshCw, Download, CheckCircle,
    Clock, XCircle, AlertCircle, User, TrendingUp, FileText
} from 'lucide-react';

// ─── Helpers ────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    ACCEPTED: { label: 'Aceptado', color: 'emerald', icon: <CheckCircle className="w-3.5 h-3.5" /> },
    SENT_WAIT_CDR: { label: 'Pendiente CDR', color: 'amber', icon: <Clock className="w-3.5 h-3.5" /> },
    REJECTED: { label: 'Rechazado', color: 'rose', icon: <XCircle className="w-3.5 h-3.5" /> },
    OBSERVED: { label: 'Observado', color: 'orange', icon: <AlertCircle className="w-3.5 h-3.5" /> },
    DRAFT: { label: 'Borrador', color: 'gray', icon: <FileText className="w-3.5 h-3.5" /> },
};

const statusColorClasses: Record<string, string> = {
    emerald: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border border-amber-100',
    rose: 'bg-rose-50 text-rose-600 border border-rose-100',
    orange: 'bg-orange-50 text-orange-600 border border-orange-100',
    gray: 'bg-gray-50 text-gray-600 border border-gray-100',
};

const cardColorClasses: Record<string, string> = {
    emerald: 'bg-emerald-50 text-emerald-600',
    indigo: 'bg-indigo-50 text-indigo-600',
    amber: 'bg-amber-50 text-amber-600',
    rose: 'bg-rose-50 text-rose-600',
};

function StatusBadge({ status }: { status: string }) {
    const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.DRAFT;
    const colorClasses = statusColorClasses[cfg.color] || statusColorClasses.gray;
    return (
        <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${colorClasses}`}
        >
            {cfg.icon} {cfg.label}
        </span>
    );
}

function formatCurrency(n: number) {
    return `S/ ${n.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`;
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function AdminRapifacInvoicesPage() {
    const { invoices, kpis, isLoading, error, search, setSearch, refresh } = useAdminInvoices();

    // Exportar CSV
    const handleExportCSV = () => {
        const headers = ['ID', 'Vendedor', 'Tipo', 'Serie', 'Número', 'Cliente', 'RUC', 'Monto', 'Estado', 'Fecha'];
        const rows = invoices.map(i => [
            i.id, i.seller_name, i.type, i.series, i.number,
            i.customer_name, i.customer_ruc,
            i.amount.toFixed(2), i.sunat_status,
            new Date(i.emission_date).toLocaleDateString('es-PE')
        ]);
        const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `comprobantes-rapifac-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // ── KPIs ──
    const kpiCards = kpis ? [
        {
            label: 'Total Facturado (SUNAT)',
            value: formatCurrency(kpis.totalFacturado),
            icon: <TrendingUp className="w-5 h-5" />,
            color: 'emerald',
        },
        {
            label: 'Comprobantes Emitidos',
            value: kpis.totalComprobantes.toString(),
            icon: <Receipt className="w-5 h-5" />,
            color: 'indigo',
        },
        {
            label: 'Pendientes CDR',
            value: kpis.pendingCount.toString(),
            icon: <Clock className="w-5 h-5" />,
            color: 'amber',
        },
        {
            label: 'Rechazados / Observados',
            value: kpis.rejectedCount.toString(),
            icon: <XCircle className="w-5 h-5" />,
            color: 'rose',
        },
    ] : [];

    return (
        <div className="px-8 pb-20 space-y-8 animate-fadeIn font-industrial">

            {/* Header + Acciones */}
            <div className="flex justify-between items-start">
                <ModuleHeader
                    title="Comprobantes Electrónicos (Rapifac)"
                    subtitle="Auditoría global de facturas emitidas por todos los vendedores vía Rapifac / SUNAT"
                    icon="Receipt"
                />
                <div className="flex gap-3 pt-6">
                    <button
                        onClick={refresh}
                        title="Actualizar"
                        className="p-3 bg-white border border-gray-100 text-gray-400 rounded-2xl
                            hover:text-emerald-600 hover:border-emerald-100 transition-all shadow-sm"
                    >
                        <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                        onClick={handleExportCSV}
                        className="flex items-center gap-3 px-6 py-3 bg-gray-900 text-white rounded-2xl
                            font-black text-[11px] uppercase tracking-widest
                            hover:bg-indigo-600 transition-all shadow-xl active:scale-95"
                    >
                        <Download className="w-4 h-4" /> Exportar CSV
                    </button>
                </div>
            </div>

            {/* Error Banner */}
            {error && (
                <div className="p-5 bg-rose-50 border border-rose-100 rounded-[2rem] flex items-center gap-4 text-rose-600 font-bold text-sm">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {isLoading
                    ? Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-28 bg-gray-100 animate-pulse rounded-[2.5rem]" />
                    ))
                    : kpiCards.map((card, i) => (
                        <div
                            key={i}
                            className="bg-white p-7 rounded-[2.5rem] border border-gray-100 shadow-sm
                                hover:shadow-md transition-all overflow-hidden"
                        >
                            <div className="flex items-center justify-between mb-3">
                            <div className={`p-3 ${cardColorClasses[card.color]} rounded-2xl`}>
                                    {card.icon}
                                </div>
                                <span className="text-2xl font-black text-gray-900 tracking-tighter">
                                    {card.value}
                                </span>
                            </div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                {card.label}
                            </p>
                        </div>
                    ))}
            </div>

            {/* Buscador */}
            <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    id="admin-invoice-search"
                    type="text"
                    placeholder="Buscar por vendedor, cliente, RUC, serie, número de orden..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 bg-white border border-gray-100 rounded-[2rem]
                        text-sm text-gray-700 placeholder:text-gray-300 focus:outline-none
                        focus:ring-2 focus:ring-indigo-100 shadow-sm transition-all"
                />
            </div>

            {/* Tabla */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                {/* Table header */}
                <div className="px-8 py-5 border-b border-gray-50 flex items-center justify-between">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">
                        Listado de Comprobantes
                    </h3>
                    {!isLoading && (
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                            {invoices.length} registros
                        </span>
                    )}
                </div>

                {isLoading ? (
                    <div className="p-20 flex flex-col items-center gap-6">
                        <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-500 rounded-full animate-spin" />
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] animate-pulse">
                            Cargando comprobantes de Rapifac…
                        </p>
                    </div>
                ) : invoices.length === 0 ? (
                    <div className="p-20 flex flex-col items-center gap-4 text-gray-300">
                        <Receipt className="w-16 h-16" />
                        <p className="text-sm font-black uppercase tracking-widest">
                            {search ? 'Sin resultados para esa búsqueda' : 'No hay comprobantes emitidos aún'}
                        </p>
                        <p className="text-xs text-gray-400">
                            {!search && 'Cuando un vendedor emita una factura aparecerá aquí en tiempo real.'}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-50">
                                    {['Vendedor', 'Tipo', 'Serie / N°', 'Cliente / RUC', 'Monto', 'Estado', 'Fecha'].map(h => (
                                        <th
                                            key={h}
                                            className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest"
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {invoices.map((inv) => (
                                    <tr
                                        key={inv.id}
                                        className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group"
                                    >
                                        {/* Vendedor */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 bg-indigo-50 rounded-full flex items-center justify-center">
                                                    <User className="w-3.5 h-3.5 text-indigo-500" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black text-gray-700">{inv.seller_name}</p>
                                                    <p className="text-[10px] font-medium text-gray-400">{inv.seller_id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        {/* Tipo */}
                                        <td className="px-6 py-4">
                                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-wider">
                                                {inv.type}
                                            </span>
                                        </td>
                                        {/* Serie / N° */}
                                        <td className="px-6 py-4">
                                            <p className="text-xs font-bold text-gray-700">{inv.series}-{inv.number}</p>
                                            <p className="text-[10px] text-gray-400">{inv.order_id}</p>
                                        </td>
                                        {/* Cliente */}
                                        <td className="px-6 py-4">
                                            <p className="text-xs font-bold text-gray-700">{inv.customer_name}</p>
                                            <p className="text-[10px] text-gray-400">{inv.customer_ruc}</p>
                                        </td>
                                        {/* Monto */}
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-black text-gray-900 tracking-tight">
                                                {formatCurrency(inv.amount)}
                                            </span>
                                        </td>
                                        {/* Estado */}
                                        <td className="px-6 py-4">
                                            <StatusBadge status={inv.sunat_status} />
                                        </td>
                                        {/* Fecha */}
                                        <td className="px-6 py-4">
                                            <p className="text-xs font-medium text-gray-500">
                                                {new Date(inv.emission_date).toLocaleDateString('es-PE', {
                                                    day: '2-digit', month: 'short', year: 'numeric'
                                                })}
                                            </p>
                                            <p className="text-[10px] text-gray-400">
                                                {new Date(inv.emission_date).toLocaleTimeString('es-PE', {
                                                    hour: '2-digit', minute: '2-digit'
                                                })}
                                            </p>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Footer informativo */}
            <div className="bg-indigo-900 p-8 rounded-[2.5rem] text-white flex items-center gap-6 relative overflow-hidden shadow-2xl shadow-indigo-200">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full -mr-32 -mt-32 blur-3xl" />
                <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md">
                    <Receipt className="w-8 h-8 text-indigo-300" />
                </div>
                <div className="flex-1">
                    <h4 className="text-sm font-black uppercase tracking-widest mb-1">
                        Auditoría en Tiempo Real
                    </h4>
                    <p className="text-xs text-indigo-200 font-medium">
                        Cada factura emitida por un vendedor queda registrada automáticamente en este panel.
                        Los datos provienen del store compartido de la API interna de Rapifac
                        (<code className="bg-white/10 px-1.5 py-0.5 rounded font-mono text-[10px]">GET /api/rapifac/invoices</code>).
                    </p>
                </div>
            </div>
        </div>
    );
}
