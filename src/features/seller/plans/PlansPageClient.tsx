'use client';

import { useState, useEffect } from 'react';
import { useSellerPlans } from './hooks/useSellerPlans';
import { CurrentPlanCard } from './components/CurrentPlanCard';
import { PlanCard } from './components/PlanCard';
import PlanModal from './components/PlanModal';
import BenefitsModal from './components/BenefitsModal';
import BaseLoading from '@/components/ui/BaseLoading';
import BaseErrorState from '@/components/ui/BaseErrorState';
import Icon from '@/components/ui/Icon';
import type { Plan, PlanTab, PaymentSummary } from './types';

const motivationalMessages = [
    'Recuerda que puedes cambiar de plan cuando desees y sin compromisos',
    'Tu crecimiento es nuestra prioridad. Mejora cuando estés listo',
    'Cada plan está diseñado pensando en ti y tus objetivos',
    'Sin contratos a largo plazo. Cambia o cancela cuando quieras',
    'La flexibilidad es clave. Ajusta tu plan según tus necesidades'
];

export function PlansPageClient() {
    const {
        currentPlan,
        subscriptionInfo,
        expirationWarning,
        plansData,
        planOrder,
        buttonColors,
        isLoading,
        isLoggedIn,
        isVendedor,
        calculatePaymentSummary,
        durationPresets,
        createRequest,
        createPayment
    } = useSellerPlans();

    const [activeTab, setActiveTab] = useState<PlanTab>('my-plan');
    const [showcasePlan, setShowcasePlan] = useState(currentPlan);
    const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);
    const [motivationIndex, setMotivationIndex] = useState(0);

    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [paymentStep, setPaymentStep] = useState<1 | 2>(1);
    const [selectedPresetId, setSelectedPresetId] = useState('trial');
    const [customMonths, setCustomMonths] = useState(4);
    const [isProcessing, setIsProcessing] = useState(false);

    const [benefitsPlan, setBenefitsPlan] = useState<Plan | null>(null);
    const [isBenefitsModalOpen, setIsBenefitsModalOpen] = useState(false);

    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        if (currentPlan && planOrder.length > 0) {
            setShowcasePlan(currentPlan);
        }
    }, [currentPlan, planOrder]);

    useEffect(() => {
        const interval = setInterval(() => {
            setMotivationIndex((prev) => (prev + 1) % motivationalMessages.length);
        }, 180000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const showNotification = (message: string, type: 'success' | 'error') => {
        setNotification({ message, type });
    };

    const handleUpgradeClick = (planId: string) => {
        const plan = plansData[planId];
        if (!plan) return;
        
        setSelectedPlan(plan);
        setSelectedPresetId(plan.requiresPayment ? '6m' : 'trial');
        setCustomMonths(4);
        setPaymentStep(1);
        setIsPaymentModalOpen(true);
    };

    const handleProcessPayment = async () => {
        if (!selectedPlan) return;

        setIsProcessing(true);
        try {
            const summary = calculatePaymentSummary(selectedPlan.id, selectedPresetId, customMonths);
            
            if (selectedPresetId === 'trial') {
                await createRequest({
                    type: 'upgrade',
                    fromPlan: currentPlan,
                    toPlan: selectedPlan.id,
                    planName: selectedPlan.name,
                    duration: summary.duration,
                    durationId: selectedPresetId,
                    months: summary.total > 0 ? customMonths : 1,
                    amount: 0,
                    status: 'pending'
                });
                setIsPaymentModalOpen(false);
                showNotification(`¡Plan ${selectedPlan.name} activado!`, 'success');
            } else {
                await createPayment({
                    planId: selectedPlan.id,
                    durationId: selectedPresetId,
                    months: customMonths
                });
                setIsPaymentModalOpen(false);
                showNotification(`¡Pago exitoso! Plan ${selectedPlan.name} activado.`, 'success');
            }
        } catch (error) {
            showNotification('Error al procesar el pago', 'error');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleViewBenefits = (planId: string) => {
        const plan = plansData[planId];
        if (plan) {
            setBenefitsPlan(plan);
            setIsBenefitsModalOpen(true);
        }
    };

    const handlePlanSelect = (planId: string) => {
        if (planId === currentPlan) return;
        
        const currentIdx = planOrder.indexOf(currentPlan);
        const targetIdx = planOrder.indexOf(planId);
        
        if (targetIdx < currentIdx) {
            showNotification('Para bajar de plan, contacta al administrador', 'error');
            return;
        }
        
        handleUpgradeClick(planId);
    };

    const handleShowcasePlanClick = (planId: string) => {
        const plan = plansData[planId];
        if (!plan) return;
        setShowcasePlan(planId);
    };

    const handlePlanCardClick = (planId: string) => {
        const plan = plansData[planId];
        if (!plan) return;
        setShowcasePlan(planId);
        if (planId !== currentPlan) {
            handleUpgradeClick(planId);
        }
    };

    const getPaymentSummary = (): PaymentSummary => {
        if (!selectedPlan) return { planName: '', duration: '', originalPrice: 0, discount: 0, total: 0, perMonth: 0 };
        return calculatePaymentSummary(selectedPlan.id, selectedPresetId, customMonths);
    };

    if (!isLoggedIn) {
        return (
            <BaseErrorState
                title="Acceso restringido"
                message="Debes iniciar sesión como vendedor para ver esta página."
                icon="Lock"
            />
        );
    }

    if (!isVendedor) {
        return (
            <BaseErrorState
                title="Esta sección es para vendedores"
                message="Como administrador, gestiona los planes desde el panel de administración."
                icon="Shield"
            />
        );
    }

    if (isLoading) {
        return <BaseLoading message="Cargando planes..." />;
    }

    const currentPlanData = plansData[currentPlan];
    const showcasePlanData = plansData[showcasePlan];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" style={{ fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}>
            {notification && (
                <div className={`fixed top-20 right-5 z-50 p-4 rounded-xl shadow-xl flex items-center gap-3 ${
                    notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                } text-white max-w-md`}>
                    <Icon name={notification.type === 'success' ? 'CheckCircle' : 'AlertCircle'} className="w-5 h-5 shrink-0" />
                    <span className="text-sm leading-relaxed">{notification.message}</span>
                    <button onClick={() => setNotification(null)} className="ml-2 hover:opacity-70">
                        <Icon name="X" className="w-4 h-4" />
                    </button>
                </div>
            )}

            <div className="max-w-6xl mx-auto px-5 py-8">
                <div className="flex justify-center mb-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-1 flex gap-1">
                        <button
                            onClick={() => setActiveTab('my-plan')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                                activeTab === 'my-plan' 
                                    ? 'bg-gray-900 text-white' 
                                    : 'text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            <Icon name="CreditCard" className="w-4 h-4" />
                            Mi Plan
                        </button>
                        <button
                            onClick={() => setActiveTab('all-plans')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                                activeTab === 'all-plans' 
                                    ? 'bg-gray-900 text-white' 
                                    : 'text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            <Icon name="Grid" className="w-4 h-4" />
                            Planes
                        </button>
                    </div>
                </div>

                {activeTab === 'my-plan' && (
                    <div className="animate-fade-in">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-2 bg-gradient-to-r from-gray-900 via-green-400 to-teal-400 bg-clip-text text-transparent">
                            Mi Plan Actual
                        </h1>
                        <p className="text-gray-500 text-xl text-center mb-8">Gestiona tu suscripción en LYRIUM Biomarketplace</p>

                        {expirationWarning && expirationWarning.porVencer && (
                            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl mb-6 flex items-center gap-3">
                                <Icon name="AlertTriangle" className="text-amber-500 w-5 h-5" />
                                <span className="text-amber-700">Tu plan vence en {expirationWarning.dias} días. ¡Renueva ahora para no perder acceso!</span>
                            </div>
                        )}

                        <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl p-5 mb-6 relative overflow-hidden">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-teal-600 to-green-400 rounded-l-xl"></div>
                            <div className="flex items-center gap-4">
                                <div className="w-11 h-11 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center text-white border border-white/10">
                                    <Icon name="Info" className="w-5 h-5" />
                                </div>
                                <p className="text-gray-300 text-sm flex-1">{motivationalMessages[motivationIndex]}</p>
                            </div>
                        </div>

                        {currentPlanData ? (
                            <CurrentPlanCard
                                plan={currentPlanData}
                                subscription={subscriptionInfo}
                                onToggleDetails={() => setIsDetailsExpanded(!isDetailsExpanded)}
                                isDetailsExpanded={isDetailsExpanded}
                            />
                        ) : (
                            <div className="text-center py-12 text-gray-500 bg-white rounded-2xl shadow-sm">
                                <Icon name="CreditCard" className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                <p>No tienes un plan activo</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'all-plans' && (
                    <div className="animate-fade-in">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-2 bg-gradient-to-r from-lime-600 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
                            Explora Nuestros Planes
                        </h1>
                        <p className="text-gray-500 text-xl text-center mb-8">Elige el plan perfecto para tu tienda en LYRIUM Biomarketplace</p>

                        {showcasePlanData && (
                            <div className="relative rounded-3xl overflow-hidden mb-8 shadow-2xl min-h-[440px]" style={{ backgroundColor: `${showcasePlanData.cssColor}15` }}>
                                <div className="absolute inset-0 bg-cover bg-center opacity-5" style={{ backgroundImage: showcasePlanData.bgImage ? `url(${showcasePlanData.bgImage})` : undefined }}></div>
                                <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/70 to-white/15"></div>
                                <div className="relative z-10 p-10 flex flex-col justify-center max-w-xl">
                                    <span className="inline-flex px-4 py-1.5 rounded-full text-xs font-bold letter-spacing-wide mb-4" style={{ backgroundColor: showcasePlanData.cssColor, color: 'white' }}>
                                        {showcasePlanData.badge || showcasePlanData.name}
                                    </span>
                                    <h2 className="text-4xl md:text-5xl font-black mb-2 text-gray-900">{showcasePlanData.name}</h2>
                                    <p className="text-gray-500 mb-5">{showcasePlanData.description}</p>
                                    <div className="flex items-baseline gap-1 mb-6">
                                        <span className="text-5xl font-black text-gray-900">{showcasePlanData.currency}{showcasePlanData.price.toFixed(2)}</span>
                                        <span className="text-gray-500">{showcasePlanData.period}</span>
                                    </div>
                                    <div className="space-y-2 mb-6">
                                        {showcasePlanData.features?.slice(0, 4).map((feature, idx) => (
                                            <div key={idx} className="flex items-center gap-2.5 text-sm">
                                                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${feature.active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                                                    {feature.active ? '✓' : '×'}
                                                </span>
                                                <span className={feature.active ? 'text-gray-900' : 'text-gray-400 line-through'}>{feature.text}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        className="py-3.5 px-8 rounded-xl font-bold uppercase tracking-wide transition-all hover:-translate-y-1 hover:shadow-lg"
                                        style={{ 
                                            backgroundColor: currentPlan === showcasePlanData.id ? '#e5e7eb' : showcasePlanData.cssColor,
                                            color: currentPlan === showcasePlanData.id ? '#9ca3af' : 'white'
                                        }}
                                        onClick={() => handlePlanSelect(showcasePlanData.id)}
                                        disabled={currentPlan === showcasePlanData.id}
                                    >
                                        {currentPlan === showcasePlanData.id ? 'Plan Actual' : showcasePlanData.subscribeButtonText}
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="mb-6 pl-3">
                            <h3 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                <span className="w-1 h-9 bg-blue-500 rounded"></span>
                                Todos los Planes
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {planOrder.map((planId) => {
                                const plan = plansData[planId];
                                if (!plan || !plan.isActive) return null;
                                
                                return (
                                    <PlanCard
                                        key={planId}
                                        plan={plan}
                                        isActive={showcasePlan === planId}
                                        isCurrentPlan={currentPlan === planId}
                                        isClaimed={false}
                                        isTrialUsed={false}
                                        onSelect={() => handlePlanCardClick(planId)}
                                        onViewBenefits={() => handleViewBenefits(planId)}
                                        buttonColors={buttonColors || undefined}
                                    />
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            <PlanModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                plan={selectedPlan}
                summary={getPaymentSummary()}
                durationPresets={durationPresets}
                selectedPresetId={selectedPresetId}
                customMonths={customMonths}
                onSelectPreset={setSelectedPresetId}
                onChangeCustomMonths={setCustomMonths}
                onProcessPayment={handleProcessPayment}
                isProcessing={isProcessing}
                step={paymentStep}
                onGoToStep={setPaymentStep}
            />

            <BenefitsModal
                isOpen={isBenefitsModalOpen}
                onClose={() => setIsBenefitsModalOpen(false)}
                plan={benefitsPlan}
            />
        </div>
    );
}
