

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Logo, Spinner, CoinIcon } from '../../constants';
import { useAuth } from '../../hooks/useAuth';
import { getCoinBalance } from '../../services/authService';

const BellIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
);

const TopNavBar: React.FC = () => {
    const { user, token } = useAuth();
    const [coins, setCoins] = useState<number | null>(null);

    useEffect(() => {
        const fetchCoins = async () => {
            if (user && token) {
                try {
                    const data = await getCoinBalance(user.id, token);
                    setCoins(data.coins);
                } catch (error) {
                    console.error("Failed to fetch coin balance", error);
                    // Fallback to balance from user profile if API fails
                    setCoins(user.balance);
                }
            }
        };
        fetchCoins();
    }, [user, token]);

    return (
        <header className="bg-theme sticky top-0 z-20 px-4 py-3 flex items-center justify-between lg:justify-end border-b border-theme shadow-md lg:shadow-none lg:border-r">
            {/* Logo for mobile view */}
            <div className="lg:hidden">
                <Logo />
            </div>

            <div className="flex items-center space-x-4 text-theme-secondary">
                <Link to="/dashboard/updates" className="relative hover:text-accent-primary transition-colors">
                    <BellIcon />
                    {/* Add notification dot logic here if needed */}
                </Link>
                <div className="flex items-center space-x-2 bg-card px-3 py-1 rounded-full border border-theme">
                    <CoinIcon className="text-yellow-400" />
                    <span className="font-semibold text-theme-primary w-12 text-center">
                        {coins === null ? <Spinner className="w-4 h-4 mx-auto"/> : Math.floor(coins).toLocaleString()}
                    </span>
                </div>
            </div>
        </header>
    );
};

export default TopNavBar;