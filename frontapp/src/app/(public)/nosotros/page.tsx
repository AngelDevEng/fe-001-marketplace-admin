'use client';

import Image from 'next/image';
import {
    Heart,
    Leaf,
    ShieldCheck,
    Users,
    Clock,
    MessageCircle,
    RotateCcw,
    Brain,
    Star,
    Check
} from 'lucide-react';
import { aboutData } from '@/constants/aboutData';

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-[#f8f9fa] overflow-hidden">

            {/* 1. HERO PRINCIPAL */}
            <section className="relative h-[450px] md:h-[550px] flex items-center justify-center text-center overflow-hidden">
                {/* Parallax Background */}
                <div
                    className="absolute inset-0 bg-cover bg-center bg-fixed transition-transform duration-700 hover:scale-105"
                    style={{ backgroundImage: `url('/${aboutData.hero.bgImage1}')` }}
                />
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

                <div className="relative z-10 px-6 animate-in">
                    <p className="text-white/90 text-[10px] md:text-xs tracking-[0.4em] uppercase font-bold mb-4 drop-shadow-lg">
                        {aboutData.hero.tagline}
                    </p>
                    <h1 className="text-3xl md:text-5xl lg:text-7xl font-black text-white leading-tight tracking-tighter drop-shadow-2xl max-w-4xl">
                        {aboutData.hero.title}
                    </h1>
                    <div className="mt-8 mx-auto w-24 h-1 bg-sky-400 rounded-full shadow-[0_0_15px_rgba(56,189,248,0.5)] animate-pulse" />
                </div>
            </section>

            {/* 2. SECCIÓN DOCTORA / INTRODUCCIÓN */}
            <section className="py-24 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8 animate-in animate-delay-1">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-sky-50 border border-sky-100 rounded-full">
                            <span className="w-2 h-2 bg-sky-500 rounded-full animate-ping" />
                            <span className="text-xs font-bold text-sky-600 uppercase tracking-widest">
                                {aboutData.doctorSection.tagline}
                            </span>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-black text-slate-800 leading-[1.1]">
                            Tu salud es nuestra <br />
                            <span className="bg-gradient-to-r from-sky-500 to-sky-700 bg-clip-text text-transparent italic">
                                prioridad absoluta
                            </span>
                        </h2>

                        <div className="space-y-6 text-slate-600 leading-relaxed text-lg">
                            {aboutData.doctorSection.paragraphs.map((p, i) => (
                                <p key={i} className={i === 0 ? "font-semibold text-slate-900 border-l-4 border-sky-500 pl-6 py-2 bg-sky-50/30 rounded-r-2xl" : ""}>
                                    {p}
                                </p>
                            ))}
                        </div>

                        <div className="pt-4 flex items-center gap-6">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-slate-200 overflow-hidden shadow-lg transform hover:-translate-y-1 transition-transform">
                                        <Image src={`https://i.pravatar.cc/150?u=${i}`} alt="user" width={48} height={48} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm font-bold text-slate-500">
                                <span className="text-sky-500 font-black text-lg block">10,000+</span>
                                Clientes felices
                            </p>
                        </div>
                    </div>

                    <div className="relative group animate-in animate-delay-2">
                        <div className="absolute -inset-4 bg-sky-400/20 rounded-[3rem] blur-2xl group-hover:bg-sky-400/30 transition-all duration-700" />
                        <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white">
                            <Image
                                src={`/${aboutData.doctorSection.image}`}
                                alt="Doctora Lyrium"
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-cover transform group-hover:scale-110 transition-transform duration-[2000ms]"
                            />
                            <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/50">
                                <p className="text-sky-600 font-black uppercase text-xs tracking-widest mb-1">Especialistas en BioSalud</p>
                                <h4 className="font-bold text-slate-800 text-lg">Compromiso Lyrium</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. NUESTROS VALORES & RELACIÓN (CARDS OVERLAY) */}
            <section className="py-20 px-6 space-y-12">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                    {aboutData.values.map((val) => (
                        <div key={val.title} className="relative h-[450px] md:h-[550px] rounded-[3rem] overflow-hidden shadow-2xl group border-4 border-white">
                            <Image
                                src={val.image}
                                alt={val.title}
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-cover transform group-hover:scale-110 transition-transform duration-[1500ms]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                            <div className={`absolute bottom-8 ${idx === 0 ? 'right-8' : 'left-8'} z-10 max-w-[85%] md:max-w-[70%]`}>
                                <div className="bg-sky-500/80 backdrop-blur-xl p-8 md:p-10 rounded-[2.5rem] border border-white/30 shadow-2xl transform group-hover:-translate-y-4 transition-transform duration-500">
                                    <h3 className="text-2xl md:text-3xl font-black text-white mb-6 uppercase leading-tight tracking-tight">
                                        {val.title}
                                    </h3>
                                    <div className="w-12 h-1 bg-white/50 rounded-full mb-6" />

                                    {val.items ? (
                                        <ul className="space-y-4">
                                            {val.items.map((item) => (
                                                <li key={item} className="flex items-center gap-3 text-white font-bold group/item">
                                                    <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center group-hover/item:bg-white/40 transition-colors">
                                                        <Check className="w-4 h-4 text-white" />
                                                    </div>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-white/90 font-medium text-lg leading-relaxed">
                                            {val.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 4. TIMELINE SECTION */}
            <section className="py-32 bg-white relative">
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#f8f9fa] to-transparent" />

                <div className="max-w-7xl mx-auto px-6 relative">
                    <div className="text-center mb-20 space-y-4">
                        <div className="inline-block p-3 bg-sky-100 rounded-2xl text-sky-600 mb-4 animate-bounce">
                            <Star className="w-6 h-6 fill-sky-600" />
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter">
                            {aboutData.timeline.title}
                        </h2>
                    </div>

                    <div className="relative">
                        {/* Central Line */}
                        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-sky-200 via-sky-500 to-sky-200 rounded-full hidden md:block" />

                        <div className="space-y-20 md:space-y-0 relative">
                            {aboutData.timeline.items.map((item) => {
                                const Icon = [Star, Clock, RotateCcw, Brain, ShieldCheck, Users][idx % 6];
                                return (
                                    <div key={item.title} className={`flex flex-col md:flex-row items-center justify-center w-full md:mb-12 ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                                        {/* PC Content Card */}
                                        <div className="w-full md:w-5/12 hidden md:block group">
                                            <div className={`p-8 bg-sky-50/50 border-2 border-transparent hover:border-sky-200 hover:bg-white rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-500 relative ${idx % 2 === 0 ? 'text-right' : 'text-left'}`}>
                                                <div className={`absolute top-1/2 -translate-y-1/2 ${idx % 2 === 0 ? '-right-4' : '-left-4'} w-8 h-8 bg-white border-2 border-sky-200 rounded-lg rotate-45 z-0`} />
                                                <h3 className="text-2xl font-black text-slate-800 mb-3 uppercase tracking-tight relative z-10">{item.title}</h3>
                                                <p className="text-slate-500 font-medium leading-relaxed relative z-10">{item.description}</p>

                                                <div className={`absolute top-0 ${idx % 2 === 0 ? 'right-0' : 'left-0'} p-3 text-sky-600 font-black text-4xl opacity-10 group-hover:opacity-20 transition-opacity`}>
                                                    0{idx + 1}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Timeline Node */}
                                        <div className="relative z-20 flex items-center justify-center w-full md:w-2/12 mb-8 md:mb-0">
                                            <div className="w-16 h-16 bg-white border-4 border-sky-500 rounded-full shadow-[0_0_20px_rgba(14,165,233,0.3)] flex items-center justify-center p-4 group hover:scale-110 transition-all duration-500 cursor-help">
                                                <Icon className="w-full h-full text-sky-500 group-hover:rotate-12 transition-transform" />
                                            </div>
                                        </div>

                                        {/* Mobile & Opposite Empty Space */}
                                        <div className="w-full md:w-5/12 block group">
                                            <div className="md:hidden block p-8 bg-white border-2 border-sky-100 rounded-[2rem] shadow-lg text-center relative overflow-hidden">
                                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-sky-500" />
                                                <h3 className="text-xl font-black text-slate-800 mb-3 uppercase tracking-tighter">{item.title}</h3>
                                                <p className="text-slate-500 font-medium text-sm leading-relaxed">{item.description}</p>
                                                <div className="mt-4 text-sky-500 font-black text-xs uppercase tracking-widest opacity-40">Punto de Compromiso 0{idx + 1}</div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. HERO SECUNDARIO */}
            <section className="relative h-[350px] md:h-[500px] flex items-center justify-center text-center overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-fixed"
                    style={{ backgroundImage: `url('/${aboutData.hero.bgImage2}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/60" />

                <div className="relative z-10 px-6">
                    <h2 className="text-2xl md:text-5xl lg:text-6xl font-black text-white leading-tight uppercase tracking-tighter drop-shadow-2xl max-w-5xl">
                        {aboutData.hero.subtitle}
                    </h2>
                    <div className="mt-8 flex justify-center gap-4">
                        <div className="w-3 h-3 bg-sky-400 rounded-full animate-bounce" />
                        <div className="w-3 h-3 bg-sky-400 rounded-full animate-bounce delay-100" />
                        <div className="w-3 h-3 bg-sky-400 rounded-full animate-bounce delay-200" />
                    </div>
                </div>
            </section>

            {/* 6. ICONOS PREMIUM */}
            <section className="py-32 bg-white relative overflow-hidden">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-64 h-64 bg-sky-50 rounded-full blur-[100px] -z-10" />
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-64 h-64 bg-sky-50 rounded-full blur-[100px] -z-10" />

                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-16">
                        {aboutData.premiumIcons.map((icon) => (
                            <div key={icon.title} className="flex flex-col items-center text-center group animate-in" style={{ animationDelay: `${idx * 150}ms` }}>
                                <div className="relative w-32 h-32 md:w-48 md:h-48 mb-8">
                                    {/* Decorative Rings */}
                                    <div className="absolute -inset-4 border-2 border-dashed border-sky-100 rounded-full group-hover:rotate-180 transition-transform duration-[4000ms]" />
                                    <div className="absolute -inset-2 border border-sky-200/50 rounded-full group-hover:-rotate-180 transition-transform duration-[6000ms]" />

                                    <div className="relative w-full h-full bg-white rounded-full shadow-2xl flex items-center justify-center p-6 border-2 border-sky-50 group-hover:shadow-[0_20px_50px_rgba(14,165,233,0.15)] transition-all duration-500 transform group-hover:-translate-y-3">
                                        <Image
                                            src={`/${icon.image}`}
                                            alt={icon.title}
                                            width={160}
                                            height={160}
                                            className="w-4/5 h-4/5 object-contain transform group-hover:scale-110 transition-transform duration-500 drop-shadow-md"
                                        />
                                    </div>

                                    {/* Floating Badge */}
                                    <div className="absolute bottom-0 right-0 w-10 h-10 bg-sky-500 rounded-xl shadow-lg flex items-center justify-center transform translate-x-1/2 translate-y-1/2 group-hover:rotate-12 transition-transform">
                                        <Check className="w-6 h-6 text-white" />
                                    </div>
                                </div>

                                <h3 className="text-xl md:text-2xl font-black text-slate-800 mb-4 tracking-tight group-hover:text-sky-500 transition-colors">
                                    {icon.title}
                                </h3>
                                <p className="text-sm md:text-base text-slate-500 font-medium leading-relaxed max-w-[220px]">
                                    {icon.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

        </main>
    );
}
