'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const podcastAnimations = [
    { emoji: '🎙️', text: 'Cada semana con un nuevo invitado.' },
    { emoji: '🎧', text: 'Escucha el último episodio' },
];

const videoAnimations = [
    { emoji: '🎥', text: 'Nuevos episodios cada semana.' },
    { emoji: '📽️', text: 'Desde el lente hacia el corazón.' },
    { emoji: '🌍', text: 'Conecta, entiende y aprende en minutos.' },
    { emoji: '💬', text: 'Historias de vida que inspiran.' },
];

function AnimatedText({ animations }: { animations: { emoji: string; text: string }[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % animations.length);
        }, 4500);
        return () => clearInterval(interval);
    }, [animations.length]);

    return (
        <div className="w-full h-24 md:h-14 overflow-hidden relative">
            {animations.map((item, index) => (
                <div
                    key={`podcast-anim-${index}`}
                    className="absolute top-0 left-0 w-full flex items-center space-x-3 text-sm md:text-2xl !text-white/90 transition-all duration-1000"
                    style={{
                        opacity: index === currentIndex ? 1 : 0,
                        transform: index === currentIndex ? 'scale(1)' : 'scale(0.8)',
                        pointerEvents: index === currentIndex ? 'auto' : 'none',
                    }}
                >
                    <span className="text-3xl flex-shrink-0">{item.emoji}</span>
                    <span className="flex-1">{item.text}</span>
                </div>
            ))}
        </div>
    );
}

function SectionHeader({ title, description }: { title: string; description: string }) {
    return (
        <div className="pt-8 pb-12 text-center max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-center space-x-3 mb-4">
                <span className="h-px w-12 bg-lime-500" />
                <span className="text-lime-600 font-bold tracking-widest text-sm uppercase">Lyrium</span>
                <span className="h-px w-12 bg-lime-500" />
            </div>
            <h3 className="text-3xl md:text-5xl font-black text-slate-800 mb-6 drop-shadow-sm uppercase">
                {title}
            </h3>
            <p className="text-slate-600 text-base md:text-lg leading-relaxed font-light text-center max-w-5xl mx-auto">
                {description}
            </p>
        </div>
    );
}

export default function PodcastSection() {
    return (
        <>
            {/* Podcast - Audios */}
            <div className="w-full py-16 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4">
                    <SectionHeader
                        title="PODCAST - AUDIOS"
                        description="Escucha nuestros podcasts sobre vida ecológica, bienestar natural y sostenibilidad. Entrevistas con expertos, consejos prácticos y experiencias reales para inspirarte a llevar un estilo de vida más consciente y saludable."
                    />

                    <div className="relative overflow-hidden rounded-3xl md:rounded-[3rem] p-6 md:p-20 shadow-2xl group">
                        <Image
                            src="/img/bioblog/entrevista_doctora-scaled.webp"
                            alt="Podcast Background"
                            fill
                            sizes="100vw"
                            className="object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-slate-900/60 group-hover:bg-slate-900/70 transition-colors duration-1000" />

                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                            <div className="w-full flex-1 space-y-6">
                                <h1 className="text-3xl md:text-6xl font-black !text-white leading-tight">
                                    Conecta <span className="!text-sky-400">Natural</span>
                                </h1>

                                <AnimatedText animations={podcastAnimations} />

                                <div className="w-24 h-px bg-white/30" />

                                <p className="!text-white/80 text-lg max-w-md text-justify">
                                    Historias, consejos y conversaciones sobre consumo consciente, sostenibilidad y productos bio.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Podcast - Videos */}
            <div className="w-full py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <SectionHeader
                        title="PODCAST - VIDEOS"
                        description="Disfruta de nuestros videos sobre alimentación saludable, productos ecológicos y estilo de vida sostenible. Tutoriales, entrevistas y tips visuales para inspirarte a vivir de forma más natural y consciente."
                    />

                    <div className="relative overflow-hidden rounded-3xl md:rounded-[3rem] p-6 md:p-20 shadow-2xl group">
                        <Image
                            src="/img/bioblog/Familia-en-picnic-scaled.webp"
                            alt="Historias Background"
                            fill
                            sizes="100vw"
                            className="object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/50 transition-colors duration-1000" />

                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                            <div className="w-full flex-1 space-y-6">
                                <h1 className="text-3xl md:text-6xl font-black !text-white leading-tight">
                                    Historias que se ven y se sienten
                                </h1>

                                <AnimatedText animations={videoAnimations} />

                                <div className="w-24 h-px bg-white/30" />

                                <p className="!text-white/80 text-lg max-w-md">
                                    Un espacio donde cada video cuenta una historia real, visibiliza un propósito y nos inspira a vivir de forma más consciente.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
