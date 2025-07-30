
import React from 'react';
import { NavLink } from 'react-router-dom';
import { JoystickIcon, HeadsetIcon, BarChartIcon, UserCircleIcon, Logo, SettingsIcon } from '../../constants';

const SideNavBar: React.FC = () => {
    const navItems = [
        { path: 'play', icon: JoystickIcon, label: 'Gameplay' },
        { path: 'leaderboard', icon: BarChartIcon, label: 'Leaderboard' },
        { path: 'support', icon: HeadsetIcon, label: 'Support' },
        { path: 'me', icon: UserCircleIcon, label: 'Profile' },
        { path: 'settings', icon: SettingsIcon, label: 'Settings' },
    ];

    const navLinkClasses = "flex items-center space-x-4 px-4 py-3 text-theme-secondary rounded-lg hover:bg-hover hover:text-accent-primary transition-colors w-full";
    const activeNavLinkClasses = "bg-hover text-accent-primary";

    return (
        <aside className="hidden lg:flex flex-col w-64 bg-card p-4 border-r border-theme">
            <div className="px-2 mb-8">
                <Logo size="sm" />
            </div>
            <nav className="flex-grow flex flex-col space-y-2">
                {navItems.map(item => (
                    <NavLink
                        key={item.path}
                        to={`/dashboard/${item.path}`}
                        className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}
                    >
                        <item.icon className="h-6 w-6" />
                        <span className="text-base font-semibold">{item.label}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

export default SideNavBar;