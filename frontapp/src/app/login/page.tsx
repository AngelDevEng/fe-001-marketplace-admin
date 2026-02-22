'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Lock, User, ShieldCheck, ArrowRight, Loader2, Sparkles } from 'lucide-react';

export default function LoginPage() {
    const { login } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const username = formData.get('username') as string;
        const password = formData.get('password') as string;

        try {
            await login({ username, password });
        } catch (err) {
            setError('Credenciales inválidas. Por favor verifique su acceso.');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden font-industrial">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-2 bg-white/5 backdrop-blur-2xl rounded-[3rem] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)] relative z-10 overflow-hidden">

                {/* Left Side: Brand & Visuals */}
                <div className="p-16 flex flex-col justify-between relative bg-gradient-to-br from-indigo-600 to-blue-700 overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-12">
                            <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30">
                                <ShieldCheck className="w-8 h-8 text-white" />
                            </div>
                            <span className="text-2xl font-black text-white tracking-widest uppercase italic">Lyrium</span>
                        </div>

                        <h1 className="text-5xl font-black text-white tracking-tighter leading-none mb-6">
                            SISTEMA DE <br />
                            <span className="text-indigo-200">CONTROL MAESTRO</span>
                        </h1>
                        <p className="text-indigo-100/70 text-sm font-medium leading-relaxed max-w-sm">
                            Acceso centralizado para administradores y vendedores. Gestión industrial de marketplace con seguridad de grado bancario.
                        </p>
                    </div>

                    <div className="relative z-10 pt-12">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-6 bg-white/10 backdrop-blur-md rounded-3xl border border-white/10">
                                <p className="text-2xl font-black text-white">99.9%</p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Uptime Garantizado</p>
                            </div>
                            <div className="p-6 bg-white/10 backdrop-blur-md rounded-3xl border border-white/10">
                                <p className="text-2xl font-black text-white">256-bit</p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200">AES Encryption</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Login Form */}
                <div className="p-16 lg:p-24 bg-white flex flex-col justify-center">
                    <div className="mb-12">
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase italic mb-2">Bienvenido</h2>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Identifíquese para continuar al panel</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="relative">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Usuario / ID Corporativo</label>
                                <div className="group relative">
                                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                                    </div>
                                    <input
                                        name="username"
                                        type="text"
                                        required
                                        className="block w-full pl-14 pr-5 py-5 bg-gray-50 border-2 border-gray-100 rounded-3xl text-sm font-bold text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-indigo-600 transition-all"
                                        placeholder="Ingrese su credencial WP"
                                    />
                                </div>
                            </div>

                            <div className="relative">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Contraseña Encriptada</label>
                                <div className="group relative">
                                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                                    </div>
                                    <input
                                        name="password"
                                        type="password"
                                        required
                                        className="block w-full pl-14 pr-5 py-5 bg-gray-50 border-2 border-gray-100 rounded-3xl text-sm font-bold text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-indigo-600 transition-all"
                                        placeholder="••••••••••••"
                                    />
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 text-xs font-bold animate-shake">
                                <Sparkles className="w-4 h-4 flex-shrink-0" />
                                {error}
                            </div>
                        )}

                        <div className="flex items-center justify-between py-2">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input type="checkbox" className="w-5 h-5 rounded-lg border-2 border-gray-100 text-indigo-600 focus:ring-indigo-600 transition-all cursor-pointer" />
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-gray-600 transition-colors">Recordar Sesión</span>
                            </label>
                            <button type="button" className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-800 transition-colors">¿Olvidó su contraseña?</button>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full py-6 bg-gray-900 text-white rounded-3xl font-black text-sm uppercase tracking-[0.2em] relative overflow-hidden group transition-all hover:bg-indigo-600 active:scale-[0.98] shadow-2xl ${isSubmitting ? 'cursor-not-allowed opacity-80' : ''}`}
                        >
                            <div className="relative z-10 flex items-center justify-center gap-4">
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Iniciando Protocolo...
                                    </>
                                ) : (
                                    <>
                                        Entrar al Sistema <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                                    </>
                                )}
                            </div>
                        </button>
                    </form>

                    <div className="mt-12 text-center">
                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                            Desarrollado para Lyrium BioMarketplace v2.0
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
