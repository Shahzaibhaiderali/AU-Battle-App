import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Logo, Spinner } from '../../constants';
import { useAuth } from '../../hooks/useAuth';
import { getCoinBalance } from '../../services/authService';

const BellIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
);

const CoinIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="8"/><path d="M12 18.012c-3.664 0-4-1.67-4-3.006 0-1.337.336-3.006 4-3.006s4 1.669 4 3.006c0 1.336-.336 3.006-4 3.006Z"/><path d="M12 6v12"/></svg>
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
        <header className="bg-theme sticky top-0 z-20 px-4 py-3 flex items-center justify-between border-b border-theme shadow-md lg:shadow-none lg:border-r">
            <div className="lg:hidden">
                <Logo />
            </div>
            {/* This div is a spacer on mobile to center the icons, and hidden on desktop */}
            <div className="hidden lg:block w-24"></div>

            <div className="flex items-center space-x-4 text-theme-secondary">
                <Link to="/dashboard/updates" className="relative hover:text-accent-primary transition-colors">
                    <BellIcon />
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