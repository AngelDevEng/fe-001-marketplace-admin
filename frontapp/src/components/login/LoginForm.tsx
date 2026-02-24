'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useLogin } from '@/hooks/useLogin';
import { Loader2, Lock, Mail, User, Phone, Building2, ArrowRight, CheckCircle } from 'lucide-react';

interface LoginFormProps {
    onSuccess?: () => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
    const [showIntro, setShowIntro] = useState(true);
    const [isIntroExiting, setIsIntroExiting] = useState(false);
    const [isRegisterMode, setIsRegisterMode] = useState(false);
    const [loginData, setLoginData] = useState({
        username: '',
        password: '',
        rememberMe: false,
    });
    const [registerData, setRegisterData] = useState({
        storeName: '',
        email: '',
        phone: '',
        password: '',
        ruc: '',
    });
    const [formError, setFormError] = useState<string | null>(null);
    const [formSuccess, setFormSuccess] = useState<string | null>(null);

    const { login, isLoading, error, clearError } = useLogin();

    const handleEnterPortal = () => {
        setIsIntroExiting(true);
        setTimeout(() => {
            setShowIntro(false);
        }, 800);
    };

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.key === 'Enter' && !showIntro) {
                handleEnterPortal();
            }
        };
        window.addEventListener('keypress', handleKeyPress);
        return () => window.removeEventListener('keypress', handleKeyPress);
    }, [showIntro]);

    const handleLoginSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setFormError(null);
        setFormSuccess(null);

        const result = await login(loginData);

        if (result.success) {
            setFormSuccess(result.message || 'Login exitoso');
            onSuccess?.();
        } else {
            setFormError(result.error || 'Credenciales inválidas');
        }
    };

    const handleRegisterSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setFormError(null);
        setFormSuccess(null);

        if (registerData.ruc.length !== 11) {
            setFormError('El RUC debe tener exactamente 11 dígitos');
            return;
        }

        if (registerData.phone.length !== 9) {
            setFormError('El teléfono debe tener exactamente 9 dígitos');
            return;
        }

        setFormSuccess('Registro exitoso. Recibirás un email cuando sea aprobado.');
        setTimeout(() => {
            setRegisterData({
                storeName: '',
                email: '',
                phone: '',
                password: '',
                ruc: '',
            });
        }, 3000);
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        formType: 'login' | 'register'
    ) => {
        const { name, value, type, checked } = e.target;

        if (formType === 'login') {
            setLoginData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value,
            }));
        } else {
            if (name === 'phone' || name === 'ruc') {
                const numericValue = value.replace(/[^0-9]/g, '');
                setRegisterData(prev => ({ ...prev, [name]: numericValue }));
            } else {
                setRegisterData(prev => ({
                    ...prev,
                    [name]: value,
                }));
            }
        }
        clearError();
        setFormError(null);
    };

    const toggleMode = () => {
        setIsRegisterMode(!isRegisterMode);
        setFormError(null);
        setFormSuccess(null);
        clearError();
    };

    if (showIntro) {
        return (
            <div className={`fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-sky-500/95 via-sky-400/90 to-lime-400/85 transition-all duration-700 ${isIntroExiting ? 'opacity-0 translate-y-[-100px] scale-95' : ''}`}>
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&q=80')] bg-cover bg-center opacity-20" />
                <div className="absolute inset-0 bg-black/30" />
                
                {/* Floating particles */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-[10%] left-[10%] w-24 h-24 bg-white/30 rounded-full animate-[floatParticle_20s_ease-in-out_infinite]" />
                    <div className="absolute top-[60%] right-[15%] w-36 h-36 bg-white/30 rounded-full animate-[floatParticle_20s_ease-in-out_infinite_5s]" />
                    <div className="absolute bottom-[15%] left-[20%] w-20 h-20 bg-white/30 rounded-full animate-[floatParticle_20s_ease-in-out_infinite_10s]" />
                </div>

                <div className="relative z-10 text-center max-w-[800px] px-10 animate-[fadeInUp_1s_ease-out]">
                    <div className="mb-10 animate-[float_3s_ease-in-out_infinite]">
                        <Building2 className="w-28 h-28 mx-auto text-white drop-shadow-lg" />
                    </div>
                    <h1 className="text-[3.5rem] font-black text-white mb-5 leading-tight drop-shadow-lg animate-[fadeInUp_1s_ease-out_0.2s_both]">
                        El Marketplace que cuida tu marca
                    </h1>
                    <p className="text-xl text-white/95 mb-12 leading-relaxed drop-shadow-md animate-[fadeInUp_1s_ease-out_0.4s_both]">
                        Únete a la comunidad de vendedores que están transformando el comercio sostenible
                    </p>
                    <button
                        onClick={handleEnterPortal}
                        className="inline-flex items-center gap-3 py-5 px-12 bg-white text-sky-500 rounded-full text-lg font-bold shadow-[0_20px_60px_rgba(0,0,0,0.3)] hover:shadow-[0_25px_70px_rgba(0,0,0,0.4)] hover:-translate-y-1 hover:scale-105 transition-all duration-300 animate-[fadeInUp_1s_ease-out_0.6s_both] animate-[pulse_2s_ease-in-out_2s_infinite] uppercase tracking-wide"
                    >
                        <span>Entrar al Portal</span>
                        <ArrowRight className="w-6 h-6" />
                    </button>
                </div>

                <style jsx global>{`
                    @keyframes fadeInUp {
                        from { opacity: 0; transform: translateY(30px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    @keyframes float {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-20px); }
                    }
                    @keyframes pulse {
                        0%, 100% { box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3); }
                        50% { box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 10px rgba(255, 255, 255, 0.2); }
                    }
                    @keyframes floatParticle {
                        0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
                        25% { transform: translate(30px, -30px) scale(1.1); opacity: 0.5; }
                        50% { transform: translate(-20px, -50px) scale(0.9); opacity: 0.4; }
                        75% { transform: translate(40px, -20px) scale(1.05); opacity: 0.6; }
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4">
            <div className="relative w-full max-w-[1200px] min-h-[650px] bg-white rounded-[30px] shadow-[0_40px_100px_rgba(0,0,0,0.1)] overflow-hidden flex transition-all duration-700">
                {/* Panel Lateral */}
                <div
                    className={`absolute top-0 left-0 h-full w-[40%] bg-gradient-to-br from-sky-500 via-sky-400 to-lime-400 p-10 flex flex-col justify-between text-white z-20 transition-all duration-700 cubic-bezier(0.68,-0.55,0.265,1.55) rounded-r-[20px] ${
                        isRegisterMode ? 'left-[60%]' : ''
                    }`}
                    style={{
                        background: 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 50%, #84cc16 100%)'
                    }}
                >
                    {/* Grid pattern overlay con animación */}
                    <div className="absolute inset-0 opacity-30 animate-[gridMove_20s_linear_infinite]">
                        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <pattern id="gridLogin" width="20" height="20" patternUnits="userSpaceOnUse">
                                    <path
                                        d="M 20 0 L 0 0 0 20"
                                        fill="none"
                                        stroke="rgba(255,255,255,0.1)"
                                        strokeWidth="1"
                                    />
                                </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#gridLogin)" />
                        </svg>
                    </div>

                    <div className="relative z-10">
                        {/* Login Content */}
                        <div className={`transition-all duration-300 ${isRegisterMode ? 'opacity-0 hidden' : 'opacity-100'}`}>
                            <h2 className="text-[2rem] font-black mb-4 leading-tight">
                                ¡Qué gusto verte de nuevo!
                            </h2>
                            <p className="text-white/95 text-center max-w-[300px] mx-auto">
                                Accede a tu panel para revisar tus ventas de hoy y actualizar tu inventario.
                            </p>
                        </div>

                        {/* Register Content */}
                        <div className={`transition-all duration-300 absolute top-0 left-0 w-full px-10 py-10 ${isRegisterMode ? 'opacity-100' : 'opacity-0 hidden'}`}>
                            <h2 className="text-[2rem] font-black mb-4 leading-tight">
                                Haz crecer tu marca con nosotros.
                            </h2>
                            <p className="text-white/95 text-center max-w-[300px] mx-auto">
                                Únete a la comunidad de vendedores más grande y gestiona tus pedidos en un solo lugar.
                            </p>
                        </div>
                    </div>

                    <div className="relative z-10">
                        <p className="text-sm mb-4 opacity-90">
                            {isRegisterMode ? '¿Ya tienes cuenta?' : '¿Ya eres parte de Lyrium?'}
                        </p>
                        <button
                            type="button"
                            onClick={toggleMode}
                            className="w-full py-4 px-6 bg-white text-sky-500 rounded-xl font-bold text-sm uppercase tracking-wider shadow-[0_10px_25px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 transition-all duration-300"
                        >
                            {isRegisterMode ? 'Iniciar Sesión' : 'Registrarse como vendedor'}
                        </button>
                    </div>

                    {/* Background Icon */}
                    <div className="absolute -bottom-40 -right-20 opacity-15 pointer-events-none z-0">
                        <Building2 className="w-[320px] h-[320px] text-white" />
                    </div>
                </div>

                {/* Form Section */}
                <div
                    className={`absolute top-0 right-0 h-full w-[60%] bg-white p-10 flex flex-col justify-between transition-all duration-700 cubic-bezier(0.68,-0.55,0.265,1.55) z-10 ${
                        isRegisterMode ? 'right-[40%]' : ''
                    }`}
                >
                    {/* Login Form */}
                    <div className={`flex flex-col h-full ${isRegisterMode ? 'opacity-0 hidden' : 'opacity-100'}`}>
                        <div className="flex-1 w-[90%] mx-auto">
                            <div className="flex items-center gap-6 mb-8">
                                <div className="w-16 h-16 bg-sky-50 rounded-2xl flex items-center justify-center text-sky-500 shadow-[0_10px_20px_rgba(14,165,233,0.1)] flex-shrink-0">
                                    <User className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900">Inicia sesión como vendedor</h3>
                                    <p className="text-slate-500 text-sm">Ingresa tus credenciales para acceder al panel.</p>
                                </div>
                            </div>

                            {/* Error/Success Messages - Estilo legacy */}
                            <div className="error-message" style={{ display: formError || error ? 'block' : 'none' }} role="alert">
                                {formError || error}
                            </div>
                            <div className="success-message" style={{ display: formSuccess ? 'block' : 'none' }} role="status">
                                {formSuccess}
                            </div>

                            <form onSubmit={handleLoginSubmit} className="space-y-5" noValidate>
                                <div>
                                    <label htmlFor="login-email" className="block text-sm font-semibold text-slate-700 mb-2">
                                        Usuario / Nombre de Tienda <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" aria-hidden="true" />
                                        <input
                                            id="login-email"
                                            type="text"
                                            name="username"
                                            value={loginData.username}
                                            onChange={(e) => handleInputChange(e, 'login')}
                                            placeholder="Nombre de tu tienda o admin"
                                            autoComplete="username"
                                            required
                                            aria-required="true"
                                            className="w-full py-3.5 pl-12 pr-4 border-2 border-slate-200 rounded-xl text-sm text-slate-700 bg-slate-50 focus:outline-none focus:border-sky-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(66,153,225,0.1)] transition-all duration-300"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="login-password" className="block text-sm font-semibold text-slate-700 mb-2">
                                        Contraseña <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" aria-hidden="true" />
                                        <input
                                            id="login-password"
                                            type="password"
                                            name="password"
                                            value={loginData.password}
                                            onChange={(e) => handleInputChange(e, 'login')}
                                            placeholder="••••••••"
                                            autoComplete="current-password"
                                            required
                                            aria-required="true"
                                            className="w-full py-3.5 pl-12 pr-4 border-2 border-slate-200 rounded-xl text-sm text-slate-700 bg-slate-50 focus:outline-none focus:border-sky-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(66,153,225,0.1)] transition-all duration-300"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-between items-center">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="rememberMe"
                                            checked={loginData.rememberMe}
                                            onChange={(e) => handleInputChange(e, 'login')}
                                            className="w-4 h-4 accent-sky-500 cursor-pointer"
                                        />
                                        <span className="text-sm text-slate-600 select-none">Recordarme</span>
                                    </label>
                                    <a href="#" className="text-sm text-sky-500 hover:text-sky-700 font-medium transition-colors">
                                        ¿Olvidaste tu contraseña?
                                    </a>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="group relative w-full py-4 bg-gradient-to-r from-sky-500 to-sky-400 text-white font-bold text-sm uppercase tracking-wider rounded-xl shadow-[0_10px_25px_rgba(14,165,233,0.3)] hover:shadow-[0_15px_35px_rgba(14,165,233,0.4)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-3 overflow-hidden"
                                >
                                    <span className="relative z-10 flex items-center gap-3">
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                <span>Iniciando sesión...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Iniciar Sesión</span>
                                                <User className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-rotate-10" />
                                            </>
                                        )}
                                    </span>
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Register Form */}
                    <div className={`flex flex-col h-full ${isRegisterMode ? 'opacity-100' : 'opacity-0 hidden'}`}>
                        <div className="flex-1 w-[90%] mx-auto">
                            <div className="flex items-center gap-6 mb-8">
                                <div className="w-16 h-16 bg-sky-50 rounded-2xl flex items-center justify-center text-sky-500 shadow-[0_10px_20px_rgba(14,165,233,0.1)] flex-shrink-0">
                                    <Building2 className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900">Crea tu tienda</h3>
                                    <p className="text-slate-500 text-sm">Ingresa los detalles para configurar tu perfil de vendedor.</p>
                                </div>
                            </div>

                            {/* Error/Success Messages - Estilo legacy */}
                            <div className="error-message" style={{ display: formError ? 'block' : 'none' }} role="alert">
                                {formError}
                            </div>
                            <div className="success-message" style={{ display: formSuccess ? 'block' : 'none' }} role="status">
                                {formSuccess}
                            </div>

                            <form onSubmit={handleRegisterSubmit} className="grid grid-cols-2 gap-5" noValidate>
                                <div className="col-span-2">
                                    <label htmlFor="store-name" className="block text-sm font-semibold text-slate-700 mb-2">
                                        Nombre Comercial <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" aria-hidden="true" />
                                        <input
                                            id="store-name"
                                            type="text"
                                            name="storeName"
                                            value={registerData.storeName}
                                            onChange={(e) => handleInputChange(e, 'register')}
                                            placeholder="Ej: Mi Dulce Hogar"
                                            autoComplete="organization"
                                            required
                                            className="w-full py-3.5 pl-12 pr-4 border-2 border-slate-200 rounded-xl text-sm text-slate-700 bg-slate-50 focus:outline-none focus:border-sky-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(66,153,225,0.1)] transition-all duration-300"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="reg-email" className="block text-sm font-semibold text-slate-700 mb-2">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" aria-hidden="true" />
                                        <input
                                            id="reg-email"
                                            type="email"
                                            name="email"
                                            value={registerData.email}
                                            onChange={(e) => handleInputChange(e, 'register')}
                                            placeholder="email@tienda.com"
                                            autoComplete="email"
                                            required
                                            className="w-full py-3.5 pl-12 pr-4 border-2 border-slate-200 rounded-xl text-sm text-slate-700 bg-slate-50 focus:outline-none focus:border-sky-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(66,153,225,0.1)] transition-all duration-300"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="reg-phone" className="block text-sm font-semibold text-slate-700 mb-2">
                                        Teléfono <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" aria-hidden="true" />
                                        <input
                                            id="reg-phone"
                                            type="text"
                                            name="phone"
                                            value={registerData.phone}
                                            onChange={(e) => handleInputChange(e, 'register')}
                                            placeholder="999 000 000"
                                            maxLength={9}
                                            inputMode="numeric"
                                            required
                                            className="w-full py-3.5 pl-12 pr-4 border-2 border-slate-200 rounded-xl text-sm text-slate-700 bg-slate-50 focus:outline-none focus:border-sky-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(66,153,225,0.1)] transition-all duration-300"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="reg-password" className="block text-sm font-semibold text-slate-700 mb-2">
                                        Contraseña <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" aria-hidden="true" />
                                        <input
                                            id="reg-password"
                                            type="password"
                                            name="password"
                                            value={registerData.password}
                                            onChange={(e) => handleInputChange(e, 'register')}
                                            placeholder="••••••••"
                                            autoComplete="new-password"
                                            required
                                            className="w-full py-3.5 pl-12 pr-4 border-2 border-slate-200 rounded-xl text-sm text-slate-700 bg-slate-50 focus:outline-none focus:border-sky-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(66,153,225,0.1)] transition-all duration-300"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="reg-ruc" className="block text-sm font-semibold text-slate-700 mb-2">
                                        RUC <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <CheckCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" aria-hidden="true" />
                                        <input
                                            id="reg-ruc"
                                            type="text"
                                            name="ruc"
                                            value={registerData.ruc}
                                            onChange={(e) => handleInputChange(e, 'register')}
                                            placeholder="11 dígitos"
                                            maxLength={11}
                                            inputMode="numeric"
                                            required
                                            className="w-full py-3.5 pl-12 pr-4 border-2 border-slate-200 rounded-xl text-sm text-slate-700 bg-slate-50 focus:outline-none focus:border-sky-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(66,153,225,0.1)] transition-all duration-300"
                                        />
                                    </div>
                                </div>

                                <div className="col-span-2">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="group relative w-full py-4 bg-gradient-to-r from-sky-500 to-sky-400 text-white font-bold text-sm uppercase tracking-wider rounded-xl shadow-[0_10px_25px_rgba(14,165,233,0.3)] hover:shadow-[0_15px_35px_rgba(14,165,233,0.4)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-3 overflow-hidden"
                                    >
                                        <span className="relative z-10 flex items-center gap-3">
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    <span>Registrando...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span>Crear Tienda</span>
                                                    <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-rotate-10" />
                                                </>
                                            )}
                                        </span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @keyframes gridMove {
                    0% { transform: translate(0, 0); }
                    100% { transform: translate(20px, 20px); }
                }
                .error-message {
                    background-color: #fee;
                    color: #c00;
                    border: 1px solid #fcc;
                    padding: 12px 16px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                    font-size: 14px;
                    font-weight: 500;
                    display: none;
                }
                .success-message {
                    background-color: #efe;
                    color: #060;
                    border: 1px solid #cfc;
                    padding: 12px 16px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                    font-size: 14px;
                    font-weight: 500;
                    display: none;
                }
            `}</style>
        </div>
    );
}
