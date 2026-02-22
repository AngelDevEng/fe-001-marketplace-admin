'use client';

import React, { useState, useEffect } from 'react';
import { VoucherType } from '@/lib/types/seller/invoices';
import { EmitInvoicePayload } from '@/hooks/useSellerInvoices';
import Icon from '@/components/ui/Icon';

interface EmitInvoiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onEmit: (payload: EmitInvoicePayload) => Promise<{ success: boolean; error?: string }>;
}

type ModalState = 'form' | 'loading' | 'success' | 'error';

const TYPE_OPTIONS: { value: VoucherType; label: string; icon: string; desc: string }[] = [
    { value: 'FACTURA', label: 'Factura', icon: 'FileText', desc: 'Para empresas con RUC activo' },
    { value: 'BOLETA', label: 'Boleta', icon: 'Receipt', desc: 'Para personas naturales' },
    { value: 'NOTA_CREDITO', label: 'Nota Crédito', icon: 'Undo', desc: 'Anular o corregir otro comprobante' },
];

const EMPTY_FORM = {
    type: 'FACTURA' as VoucherType,
    customer_name: '',
    customer_ruc: '',
    series: 'F001',
    number: '',
    amount: '',
    order_id: '',
};

export default function EmitInvoiceModal({ isOpen, onClose, onEmit }: EmitInvoiceModalProps) {
    const [form, setForm] = useState({ ...EMPTY_FORM });
    const [state, setState] = useState<ModalState>('form');
    const [errorMsg, setErrorMsg] = useState('');

    // Reset al abrir
    useEffect(() => {
        if (isOpen) {
            setForm({ ...EMPTY_FORM });
            setState('form');
            setErrorMsg('');
        }
    }, [isOpen]);

    // Cerrar con Escape
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && state !== 'loading') onClose();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose, state]);

    const set = (field: keyof typeof EMPTY_FORM) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
            setForm(p => ({ ...p, [field]: e.target.value }));

    const isValid =
        form.customer_name.trim() &&
        form.customer_ruc.trim().length >= 8 &&
        form.series.trim() &&
        form.number.trim() &&
        Number(form.amount) > 0 &&
        form.order_id.trim();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid) return;
        setState('loading');

        const payload: EmitInvoicePayload = {
            seller_id: 'SELLER-001',           // En prod: extraer del JWT / session
            seller_name: 'Vendedor Demo',         // En prod: nombre del usuario autenticado
            type: form.type,
            customer_name: form.customer_name.trim(),
            customer_ruc: form.customer_ruc.trim(),
            series: form.series.trim(),
            number: form.number.trim(),
            amount: Number(form.amount),
            order_id: form.order_id.trim(),
        };

        const result = await onEmit(payload);
        if (result.success) {
            setState('success');
        } else {
            setErrorMsg(result.error ?? 'Error al conectar con Rapifac');
            setState('error');
        }
    };

    if (!isOpen) return null;

    return (
        /* Backdrop */
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fadeIn"
            onClick={e => { if (e.target === e.currentTarget && state !== 'loading') onClose(); }}
        >
            <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl shadow-gray-900/20 overflow-hidden
                animate-in slide-in-from-bottom-6 duration-300">

                {/* ── Header ── */}
                <div className="relative bg-gradient-to-br from-emerald-500 to-sky-500 p-8 text-white overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                    <div className="absolute -bottom-6 -left-6 w-28 h-28 bg-white/10 rounded-full blur-xl" />
                    <div className="relative">
                        <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                                    <Icon name="Receipt" className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">
                                        Rapifac · SUNAT
                                    </p>
                                    <h2 className="text-lg font-black tracking-tight">
                                        Nueva Factura Electrónica
                                    </h2>
                                </div>
                            </div>
                            {state !== 'loading' && (
                                <button
                                    onClick={onClose}
                                    className="w-9 h-9 bg-white/20 hover:bg-white/30 rounded-2xl flex items-center justify-center transition-all active:scale-90"
                                >
                                    <Icon name="X" className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── States ── */}

                {/* LOADING */}
                {state === 'loading' && (
                    <div className="p-16 flex flex-col items-center gap-6 text-center">
                        <div className="relative">
                            <div className="w-20 h-20 border-4 border-emerald-100 rounded-full" />
                            <div className="w-20 h-20 border-4 border-t-emerald-500 rounded-full animate-spin absolute top-0 left-0" />
                            <Icon name="Receipt" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 text-emerald-500 animate-pulse" />
                        </div>
                        <div>
                            <p className="text-xs font-black text-gray-800 uppercase tracking-[0.2em] animate-pulse">
                                Enviando a Rapifac…
                            </p>
                            <p className="text-[11px] text-gray-400 font-medium mt-1">
                                Obteniendo token y emitiendo comprobante en SUNAT
                            </p>
                        </div>
                    </div>
                )}

                {/* SUCCESS */}
                {state === 'success' && (
                    <div className="p-12 flex flex-col items-center gap-6 text-center">
                        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center border-4 border-emerald-100">
                            <Icon name="CheckCircle2" className="w-10 h-10 text-emerald-500" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-gray-900 tracking-tight">
                                ¡Factura emitida con éxito!
                            </h3>
                            <p className="text-[11px] text-gray-400 font-medium mt-2 max-w-xs mx-auto">
                                El comprobante fue enviado a SUNAT vía Rapifac. El administrador
                                ya puede verlo en su panel de auditoría.
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="px-10 py-4 bg-gray-900 text-white rounded-[2.5rem] font-black text-[11px]
                                uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl active:scale-95"
                        >
                            Cerrar
                        </button>
                    </div>
                )}

                {/* ERROR */}
                {state === 'error' && (
                    <div className="p-12 flex flex-col items-center gap-6 text-center">
                        <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center border-4 border-rose-100">
                            <Icon name="XCircle" className="w-10 h-10 text-rose-500" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-gray-900 tracking-tight">
                                Error en la emisión
                            </h3>
                            <p className="text-[11px] text-rose-500 font-bold mt-2 bg-rose-50 px-4 py-2 rounded-2xl border border-rose-100 max-w-xs mx-auto">
                                {errorMsg}
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setState('form')}
                                className="px-8 py-4 bg-gray-100 text-gray-700 rounded-[2.5rem] font-black text-[11px]
                                    uppercase tracking-widest hover:bg-gray-200 transition-all active:scale-95"
                            >
                                Corregir datos
                            </button>
                            <button
                                onClick={onClose}
                                className="px-8 py-4 bg-rose-500 text-white rounded-[2.5rem] font-black text-[11px]
                                    uppercase tracking-widest hover:bg-rose-600 transition-all active:scale-95"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                )}

                {/* FORM */}
                {state === 'form' && (
                    <form onSubmit={handleSubmit} className="p-8 space-y-6">

                        {/* Tipo de comprobante */}
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">
                                Tipo de Comprobante
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                {TYPE_OPTIONS.map(opt => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => setForm(p => ({ ...p, type: opt.value }))}
                                        className={`flex flex-col items-center gap-2 p-4 rounded-[1.5rem] border-2 transition-all text-center
                                            ${form.type === opt.value
                                                ? 'border-emerald-400 bg-emerald-50 text-emerald-700 shadow-lg shadow-emerald-100'
                                                : 'border-gray-100 bg-white text-gray-400 hover:border-gray-200'
                                            }`}
                                    >
                                        <Icon name={opt.icon} className="w-5 h-5" />
                                        <span className="text-[9px] font-black uppercase tracking-wider">{opt.label}</span>
                                        <span className="text-[8px] font-medium text-gray-400 leading-tight">{opt.desc}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Serie y Número */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">
                                    Serie
                                </label>
                                <input
                                    id="emit-series"
                                    type="text"
                                    value={form.series}
                                    onChange={set('series')}
                                    placeholder="F001"
                                    maxLength={4}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold
                                        text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-300
                                        transition-all font-mono tracking-wider"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">
                                    Número
                                </label>
                                <input
                                    id="emit-number"
                                    type="text"
                                    value={form.number}
                                    onChange={set('number')}
                                    placeholder="00000001"
                                    maxLength={8}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold
                                        text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-300
                                        transition-all font-mono tracking-wider"
                                />
                            </div>
                        </div>

                        {/* Cliente */}
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">
                                Razón Social / Nombre del Cliente
                            </label>
                            <input
                                id="emit-customer-name"
                                type="text"
                                value={form.customer_name}
                                onChange={set('customer_name')}
                                placeholder="Ej: Distribuidora Lima S.A.C."
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold
                                    text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-300
                                    transition-all"
                            />
                        </div>

                        {/* RUC y Pedido */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">
                                    RUC / DNI
                                </label>
                                <input
                                    id="emit-ruc"
                                    type="text"
                                    value={form.customer_ruc}
                                    onChange={set('customer_ruc')}
                                    placeholder="20600123456"
                                    maxLength={11}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold
                                        text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-300
                                        transition-all font-mono"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">
                                    N° Pedido / Orden
                                </label>
                                <input
                                    id="emit-order-id"
                                    type="text"
                                    value={form.order_id}
                                    onChange={set('order_id')}
                                    placeholder="ORD-2026-010"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold
                                        text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-300
                                        transition-all"
                                />
                            </div>
                        </div>

                        {/* Monto */}
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">
                                Monto Total (S/ — Incluye IGV)
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black text-gray-300">S/</span>
                                <input
                                    id="emit-amount"
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    value={form.amount}
                                    onChange={set('amount')}
                                    placeholder="0.00"
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold
                                        text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-300
                                        transition-all"
                                />
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-gray-100 rounded-full" />

                        {/* Botones */}
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-[2.5rem] font-black text-[11px]
                                    uppercase tracking-widest hover:bg-gray-200 transition-all active:scale-95"
                            >
                                Cancelar
                            </button>
                            <button
                                id="emit-submit-btn"
                                type="submit"
                                disabled={!isValid}
                                className={`flex-[2] py-4 rounded-[2.5rem] font-black text-[11px] uppercase tracking-widest
                                    flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl
                                    ${isValid
                                        ? 'bg-gray-900 text-white hover:bg-emerald-600 shadow-gray-200'
                                        : 'bg-gray-100 text-gray-300 cursor-not-allowed shadow-none'
                                    }`}
                            >
                                <Icon name="Send" className="w-4 h-4" />
                                Emitir vía Rapifac
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
