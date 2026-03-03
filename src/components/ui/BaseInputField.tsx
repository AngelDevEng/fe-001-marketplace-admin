'use client';

import React from 'react';
import Icon from './Icon';

export interface InputFieldProps {
    label?: string;
    name: string;
    value: string | number;
    onChange: (value: string) => void;
    type?: 'text' | 'number' | 'email' | 'date' | 'password' | 'tel' | 'url';
    placeholder?: string;
    icon?: string;
    iconPosition?: 'left' | 'right';
    error?: string;
    disabled?: boolean;
    required?: boolean;
    maxLength?: number;
    min?: number;
    max?: number;
    step?: number;
    className?: string;
    inputClassName?: string;
}

export default function BaseInputField({
    label,
    name,
    value,
    onChange,
    type = 'text',
    placeholder,
    icon,
    iconPosition = 'left',
    error,
    disabled = false,
    required = false,
    maxLength,
    min,
    max,
    step,
    className = '',
    inputClassName = ''
}: InputFieldProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    const hasIcon = !!icon;
    const iconLeft = hasIcon && iconPosition === 'left';
    const iconRight = hasIcon && iconPosition === 'right';

    const inputPaddingLeft = iconLeft ? 'pl-12' : 'pl-4';
    const inputPaddingRight = iconRight ? 'pr-12' : 'pr-4';

    const inputId = name || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div className={`space-y-2 ${className}`}>
            {label && (
                <label htmlFor={inputId} className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <div className="relative">
                {iconLeft && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-500 pointer-events-none">
                        <Icon name={icon} className="text-lg" />
                    </div>
                )}
                <input
                    id={inputId}
                    type={type}
                    value={value}
                    onChange={handleChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    required={required}
                    maxLength={maxLength}
                    min={min}
                    max={max}
                    step={step}
                    className={`
                        w-full ${inputPaddingLeft} ${inputPaddingRight} py-3 
                        bg-gray-50/50 border-none rounded-2xl 
                        focus:ring-2 focus:ring-sky-500/20 
                        transition-all font-bold text-gray-700
                        outline-none
                        disabled:opacity-50 disabled:cursor-not-allowed
                        ${error ? 'ring-2 ring-rose-500/50' : ''}
                        ${inputClassName}
                    `}
                />
                {iconRight && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sky-500 pointer-events-none">
                        <Icon name={icon} className="text-lg" />
                    </div>
                )}
            </div>
            {error && (
                <p className="text-[10px] font-black text-rose-500 ml-1">{error}</p>
            )}
        </div>
    );
}
