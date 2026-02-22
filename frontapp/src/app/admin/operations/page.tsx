'use client';

import { useGestionOperativa } from '@/hooks/useGestionOperativa';
import ModuleHeader from '@/components/layout/shared/ModuleHeader';
import { GestionOperativaModule } from '@/components/admin/operations/GestionOperativaModule';
import { ProviderModal, TwoFactorModalContent } from '@/components/admin/operations/OperationsModals';
import ModalsPortal from '@/components/layout/shared/ModalsPortal';
import { Provider } from '@/lib/types/admin/operations';
import { FileText, ShieldCheck } from 'lucide-react';

export default function OperationsPage() {
    const { state, actions } = useGestionOperativa();
    const { selectedProvider, show2FAModal } = state;

    const handleSaveProvider = (providerData: Partial<Provider>) => {
        actions.request2FA(() => {
            actions.saveProvider(providerData);
        });
    };

    return (
        <div className="space-y-6 animate-fadeIn font-industrial">
            <ModuleHeader
                title="Gestión Operativa"
                subtitle="Control de proveedores, gastos y credenciales"
                icon="Briefcase"
                actions={
                    <div className="flex gap-2">
                        <button
                            onClick={() => alert('Generando Reporte Operativo Mensual...')}
                            className="px-6 py-3 bg-white border border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-gray-50 transition-all flex items-center gap-2 shadow-sm font-industrial"
                        >
                            <FileText className="w-4 h-4" />
                            Reporte Mensual
                        </button>
                    </div>
                }
            />

            {/* Presentational Module View */}
            <GestionOperativaModule state={state} actions={actions} />

            {/* GLOBAL MODALS (Teleported) */}
            {selectedProvider && (
                <ModalsPortal>
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div
                            className="absolute inset-0 bg-gray-900/60 backdrop-blur-md animate-fadeIn"
                            onClick={() => actions.setSelectedProvider(null)}
                        ></div>
                        <div className="relative z-10 w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-scaleUp">
                            <div className="p-10 max-h-[90vh] overflow-y-auto custom-scrollbar">
                                <div className="flex items-center gap-6 mb-10">
                                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-[1.5rem] flex items-center justify-center">
                                        <FileText className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-black text-gray-800 tracking-tighter leading-none mb-1 font-industrial">Ficha Técnica</h3>
                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] font-industrial">Perfil Profesional Especializado</p>
                                    </div>
                                </div>
                                <ProviderModal
                                    provider={selectedProvider}
                                    onClose={() => actions.setSelectedProvider(null)}
                                    onSave={handleSaveProvider}
                                />
                            </div>
                        </div>
                    </div>
                </ModalsPortal>
            )}

            {show2FAModal && (
                <ModalsPortal>
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div
                            className="absolute inset-0 bg-gray-900/90 backdrop-blur-xl animate-fadeIn"
                            onClick={actions.close2FAModal}
                        ></div>
                        <div className="relative z-10 w-full max-w-sm bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-bounceIn p-8 text-center">
                            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <ShieldCheck className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-800 tracking-tighter mb-2 font-industrial">Verificación 2FA</h3>
                            <p className="text-[10px] text-gray-400 font-bold leading-relaxed mb-8 uppercase tracking-tight font-industrial">
                                Acción Crítica Detectada. Ingrese el código enviado a su dispositivo móvil. (123456)
                            </p>
                            <TwoFactorModalContent
                                onVerify={actions.verify2FA}
                                onClose={actions.close2FAModal}
                            />
                        </div>
                    </div>
                </ModalsPortal>
            )}
        </div>
    );
}
