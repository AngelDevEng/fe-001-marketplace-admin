'use client';

import React from 'react';
import ModuleHeader from '@/components/layout/shared/ModuleHeader';
import { GlobalLogisticsConfig } from '@/lib/types/seller/logistics';
import ToggleSwitch from './components/ToggleSwitch';
import AddCityModal from './components/AddCityModal';
import AddAgencyModal from './components/AddAgencyModal';
import ModalsPortal from '@/components/layout/shared/ModalsPortal';
import { useSellerLogistics } from '@/hooks/useSellerLogistics';

export default function LogisticsPage() {
    const {
        config,
        isLoading,
        isAddCityOpen,
        setIsAddCityOpen,
        isAddAgencyOpen,
        setIsAddAgencyOpen,
        selectedCityIndex,
        setSelectedCityIndex,
        updateGlobalConfig,
        updateOperator,
        addCityRate,
        removeCityRate,
        updateCityRateValue,
        addAgency,
        removeAgency,
        saveConfig
    } = useSellerLogistics();

    const headerActions = (
        <button
            onClick={saveConfig}
            className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white text-gray-900 font-black text-[11px] uppercase tracking-widest border border-gray-100 shadow-xl hover:text-indigo-600 hover:shadow-indigo-100 transition-all active:scale-95"
        >
            <i className="ph ph-floppy-disk text-xl"></i>
            <span>Guardar Configuración</span>
        </button>
    );

    if (isLoading && !config) {
        return (
            <div className="p-20 flex flex-col items-center justify-center animate-pulse">
                <i className="ph ph-circle-notch animate-spin text-4xl text-indigo-500 mb-4"></i>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Sincronizando Logística...</p>
            </div>
        );
    }

    if (!config) return null;

    return (
        <div className="space-y-8 animate-fadeIn pb-20 font-industrial">
            <ModuleHeader
                title="Mi Logística"
                subtitle="Configuración estratégica de envíos y operadoras"
                icon="ph-truck"
                actions={headerActions}
            />

            {/* Coverage Scope */}
            <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center text-white shadow-sm">
                            <i className="ph ph-map-trifold text-3xl"></i>
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-gray-800 tracking-tighter uppercase italic">Alcance de Cobertura</h3>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Define el rango geográfico de tus entregas</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        {[
                            { label: 'Envíos Locales', sub: 'Misma ciudad', key: 'localEnabled' as keyof GlobalLogisticsConfig },
                            { label: 'Interprovinciales', sub: 'A nivel nacional', key: 'interprovincialEnabled' as keyof GlobalLogisticsConfig }
                        ].map(item => (
                            <div key={item.key} className="flex items-center gap-5 bg-gray-50 p-4 pr-6 rounded-[2rem] border border-gray-100 shadow-sm transition-all hover:shadow-md">
                                <div className="flex flex-col text-left">
                                    <span className="text-[11px] font-black text-gray-800 uppercase tracking-tight">{item.label}</span>
                                    <span className="text-[9px] font-bold text-gray-400 uppercase">{item.sub}</span>
                                </div>
                                <ToggleSwitch
                                    enabled={!!config.globalConfig[item.key]}
                                    onChange={(val) => updateGlobalConfig({ [item.key]: val })}
                                    size="sm"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bento Categories */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Free Shipping */}
                <div className="bg-white group p-8 flex flex-col h-full border-t-4 border-t-emerald-500 rounded-[2.5rem] border border-gray-100 shadow-xl">
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                            <i className="ph ph-gift text-2xl"></i>
                        </div>
                        <ToggleSwitch
                            enabled={!!config.globalConfig.envioGratuitoEnabled}
                            onChange={(val) => updateGlobalConfig({ envioGratuitoEnabled: val })}
                        />
                    </div>
                    <h3 className="text-lg font-black text-gray-800 mb-2 uppercase tracking-tighter">Envío Gratuito</h3>
                    <p className="text-xs font-bold text-gray-400 mb-8 flex-1">Incentiva compras mayores con envíos sin costo adicional.</p>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Monto Mínimo <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-gray-400">S/</span>
                            <input
                                type="number"
                                value={config.globalConfig.montoMinimoGratuito}
                                onChange={(e) => updateGlobalConfig({ montoMinimoGratuito: parseFloat(e.target.value) })}
                                className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500/20 transition-all font-black text-gray-700 outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Recojo en Tienda */}
                <div className="bg-white group p-8 flex flex-col h-full border-t-4 border-t-violet-500 rounded-[2.5rem] border border-gray-100 shadow-xl">
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 bg-violet-50 rounded-2xl flex items-center justify-center text-violet-500 group-hover:scale-110 transition-transform">
                            <i className="ph ph-storefront text-2xl"></i>
                        </div>
                        <ToggleSwitch
                            enabled={!!config.globalConfig.recojoTiendaEnabled}
                            onChange={(val) => updateGlobalConfig({ recojoTiendaEnabled: val })}
                        />
                    </div>
                    <h3 className="text-lg font-black text-gray-800 mb-2 uppercase tracking-tighter">Recojo en Tienda</h3>
                    <p className="text-xs font-bold text-gray-400 mb-8 flex-1">Permite a tus clientes recoger pedidos localmente en tus sedes.</p>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Dirección de Recojo <span className="text-red-500">*</span></label>
                        <textarea
                            rows={2}
                            value={config.globalConfig.direccionTienda}
                            onChange={(e) => updateGlobalConfig({ direccionTienda: e.target.value })}
                            className="w-full px-4 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-violet-500/20 transition-all font-bold text-gray-700 text-sm resize-none outline-none"
                        />
                    </div>
                </div>

                {/* Delivery */}
                <div className="bg-white group p-8 flex flex-col h-full border-t-4 border-t-indigo-500 rounded-[2.5rem] border border-gray-100 shadow-xl">
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
                            <i className="ph ph-truck text-2xl"></i>
                        </div>
                        <ToggleSwitch
                            enabled={!!config.globalConfig.deliveryEnabled}
                            onChange={(val) => updateGlobalConfig({ deliveryEnabled: val })}
                        />
                    </div>
                    <h3 className="text-lg font-black text-gray-800 mb-2 uppercase tracking-tighter">Envío por Delivery</h3>
                    <p className="text-xs font-bold text-gray-400 mb-8 flex-1">Gestión de entregas a domicilio con tarifas dinámicas por región.</p>
                    <div className="flex items-center gap-2 px-4 py-3.5 bg-indigo-50 text-indigo-500 rounded-2xl border border-indigo-100">
                        <i className="ph ph-info text-lg"></i>
                        <span className="text-[10px] font-black uppercase tracking-wider">Tarifas Activas por Zona</span>
                    </div>
                </div>
            </div>

            {/* Destination Management */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center text-white shadow-sm">
                            <i className="ph ph-map-pin-line text-3xl"></i>
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-gray-800 tracking-tighter uppercase italic">Gestión de Destinos</h3>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Configura tarifas y agencias en un solo lugar</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsAddCityOpen(true)}
                        className="flex items-center gap-2 px-6 py-3.5 bg-gray-900 text-white rounded-[1.25rem] text-xs font-black hover:bg-indigo-600 transition-all shadow-xl active:scale-95"
                    >
                        <i className="ph ph-plus-circle text-lg"></i> Añadir Ciudad
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {config.cityRates.map((city, index) => (
                        <div key={`${city.department}-${city.city}`} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-xl space-y-6 hover:shadow-2xl transition-all">
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest block mb-1">{city.department}</span>
                                    <h4 className="text-sm font-black text-gray-800 uppercase tracking-tight">{city.city}</h4>
                                </div>
                                <button
                                    onClick={() => removeCityRate(index)}
                                    className="w-8 h-8 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-100 transition-colors active:scale-90"
                                >
                                    <i className="ph ph-trash"></i>
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Tarifa Plana</label>
                                    <div className="flex items-center gap-2 bg-emerald-50 p-3 rounded-2xl border border-emerald-100">
                                        <span className="text-xs font-black text-emerald-600">S/</span>
                                        <input
                                            type="number"
                                            value={city.rate}
                                            onChange={(e) => updateCityRateValue(index, parseFloat(e.target.value))}
                                            className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm font-black text-emerald-700 outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between px-1">
                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Puntos de Recojo</label>
                                        <button
                                            onClick={() => { setSelectedCityIndex(index); setIsAddAgencyOpen(true); }}
                                            className="text-[9px] font-black text-indigo-600 uppercase hover:underline"
                                        >
                                            + Añadir
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        {city.agencies.map((ag, agIdx) => (
                                            <div key={ag.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl border border-gray-100 group">
                                                <div className="flex items-center gap-3">
                                                    <img src={ag.logo.replace('../', '/')} className="w-8 h-8 object-contain opacity-60 group-hover:opacity-100 transition-opacity" />
                                                    <div className="min-w-0">
                                                        <p className="text-[11px] font-black text-gray-800 truncate">{ag.name}</p>
                                                        <p className="text-[8px] font-bold text-gray-400 uppercase truncate max-w-[120px]">{ag.address}</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => removeAgency(index, agIdx)}
                                                    className="text-gray-300 hover:text-rose-500 p-1 transition-colors active:scale-90"
                                                >
                                                    <i className="ph ph-trash"></i>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Operators and Strategies */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <h3 className="text-xl font-black text-gray-800 tracking-tighter uppercase italic flex items-center gap-3">
                        <div className="p-2 bg-gray-900 rounded-xl text-white"><i className="ph ph-shield-check text-lg"></i></div>
                        Operadores Habilitados
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                        {Object.entries(config.operators).map(([key, op]) => (
                            <div key={key} className="bg-white p-4 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-50 rounded-[1.25rem] border border-gray-100 p-2 flex items-center justify-center">
                                        <img src={`/img/${key.toUpperCase()}.png`} alt={op.name} className="w-full h-full object-contain" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-gray-800">{op.name}</h4>
                                        <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg ${op.enabled ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
                                            {op.enabled ? 'Operando' : 'Inactivo'}
                                        </span>
                                    </div>
                                </div>
                                <ToggleSwitch
                                    enabled={op.enabled}
                                    onChange={(val) => updateOperator(key as any, val)}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <h3 className="text-xl font-black text-gray-800 tracking-tighter uppercase italic flex items-center gap-3">
                        <div className="p-2 bg-gray-900 rounded-xl text-white"><i className="ph ph-list-checks text-lg"></i></div>
                        Estrategias de Despacho
                    </h3>
                    <div className="space-y-4">
                        {[
                            { label: 'Puerta a Puerta', icon: 'ph-house-line', key: 'puertaAPuertaEnabled' as keyof GlobalLogisticsConfig, desc: 'Envío directo al domicilio del cliente.' },
                            { label: 'Recojo en Agencia', icon: 'ph-buildings', key: 'recojoAgenciaEnabled' as keyof GlobalLogisticsConfig, desc: 'Puntos de recojo Shalom, Olva o Cruz del Sur.' }
                        ].map(strategy => (
                            <div key={strategy.key} className="p-5 rounded-[2.5rem] bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex items-start gap-4">
                                <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-600 flex-shrink-0 group-hover:bg-gray-900 group-hover:text-white transition-all">
                                    <i className={`ph ${strategy.icon} text-2xl`}></i>
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-1">
                                        <h4 className="font-black text-gray-800 text-sm uppercase tracking-tighter">{strategy.label}</h4>
                                        <ToggleSwitch
                                            enabled={!!config.globalConfig[strategy.key]}
                                            onChange={(val) => updateGlobalConfig({ [strategy.key]: val })}
                                            size="sm"
                                        />
                                    </div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{strategy.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {isAddCityOpen && (
                <ModalsPortal>
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md animate-fadeIn" onClick={() => setIsAddCityOpen(false)} />
                        <div className="relative z-10 w-full max-w-xl animate-scaleUp">
                            <button onClick={() => setIsAddCityOpen(false)} className="absolute -top-12 right-0 text-white/50 hover:text-white transition-all">
                                <i className="ph ph-x font-bold text-2xl"></i>
                            </button>
                            <AddCityModal
                                isOpen={isAddCityOpen}
                                onClose={() => setIsAddCityOpen(false)}
                                onSave={(rate) => { addCityRate(rate); setIsAddCityOpen(false); }}
                            />
                        </div>
                    </div>
                </ModalsPortal>
            )}

            {isAddAgencyOpen && (
                <ModalsPortal>
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md animate-fadeIn" onClick={() => setIsAddAgencyOpen(false)} />
                        <div className="relative z-10 w-full max-w-xl animate-scaleUp">
                            <button onClick={() => setIsAddAgencyOpen(false)} className="absolute -top-12 right-0 text-white/50 hover:text-white transition-all">
                                <i className="ph ph-x font-bold text-2xl"></i>
                            </button>
                            <AddAgencyModal
                                isOpen={isAddAgencyOpen}
                                onClose={() => {
                                    setIsAddAgencyOpen(false);
                                    setSelectedCityIndex(null);
                                }}
                                onSave={(agency) => {
                                    if (selectedCityIndex !== null) {
                                        const logo = agency.name.toUpperCase().includes('SHALOM') ? '/img/SHALOM.png' :
                                            agency.name.toUpperCase().includes('OLVA') ? '/img/OLVA.png' : '/img/AGENCY_DEFAULT.png';
                                        addAgency(selectedCityIndex, { ...agency, logo });
                                    }
                                    setIsAddAgencyOpen(false);
                                }}
                            />
                        </div>
                    </div>
                </ModalsPortal>
            )}
        </div>
    );
}
