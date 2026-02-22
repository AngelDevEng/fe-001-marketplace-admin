import React from 'react';
import Icon from './Icon';
import { Loader2 } from 'lucide-react';

interface BaseButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'dark';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    isLoading?: boolean;
    leftIcon?: string;
    rightIcon?: string;
    fullWidth?: boolean;
}

const variantClasses = {
    primary: 'bg-sky-500 text-white shadow-xl shadow-sky-100 hover:bg-sky-600 border-none',
    secondary: 'bg-white text-gray-700 border border-gray-100 hover:bg-gray-50 shadow-sm',
    ghost: 'bg-transparent text-gray-500 hover:bg-gray-50 border-none',
    danger: 'bg-rose-50 text-rose-500 border border-rose-100 hover:bg-rose-100',
    success: 'bg-emerald-500 text-white shadow-xl shadow-emerald-100 hover:bg-emerald-600 border-none',
    dark: 'bg-gray-900 text-white shadow-2xl shadow-gray-200 hover:bg-black border-none'
};

const sizeClasses = {
    sm: 'px-4 py-2 text-[10px] rounded-xl',
    md: 'px-6 py-3.5 text-[11px] rounded-2xl',
    lg: 'px-10 py-5 text-[12px] rounded-[1.75rem]',
    xl: 'px-14 py-6 text-[13px] rounded-[2rem]'
};

export default function BaseButton({
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    children,
    className = '',
    disabled,
    ...props
}: BaseButtonProps) {
    const baseStyles = 'inline-flex items-center justify-center font-black uppercase tracking-[0.15em] transition-all duration-300 active:scale-95 disabled:opacity-40 disabled:pointer-events-none gap-3';

    return (
        <button
            className={`
                ${baseStyles} 
                ${variantClasses[variant]} 
                ${sizeClasses[size]} 
                ${fullWidth ? 'w-full' : ''} 
                ${className}
            `}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
                <>
                    {leftIcon && <Icon name={leftIcon} className="w-5 h-5" />}
                    {children}
                    {rightIcon && <Icon name={rightIcon} className="w-5 h-5" />}
                </>
            )}
        </button>
    );
}
