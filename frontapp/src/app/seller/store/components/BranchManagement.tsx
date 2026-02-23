'use client';

import React, { useState } from 'react';
import { Branch } from '@/lib/types/seller/shop';
import BranchCard from './BranchCard';
import BranchModal from './BranchModal';
import Icon from '@/components/ui/Icon';
import ModalsPortal from '@/components/layout/shared/ModalsPortal';
import { MapPin, Plus, Store } from 'lucide-react';

interface BranchManagementProps {
    branches: Branch[];
    setBranches: (branches: Branch[]) => void;
}

export default function BranchManagement({ branches, setBranches }: BranchManagementProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBranch, setEditingBranch] = useState<Branch | null>(null);

    const handleOpenModal = (branch?: Branch) => {
        setEditingBranch(branch || null);
        setIsModalOpen(true);
    };

    const handleSave = (branchData: Branch) => {
        if (editingBranch) {
            setBranches(branches.map(b => b.id === editingBranch.id ? { ...branchData, id: b.id } : b));
        } else {
            setBranches([...branches, { ...branchData, id: Math.random().toString(36).substr(2, 9) }]);
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('¿Estás seguro de eliminar esta sucursal estratégica?')) {
            setBranches(branches.filter(b => b.id !== id));
        }
    };

    return (
        <div className="bg-white rounded-[3rem] border border-gray-100 shadow-xl overflow-hidden font-industrial">
            <div className="bg-gradient-to-r from-sky-500 via-sky-500 to-sky-400 p-8 flex items-center justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                <div className="flex items-center gap-5 text-white relative z-10">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-inner">
                        <Store className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black tracking-tighter leading-none">Matriz de Sedes</h3>
                        <p className="text-[10px] font-bold text-blue-100 uppercase tracking-[0.2em] mt-1 opacity-80">
                            Gestión de Puntos de Venta y Almacenes Físicos
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="relative z-10 flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-sky-600 font-black text-[10px] shadow-2xl hover:scale-105 transition-all uppercase tracking-widest active:scale-95"
                >
                    <Plus className="w-4 h-4" /> Aperturar Sede
                </button>
            </div>

            <div className="p-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {branches.map(branch => (
                        <div key={branch.id} className="animate-in zoom-in-95 duration-500">
                            <BranchCard
                                branch={branch}
                                onEdit={handleOpenModal}
                                onDelete={handleDelete}
                            />
                        </div>
                    ))}
                    {branches.length === 0 && (
                        <div className="col-span-full py-20 flex flex-col items-center justify-center bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-100 p-12 text-center group">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 border border-gray-100 group-hover:scale-110 transition-transform">
                                <MapPin className="w-8 h-8 text-gray-200" />
                            </div>
                            <h3 className="text-xl font-black text-gray-400 uppercase tracking-widest mb-2 italic">Sin Cobertura de Sedes</h3>
                            <p className="text-[10px] text-gray-400 max-w-xs leading-relaxed uppercase font-black tracking-tighter">Registra tu sede principal para habilitar la trazabilidad logística y retiro en tienda.</p>
                        </div>
                    )}
                </div>
            </div>

            {isModalOpen && (
                <ModalsPortal>
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md animate-fadeIn" onClick={() => setIsModalOpen(false)} />
                        <div className="relative z-10 w-full max-w-xl animate-scaleUp">
                            <BranchModal
                                isOpen={isModalOpen}
                                onClose={() => setIsModalOpen(false)}
                                onSave={handleSave}
                                branch={editingBranch}
                            />
                        </div>
                    </div>
                </ModalsPortal>
            )}
        </div>
    );
}
