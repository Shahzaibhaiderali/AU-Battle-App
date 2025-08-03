import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input: React.FC<InputProps> = ({ className, ...props }) => {
    const baseClasses = "w-full bg-slate-800/80 border border-slate-700 text-theme-primary placeholder-slate-400 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-accent-primary transition-all duration-200";
    
    return (
        <input
            {...props}
            className={`${baseClasses} ${className || ''}`}
        />
    );
};