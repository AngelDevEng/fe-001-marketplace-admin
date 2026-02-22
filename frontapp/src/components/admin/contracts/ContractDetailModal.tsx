import React, { useState, useEffect } from 'react';
import { StatusBadge, AuditTimeline } from './ContractsUIComponents';
import { Contract } from '@/lib/types/admin/contracts';
import { FileText, FolderOpen, CheckCircle, XCircle } from 'lucide-react';

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
        <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative overflow-hidden animate-modalIn max-h-[90vh] flex flex-col font-industrial">
            {/* Header */}
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 flex-shrink-0">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white border border-gray-100 rounded-2xl shadow-sm text-indigo-600">
                        <FileText className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xl font-black text-gray-800 tracking-tight leading-none">Contrato #{contract.id}</h3>
                        <input
                            type="text"
                            value={formState.company || ''}
                            onChange={(e) => setFormState(p => ({ ...p, company: e.target.value }))}
                            className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1 bg-transparent border-none p-0 focus:ring-0 w-full"
                            placeholder="NOMBRE DE LA EMPRESA"
                        />
                    </div>
                </div>
                <StatusBadge status={contract.status} large />
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 overflow-y-auto custom-scrollbar">
                {/* Info Legal */}
                <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Información Legal</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[9px] font-bold text-gray-400 uppercase">RUC</label>
                            <input
                                type="text"
                                value={formState.ruc || ''}
                                onChange={(e) => setFormState(p => ({ ...p, ruc: e.target.value }))}
                                className="w-full bg-transparent border-none p-0 text-xs font-bold text-gray-700 focus:ring-0"
                            />
                        </div>
                        <div>
                            <label className="text-[9px] font-bold text-gray-400 uppercase">Representante</label>
                            <input
                                type="text"
                                value={formState.rep || ''}
                                onChange={(e) => setFormState(p => ({ ...p, rep: e.target.value }))}
                                className="w-full bg-transparent border-none p-0 text-xs font-bold text-gray-700 focus:ring-0"
                            />
                        </div>
                        <div>
                            <label className="text-[9px] font-bold text-gray-400 uppercase">Fecha Inicio</label>
                            <input
                                type="date"
                                value={formState.start || ''}
                                onChange={(e) => setFormState(p => ({ ...p, start: e.target.value }))}
                                className="w-full bg-transparent border-none p-0 text-xs font-bold text-gray-700 focus:ring-0"
                            />
                        </div>
                        <div>
                            <label className="text-[9px] font-bold text-gray-400 uppercase">Vencimiento</label>
                            <input
                                type="date"
                                value={formState.end || ''}
                                onChange={(e) => setFormState(p => ({ ...p, end: e.target.value }))}
                                className="w-full bg-transparent border-none p-0 text-xs font-bold text-gray-700 focus:ring-0"
                            />
                        </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <p className="text-[8px] font-black text-gray-400 uppercase mb-2">Ruta Estructural (RF-16)</p>
                        <p className="text-[10px] font-bold text-gray-800 flex items-center gap-2">
                            <FolderOpen className="w-4 h-4 text-amber-500" />
                            <span>{formState.storage_path || '--- / --- / ---'}</span>
                        </p>
                    </div>
                </div>

                {/* Acciones */}
                <div className="space-y-4 flex flex-col justify-between">
                    <div>
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2 mb-4">Historial de Auditoría (RF-16)</h4>
                        <AuditTimeline events={contract.auditTrail} />
                    </div>

                    {contract.status === 'PENDING' && (
                        <div className="space-y-3 mt-4">
                            <button
                                onClick={() => onValidate(contract.id, formState)}
                                className="w-full py-3 bg-emerald-500 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2"
                            >
                                <CheckCircle className="w-4 h-4" /> Validar Contrato
                            </button>
                            <button
                                onClick={() => onInvalidate(contract.id, formState)}
                                className="w-full py-3 bg-white border border-red-100 text-red-500 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                            >
                                <XCircle className="w-4 h-4" /> Rechazar / Expirar
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 text-right flex-shrink-0">
                <button onClick={onClose} className="text-xs font-bold text-gray-500 hover:text-gray-800 uppercase tracking-wider transition-colors">Cerrar Ventana</button>
            </div>
        </div>
    );
};
