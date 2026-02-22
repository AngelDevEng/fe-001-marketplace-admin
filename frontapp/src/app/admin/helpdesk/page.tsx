'use client';

import { useState } from 'react';
import ModuleHeader from '@/components/layout/shared/ModuleHeader';
import { HelpDeskModule } from '@/components/admin/helpdesk/HelpDeskModule';
import { useMesaAyuda } from '@/hooks/useMesaAyuda';
import ModalsPortal from '@/components/layout/shared/ModalsPortal';
import { SlidersHorizontal, X, AlertOctagon, CheckCircle2, ThumbsUp, ThumbsDown, Star } from 'lucide-react';

export default function HelpDeskPage() {
    const {
        data, loading, currentTab, setCurrentTab,
        selectedTicket, filteredTickets, filteredAudit,
        filters, setFilters, actions
    } = useMesaAyuda();

    const [activeModal, setActiveModal] = useState<string | null>(null);
    const [faqDetailId, setFaqDetailId] = useState<number | null>(null);

    const faqSelected = data?.faq.find(f => f.id === faqDetailId);

    // Reuse the internal Modal wrapper for consistency in this page
    const ModalWrapper = ({ title, subtitle, icon, onClose, children }: any) => (
        <ModalsPortal>
            <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
                <div
                    className="absolute inset-0 bg-gray-900/60 backdrop-blur-md animate-fadeIn"
                    onClick={onClose}
                ></div>
                <div className="relative z-10 bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-scaleUp p-10">
                    <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                    <div className="text-center mb-8">
                        {icon && (
                            <div className={`w-20 h-20 bg-sky-50 text-sky-500 rounded-3xl flex items-center justify-center mx-auto mb-4`}>
                                {icon}
                            </div>
                        )}
                        <h3 className="text-2xl font-black text-gray-800 tracking-tight font-industrial uppercase">{title}</h3>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1 font-industrial">{subtitle}</p>
                    </div>
                    {children}
                </div>
            </div>
        </ModalsPortal>
    );

    return (
        <div className="px-8 pb-20 space-y-8 animate-fadeIn">
            <ModuleHeader
                title="Módulo de Soporte"
                subtitle="Comunicación Estratégica y Mesa de Ayuda (RF-05, RF-06)"
                icon="HelpCircle"
                actions={
                    <div className="flex gap-2">
                        <button
                            onClick={() => alert('Abriendo panel de configuración de SLAs y Horarios...')}
                            className="px-6 py-3 bg-white border border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-gray-50 transition-all flex items-center gap-2 shadow-sm font-industrial"
                        >
                            <SlidersHorizontal className="w-4 h-4" />
                            Configuración SLAs
                        </button>
                    </div>
                }
            />

            <HelpDeskModule
                data={data}
                loading={loading}
                currentTab={currentTab}
                setCurrentTab={setCurrentTab as any}
                selectedTicket={selectedTicket}
                filteredTickets={filteredTickets}
                filteredAudit={filteredAudit}
                filters={filters}
                setFilters={setFilters}
                actions={actions}
                onEscalate={() => setActiveModal('escalate')}
                onCloseTicket={() => setActiveModal('survey')}
                onFAQCreate={() => setActiveModal('faq-create')}
                onFAQDetail={(id) => {
                    setFaqDetailId(id);
                    setActiveModal('faq-detail');
                }}
            />

            {/* MODALS */}
            {activeModal === 'escalate' && (
                <ModalWrapper
                    title="Escalar Caso"
                    subtitle="Transfiera la gestión a un especialista"
                    icon={<AlertOctagon className="w-10 h-10" />}
                    onClose={() => setActiveModal(null)}
                >
                    <form className="space-y-6" onSubmit={(e) => {
                        e.preventDefault();
                        const fd = new FormData(e.currentTarget);
                        actions.escalateTicket(fd.get('destino') as string, fd.get('motivo') as string);
                        setActiveModal(null);
                    }}>
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase ml-1 block mb-2 font-industrial">Destino de Escalamiento</label>
                            <select name="destino" required className="w-full p-4 bg-gray-50 border-none rounded-2xl font-black text-gray-700 font-industrial">
                                <option value="Soporte Senior">Soporte Senior</option>
                                <option value="Finanzas / Pagos">Área Financiera</option>
                                <option value="Logística">Logística / Envíos</option>
                                <option value="Supervisión General">Supervisión General</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase ml-1 block mb-2 font-industrial">Motivo / Justificación</label>
                            <textarea name="motivo" rows={4} required className="w-full p-4 bg-gray-50 border-none rounded-2xl text-xs font-medium text-gray-600 resize-none font-industrial"></textarea>
                        </div>
                        <div className="flex gap-4">
                            <button type="submit" className="flex-1 py-4 bg-amber-500 text-white rounded-2xl font-black hover:bg-amber-600 transition-all shadow-xl shadow-amber-100/50 font-industrial uppercase tracking-widest text-xs">Confirmar Escalamiento</button>
                        </div>
                    </form>
                </ModalWrapper>
            )}

            {activeModal === 'survey' && (
                <ModalWrapper
                    title="Cerrar y Calificar Caso"
                    subtitle="Tu opinión nos ayuda a mejorar"
                    icon={<CheckCircle2 className="w-10 h-10" />}
                    onClose={() => setActiveModal(null)}
                >
                    <form className="space-y-8" onSubmit={(e) => {
                        e.preventDefault();
                        const fd = new FormData(e.currentTarget);
                        actions.closeTicket({
                            satisfaction: 5,
                            timely: 5,
                            comments: fd.get('comments') as string
                        });
                        setActiveModal(null);
                    }}>
                        <p className="text-sm font-black text-gray-700 text-center font-industrial uppercase">¿Se resolvió tu problema de manera efectiva?</p>
                        <div className="flex justify-center gap-3">
                            {[1, 2, 3, 4, 5].map(v => (
                                <Star key={v} className="w-10 h-10 cursor-pointer text-amber-400 fill-amber-400" />
                            ))}
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase ml-1 block mb-2 font-industrial">Comentarios (Opcional)</label>
                            <textarea name="comments" rows={3} className="w-full p-4 bg-gray-50 border-none rounded-2xl text-xs font-medium text-gray-600 resize-none font-industrial" placeholder="Escribe aquí tus comentarios técnicos..."></textarea>
                        </div>
                        <button type="submit" className="w-full py-5 bg-gray-900 text-white rounded-[1.5rem] font-black hover:bg-black transition-all shadow-xl font-industrial uppercase tracking-widest text-xs">Enviar y Cerrar Ticket</button>
                    </form>
                </ModalWrapper>
            )}

            {activeModal === 'faq-detail' && faqSelected && (
                <ModalWrapper
                    title={faqSelected.titulo}
                    subtitle={faqSelected.categoria}
                    onClose={() => setActiveModal(null)}
                >
                    <div className="space-y-6">
                        <p className="text-sm text-gray-600 font-medium leading-relaxed font-industrial">{faqSelected.contenido}</p>
                        <div className="pt-8 border-t border-gray-100 flex items-center justify-between">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest font-industrial">¿Fue útil este artículo?</p>
                            <div className="flex gap-4">
                                <button className="px-6 py-3 bg-emerald-50 text-emerald-600 rounded-xl font-black text-[10px] flex items-center gap-2 hover:bg-emerald-100 transition-all font-industrial uppercase">
                                    <ThumbsUp className="w-4 h-4" /> SI ({faqSelected.util_si})
                                </button>
                                <button className="px-6 py-3 bg-red-50 text-red-600 rounded-xl font-black text-[10px] flex items-center gap-2 hover:bg-red-100 transition-all font-industrial uppercase">
                                    <ThumbsDown className="w-4 h-4" /> NO ({faqSelected.util_no})
                                </button>
                            </div>
                        </div>
                    </div>
                </ModalWrapper>
            )}
        </div>
    );
}
