
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input: React.FC<InputProps> = ({ className, ...props }) => {
    const baseClasses = "w-full bg-slate-900/50 border border-slate-600 text-white placeholder-gray-400 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary transition-shadow";
    
    return (
        <input
            {...props}
            className={`${baseClasses} ${className || ''}`}
        />
    );
};
