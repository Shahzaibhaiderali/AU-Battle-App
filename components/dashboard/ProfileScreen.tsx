
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ASSETS, Spinner, BackArrowIcon, GridIcon, UserIcon, JoystickIcon, CreditCardIcon, LogOutIcon, ChevronRightIcon, PaintBrushIcon, SettingsIcon, ChevronUpIcon } from '../../constants';
import ThemeSwitcherModal from '../ui/ThemeSwitcherModal';

const ProfileScreen: React.FC = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const [isThemeModalOpen, setThemeModalOpen] = useState(false);

    const menuItems = [
        { name: 'Personal Info', icon: UserIcon, action: () => {} },
        { name: 'Game Progress', icon: JoystickIcon, action: () => {} },
        { name: 'Billing Methods', icon: CreditCardIcon, action: () => {} },
        { name: 'Settings', icon: SettingsIcon, action: () => navigate('/dashboard/settings') },
    ];

    if (!user) {
        return (
            <div className="flex flex-col h-full w-full items-center justify-center">
                <Spinner className="w-10 h-10 text-accent-primary" />
                <p className="mt-4 text-theme-secondary">Loading Profile...</p>
            </div>
        );
    }

    return (
        <div className="w-full h-full relative">
            <ThemeSwitcherModal isOpen={isThemeModalOpen} onClose={() => setThemeModalOpen(false)} />
            {/* Custom Header - Mobile Only */}
            <header className="px-4 py-3 flex items-center justify-between fixed top-0 w-full max-w-lg mx-auto z-30 bg-card lg:hidden">
                <button onClick={() => navigate(-1)} className="p-2">
                    <BackArrowIcon className="w-6 h-6 text-theme-primary" />
                </button>
                <h1 className="text-xl font-bold text-theme-primary">My Profile</h1>
                <button className="p-2">
                    <GridIcon className="w-6 h-6 text-theme-primary" />
                </button>
            </header>

            <div className="pt-20 lg:pt-0">
                <div className="lg:flex lg:items-start lg:space-x-8 max-w-4xl mx-auto">
                    {/* Left Column: User Info */}
                    <div className="flex flex-col items-center text-center fade-in-up lg:w-1/3 lg:sticky lg:top-8">
                        <div className="relative w-28 h-28 mb-4">
                            <img 
                                src={ASSETS.PROFILE_AVATAR}
                                alt="Profile" 
                                className="w-full h-full rounded-full object-cover border-4 border-theme"
                            />
                            <div className="absolute inset-0 rounded-full border-2 border-accent-primary animate-ping-slow opacity-75"></div>
                            <div className="absolute inset-0 rounded-full border-2 border-accent-primary"></div>
                        </div>
                        <h2 className="text-2xl font-bold text-theme-primary">{user.ff_name}</h2>
                        
                        <div className="flex flex-col items-center space-y-1 w-full text-sm text-theme-secondary mt-4">
                            <span>Joined: Mar 18th 2024</span>
                            <span>Rating: 8.7/10</span>
                            <span>Rank: Pro V</span>
                        </div>
                    </div>

                    {/* Right Column: Menu */}
                    <div className="mt-8 lg:mt-0 w-full lg:w-2/3 bg-card p-2 rounded-2xl stagger-children">
                        <ul className="divide-y divide-theme">
                            {menuItems.map((item, index) => (
                                <li 
                                    key={item.name} 
                                    onClick={item.action} 
                                    className="flex justify-between items-center p-4 text-theme-primary bg-hover transition-colors cursor-pointer rounded-lg fade-in-up"
                                    style={{'--stagger-delay': `${100 + index * 100}ms`} as React.CSSProperties}
                                >
                                    <div className="flex items-center space-x-4">
                                        <item.icon className="w-6 h-6 text-accent-primary" />
                                        <span>{item.name}</span>
                                    </div>
                                    <ChevronRightIcon className="w-5 h-5 text-theme-secondary" />
                                </li>
                            ))}
                             <li 
                                onClick={() => setThemeModalOpen(true)}
                                className="flex justify-between items-center p-4 text-theme-primary bg-hover transition-colors cursor-pointer rounded-lg fade-in-up"
                                style={{'--stagger-delay': `${100 + menuItems.length * 100}ms`} as React.CSSProperties}
                            >
                                <div className="flex items-center space-x-4">
                                    <PaintBrushIcon className="w-6 h-6 text-accent-primary" />
                                    <span>Change Theme</span>
                                </div>
                                <ChevronRightIcon className="w-5 h-5 text-theme-secondary" />
                            </li>
                            <li 
                                onClick={logout} 
                                className="flex justify-between items-center p-4 text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer rounded-lg fade-in-up"
                                style={{'--stagger-delay': `${100 + (menuItems.length + 1) * 100}ms`} as React.CSSProperties}
                            >
                                <div className="flex items-center space-x-4">
                                    <LogOutIcon className="w-6 h-6" />
                                    <span>Logout</span>
                                </div>
                                <ChevronRightIcon className="w-5 h-5" />
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* "Slide Away" Button - Mobile Only */}
            <button
                onClick={() => navigate('/dashboard/play')}
                className="fixed bottom-24 right-4 lg:hidden z-40 bg-accent-primary text-black w-12 h-12 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform"
                aria-label="Go to Gameplay"
            >
                <ChevronUpIcon className="w-6 h-6" />
            </button>
        </div>
    );
};

export default ProfileScreen;
