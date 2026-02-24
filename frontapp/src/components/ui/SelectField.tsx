'use client';

import React from 'react';
import Icon from './Icon';

export interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}

export interface SelectFieldProps {
    label?: string;
    value: string;
    onChange: (value: string) => void;
    options: SelectOption[];
    placeholder?: string;
    error?: string;
    disabled?: boolean;
    required?: boolean;
    className?: string;
}

export default function SelectField({
    label,
    value,
    onChange,
    options,
    placeholder = 'Seleccionar...',
    error,
    disabled = false,
    required = false,
    className = ''
}: SelectFieldProps) {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onChange(e.target.value);
    };

    return (
        <div className={`space-y-2 ${className}`}>
            {label && (
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <div className="relative">
                <select
                    value={value}
                    onChange={handleChange}
                    disabled={disabled}
                    required={required}
                    className={`
                        w-full px-4 py-3 
                        bg-gray-50/50 border-none rounded-2xl 
                        focus:ring-2 focus:ring-sky-500/20 
                        transition-all font-bold text-gray-700
                        outline-none cursor-pointer
                        disabled:opacity-50 disabled:cursor-not-allowed
                        appearance-none
                        text-[10px] uppercase tracking-widest
                        ${error ? 'ring-2 ring-rose-500/50' : ''}
                    `}
                >
                    {placeholder && (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    )}
                    {options.map((option) => (
                        <option 
                            key={option.value} 
                            value={option.value}
                            disabled={option.disabled}
                        >
                            {option.label}
                        </option>
                    ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <Icon name="ChevronDown" className="w-4 h-4" />
                </div>
            </div>
            {error && (
                <p className="text-[10px] font-black text-rose-500 ml-1">{error}</p>
            )}
        </div>
    );
}
