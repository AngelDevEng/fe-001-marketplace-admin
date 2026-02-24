import React from 'react';
import { FinanceSummary, MonthlyLiquidation, CashInPayment, CashOutPayment, CashInStatus, CashOutStatus } from '@/lib/types/admin/treasury';
import { FileText, CheckCircle, AlertTriangle, AlertOctagon, XCircle, Clock, CheckCircle2, Search, Zap, DollarSign, Wallet, ShieldCheck, Download } from 'lucide-react';

export const BalanceTab: React.FC<{ resume: FinanceSummary; monthly: MonthlyLiquidation[] }> = ({ resume, monthly }) => {
    return (
        <div className="space-y-8 font-industrial">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full -mr-16 -mt-16 blur-xl group-hover:bg-indigo-100/50 transition-all duration-700"></div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Ventas Brutas</p>
                    <p className="text-3xl font-black text-gray-900 tracking-tighter mb-4">S/ {resume.ventas_totales.toLocaleString()}</p>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-black rounded-lg uppercase">
                        + {resume.crecimiento_mensual}% vs pasado
                    </span>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden group">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Fee Capturado (Comisiones)</p>
                    <p className="text-3xl font-black text-indigo-600 tracking-tighter mb-4">S/ {resume.comisiones_totales.toLocaleString()}</p>
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[9px] font-black rounded-lg uppercase">
                        Sólido
                    </span>
                </div>
                <div className="bg-sky-500 text-white p-6 rounded-[2rem] border border-sky-400 shadow-sm relative overflow-hidden group">
                    <p className="text-[10px] font-black text-sky-200 uppercase tracking-widest leading-none mb-1">Margen Operativo</p>
                    <p className="text-3xl font-black text-white tracking-tighter mb-4">{resume.margen_operativo}%</p>
                    <span className="text-[9px] font-black text-sky-200 uppercase">
                        Optimizado por Algoritmo (RF-08)
                    </span>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Consolidado Mensual de Tesorería</h3>
                <div className="space-y-4">
                    {monthly.map((m, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-indigo-50/50 hover:border-indigo-100 border border-transparent transition-all">
                            <div className="w-16 h-16 bg-white rounded-xl shadow-sm text-center flex flex-col items-center justify-center">
                                <span className="text-xs font-black text-gray-800 uppercase leading-none">{m.mes}</span>
                            </div>
                            <div className="flex-1 px-8 grid grid-cols-3 gap-4 text-center">
                                <div>
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider mb-1">Cash In (Recaudación)</p>
                                    <p className="text-sm font-bold text-gray-800 tracking-tighter">S/ {m.cashIn.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider mb-1">Cash Out (Liquidación a Vendedores)</p>
                                    <p className="text-sm font-bold text-gray-800 tracking-tighter">S/ {m.cashOut.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-emerald-600/80 uppercase tracking-wider mb-1">Fee Resultante</p>
                                    <p className="text-sm font-black text-emerald-600 tracking-tighter">S/ {m.comisiones.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


const CashInStatusBadge: React.FC<{ status: CashInStatus }> = ({ status }) => {
    switch (status) {
        case CashInStatus.PENDING_VALIDATION: return <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[9px] font-black uppercase rounded-lg border border-amber-100">En Revisión</span>;
        case CashInStatus.VALIDATED: return <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase rounded-lg border border-emerald-100">Validado / Rapifac</span>;
        case CashInStatus.REJECTED: return <span className="px-3 py-1 bg-red-50 text-red-600 text-[9px] font-black uppercase rounded-lg border border-red-100">Rechazado</span>;
        default: return <span className="px-3 py-1 bg-gray-50 text-gray-600 text-[9px] font-black uppercase rounded-lg border border-gray-100">{status}</span>;
    }
}

export const CashInTab: React.FC<{
    payments: CashInPayment[];
    onSelect: (p: CashInPayment) => void;
}> = ({ payments, onSelect }) => {
    return (
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden font-industrial">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div>
                    <h3 className="text-xs font-black text-gray-800 uppercase tracking-tight">Recaudación de Clientes (Cash-In)</h3>
                    <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">Validación de Vouchers y Facturación (RF-14)</p>
                </div>
                <button className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase flex items-center gap-2">
                    <Download className="w-4 h-4" /> Exportar Conciliación
                </button>
            </div>
            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest transition-colors">
                            <th className="px-6 py-5 whitespace-nowrap">ID Trama</th>
                            <th className="px-6 py-5 whitespace-nowrap">Cliente Obligado</th>
                            <th className="px-6 py-5 whitespace-nowrap">Order Ref.</th>
                            <th className="px-6 py-5 whitespace-nowrap text-right">Monto</th>
                            <th className="px-6 py-5 whitespace-nowrap">Estado Auditado</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {payments.map(p => (
                            <tr key={p.id} onClick={() => onSelect(p)} className="hover:bg-gray-50/50 transition-colors cursor-pointer group">
                                <td className="px-6 py-4">
                                    <span className="text-xs font-black text-gray-800 group-hover:text-indigo-600 transition-colors uppercase">{p.id}</span>
                                    <p className="text-[9px] text-gray-400 font-bold uppercase mt-1">{new Date(p.createdAt).toLocaleDateString()}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-xs font-bold text-gray-700 uppercase">{p.customer.name}</p>
                                    <p className="text-[9px] text-gray-500 font-bold tracking-widest mt-1">DOC: {p.customer.taxId}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-[9px] font-black rounded-md uppercase">{p.referenceId}</span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <span className="text-sm font-black text-gray-900 tracking-tighter">S/ {p.amount.amount.toLocaleString()}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <CashInStatusBadge status={p.status} />
                                </td>
                            </tr>
                        ))}
                        {payments.length === 0 && (
                            <tr><td colSpan={5} className="p-8 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">No hay pagos Cash-In concidiendo con los filtros</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


const CashOutStatusBadge: React.FC<{ status: CashOutStatus }> = ({ status }) => {
    switch (status) {
        case CashOutStatus.SCHEDULED: return <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[9px] font-black uppercase rounded-lg border border-blue-100">Programado (Batch)</span>;
        case CashOutStatus.PROCESSING: return <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[9px] font-black uppercase rounded-lg border border-amber-100">Procesando Banco</span>;
        case CashOutStatus.PAID: return <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase rounded-lg border border-emerald-100">Depositado</span>;
        case CashOutStatus.DISPUTED: return <span className="px-3 py-1 bg-red-50 text-red-600 text-[9px] font-black uppercase rounded-lg border border-red-100 animate-pulse">Disputa Activa</span>;
        default: return <span className="px-3 py-1 bg-gray-50 text-gray-600 text-[9px] font-black uppercase rounded-lg border border-gray-100">{status}</span>;
    }
}

export const CashOutTab: React.FC<{
    payments: CashOutPayment[];
    onSelect: (p: CashOutPayment) => void;
    windowOpen: boolean;
}> = ({ payments, onSelect, windowOpen }) => {
    return (
        <div className="space-y-6 font-industrial">
            {!windowOpen && (
                <div className="p-6 bg-red-50 border border-red-100 rounded-[2rem] flex items-center gap-4 text-red-600 shadow-sm animate-pulse">
                    <AlertTriangle className="w-8 h-8" />
                    <div>
                        <h4 className="text-sm font-black uppercase tracking-widest">Fuera de Ventana de Liquidación Pautada</h4>
                        <p className="text-[10px] font-bold uppercase mt-1 text-red-500/80">Recuerde que por reglas de negocio, los pagos masivos a vendedores se ejecutan de Lunes a Miércoles.</p>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h3 className="text-xs font-black text-gray-800 uppercase tracking-tight">Liquidaciones Programadas a Vendedores (Cash-Out)</h3>
                        <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">Desembolsos y Cálculo de Comisión Lyrium (RF-15)</p>
                    </div>
                    <button
                        className={`px-4 py-2 ${windowOpen ? 'bg-sky-500 hover:bg-sky-600 text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed'} rounded-xl text-[10px] font-black uppercase transition-colors flex items-center gap-2`}
                        disabled={!windowOpen}
                    >
                        <Zap className="w-4 h-4" /> Desembolso Masivo (Batch)
                    </button>
                </div>
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest transition-colors">
                                <th className="px-6 py-5 whitespace-nowrap">ID Lote</th>
                                <th className="px-6 py-5 whitespace-nowrap">Vendedor (Sujeto)</th>
                                <th className="px-6 py-5 whitespace-nowrap">Banco Destino</th>
                                <th className="px-6 py-5 whitespace-nowrap text-right">Monto Bruto</th>
                                <th className="px-6 py-5 whitespace-nowrap text-right">Fee (Lyrium)</th>
                                <th className="px-6 py-5 whitespace-nowrap text-right">Neto A Pagar</th>
                                <th className="px-6 py-5 whitespace-nowrap">Estado Tran.</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {payments.map(p => (
                                <tr key={p.id} onClick={() => onSelect(p)} className="hover:bg-gray-50/50 transition-colors cursor-pointer group">
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-black text-gray-800 group-hover:text-indigo-600 transition-colors uppercase">{p.id}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-xs font-bold text-gray-700 uppercase">{p.seller.name}</p>
                                        <p className="text-[9px] text-gray-500 font-bold tracking-widest mt-1">Periodo: {p.liquidationPeriod.start} / {p.liquidationPeriod.end}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-xs font-bold text-indigo-600 uppercase mb-1">{p.seller.bankName}</p>
                                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[8px] font-black rounded uppercase block w-fit">ACC: {p.seller.accountNumber}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="text-sm font-black text-gray-500 tracking-tighter line-through decoration-red-500/50">S/ {p.amount.amount.toLocaleString()}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="text-xs font-black text-emerald-500 uppercase tracking-tighter">S/ {p.commission.amount.toLocaleString()}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="text-sm font-black text-gray-900 tracking-tighter underline decoration-gray-300 underline-offset-4">S/ {p.netAmount.amount.toLocaleString()}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <CashOutStatusBadge status={p.status} />
                                    </td>
                                </tr>
                            ))}
                            {payments.length === 0 && (
                                <tr><td colSpan={7} className="p-8 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">No hay pagos Cash-Out concidiendo con los filtros</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
