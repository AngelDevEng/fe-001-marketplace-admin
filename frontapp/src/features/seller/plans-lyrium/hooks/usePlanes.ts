'use client';
import { useState, useCallback, useRef, useEffect } from 'react';
import { apiGet, apiPost } from '@/features/seller/plans-lyrium/lib/api';
import { buildPlanOrder, defaultPlansData, durationPresets, getDiscountForMonths } from '@/features/seller/plans-lyrium/lib/plans';
import type { PlansMap, SubscriptionInfo, Request, ButtonColors, SesionResponse, EstadoResponse, AvisoVencimientoResponse } from '@/features/seller/plans-lyrium/types';

export interface PlanesState {
  plansData: PlansMap; planOrder: string[]; currentPlan: string;
  userId: string; userName: string; claimedPlans: string[];
  trialUsedPlans: string[]; subscriptionInfo: SubscriptionInfo | null;
  avisoPorVencer: AvisoVencimientoResponse | null; requestsCache: Request[];
  buttonColors: ButtonColors; activeTab: 'my-plan' | 'all-plans';
  showcasePlan: string; carouselIndex: number; isDetailsExpanded: boolean;
  selectedPaymentPlan: string | null; pendingDowngradePlan: string | null;
  selectedPresetId: string; customMonths: number; benefitDetailPlanKey: string;
  expandedCards: Record<string, boolean>; pendingUIRefresh: boolean;
  modals: { payment: boolean; requestSent: boolean; downgrade: boolean; downgradeConfirm2: boolean; benefitDetail: boolean; benefitFullDetail: boolean; izipayPay: boolean; waitingPayment: boolean };
  sentText: string; downgradeConfirmText: string; isBlocked: boolean;
  blockInfo: { msg: string; sub: string; btnHref: string; btnLabel: string } | null;
  isLoaded: boolean; notification: { msg: string; color: string; visible: boolean } | null;
  izipayConfig: { formToken: string; publicKey: string; orderId: string } | null;
}

type ModalKey = keyof PlanesState['modals'];

const initialState: PlanesState = {
  plansData: defaultPlansData, planOrder: ['basic', 'standard', 'premium'],
  currentPlan: 'basic', userId: 'default', userName: 'Vendedor',
  claimedPlans: [], trialUsedPlans: [], subscriptionInfo: null,
  avisoPorVencer: null, requestsCache: [], buttonColors: {},
  activeTab: 'my-plan', showcasePlan: 'basic', carouselIndex: 0,
  isDetailsExpanded: false, selectedPaymentPlan: null, pendingDowngradePlan: null,
  selectedPresetId: 'trial', customMonths: 4, benefitDetailPlanKey: 'basic',
  expandedCards: {}, pendingUIRefresh: false,
  modals: { payment: false, requestSent: false, downgrade: false, downgradeConfirm2: false, benefitDetail: false, benefitFullDetail: false, izipayPay: false, waitingPayment: false },
  sentText: '', downgradeConfirmText: '', isBlocked: false, blockInfo: null,
  isLoaded: false, notification: null, izipayConfig: null,
};

