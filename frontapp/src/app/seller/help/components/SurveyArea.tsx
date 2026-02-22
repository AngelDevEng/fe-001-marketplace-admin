'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/Icon';

interface SurveyAreaProps {
    onSubmit: (rating: number, comment: string) => void | Promise<void>;
}

export default function SurveyArea({ onSubmit }: SurveyAreaProps) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (rating === 0) return;
        setIsSubmitting(true);
        await onSubmit(rating, comment);
        setIsSubmitting(false);
    };

    return (
        <div className="p-8 border-t-2 border-dashed border-sky-100 bg-sky-50/30 animate-fadeIn rounded-b-[2.5rem]">
            <div className="flex flex-col items-center text-center max-w-lg mx-auto">
                <div className="w-16 h-16 bg-white rounded-[2rem] shadow-sm flex items-center justify-center text-sky-500 text-3xl mb-6">
                    <Icon name="Heart" className="w-4 h-4" />
                </div>
                <h3 className="text-xl font-black text-gray-800 tracking-tight mb-2">¡Tu opinión nos ayuda a mejorar!</h3>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-8">Encuesta de Satisfacción Obligatoria (RF-06)</p>

                <div className="flex gap-3 mb-8">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            onClick={() => setRating(star)}
                            className={`w-12 h-12 rounded-2xl bg-white border-2 transition-all flex items-center justify-center text-2xl shadow-sm
                                ${rating >= star ? 'border-sky-200 text-sky-400' : 'border-transparent text-gray-300 hover:text-sky-200'}`}
                        >
                            <Icon name="Star" className={`w-8 h-8 ${rating >= star ? 'animate-pulse fill-current' : ''}`} />
                        </button>
                    ))}
                </div>

                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={2}
                    className="w-full p-4 bg-white border-none rounded-2xl font-medium text-xs text-gray-500 mb-6 shadow-sm focus:ring-2 focus:ring-sky-500/10 placeholder:text-gray-300 outline-none"
                    placeholder="¿Tienes algún comentario adicional? (Opcional)"
                ></textarea>

                <button
                    onClick={handleSubmit}
                    disabled={rating === 0 || isSubmitting}
                    className="px-12 py-4 bg-sky-500 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-sky-100 hover:bg-sky-600 transition-all active:scale-95 disabled:bg-gray-200 disabled:shadow-none min-w-[200px]"
                >
                    {isSubmitting ? (
                        <Icon name="Loader2" className="animate-spin text-lg w-5 h-5" />
                    ) : (
                        'Enviar Encuesta y Finalizar'
                    )}
                </button>
            </div>
        </div>
    );
}
