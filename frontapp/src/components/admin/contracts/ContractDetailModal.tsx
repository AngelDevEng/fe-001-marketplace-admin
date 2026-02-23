import React, { useState, useEffect } from 'react';
import { StatusBadge, AuditTimeline } from './ContractsUIComponents';
import { Contract } from '@/lib/types/admin/contracts';
import { FileText, FolderOpen, CheckCircle, XCircle } from 'lucide-react';
import BaseButton from '@/components/ui/BaseButton';

interface ContractDetailModalProps {
    contract: Contract;
    onClose: () => void;
    onValidate: (id: string, data: Partial<Contract>) => void;
    onInvalidate: (id: string, data: Partial<Contract>) => void;
}

export const ContractDetailModal: React.FC<ContractDetailModalProps> = ({ contract, onClose, onValidate, onInvalidate }) => {
    const [formState, setFormState] = useState<Partial<Contract>>({});

    useEffect(() => {
        if (contract) {
            setFormState({ ...contract });
        }
    }, [contract]);

    return (
        <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col font-industrial animate-scaleUp">
            {/* Header */}
            <div className="px-10 py-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-white border border-gray-100 rounded-[1.5rem] shadow-sm flex items-center justify-center text-indigo-600">
                        <FileText className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-gray-900 tracking-tighter uppercase italic">Expediente Legal</h3>
                        <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mt-1">Contrato Identificador: {contract.id}</p>
                    </div>
                </div>
                <StatusBadge status={contract.status} large />
            </div>

            <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10 overflow-y-auto custom-scrollbar max-h-[60vh]">
                {/* Info Legal */}
                <div className="space-y-6">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-3">Metadata Estructural (RF-16)</h4>

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Razón Social</label>
                            <input
                                type="text"
                                value={formState.company || ''}
                                onChange={(e) => setFormState(p => ({ ...p, company: e.target.value }))}
                                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-xs font-black text-gray-800 focus:ring-2 focus:ring-indigo-500/10 transition-all font-industrial"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-gray-400 uppercase ml-1">RUC Fiscal</label>
                                <input
                                    type="text"
                                    value={formState.ruc || ''}
                                    onChange={(e) => setFormState(p => ({ ...p, ruc: e.target.value }))}
                                    className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-xs font-black text-gray-800 focus:ring-2 focus:ring-indigo-500/10 transition-all font-industrial"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Representante</label>
                                <input
                                    type="text"
                                    value={formState.rep || ''}
                                    onChange={(e) => setFormState(p => ({ ...p, rep: e.target.value }))}
                                    className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-xs font-black text-gray-800 focus:ring-2 focus:ring-indigo-500/10 transition-all font-industrial"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Fecha de Firma</label>
                                <input
                                    type="date"
                                    value={formState.start || ''}
                                    onChange={(e) => setFormState(p => ({ ...p, start: e.target.value }))}
                                    className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-xs font-black text-gray-800 focus:ring-2 focus:ring-indigo-500/10 transition-all font-industrial uppercase"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Vencimiento</label>
                                <input
                                    type="date"
                                    value={formState.end || ''}
                                    onChange={(e) => setFormState(p => ({ ...p, end: e.target.value }))}
                                    className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-xs font-black text-gray-800 focus:ring-2 focus:ring-indigo-500/10 transition-all font-industrial uppercase"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="p-5 bg-indigo-50/30 rounded-2xl border border-indigo-100 flex gap-4 items-center">
                        <FolderOpen className="w-8 h-8 text-indigo-500 opacity-40 shrink-0" />
                        <div>
                            <p className="text-[8px] font-black text-indigo-400 uppercase mb-0.5">Ruta en Nodo de Almacenamiento</p>
                            <p className="text-[10px] font-black text-indigo-900 truncate max-w-[180px]">{formState.storage_path || 'pendiente_de_carga.pdf'}</p>
                        </div>
                    </div>
                </div>

                {/* Acciones & Auditoría */}
                <div className="space-y-6 flex flex-col">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-3">Track de Auditoría</h4>

                    <div className="flex-1 min-h-[200px]">
                        <AuditTimeline events={contract.auditTrail} />
                    </div>

                    {contract.status === 'PENDING' && (
                        <div className="space-y-3 pt-6 border-t border-gray-50">
                            <BaseButton
                                onClick={() => onValidate(contract.id, formState)}
                                variant="primary"
                                className="w-full h-14 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-indigo-100"
                            >
                                <CheckCircle className="w-5 h-5" /> Validar y Activar
                            </BaseButton>
                            <BaseButton
                                onClick={() => onInvalidate(contract.id, formState)}
                                variant="ghost"
                                className="w-full h-14 rounded-2xl border border-rose-100 text-rose-500 hover:bg-rose-50 flex items-center justify-center gap-3"
                            >
                                <XCircle className="w-5 h-5" /> Denegar / Expirar
                            </BaseButton>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="px-10 py-6 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic">Seguridad Criptográfica Lyrium © 2025</p>
                <button
                    onClick={onClose}
                    className="text-[10px] font-black text-gray-500 hover:text-indigo-600 uppercase tracking-widest transition-all hover:translate-x-1"
                >
                    Volver al Panel
                </button>
            </div>
        </div>
    );
};
