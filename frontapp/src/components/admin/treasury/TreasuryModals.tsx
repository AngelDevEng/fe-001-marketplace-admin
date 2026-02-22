import React from 'react';
import { CashInPayment, CashOutPayment, PaymentDirection, CashInStatus, CashOutStatus } from '@/lib/types/admin/treasury';
import { X, CheckCircle, CheckCircle2, XCircle, AlertTriangle, AlertOctagon, Link as LinkIcon, DollarSign, Wallet, ShieldCheck, Download } from 'lucide-react';

export const PaymentModal: React.FC<{
    payment: CashInPayment | CashOutPayment;
    onClose: () => void;
    onProcessIn: (id: string, action: 'VALIDATE' | 'REJECT') => void;
    onProcessOut: (id: string, action: 'PAY' | 'FAIL' | 'RESCHEDULE') => void;
}> = ({ payment, onClose, onProcessIn, onProcessOut }) => {

    const isCashIn = payment.direction === PaymentDirection.IN;

    if (isCashIn) {
        const p = payment as CashInPayment;
        return (
            <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative overflow-hidden animate-modalIn flex flex-col font-industrial max-h-[90vh]">
                <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white border border-emerald-100 rounded-2xl shadow-sm text-emerald-600">
                            <DollarSign className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-black text-gray-800 tracking-tight leading-none uppercase">Validación Cash-In #{p.id}</h3>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Order Ref: {p.referenceId}</p>
                        </div>
                    </div>
                </div>

                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 overflow-y-auto custom-scrollbar">
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Datos Transaccionales</h4>
                        <div>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Cliente Responsable</p>
                            <p className="text-sm font-black text-gray-800 uppercase leading-none">{p.customer.name}</p>
                            <p className="text-[10px] text-indigo-500 font-black mt-1 uppercase">DNI/RUC: {p.customer.taxId || '----'}</p>
                        </div>
                        <div>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1 mt-4">Monto Reportado</p>
                            <p className="text-3xl font-black text-emerald-600 uppercase tracking-tighter">S/ {p.amount.amount.toLocaleString()}</p>
                        </div>

                        {p.voucherUrl ? (
                            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 mt-6 cursor-pointer hover:bg-emerald-50/50 transition-colors group">
                                <p className="text-[8px] font-black text-gray-400 uppercase mb-2">Comprobante de Pago Subido</p>
                                <p className="text-[10px] font-bold text-gray-800 flex items-center gap-2 uppercase">
                                    <LinkIcon className="w-4 h-4 text-emerald-500 group-hover:text-emerald-700" />
                                    <span>{p.voucherUrl.split('/').pop()}</span>
                                </p>
                            </div>
                        ) : (
                            <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 font-bold text-xs flex items-center gap-2">
                                <AlertOctagon className="w-6 h-6" /> Voucher no adjuntado
                            </div>
                        )}
                    </div>

                    <div className="space-y-4 flex flex-col justify-between">
                        <div>
                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2 mb-4">Jerarquía Lógica (Orden)</h4>
                            <div className="space-y-2 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                <p className="text-[9px] font-black text-gray-800 uppercase flex justify-between"><span className="text-gray-400">Emisor:</span> {p.orderHierarchy.company}</p>
                                <p className="text-[9px] font-black text-gray-800 uppercase flex justify-between"><span className="text-gray-400">Vendedor:</span> {p.orderHierarchy.seller}</p>
                                <p className="text-[9px] font-black text-gray-800 uppercase flex justify-between"><span className="text-gray-400">Beneficiario:</span> {p.orderHierarchy.customer}</p>
                            </div>
                        </div>

                        {p.status === CashInStatus.PENDING_VALIDATION && (
                            <div className="space-y-3 mt-4 flex flex-col pt-4 border-t border-gray-100">
                                <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest text-center animate-pulse mb-2">Requiere Auditoría Humana/Bancaria</p>
                                <button
                                    onClick={() => onProcessIn(p.id, 'VALIDATE')}
                                    className="w-full py-3 bg-emerald-500 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2"
                                >
                                    <CheckCircle className="w-4 h-4" /> Validar y Emitir Rapifac
                                </button>
                                <button
                                    onClick={() => onProcessIn(p.id, 'REJECT')}
                                    className="w-full py-3 bg-white border border-red-100 text-red-500 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                                >
                                    <XCircle className="w-4 h-4" /> Rechazar Voucher
                                </button>
                            </div>
                        )}
                        {p.status === CashInStatus.VALIDATED && (
                            <div className="mt-4 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-700 font-bold text-[10px] uppercase text-center flex flex-col items-center">
                                <ShieldCheck className="w-8 h-8 mb-2 opacity-80" /> Validado Sistemáticamente
                            </div>
                        )}
                    </div>
                </div>
                <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 text-right flex-shrink-0">
                    <button onClick={onClose} className="text-xs font-bold text-gray-500 hover:text-gray-800 uppercase tracking-wider transition-colors">Cerrar Inspección</button>
                </div>
            </div>
        );
    } else {
        const p = payment as CashOutPayment;
        return (
            <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative overflow-hidden animate-modalIn flex flex-col font-industrial max-h-[90vh]">
                <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white border border-indigo-100 rounded-2xl shadow-sm text-indigo-600">
                            <Wallet className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-black text-gray-800 tracking-tight leading-none uppercase">Liquidación Cash-Out #{p.id}</h3>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Batch Lote Ref: {p.referenceId}</p>
                        </div>
                    </div>
                </div>

                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 overflow-y-auto custom-scrollbar">
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Destinatario Bancario</h4>
                        <div>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Vendedor Beneficiario</p>
                            <p className="text-sm font-black text-gray-800 uppercase leading-none">{p.seller.name}</p>
                            <p className="text-[10px] text-indigo-500 font-black mt-1 uppercase">Banco: {p.seller.bankName}</p>
                            <span className="px-2 py-0.5 bg-gray-50 text-gray-600 text-[9px] font-black rounded uppercase block mt-2 text-center border border-gray-200">
                                CTA: {p.seller.accountNumber} <br /> CCI: {p.seller.cci || 'NA'}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-4 flex flex-col justify-between">
                        <div>
                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2 mb-4">Estructura Matemática del Desembolso</h4>
                            <div className="space-y-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-inner">
                                <p className="text-[10px] font-black text-gray-400 uppercase flex justify-between items-end">
                                    <span>Monto Bruto de Ventas:</span>
                                    <span className="text-sm text-gray-500">S/ {p.amount.amount.toLocaleString()}</span>
                                </p>
                                <p className="text-[10px] font-black text-gray-400 uppercase flex justify-between items-end">
                                    <span>Fee Lyrium (Retención):</span>
                                    <span className="text-sm text-emerald-500">- S/ {p.commission.amount.toLocaleString()}</span>
                                </p>
                                <div className="border-t border-dashed border-gray-200 my-2 pt-2"></div>
                                <p className="text-[10px] font-black justify-between items-end flex uppercase">
                                    <span className="text-gray-900 tracking-widest">Neto de Transferencia:</span>
                                    <span className="text-2xl text-gray-900 tracking-tighter">S/ {p.netAmount.amount.toLocaleString()}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {p.status === CashOutStatus.SCHEDULED && (
                    <div className="px-8 py-5 bg-indigo-50 border-t border-indigo-100 flex gap-4">
                        <button
                            onClick={() => onProcessOut(p.id, 'PAY')}
                            className="flex-1 py-3 bg-gray-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2"
                        >
                            <Wallet className="w-4 h-4" /> Desembolsar Manualmente
                        </button>
                        <button
                            onClick={() => onProcessOut(p.id, 'FAIL')}
                            className="px-6 py-3 bg-white border border-red-100 text-red-500 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                        >
                            <XCircle className="w-4 h-4" /> Suspender
                        </button>
                    </div>
                )}
                {p.status === CashOutStatus.PAID && (
                    <div className="px-8 py-4 bg-emerald-50 border-t border-emerald-100 text-emerald-700 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-5 h-5" /> Pagado y Conciliado
                    </div>
                )}
                {p.status === CashOutStatus.DISPUTED && (
                    <div className="px-8 py-4 bg-red-50 border-t border-red-100 flex flex-col items-center">
                        <p className="text-red-600 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 animate-pulse mb-3">
                            <AlertTriangle className="w-5 h-5" /> Disputa Abierta por el Vendedor
                        </p>
                        <button
                            onClick={() => onProcessOut(p.id, 'PAY')}
                            className="px-6 py-3 bg-white border border-red-200 text-red-600 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-red-100 transition-all w-full flex justify-center gap-2"
                        >
                            <CheckCircle className="w-4 h-4" /> Resolver a favor y Forzar Pago
                        </button>
                    </div>
                )}

                <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 text-right flex-shrink-0">
                    <button onClick={onClose} className="text-xs font-bold text-gray-500 hover:text-gray-800 uppercase tracking-wider transition-colors">Cerrar Inspección</button>
                </div>
            </div>
        );
    }
};
