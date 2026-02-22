'use client';

import React, { useState } from 'react';
import ModuleHeader from '@/components/layout/shared/ModuleHeader';
import { useInventory } from '@/hooks/useInventory';
import { InventoryTable } from '@/components/admin/inventory/InventoryTable';
import { Search, Download, Package, Activity, AlertCircle, ShoppingBag, X, Check, Eye } from 'lucide-react';
import { InventoryItem } from '@/lib/types/admin/inventory';

const colorClasses: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    amber: 'bg-amber-50 text-amber-600',
    rose: 'bg-rose-50 text-rose-600',
    emerald: 'bg-emerald-50 text-emerald-600',
};

export default function InventoryPage() {
    const { items, loading, error, stats, sellers, filters, setFilters, updateStock } = useInventory();

    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
    const [historyItem, setHistoryItem] = useState<InventoryItem | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);

    const handleExport = () => {
        if (!items.length) return;

        const headers = ['ID', 'Nombre', 'SKU', 'Tipo', 'Vendedor', 'Categoria', 'Precio', 'Stock', 'Estado'];
        const csvContent = [
            headers.join(','),
            ...items.map(i => [
                i.id,
                `"${i.name}"`,
                i.sku,
                i.type,
                `"${i.seller.name}"`,
                `"${i.category}"`,
                i.price,
                i.stock,
                i.status
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `inventario-maestro-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleQuickStockUpdate = async (id: string, newStock: number) => {
        setIsUpdating(true);
        await updateStock(id, newStock);
        setIsUpdating(false);
    };

    return (
        <div className="px-8 pb-20 space-y-8 animate-fadeIn font-industrial relative">
            {isUpdating && (
                <div className="fixed top-24 right-10 z-[100] animate-in slide-in-from-right-8 fade-in">
                    <div className="bg-gray-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-white/10">
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest italic">Sincronizando WP...</span>
                    </div>
                </div>
            )}

            <ModuleHeader
                title="Gestión de Inventario"
                subtitle="Control de Stock de Productos y Oferta de Servicios por Vendedor"
                icon="Package"
                actions={
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-3 px-6 py-3 bg-gray-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl active:scale-95"
                    >
                        <Download className="w-4 h-4" /> Exportar Inventario
                    </button>
                }
            />

            {error && (
                <div className="p-6 bg-rose-50 border border-rose-100 rounded-[2rem] flex items-center gap-4 text-rose-600 font-bold text-sm">
                    <AlertCircle className="w-5 h-5" />
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Items Totales', val: stats.totalItems, icon: <Package />, color: 'blue' },
                    { label: 'Bajo Stock', val: stats.lowStockCount, icon: <AlertCircle />, color: 'amber' },
                    { label: 'Sin Existencias', val: stats.outOfStockCount, icon: <Activity />, color: 'rose' },
                    { label: 'Servicios Activos', val: stats.activeServices, icon: <ShoppingBag />, color: 'emerald' }
                ].map((s, i) => (
                    <div key={i} className={`bg-white p-7 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all ${loading ? 'animate-pulse' : ''}`}>
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 ${colorClasses[s.color]} rounded-2xl`}>
                                {s.icon}
                            </div>
                            <span className="text-3xl font-black text-gray-900 tracking-tighter">
                                {loading ? '...' : s.val}
                            </span>
                        </div>
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-gray-600 transition-colors uppercase italic font-black">{s.label}</h3>
                    </div>
                ))}
            </div>

            <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <div className="flex flex-col lg:flex-row gap-4 items-end">
                    <div className="flex-1 space-y-2 w-full">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Búsqueda Inteligente</label>
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Nombre del producto, servicio o SKU..."
                                value={filters.search}
                                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500/20 font-industrial disabled:opacity-50"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="w-full lg:w-48 space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Vendedor</label>
                        <select
                            value={filters.seller}
                            onChange={(e) => setFilters(prev => ({ ...prev, seller: e.target.value }))}
                            className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-[10px] font-black uppercase text-gray-700 font-industrial cursor-pointer disabled:opacity-50"
                            disabled={loading}
                        >
                            <option value="ALL">Todos los Vendedores</option>
                            {sellers.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="w-full lg:w-48 space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tipo</label>
                        <select
                            value={filters.type}
                            onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value as any }))}
                            className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-[10px] font-black uppercase text-gray-700 font-industrial cursor-pointer disabled:opacity-50"
                            disabled={loading}
                        >
                            <option value="ALL">TODOS</option>
                            <option value="PRODUCT">PRODUCTOS</option>
                            <option value="SERVICE">SERVICIOS</option>
                        </select>
                    </div>

                    <div className="w-full lg:w-48 space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Estado</label>
                        <select
                            value={filters.status}
                            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as any }))}
                            className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-[10px] font-black uppercase text-gray-700 font-industrial cursor-pointer disabled:opacity-50"
                            disabled={loading}
                        >
                            <option value="ALL">TODOS</option>
                            <option value="IN_STOCK">EN STOCK</option>
                            <option value="LOW_STOCK">BAJO STOCK</option>
                            <option value="OUT_OF_STOCK">AGOTADO</option>
                            <option value="ACTIVE">ACTIVO</option>
                        </select>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="min-h-[400px] flex flex-col items-center justify-center gap-4 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm transition-all animate-pulse">
                    <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sincronizando Inventario...</p>
                </div>
            ) : (
                <InventoryTable
                    items={items}
                    onUpdateStock={handleQuickStockUpdate}
                    onEdit={(item) => setSelectedItem(item)}
                    onViewHistory={(item) => setHistoryItem(item)}
                />
            )}

            {selectedItem && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setSelectedItem(null)} />
                    <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative overflow-hidden p-10 animate-in zoom-in duration-300">
                        <div className="h-2 w-full absolute top-0 left-0 bg-indigo-600"></div>
                        <h3 className="text-2xl font-black text-gray-900 tracking-tighter uppercase italic mb-2">Editor de Inventario</h3>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-8">Ref: {selectedItem.sku} | ID: {selectedItem.id}</p>

                        <div className="space-y-6">
                            <div className="p-5 bg-gray-50 rounded-2xl">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Nombre Comercial</p>
                                <p className="text-md font-black text-gray-800 uppercase italic opacity-60 underline decoration-indigo-200">{selectedItem.name}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Stock Actual</label>
                                    <input
                                        type="number"
                                        defaultValue={selectedItem.stock}
                                        id="edit-stock"
                                        className="w-full p-4 bg-gray-50 border-none rounded-xl text-lg font-black text-indigo-600"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Precio Unitario (S/)</label>
                                    <input
                                        type="number"
                                        defaultValue={selectedItem.price}
                                        id="edit-price"
                                        className="w-full p-4 bg-gray-50 border-none rounded-xl text-lg font-black text-gray-900"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    onClick={async () => {
                                        const ns = (document.getElementById('edit-stock') as HTMLInputElement).value;
                                        handleQuickStockUpdate(selectedItem.id, parseInt(ns));
                                        setSelectedItem(null);
                                    }}
                                    className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl flex items-center justify-center gap-2"
                                >
                                    <Check className="w-4 h-4" /> Guardar Cambios Real
                                </button>
                                <button
                                    onClick={() => setSelectedItem(null)}
                                    className="px-8 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-gray-200 transition-all"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {historyItem && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setHistoryItem(null)} />
                    <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl relative overflow-hidden p-10 animate-in zoom-in duration-300">
                        <div className="h-2 w-full absolute top-0 left-0 bg-emerald-500"></div>
                        <h3 className="text-2xl font-black text-gray-900 tracking-tighter uppercase italic mb-2">Trazabilidad de Movimientos</h3>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-8">Auditoría Forensic: {historyItem.name}</p>

                        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex items-center gap-4 p-4 border-l-4 border-emerald-400 bg-gray-50 rounded-r-2xl">
                                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center">
                                        {i === 1 ? <Activity className="w-4 h-4 text-emerald-600" /> : <Eye className="w-4 h-4 text-blue-600" />}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <p className="text-[10px] font-black text-gray-900 uppercase">Actualización de Stock</p>
                                            <p className="text-[9px] text-gray-400 font-bold">21 FEB 2026 - 10:45 AM</p>
                                        </div>
                                        <p className="text-[11px] text-gray-500 mt-1 font-medium">Cambio manual por Administrador: {i === 1 ? '50 -> 49' : 'Entrada de mercadería (+10)'}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => setHistoryItem(null)}
                            className="w-full mt-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest"
                        >
                            Cerrar Historial
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
