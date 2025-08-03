
import React from 'react';
import { Spinner } from '../../constants';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    fullWidth?: boolean;
    variant?: 'primary' | 'secondary';
    children: React.ReactNode;
    isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ children, fullWidth, variant = 'primary', isLoading, disabled, ...props }) => {
    const baseClasses = "px-6 py-3 font-bold rounded-full transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0c0a3a] flex items-center justify-center";
    const widthClass = fullWidth ? 'w-full' : '';
    
    const primaryClasses = "bg-accent-primary text-[#0c0a3a] hover:bg-accent-hover focus:ring-accent-primary";
    const secondaryClasses = "bg-transparent border-2 border-accent-primary text-accent-primary hover:bg-accent-primary hover:text-[#0c0a3a]";
    
    const variantClasses = variant === 'primary' ? primaryClasses : secondaryClasses;
    const finalDisabled = isLoading || disabled;
    const disabledClasses = "opacity-50 cursor-not-allowed hover:scale-100";

    return (
        <button
            {...props}
            disabled={finalDisabled}
            className={`${baseClasses} ${widthClass} ${variantClasses} ${finalDisabled ? disabledClasses : ''}`}
        >
            {isLoading ? <Spinner className="h-6 w-6" /> : children}
        </button>
    );
};
