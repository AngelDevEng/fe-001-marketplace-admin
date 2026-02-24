import React, { ReactNode, CSSProperties } from 'react';
import Icon from './Icon';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface BaseButtonProps {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
    leftIcon?: string;
    rightIcon?: string;
    fullWidth?: boolean;
    children?: ReactNode;
    className?: string;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    onClick?: () => void;
    style?: CSSProperties;
    title?: string;
    id?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
    primary: `
        bg-sky-500 text-white
        hover:bg-sky-600
        focus:ring-2 focus:ring-sky-500/50 focus:ring-offset-2 focus:ring-offset-white
        active:bg-sky-700
    `,
    secondary: `
        bg-emerald-500 text-white
        hover:bg-emerald-600
        focus:ring-2 focus:ring-emerald-500/50 focus:ring-offset-2 focus:ring-offset-white
        active:bg-emerald-700
    `,
    tertiary: `
        bg-lime-500 text-white
        hover:bg-lime-600
        focus:ring-2 focus:ring-lime-500/50 focus:ring-offset-2 focus:ring-offset-white
        active:bg-lime-700
    `,
    ghost: `
        bg-transparent text-gray-600
        hover:bg-gray-100
        focus:ring-2 focus:ring-gray-300/50 focus:ring-offset-2 focus:ring-offset-white
        active:bg-gray-200
    `,
    danger: `
        bg-rose-500 text-white
        hover:bg-rose-600
        focus:ring-2 focus:ring-rose-500/50 focus:ring-offset-2 focus:ring-offset-white
        active:bg-rose-700
    `,
};

const sizeClasses: Record<ButtonSize, string> = {
    sm: 'px-5 py-2.5 text-xs rounded-2xl gap-2',
    md: 'px-8 py-4 text-sm rounded-3xl gap-3',
    lg: 'px-10 py-5 text-sm rounded-3xl gap-3',
    xl: 'px-14 py-6 text-sm rounded-3xl gap-3',
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
    type = 'button',
    onClick,
    style,
    title,
    id,
}: BaseButtonProps) {
    const baseStyles = `
        inline-flex items-center justify-center
        font-black uppercase tracking-wider
        transition-colors duration-200
        disabled:opacity-40 disabled:pointer-events-none
        outline-none
    `.trim().replace(/\s+/g, ' ');

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
            type={type}
            onClick={onClick}
            style={style}
            title={title}
            id={id}
        >
            {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <>
                    {leftIcon && <Icon name={leftIcon} className="w-4 h-4" />}
                    {children}
                    {rightIcon && <Icon name={rightIcon} className="w-4 h-4" />}
                </>
            )}
        </button>
    );
}
