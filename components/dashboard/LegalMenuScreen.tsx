
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheckIcon, MessageSquareIcon, InfoIcon, FileTextIcon, BackArrowIcon, ChevronRightIcon, HeadsetIcon } from '../../constants';

const LegalMenuScreen: React.FC = () => {
    const navigate = useNavigate();

    const menuItems = [
        { name: 'FAQs', icon: MessageSquareIcon, path: '/dashboard/faq' },
        { name: 'About Us', icon: InfoIcon, path: '/dashboard/legal/about' },
        { name: 'Terms & Conditions', icon: FileTextIcon, path: '/dashboard/legal/terms' },
        { name: 'Privacy Policy', icon: ShieldCheckIcon, path: '/dashboard/legal/privacy' },
        { name: 'Return Policy', icon: ShieldCheckIcon, path: '/dashboard/legal/return' },
    ];

    return (
        <div className="fade-in-up pb-8">
            <header className="flex items-center p-4 lg:justify-center relative">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 lg:hidden absolute left-4">
                    <BackArrowIcon className="w-6 h-6 text-theme-primary" />
                </button>
                <div className="flex items-center gap-2 mx-auto">
                    <HeadsetIcon className="w-7 h-7 text-accent-primary" />
                    <h1 className="text-2xl md:text-3xl font-bold text-theme-primary">Help & Legal</h1>
                </div>
            </header>

            <div className="p-4 pt-0 lg:p-0">
                <div className="bg-card p-2 rounded-2xl border border-theme max-w-4xl mx-auto stagger-children">
                    <ul className="divide-y divide-theme">
                        {menuItems.map((item, index) => (
                            <li 
                                key={item.name} 
                                onClick={() => navigate(item.path)} 
                                className="flex justify-between items-center p-4 text-theme-primary bg-hover transition-colors cursor-pointer rounded-lg fade-in-up"
                                style={{'--stagger-delay': `${100 + index * 100}ms`} as React.CSSProperties}
                            >
                                <div className="flex items-center space-x-4">
                                    <item.icon className="w-6 h-6 text-accent-primary" />
                                    <span className="font-semibold">{item.name}</span>
                                </div>
                                <ChevronRightIcon className="w-5 h-5 text-theme-secondary" />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default LegalMenuScreen;
