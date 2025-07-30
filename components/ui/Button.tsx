
import React from 'react';
import { Spinner } from '../../constants';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    fullWidth?: boolean;
    variant?: 'primary' | 'secondary';
    children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ children, fullWidth, variant = 'primary', disabled, ...props }) => {
    const baseClasses = "px-6 py-3 font-bold rounded-full transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0c0a3a]";
    const widthClass = fullWidth ? 'w-full' : '';
    
    const primaryClasses = "bg-accent-primary text-[#0c0a3a] hover:bg-accent-hover focus:ring-accent-primary";
    const secondaryClasses = "bg-transparent border-2 border-accent-primary text-accent-primary hover:bg-accent-primary hover:text-[#0c0a3a]";
    
    const variantClasses = variant === 'primary' ? primaryClasses : secondaryClasses;
    const disabledClasses = "opacity-50 cursor-not-allowed hover:scale-100";

    return (
        <button
            {...props}
            disabled={disabled}
            className={`${baseClasses} ${widthClass} ${variantClasses} ${disabled ? disabledClasses : ''}`}
        >
            <span className="flex items-center justify-center">
                {disabled && (props.type === 'submit' || props.onClick) && <Spinner className="w-5 h-5 mr-2" />}
                {children}
            </span>
        </button>
    );
};
