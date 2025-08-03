
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { JoystickIcon, BarChartIcon, MessageSquareIcon, UserCircleIcon } from '../../constants';

const BottomNavBar: React.FC = () => {
    const location = useLocation();

    const navItems = [
        { path: 'play', icon: JoystickIcon, label: 'Play' },
        { path: 'leaderboard', icon: BarChartIcon, label: 'Leaderboard' },
        { path: 'support', icon: MessageSquareIcon, label: 'Support' },
        { path: 'me', icon: UserCircleIcon, label: 'Me' },
    ];

    const getNavLinkClasses = (path: string, isActive: boolean) => {
        const baseClasses = "flex flex-col items-center justify-center space-y-1 text-theme-secondary hover:text-accent-primary transition-colors w-full pt-2";
        const activeClasses = "active-nav-item";

        // Special handling for 'me' to be active on settings and updates too
        if (path === 'me') {
            const isMeSection = location.pathname.startsWith('/dashboard/me') || 
                                location.pathname.startsWith('/dashboard/settings') || 
                                location.pathname.startsWith('/dashboard/updates');
            return `${baseClasses} ${isMeSection ? activeClasses : ''}`;
        }
        
        return `${baseClasses} ${isActive ? activeClasses : ''}`;
    };

    return (
        <nav className="fixed bottom-0 left-0 right-0 h-16 bg-card backdrop-blur-lg border-t border-theme z-20 flex justify-around items-center lg:hidden">
            {navItems.map(item => (
                <NavLink
                    key={item.path}
                    to={`/dashboard/${item.path}`}
                    className={({ isActive }) => getNavLinkClasses(item.path, isActive)}
                >
                    <item.icon className="h-6 w-6" />
                    <span className="text-xs font-medium">{item.label}</span>
                </NavLink>
            ))}
        </nav>
    );
};

export default BottomNavBar;