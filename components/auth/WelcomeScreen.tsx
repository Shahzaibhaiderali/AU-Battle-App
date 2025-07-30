
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { ASSETS, BubbleBackground } from '../../constants';

const WelcomeScreen: React.FC = () => {
    return (
        <div className="relative min-h-screen w-full flex items-end md:items-center justify-center p-4 overflow-hidden bg-[#0c0a3a]">
            <BubbleBackground />
            <div 
                className="absolute inset-0 bg-cover bg-center animate-float z-0" 
                style={{backgroundImage: `url('${ASSETS.WELCOME_BG}')`}}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a3a] via-[#0c0a3a]/90 to-transparent z-0"></div>
            
            <div className="relative z-10 w-full max-w-md md:max-w-lg text-center mb-8 md:mb-0">
                <div className="bg-slate-800/30 backdrop-blur-sm p-8 rounded-3xl border border-slate-700 shadow-2xl">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Discover The Best Game Here</h1>
                    <p className="text-[#A2B2B9] mb-8">Stream, watch other gamer streams and play games in one spot.</p>
                    <div className="flex w-full flex-col sm:flex-row items-center gap-6">
                         <Link to="/login" className="w-full">
                            <Button fullWidth>Login</Button>
                        </Link>
                        <Link to="/signup" className="w-full">
                            <Button fullWidth variant="secondary">Create Account</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WelcomeScreen;