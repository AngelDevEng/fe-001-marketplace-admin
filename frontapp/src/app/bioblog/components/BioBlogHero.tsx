'use client';

import { useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/Icon';
import { blogCategories } from '../data/blogData';

export default function BioBlogHero() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('Todos');

    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-6 md:py-10 flex-1 space-y-10 md:space-y-16 overflow-x-hidden">
            {/* Hero Section */}
            <div className="lr-hero">
                <div className="lr-pill animate-in !w-full !flex justify-center">
                    <Icon name="Newspaper" className="text-[17px]" />
                    <span className="text-[18px] md:text-[28px]">BioBlog</span>
                </div>
            </div>

            <div className="relative w-full flex flex-col md:flex-row min-h-[500px] md:min-h-[600px] overflow-hidden rounded-3xl shadow-2xl bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9]">
                {/* Contenido Izquierdo */}
                <div className="relative z-10 flex-1 flex flex-col justify-center p-6 md:p-16 lg:p-24 space-y-8 bg-gradient-to-br from-[#CEEDFA] to-transparent">
                    {/* Logo/Icono */}
                    <div className="w-20 h-20 md:w-32 md:h-32 transition-transform duration-500 hover:scale-110">
                        <img
                            src="/img/bioblog/ICON.png"
                            className="w-full h-full object-contain drop-shadow-xl"
                            alt="Lyrium Logo"
                        />
                    </div>

                    {/* Título Dual */}
                    <div className="space-y-4">
                        <h2 className="text-2xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-800 leading-tight">
                            <span className="block text-slate-500 font-medium text-lg md:text-3xl mb-1">Bienvenidos</span>
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-lime-600 to-emerald-600">
                                Lyrium BioBlog
                            </span>
                        </h2>
                    </div>

                    {/* Descripción */}
                    <div className="max-w-xl">
                        <p className="text-base md:text-xl text-slate-600 leading-relaxed font-light text-justify">
                            En este espacio encontrarás información confiable, práctica y
                            actualizada para mejorar tu salud, bienestar y calidad de vida.
                            Somos un equipo comprometido con el cuidado integral, donde el
                            conocimiento es la herramienta clave.
                        </p>
                    </div>
                </div>

                {/* Imagen Derecha Decorativa */}
                <div className="relative flex-1 hidden md:block">
                    <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#f8fafc]/50 z-10" />
                    <div
                        className="w-full h-full bg-cover bg-center transition-transform duration-700 hover:scale-105"
                        style={{ backgroundImage: "url('/img/bioblog/Fondos_BioBlog-6.webp')" }}
                    />
                </div>
            </div>

            {/* Sección de Búsqueda y Filtros */}
            <div className="w-full max-w-5xl mx-auto px-2 md:px-4 -mt-8 md:-mt-12 relative z-20">
                <div className="bg-white/90 backdrop-blur-xl p-4 md:p-8 rounded-[2rem] shadow-2xl border border-white/20">
                    {/* Barra de Búsqueda */}
                    <form action="/bioblog" method="get" className="relative group">
                        <div className="relative flex items-center">
                            <input
                                type="search"
                                name="s"
                                placeholder="¿Qué deseas buscar para mejorar tu salud?"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-24 md:pl-16 md:pr-32 py-4 md:py-5 bg-slate-100/50 border-none rounded-2xl text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-sky-500 transition-all duration-300 text-sm md:text-lg shadow-inner"
                            />
                            <button
                                type="submit"
                                className="absolute right-1.5 px-3 py-2 md:right-3 md:px-6 md:py-3 bg-sky-500 hover:bg-sky-600 text-white text-[10px] md:text-base font-semibold rounded-xl transition-all duration-300 transform active:scale-95 shadow-md"
                            >
                                Buscar
                            </button>
                        </div>
                    </form>

                    {/* Filtros de Categorías */}
                    <div className="mt-6 md:mt-8">
                        <div className="flex items-center space-x-2 md:space-x-4 overflow-x-auto pb-4 scrollbar-hide no-scrollbar">
                            {blogCategories.map((category) => (
                                category.active || category.name === activeCategory ? (
                                    <button
                                        key={category.name}
                                        onClick={() => setActiveCategory(category.name)}
                                        className="flex-shrink-0 px-4 py-2 md:px-6 md:py-2.5 bg-sky-500 text-white rounded-full text-xs md:text-sm font-semibold shadow-md active:scale-95 transition-all"
                                    >
                                        {category.name}
                                    </button>
                                ) : (
                                    <Link
                                        key={category.name}
                                        href={category.href}
                                        className="flex-none px-6 py-2.5 bg-white text-slate-600 border border-slate-200 rounded-full font-medium hover:border-sky-500 hover:text-sky-500 transition-all"
                                    >
                                        {category.name}
                                    </Link>
                                )
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