export function usePlanes() {
  const [state, _setState] = useState<PlanesState>(initialState);
  // stateRef: siempre apunta al estado actual para callbacks async
  const stateRef = useRef(state);
  const setState = useCallback((updater: PlanesState | ((prev: PlanesState) => PlanesState)) => {
    _setState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      stateRef.current = next;
      return next;
    });
  }, []);

  const update = useCallback((patch: Partial<PlanesState>) => {
    setState(prev => {
      const next = { ...prev, ...patch };
      stateRef.current = next;
      return next;
    });
  }, [setState]);

  const setModal = useCallback((key: ModalKey, open: boolean) => {
    setState(prev => ({ ...prev, modals: { ...prev.modals, [key]: open } }));
  }, []);

  const showNotification = useCallback((msg: string, color: string) => {
    setState(prev => ({ ...prev, notification: { msg, color, visible: true } }));
    setTimeout(() => setState(prev => ({ ...prev, notification: prev.notification ? { ...prev.notification, visible: false } : null })), 6000);
  }, []);

  const isPlanClaimed = (planKey: string) => state.claimedPlans.includes(planKey);
  const isTrialUsed   = (planKey: string) => state.trialUsedPlans.includes(planKey);
  const hasPendingRequest = () => state.requestsCache.some(r => r.status === 'pending');

  const getPaymentTotalMonths = (): number => {
    if (state.selectedPresetId === 'trial')  return 1;
    if (state.selectedPresetId === 'custom') return state.customMonths;
    return durationPresets.find(p => p.id === state.selectedPresetId)?.months ?? 1;
  };

  const getPaymentDurationLabel = (): string => {
    if (state.selectedPresetId === 'trial') return 'Prueba gratuita (1 mes)';
    const m = getPaymentTotalMonths();
    if (m >= 12 && m % 12 === 0) { const y = m / 12; return y === 1 ? '1 año (12 meses)' : `${y} años (${m} meses)`; }
    return m === 1 ? '1 mes' : `${m} meses`;
  };

  const initialize = useCallback(async () => {
    try {
      const sesionRes = await apiGet<SesionResponse>('/usuario/sesion.php');
      if (!sesionRes?.logged_in || sesionRes.rol !== 'Vendedor') {
        let msg = '', sub = '', btnHref = '', btnLabel = '';
        if (!sesionRes?.logged_in) { msg = 'Acceso restringido'; sub = 'Debes iniciar sesión como vendedor.'; btnHref = '/login'; btnLabel = 'Iniciar sesión'; }
        else if (sesionRes.rol === 'Admin') { msg = 'Esta sección es para vendedores'; sub = 'Gestiona los planes desde el panel admin.'; btnHref = '/admin'; btnLabel = 'Ir al panel admin'; }
        else { msg = 'Sin permiso'; sub = 'Tu cuenta no tiene acceso.'; btnHref = '/'; btnLabel = 'Ir al inicio'; }
        update({ isBlocked: true, blockInfo: { msg, sub, btnHref, btnLabel }, isLoaded: true });
        return;
      }
      const userId = sesionRes.usuario_id ?? 'default';
      const userName = sesionRes.username ?? 'Vendedor';
      const [estadoRes, planesRes, coloresRes, avisoRes, requestsRes] = await Promise.all([
        apiGet<EstadoResponse>(`/usuario/estado.php?usuario_id=${userId}`),
        apiGet<{ success: boolean; plans?: PlansMap }>('/planes/config.php'),
        apiGet<{ success: boolean; colors?: ButtonColors }>('/ui/colores.php'),
        apiGet<AvisoVencimientoResponse>(`/usuario/aviso_vencimiento.php?usuario_id=${userId}`),
        apiGet<{ success: boolean; requests?: Request[] }>(`/solicitudes/index.php?usuario_id=${userId}`),
      ]);
      let currentPlan = estadoRes.success ? (estadoRes.currentPlan ?? 'basic') : 'basic';
      const plansData = (planesRes.success && planesRes.plans && Object.keys(planesRes.plans).length > 0) ? planesRes.plans : defaultPlansData;
      const planOrder = buildPlanOrder(plansData);
      if (!plansData[currentPlan] && planOrder.length > 0) currentPlan = planOrder[0];
      const carouselIndex = Math.max(0, planOrder.indexOf(currentPlan));
      update({
        plansData, planOrder, currentPlan, userId, userName,
        claimedPlans: estadoRes.success ? (estadoRes.claimedPlans ?? []) : [],
        trialUsedPlans: estadoRes.success ? (estadoRes.trialUsed ?? []) : [],
        subscriptionInfo: estadoRes.success ? (estadoRes.subscription ?? null) : null,
        avisoPorVencer: avisoRes?.porVencer ? avisoRes : null,
        requestsCache: requestsRes.success ? (requestsRes.requests ?? []) : [],
        buttonColors: (coloresRes.success && coloresRes.colors) ? coloresRes.colors : {},
        showcasePlan: currentPlan, carouselIndex, isLoaded: true,
      });
    } catch { update({ isLoaded: true }); }
  }, [update]);

  const switchTab = (tab: 'my-plan' | 'all-plans') => update({ activeTab: tab });

  const selectCarouselPlan = (plan: string) => {
    setState(prev => ({ ...prev, showcasePlan: plan, carouselIndex: prev.planOrder.indexOf(plan) }));
  };

  const carouselStep = (delta: number) => {
    setState(prev => {
      const newIndex = Math.max(0, Math.min(prev.planOrder.length - 1, prev.carouselIndex + delta));
      if (newIndex === prev.carouselIndex) return prev;
      return { ...prev, carouselIndex: newIndex, showcasePlan: prev.planOrder[newIndex] };
    });
  };

  const saveRequest = useCallback(async (req: Omit<Request, 'usuario_id'>) => {
    const currentUserId   = stateRef.current.userId;
    const currentUserName = stateRef.current.userName;
    const fullReq = { ...req, usuario_id: currentUserId, userName: req.userName || currentUserName };
    const res = await apiPost<{ success: boolean; id?: number; auto_approved?: boolean }>('/solicitudes/index.php', fullReq);
    if (!res.success) return;
    if (res.auto_approved) {
      setTimeout(async () => {
        const est = await apiGet<EstadoResponse>(`/usuario/estado.php?usuario_id=${currentUserId}`);
        if (est.success) setState(prev => ({ ...prev, currentPlan: req.toPlan, subscriptionInfo: est.subscription ?? null, claimedPlans: est.claimedPlans ?? [], trialUsedPlans: est.trialUsed ?? [] }));
      }, 5000);
    } else {
      const savedReq: Request = { ...fullReq, id: res.id, date: new Date().toISOString(), status: 'pending' };
      setState(prev => ({ ...prev, requestsCache: [...prev.requestsCache, savedReq] }));
    }
  }, []);

  const claimFreePlan = useCallback(async (planKey: string) => {
    setState(prev => {
      const data = prev.plansData[planKey]; if (!data) return prev;
      const stdData = prev.plansData.standard;
      const baseTotal = stdData ? stdData.price * 6 : 0;
      let sentHtml = `<strong>${data.trialSuccessTitle || '¡Plan activado!'}</strong><br><br>${data.trialSuccessMessage || ''}`;
      if (planKey === 'premium' && baseTotal > 0) sentHtml += `<br><span style="color:#16b910;font-weight:800;">${data.currency ?? 'S/'} 0 (100% descuento)</span>`;
      sentHtml += `<br><br><span style="color:#6b7280;font-size:13px;">${data.trialWaitMessage || ''}</span>`;
      return { ...prev, sentText: sentHtml, modals: { ...prev.modals, requestSent: true } };
    });
    // Leer datos frescos para saveRequest desde stateRef
    const planData = stateRef.current.plansData[planKey];
    const currentPlan = stateRef.current.currentPlan;
    const userName = stateRef.current.userName;
    const stdPrice = stateRef.current.plansData.standard?.price ?? 0;
    const baseTotal = stdPrice * 6;
    await saveRequest({ type: 'free_claim', fromPlan: currentPlan, toPlan: planKey, planName: planData.name, duration: `Prueba gratuita (${planData.claimMonths ?? 1} mes)`, durationId: `free_claim_${planKey}`, months: planData.claimMonths ?? 1, amount: 0, originalAmount: planKey === 'premium' ? baseTotal : 0, discountPercent: planKey === 'premium' ? 100 : 0, userName });
    if (planData.enableClaimLock) setState(prev => ({ ...prev, claimedPlans: prev.claimedPlans.includes(planKey) ? prev.claimedPlans : [...prev.claimedPlans, planKey] }));
  }, [saveRequest]);

  const openDowngradeModal  = (plan: string) => { update({ pendingDowngradePlan: plan }); setModal('downgrade', true); };
  const closeDowngradeModal = () => { setModal('downgrade', false); update({ pendingDowngradePlan: null }); };

  const confirmDowngrade = useCallback(() => {
    setState(prev => {
      const plan = prev.pendingDowngradePlan; if (!plan) return prev;
      let diasTexto = ' El cambio se aplicará de forma inmediata.';
      if (prev.subscriptionInfo?.expiryDate) {
        const dias = Math.ceil((new Date(prev.subscriptionInfo.expiryDate).getTime() - Date.now()) / 86400000);
        if (dias > 0) diasTexto = ` Conservarás los <strong>${dias} días restantes</strong>.`;
      }
      return { ...prev, downgradeConfirmText: diasTexto, modals: { ...prev.modals, downgrade: false, downgradeConfirm2: true } };
    });
  }, []);

  const cancelDowngradeConfirm2 = () => { setModal('downgradeConfirm2', false); update({ pendingDowngradePlan: null }); };

  const executeDowngrade = useCallback(async () => {
    const plan   = stateRef.current.pendingDowngradePlan ?? '';
    const userId = stateRef.current.userId;
    if (!plan) return null;
    setModal('downgradeConfirm2', false);
    const res = await apiPost<{ success: boolean; message?: string }>('/solicitudes/downgrade.php', { usuarioId: userId, toPlan: plan });
    if (res.success) {
      setState(prev => {
        const planName  = prev.plansData[plan]?.name ?? plan;
        const planColor = prev.plansData[plan]?.cssColor ?? '#6b7280';
        setTimeout(() => showNotification(`Tu plan ha sido cambiado a ${planName}`, planColor), 0);
        return { ...prev, currentPlan: plan, pendingDowngradePlan: null, requestsCache: prev.requestsCache.filter(r => r.status !== 'pending') };
      });
    } else {
      update({ pendingDowngradePlan: null });
      showNotification(res.message ?? 'Error al cambiar de plan.', '#ef4444');
    }
    return res;
  }, [setModal, update, showNotification]);

  const closeRequestSentModal = () => {
    setState(prev => {
      const refresh = prev.pendingUIRefresh;
      return { ...prev, modals: { ...prev.modals, requestSent: false }, pendingUIRefresh: false, currentPlan: refresh ? prev.currentPlan : prev.currentPlan };
    });
  };

  const openPaymentModal = useCallback((plan: string) => {
    setState(prev => {
      const data = prev.plansData[plan]; if (!data) return prev;
      if (plan === 'premium' && !data.requiresPayment) {
        // claimFreePlan no puede llamarse aquí (es async), se hace con setTimeout
        setTimeout(() => claimFreePlan(plan), 0);
        return prev;
      }
      // Si la prueba ya fue usada, empezar con 1 mes en lugar de trial
      const trialUsed = prev.trialUsedPlans.includes(plan);
      return { ...prev, selectedPaymentPlan: plan, selectedPresetId: trialUsed ? '1m' : 'trial', customMonths: 4, modals: { ...prev.modals, payment: true } };
    });
  }, [claimFreePlan]);

  const closePaymentModal = () => { setModal('payment', false); update({ selectedPaymentPlan: null }); };

  const selectPreset = (id: string) => update({ selectedPresetId: id, customMonths: id === 'custom' ? 4 : state.customMonths });

  const changeCustomQty = (delta: number) => setState(prev => ({ ...prev, customMonths: Math.max(4, Math.min(48, prev.customMonths + delta)) }));

  const processPayment = useCallback(async () => {
    const {
      selectedPaymentPlan, selectedPresetId, plansData,
      currentPlan, userId, userName, customMonths,
    } = stateRef.current;
    if (!selectedPaymentPlan) return null;
    const isTrial = selectedPresetId === 'trial';
    const data = plansData[selectedPaymentPlan ?? ''];
    const planId = selectedPaymentPlan ?? '';
    // Calcular meses y label con los valores frescos
    let totalMonths: number;
    if (selectedPresetId === 'trial')  totalMonths = 1;
    else if (selectedPresetId === 'custom') totalMonths = customMonths;
    else totalMonths = durationPresets.find(p => p.id === selectedPresetId)?.months ?? 1;
    let durationLabel: string;
    if (selectedPresetId === 'trial') durationLabel = 'Prueba gratuita (1 mes)';
    else if (totalMonths >= 12 && totalMonths % 12 === 0) { const y = totalMonths / 12; durationLabel = y === 1 ? '1 año (12 meses)' : `${y} años (${totalMonths} meses)`; }
    else durationLabel = totalMonths === 1 ? '1 mes' : `${totalMonths} meses`;

    if (isTrial) {
      setState(prev => ({ ...prev, sentText: `<strong>¡Tu plan ${data.name} está activándose!</strong><br><br><span style="color:#6b7280;font-size:13px;">Tu acceso se activará automáticamente en unos segundos.</span>`, selectedPaymentPlan: null, modals: { ...prev.modals, payment: false, requestSent: true } }));
      await saveRequest({ type: 'upgrade', fromPlan: currentPlan, toPlan: planId, planName: data.name, duration: durationLabel, durationId: 'trial', months: totalMonths, amount: 0, userName, paymentMethod: 'trial' });
      if (data.enableClaimLock) setState(prev => ({ ...prev, claimedPlans: prev.claimedPlans.includes(planId) ? prev.claimedPlans : [...prev.claimedPlans, planId] }));
      return null;
    }
    const res = await apiPost<{ success: boolean; formToken?: string; publicKey?: string; orderId?: string; message?: string }>('/pagos/crear_sesion.php', { planId, durationId: selectedPresetId, months: totalMonths, usuarioId: userId });
    if (!res.success || !res.formToken) { showNotification(res.message ?? 'No se pudo iniciar el pago.', '#ef4444'); return null; }
    setState(prev => ({ ...prev, selectedPaymentPlan: null, modals: { ...prev.modals, payment: false, izipayPay: true }, izipayConfig: { formToken: res.formToken!, publicKey: res.publicKey!, orderId: res.orderId! } }));
    return res;
  }, [saveRequest, showNotification]);

  const onFeatureClick      = (planKey: string) => { update({ benefitDetailPlanKey: planKey }); setModal('benefitDetail', true); };
  const goToBenefitDetail   = () => { setModal('benefitDetail', false); setModal('benefitFullDetail', true); };
  const toggleDetails       = () => setState(prev => ({ ...prev, isDetailsExpanded: !prev.isDetailsExpanded }));
  const toggleCarouselCard  = (key: string) => setState(prev => ({ ...prev, expandedCards: { ...prev.expandedCards, [key]: !prev.expandedCards[key] } }));

  // SSE handlers — wrapeados en useCallback y usan setState funcional para evitar stale closures
  const handleSolicitudActualizada = useCallback(async (data: { pendientes?: Request[] }) => {
    for (const req of (data.pendientes ?? [])) {
      if (req.status !== 'approved') continue;
      if (req.id) await apiPost('/solicitudes/aplicar.php', { id: req.id });
      const currentUserId = stateRef.current.userId;
      const est = await apiGet<EstadoResponse>(`/usuario/estado.php?usuario_id=${currentUserId}`);
      const av  = await apiGet<AvisoVencimientoResponse>(`/usuario/aviso_vencimiento.php?usuario_id=${currentUserId}`);
      setState(prev => {
        const planNom   = prev.plansData[req.toPlan]?.name ?? req.toPlan;
        const planColor = prev.plansData[req.toPlan]?.cssColor ?? '#10b981';
        // Programar notificación fuera del setState (efecto secundario)
        setTimeout(() => showNotification(`Tu plan ${planNom} está activo.`, planColor), 0);
        return {
          ...prev, currentPlan: req.toPlan,
          requestsCache: prev.requestsCache.filter(r => r.id !== req.id),
          subscriptionInfo: est.success ? (est.subscription ?? null) : prev.subscriptionInfo,
          claimedPlans: est.success ? (est.claimedPlans ?? prev.claimedPlans) : prev.claimedPlans,
          trialUsedPlans: est.success ? (est.trialUsed ?? prev.trialUsedPlans) : prev.trialUsedPlans,
          avisoPorVencer: av?.porVencer ? av : null,
          pendingUIRefresh: prev.modals.requestSent,
        };
      });
    }
  }, [showNotification]);

  const handlePagoConfirmado = useCallback(async (data: { planId: string; meses: number; monto: number }) => {
    setModal('waitingPayment', false);
    const currentUserId = stateRef.current.userId;
    const est = await apiGet<EstadoResponse>(`/usuario/estado.php?usuario_id=${currentUserId}`);
    const av  = await apiGet<AvisoVencimientoResponse>(`/usuario/aviso_vencimiento.php?usuario_id=${currentUserId}`);
    setState(prev => {
      const planNom   = prev.plansData[data.planId]?.name ?? data.planId;
      const planColor = prev.plansData[data.planId]?.cssColor ?? '#10b981';
      return {
        ...prev, currentPlan: data.planId,
        subscriptionInfo: est.success ? (est.subscription ?? null) : null,
        claimedPlans:     est.success ? (est.claimedPlans ?? []) : prev.claimedPlans,
        trialUsedPlans:   est.success ? (est.trialUsed    ?? []) : prev.trialUsedPlans,
        avisoPorVencer:   av?.porVencer ? av : null,
        pendingUIRefresh: true,
        sentText: `<strong>¡Pago confirmado! 🎉</strong><br><br>Tu plan <span style="color:${planColor};font-weight:800">${planNom}</span> ha sido activado por <strong>${data.meses === 1 ? '1 mes' : `${data.meses} meses`}</strong>.<br><br><span style="color:#6b7280;font-size:13px;">S/ ${parseFloat(String(data.monto ?? 0)).toFixed(2)} · Procesado por Izipay</span>`,
        modals: { ...prev.modals, requestSent: true },
      };
    });
  }, [setModal]);

  const handlePlanesActualizados = useCallback(async () => {
    const [planesRes, coloresRes] = await Promise.all([
      apiGet<{ success: boolean; plans?: PlansMap }>('/planes/config.php'),
      apiGet<{ success: boolean; colors?: ButtonColors }>('/ui/colores.php'),
    ]);
    setState(prev => {
      const newPlans = (planesRes.success && planesRes.plans && Object.keys(planesRes.plans).length > 0) ? planesRes.plans : prev.plansData;
      return { ...prev, plansData: newPlans, planOrder: buildPlanOrder(newPlans), buttonColors: (coloresRes.success && coloresRes.colors) ? coloresRes.colors : prev.buttonColors };
    });
  }, []);

  // Declarado ANTES del useEffect para evitar ReferenceError
  const handleColoresActualizados = useCallback(async () => {
    const res = await apiGet<{ success: boolean; colors?: ButtonColors }>('/ui/colores.php');
    if (res.success && res.colors) update({ buttonColors: res.colors });
  }, [update]);
  // Actualizar ref para que el BroadcastChannel listener siempre use la versión actualizada
  useEffect(() => { handleColoresActualizadosRef.current = handleColoresActualizados; }, [handleColoresActualizados]);

  // Refs para los handlers — evita ReferenceError independientemente del orden de declaración
  const handlePlanesActualizadosRef = useRef(handlePlanesActualizados);
  useEffect(() => { handlePlanesActualizadosRef.current = handlePlanesActualizados; }, [handlePlanesActualizados]);
  const handleColoresActualizadosRef = useRef<() => Promise<void>>(async () => {});
  // Escuchar notificaciones de cambios desde el admin (misma sesión del navegador)
  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') return;
    const bc = new BroadcastChannel('lyrium-planes');
    bc.onmessage = (e) => {
      if (e.data?.event === 'planes_actualizados') handlePlanesActualizadosRef.current();
      else if (e.data?.event === 'colores_actualizados') handleColoresActualizadosRef.current();
    };
    return () => bc.close();
  }, []);

  const handlePlanVencido = useCallback(async (data: { planActual?: string }) => {
    const currentUserId = stateRef.current.userId;
    const av = await apiGet<AvisoVencimientoResponse>(`/usuario/aviso_vencimiento.php?usuario_id=${currentUserId}`);
    setState(prev => ({ ...prev, currentPlan: data.planActual ?? 'basic', subscriptionInfo: null, avisoPorVencer: av?.porVencer ? av : null }));
    showNotification('Tu plan ha vencido y fue movido automáticamente al plan Emprende.', '#ef4444');
  }, [showNotification]);

  return {
    state, update, setModal, showNotification, initialize, switchTab,
    selectCarouselPlan, carouselStep, toggleCarouselCard, claimFreePlan,
    openDowngradeModal, closeDowngradeModal, confirmDowngrade,
    cancelDowngradeConfirm2, executeDowngrade, closeRequestSentModal,
    openPaymentModal, closePaymentModal, selectPreset, changeCustomQty,
    processPayment, onFeatureClick, goToBenefitDetail, toggleDetails,
    isPlanClaimed, isTrialUsed, hasPendingRequest,
    getPaymentTotalMonths, getPaymentDurationLabel, getDiscountForMonths,
    handleSolicitudActualizada, handlePagoConfirmado, handlePlanesActualizados,
    handlePlanVencido, handleColoresActualizados,
  };
}