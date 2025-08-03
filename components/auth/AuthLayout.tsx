
import React from 'react';
import { BubbleBackground, ASSETS, Logo } from '../../constants';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle: string;
    showLogo?: boolean;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle, showLogo = true }) => {
    return (
        <div className="min-h-screen w-full bg-theme text-theme-primary flex">
            <div className="hidden lg:flex w-1/2 bg-[#0c0a3a] relative items-center justify-center p-12">
                <BubbleBackground />
                 <div className="relative z-10 text-center">
                    <img src={ASSETS.WELCOME_BG} alt="Gaming Illustration" className="max-w-md animate-float"/>
                    <h1 className="text-4xl font-bold mt-8 text-white">Welcome to AU Battle</h1>
                    <p className="text-slate-300 mt-2">Your ultimate gaming destination.</p>
                </div>
            </div>
            <div className="w-full lg:w-1/2 flex items-center justify-center p-4 relative overflow-hidden">
                 <div 
                    className="absolute -bottom-1/4 -right-1/4 w-full h-full bg-no-repeat bg-right-bottom opacity-10 lg:opacity-20 z-0 pointer-events-none"
                    style={{backgroundImage: `url('${ASSETS.WELCOME_BG}')`, backgroundSize: '75%'}}
                ></div>
                <div className="w-full max-w-sm relative z-10">
                    {showLogo && (
                        <div className="text-center mb-6">
                            <Logo size="lg" className="justify-center" />
                        </div>
                    )}
                    <div className="text-center mb-8">
                        <h2 className="text-3xl md:text-4xl font-bold text-theme-primary">{title}</h2>
                        <p className="text-theme-secondary mt-1">{subtitle}</p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;