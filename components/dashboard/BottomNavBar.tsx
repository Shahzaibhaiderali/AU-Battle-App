
import React from 'react';
import { NavLink } from 'react-router-dom';
import { JoystickIcon, HeadsetIcon, BarChartIcon, UserCircleIcon } from '../../constants';

const BottomNavBar: React.FC = () => {
    const navItems = [
        { path: 'play', icon: JoystickIcon, label: 'Gameplay' },
        { path: 'leaderboard', icon: BarChartIcon, label: 'Leaderboard' },
        { path: 'support', icon: HeadsetIcon, label: 'Support' },
        { path: 'me', icon: UserCircleIcon, label: 'Me' },
    ];

    const navLinkClasses = "flex flex-col items-center justify-center space-y-1 text-theme-secondary hover:text-accent-primary transition-colors w-full";
    const activeNavLinkClasses = "active-nav-item";

    return (
        <nav className="fixed bottom-0 left-0 right-0 h-20 bg-card backdrop-blur-lg border-t border-theme z-20 flex justify-around items-center lg:hidden">
            {navItems.map(item => (
                <NavLink
                    key={item.path}
                    to={`/dashboard/${item.path}`}
                    className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}
                >
                    <item.icon className="h-6 w-6" />
                    <span className="text-xs font-medium">{item.label}</span>
                </NavLink>
            ))}
        </nav>
    );
};

export default BottomNavBar;