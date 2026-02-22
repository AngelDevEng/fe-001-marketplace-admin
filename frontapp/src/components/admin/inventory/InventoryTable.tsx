import React from 'react';
import { InventoryItem, ItemStatus } from '@/lib/types/admin/inventory';
import { Globe, AlertTriangle, CheckCircle2, XCircle, MoreVertical, Edit2, History } from 'lucide-react';

const StatusBadge: React.FC<{ status: ItemStatus }> = ({ status }) => {
    const config: Record<ItemStatus, { label: string, color: string, icon: any }> = {
        'IN_STOCK': { label: 'En Stock', color: 'emerald', icon: <CheckCircle2 className="w-3 h-3" /> },
        'LOW_STOCK': { label: 'Bajo Stock', color: 'amber', icon: <AlertTriangle className="w-3 h-3" /> },
        'OUT_OF_STOCK': { label: 'Agotado', color: 'rose', icon: <XCircle className="w-3 h-3" /> },
        'ACTIVE': { label: 'Activo', color: 'blue', icon: <Globe className="w-3 h-3" /> },
        'INACTIVE': { label: 'Inactivo', color: 'gray', icon: <XCircle className="w-3 h-3" /> },
    };

    const { label, color, icon } = config[status] || config['INACTIVE'];

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-${color}-50 text-${color}-600 border border-${color}-100`}>
            {icon} {label}
        </span>
    );
};

export const InventoryTable: React.FC<{
    items: InventoryItem[],
    onUpdateStock: (id: string, newStock: number) => void,
    onEdit?: (item: InventoryItem) => void,
    onViewHistory?: (item: InventoryItem) => void
}> = ({ items, onUpdateStock, onEdit, onViewHistory }) => {
    return (
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden font-industrial">
            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left font-industrial">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            <th className="px-8 py-5">Item / SKU</th>
                            <th className="px-8 py-5">Vendedor (Sujeto)</th>
                            <th className="px-8 py-5">Tipo</th>
                            <th className="px-8 py-5">Categoría</th>
                            <th className="px-8 py-5 text-right">Precio</th>
                            <th className="px-8 py-5 text-center">Stock / Disp.</th>
                            <th className="px-8 py-5">Estado Operativo</th>
                            <th className="px-8 py-5 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {items.map(item => (
                            <tr key={item.id} className="hover:bg-gray-50/50 transition-all group">
                                <td className="px-8 py-6">
                                    <p className="text-xs font-black text-gray-900 uppercase group-hover:text-blue-600 transition-colors">{item.name}</p>
                                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-1">{item.sku || 'N/A'}</p>
                                </td>
                                <td className="px-8 py-6">
                                    <p className="text-xs font-bold text-gray-700 uppercase">{item.seller.name}</p>
                                    <p className="text-[9px] text-gray-400 font-bold">ID: {item.seller.id}</p>
                                </td>
                                <td className="px-8 py-6">
                                    <span className={`px-2 py-1 rounded text-[8px] font-black uppercase ${item.type === 'PRODUCT' ? 'bg-indigo-50 text-indigo-600' : 'bg-orange-50 text-orange-600'}`}>
                                        {item.type === 'PRODUCT' ? 'Producto' : 'Servicio'}
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-[10px] font-bold text-gray-500 uppercase">{item.category}</td>
                                <td className="px-8 py-6 text-right">
                                    <span className="text-xs font-black text-gray-900 tracking-tighter">S/ {item.price.toLocaleString()}</span>
                                </td>
                                <td className="px-8 py-6 text-center">
                                    <div className="flex flex-col items-center gap-1">
                                        <span className={`text-xs font-black ${item.stock < 5 ? 'text-rose-500' : 'text-gray-900'}`}>{item.stock}</span>
                                        <div className="flex gap-1">
                                            <button
                                                onClick={() => onUpdateStock(item.id, Math.max(0, item.stock - 1))}
                                                className="w-5 h-5 flex items-center justify-center bg-gray-100 hover:bg-rose-100 text-gray-400 hover:text-rose-600 rounded-md text-[8px] transition-all active:scale-90"
                                            >-</button>
                                            <button
                                                onClick={() => onUpdateStock(item.id, item.stock + 1)}
                                                className="w-5 h-5 flex items-center justify-center bg-gray-100 hover:bg-emerald-100 text-gray-400 hover:text-emerald-600 rounded-md text-[8px] transition-all active:scale-90"
                                            >+</button>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <StatusBadge status={item.status} />
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => onEdit?.(item)}
                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all active:scale-90"
                                            title="Editar Producto"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => onViewHistory?.(item)}
                                            className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all active:scale-90"
                                            title="Ver Historial"
                                        >
                                            <History className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all active:scale-90">
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
