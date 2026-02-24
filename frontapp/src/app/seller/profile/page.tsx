'use client';

import React, { useState, useEffect, useRef } from 'react';
import ModuleHeader from '@/components/layout/shared/ModuleHeader';
import { sellerNavigation } from '@/lib/constants/seller-nav';
import { allowOnlyNumbers } from '@/lib/utils/validation';

import BaseLoading from '@/components/ui/BaseLoading';
import BaseButton from '@/components/ui/BaseButton';
import Icon from '@/components/ui/Icon';
import { useSellerProfile, VendorProfileData } from '@/hooks/useSellerProfile';


export default function MisDatosPage() {
    const moduleConfig = sellerNavigation.find(m => m.id === 'mis-datos')!;

    const {
        data: hookData,
        loading,
        isSaving,
        updateProfile
    } = useSellerProfile();

    const [data, setData] = useState<VendorProfileData | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const EDIT_FIELD_CLASSES = "bg-white/70 ring-sky-500/10 px-3 py-1 rounded-xl border-2 border-sky-100";
    const READONLY_FIELD_CLASSES = "border-transparent px-3 py-1";


    useEffect(() => {
        if (hookData && !isEditMode) {
            setData(hookData);
        }
    }, [hookData, isEditMode]);

    if (loading) {
        return <BaseLoading message="Sincronizando con tu tienda en WordPress..." />;
    }

    if (!data) return null;

    const toggleEditMode = async () => {
        if (isEditMode) {
            await updateProfile(data);
            setIsEditMode(false);
        } else {
            setIsEditMode(true);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setData(prev => {
            if (!prev) return null;
            const newData = { ...prev };
            if (name.startsWith('location_')) {
                const key = name.replace('location_', '') as keyof typeof prev.location;
                newData.location = { ...prev.location, [key]: value };
            } else if (name.startsWith('rrss_')) {
                const key = name.replace('rrss_', '') as keyof typeof prev.rrss;
                newData.rrss = { ...prev.rrss, [key]: value };
            } else {
                // TODO: Mejorar tipado - usar tipo genérico o interfaz específica para campos dinámicos
                // @ts-ignore
                newData[name] = value;
            }

            return newData;
        });
    };

    const handlePhotoClick = () => {
        if (isEditMode && fileInputRef.current) fileInputRef.current.click();
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result && data) setData({ ...data, rep_legal_photo: event.target.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const fieldCls = `w-full text-sm font-black text-gray-800 bg-transparent p-3 border-2 border-gray-100 rounded-xl outline-none focus:border-sky-500 transition-all`;

    return (
        <div className="space-y-8 animate-fadeIn">
            <ModuleHeader
                title={moduleConfig.label}
                subtitle={moduleConfig.description}
                icon={moduleConfig.icon}
                actions={
                    <BaseButton
                        onClick={toggleEditMode}
                        isLoading={isSaving}
                        variant="secondary"
                        leftIcon={isEditMode ? "Save" : "Edit3"}
                        className="shadow-2xl"
                    >
                        {isEditMode ? "Guardar Cambios" : "Editar Información"}
                    </BaseButton>
                }
            />

            <form id="form-mis-datos" className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start" onSubmit={(e) => e.preventDefault()}>

                {/* 1. DATOS EMPRESARIALES */}
                <div className="md:col-span-8 overflow-hidden rounded-[2.5rem] shadow-2xl bg-white border border-gray-100">
                    <div className="bg-gradient-to-r from-sky-500 via-sky-500 to-sky-400 p-8 flex items-center justify-between relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                        <div className="flex items-center gap-5 text-white relative z-10">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-inner">
                                <Icon name="Building2" className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black tracking-tighter leading-none">Datos Empresariales</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <p className="text-[10px] font-black text-sky-100 uppercase tracking-[0.2em] opacity-80">Gestión de Entidad Legal</p>
                                    <span className="px-2 py-0.5 bg-emerald-500/20 backdrop-blur-md rounded-full text-[8px] font-black uppercase tracking-widest text-emerald-100 border border-emerald-500/30 flex items-center gap-1">
                                        Verificado <Icon name="BadgeCheck" className="w-3 h-3 ml-1" />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Razón Social <span className="text-red-500">*</span></label>
                                <input type="text" name="razon_social" required readOnly={!isEditMode} value={data.razon_social} onChange={handleInputChange}
                                    className={`${fieldCls} ${isEditMode ? EDIT_FIELD_CLASSES : READONLY_FIELD_CLASSES}`} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">RUC <span className="text-red-500">*</span></label>
                                <input type="text" name="ruc" required readOnly={!isEditMode} value={data.ruc} onChange={handleInputChange} onKeyDown={allowOnlyNumbers} maxLength={11}
                                    className={`${fieldCls} ${isEditMode ? EDIT_FIELD_CLASSES : READONLY_FIELD_CLASSES}`} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nombre Comercial</label>
                                <input type="text" name="nombre_comercial" readOnly={!isEditMode} value={data.nombre_comercial} onChange={handleInputChange}
                                    className={`${fieldCls} ${isEditMode ? EDIT_FIELD_CLASSES : READONLY_FIELD_CLASSES}`} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Representante Legal <span className="text-red-500">*</span></label>
                                <input type="text" name="rep_legal_nombre" required readOnly={!isEditMode} value={data.rep_legal_nombre} onChange={handleInputChange}
                                    className={`${fieldCls} ${isEditMode ? EDIT_FIELD_CLASSES : READONLY_FIELD_CLASSES}`} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">DNI Representante <span className="text-red-500">*</span></label>
                                <input type="text" name="rep_legal_dni" required readOnly={!isEditMode} value={data.rep_legal_dni} onChange={handleInputChange} onKeyDown={allowOnlyNumbers} maxLength={8}
                                    className={`${fieldCls} ${isEditMode ? EDIT_FIELD_CLASSES : READONLY_FIELD_CLASSES}`} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Años de Experiencia</label>
                                <input type="number" name="experience_years" readOnly={!isEditMode} value={data.experience_years} onChange={handleInputChange}
                                    className={`${fieldCls} ${isEditMode ? EDIT_FIELD_CLASSES : READONLY_FIELD_CLASSES}`} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Departamento / Provincia</label>
                                <div className="flex gap-2">
                                    <input type="text" name="location_department" readOnly={!isEditMode} value={data.location.department} onChange={handleInputChange}
                                        className={`${fieldCls} ${isEditMode ? EDIT_FIELD_CLASSES : READONLY_FIELD_CLASSES}`} />
                                    <input type="text" name="location_province" readOnly={!isEditMode} value={data.location.province} onChange={handleInputChange}
                                        className={`${fieldCls} ${isEditMode ? EDIT_FIELD_CLASSES : READONLY_FIELD_CLASSES}`} />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Condición Tributaria</label>
                                <select name="tax_condition" disabled={!isEditMode} value={data.tax_condition} onChange={handleInputChange}
                                    className={`${fieldCls} cursor-pointer ${isEditMode ? EDIT_FIELD_CLASSES : READONLY_FIELD_CLASSES}`}>
                                    <option value="">Seleccionar...</option>
                                    <option value="Régimen General">Régimen General</option>
                                    <option value="Régimen MYPE Tributario">Régimen MYPE Tributario</option>
                                    <option value="Régimen Especial de Renta">Régimen Especial de Renta (RER)</option>
                                    <option value="Nuevo RUS">Nuevo RUS</option>
                                    <option value="Agente de Retención">Agente de Retención</option>
                                    <option value="Agente de Percepción">Agente de Percepción</option>
                                    <option value="Buen Contribuyente">Buen Contribuyente</option>
                                </select>
                            </div>
                        </div>

                        {/* Redes Sociales */}
                        <div className="pt-6 mt-8 border-t border-gray-100">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-4 block">Presencia en Redes</label>
                            {!isEditMode && (
                                <div className="flex flex-wrap gap-4">
                                    {data.rrss.instagram && (
                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border bg-pink-50 text-pink-600 border-pink-100 font-bold text-xs">
                                            <Icon name="Instagram" className="w-4 h-4" /> <span>{data.rrss.instagram}</span>
                                        </div>
                                    )}
                                    {data.rrss.facebook && (
                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border bg-sky-50 text-sky-600 border-sky-100 font-bold text-xs">
                                            <Icon name="Facebook" className="w-4 h-4" /> <span>{data.rrss.facebook}</span>
                                        </div>
                                    )}
                                    {data.rrss.tiktok && (
                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border bg-gray-50 text-gray-600 border-gray-100 font-bold text-xs">
                                            <Icon name="MonitorPlay" className="w-4 h-4" /> <span>{data.rrss.tiktok}</span>
                                        </div>
                                    )}
                                </div>
                            )}
                            {isEditMode && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-pink-500 uppercase tracking-widest ml-1">Instagram</label>
                                        <input type="text" name="rrss_instagram" placeholder="@usuario" value={data.rrss.instagram} onChange={handleInputChange}
                                            className={`w-full text-xs font-bold p-3 border-2 border-gray-200 rounded-xl outline-none focus:border-pink-400 transition-all ${EDIT_FIELD_CLASSES}`} />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-sky-500 uppercase tracking-widest ml-1">Facebook</label>
                                        <input type="text" name="rrss_facebook" placeholder="/pagina" value={data.rrss.facebook} onChange={handleInputChange}
                                            className={`w-full text-xs font-bold p-3 border-2 border-gray-200 rounded-xl outline-none focus:border-sky-400 transition-all ${EDIT_FIELD_CLASSES}`} />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">TikTok</label>
                                        <input type="text" name="rrss_tiktok" placeholder="@usuario" value={data.rrss.tiktok} onChange={handleInputChange}
                                            className={`w-full text-xs font-bold p-3 border-2 border-gray-200 rounded-xl outline-none focus:border-gray-400 transition-all ${EDIT_FIELD_CLASSES}`} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 2. ADMIN DEL PANEL */}
                <div className="md:col-span-4 h-full">
                    <div className="overflow-hidden rounded-[2.5rem] shadow-2xl bg-white border border-gray-100 h-full">
                        {/* Header Premium */}
                        <div className="bg-gradient-to-r from-sky-500 via-sky-500 to-sky-400 p-8 flex items-center justify-between relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                            <div className="flex items-center gap-5 text-white relative z-10">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-inner">
                                    <Icon name="UserCog" className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black tracking-tighter leading-none">Admin del Panel</h3>
                                    <p className="text-[10px] font-black text-sky-100 uppercase tracking-[0.2em] mt-1 opacity-80">Contacto Directo</p>
                                </div>
                            </div>
                            <div className="relative group z-10" onClick={handlePhotoClick}>
                                <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/30 shadow-xl backdrop-blur-md group-hover:scale-110 transition-all duration-500 cursor-pointer">
                                    <img src={data.rep_legal_photo} alt="Representante Legal" className="w-full h-full object-cover" />
                                    {isEditMode && (
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                            <Icon name="Camera" className="text-white w-5 h-5" />
                                        </div>
                                    )}
                                </div>
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoChange} />
                            </div>
                        </div>

                        <div className="p-8">
                            <div className="space-y-8">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nombres y Apellidos <span className="text-red-500">*</span></label>
                                    <input type="text" name="admin_nombre" required readOnly={!isEditMode} value={data.admin_nombre} onChange={handleInputChange}
                                        className={`${fieldCls} ${isEditMode ? EDIT_FIELD_CLASSES : READONLY_FIELD_CLASSES}`} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">DNI Administrador</label>
                                    <input type="text" name="admin_dni" readOnly={!isEditMode} maxLength={8} value={data.admin_dni} onChange={handleInputChange} onKeyDown={allowOnlyNumbers} placeholder="8 dígitos"
                                        className={`${fieldCls} ${isEditMode ? EDIT_FIELD_CLASSES : READONLY_FIELD_CLASSES}`} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email de Gestión <span className="text-red-500">*</span></label>
                                    <input type="email" name="admin_email" required readOnly={!isEditMode} value={data.admin_email} onChange={handleInputChange}
                                        className={`${fieldCls} ${isEditMode ? EDIT_FIELD_CLASSES : READONLY_FIELD_CLASSES}`} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Teléfonos de contacto</label>
                                    <div className="flex flex-col gap-3">
                                        <input type="text" name="phone_1" readOnly={!isEditMode} placeholder="Principal" value={data.phone_1} onChange={handleInputChange}
                                            className={`${fieldCls} ${isEditMode ? EDIT_FIELD_CLASSES : READONLY_FIELD_CLASSES}`} />
                                        <input type="text" name="phone_2" readOnly={!isEditMode} placeholder="Secundario/WhatsApp" value={data.phone_2} onChange={handleInputChange}
                                            className={`${fieldCls} ${isEditMode ? EDIT_FIELD_CLASSES : READONLY_FIELD_CLASSES}`} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. FINANZAS */}
                <div className="md:col-span-12 overflow-hidden rounded-[2.5rem] shadow-2xl bg-white border border-gray-100">
                    <div className="bg-gradient-to-r from-sky-500 via-sky-500 to-sky-400 p-8 flex items-center justify-between relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                        <div className="flex items-center gap-5 text-white relative z-10">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-inner">
                                <Icon name="Receipt" className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black tracking-tighter leading-none">Finanzas</h3>
                                <p className="text-[10px] font-black text-sky-100 uppercase tracking-[0.2em] mt-1 opacity-80">Configuración de Facturación y Cuentas</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
                            <div className="space-y-1 lg:col-span-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Dirección Fiscal <span className="text-red-500">*</span></label>
                                <textarea name="direccion_fiscal" required readOnly={!isEditMode} rows={1} value={data.direccion_fiscal} onChange={handleInputChange}
                                    className={`w-full text-xs font-black text-gray-800 bg-transparent p-3 border-2 border-gray-100 rounded-xl outline-none focus:border-sky-500 transition-all ${isEditMode ? EDIT_FIELD_CLASSES : READONLY_FIELD_CLASSES}`}></textarea>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Cuenta BCP (Soles) <span className="text-red-500">*</span></label>
                                <input type="text" name="cuenta_bcp" required readOnly={!isEditMode} maxLength={14} placeholder="14 dígitos" value={data.cuenta_bcp} onChange={handleInputChange} onKeyDown={allowOnlyNumbers}
                                    className={`${fieldCls} ${isEditMode ? EDIT_FIELD_CLASSES : READONLY_FIELD_CLASSES}`} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">CCI <span className="text-red-500">*</span></label>
                                <input type="text" name="cci" readOnly={!isEditMode} maxLength={20} placeholder="20 dígitos (CCI)" value={data.cci} onChange={handleInputChange} onKeyDown={allowOnlyNumbers}
                                    className={`${fieldCls} ${isEditMode ? EDIT_FIELD_CLASSES : READONLY_FIELD_CLASSES}`} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Entidad Bancaria Interbancaria</label>
                                <input type="text" name="bank_secondary" readOnly={!isEditMode} placeholder="Entidad Bancaria" value={data.bank_secondary} onChange={handleInputChange}
                                    className={`${fieldCls} ${isEditMode ? EDIT_FIELD_CLASSES : READONLY_FIELD_CLASSES}`} />
                            </div>
                        </div>
                    </div>
                </div>

            </form>
        </div>
    );
}
