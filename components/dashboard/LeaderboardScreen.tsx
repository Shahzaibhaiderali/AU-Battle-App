import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getLeaderboard } from '../../services/authService';
import { LeaderboardEntry } from '../../types';
import { Spinner, CrownIcon, ArrowUpIcon, ArrowDownIcon } from '../../constants';

type Timeframe = 'daily' | 'weekly' | 'monthly';

const LeaderboardScreen: React.FC = () => {
    const [timeframe, setTimeframe] = useState<Timeframe>('daily');
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const { token } = useAuth();

    useEffect(() => {
        const fetchLeaderboard = async () => {
            if (!token) return;
            setIsLoading(true);
            setError('');
            try {
                const data = await getLeaderboard(timeframe, token);
                setLeaderboard(data);
            } catch (err: any) {
                setError(err.message || 'Failed to fetch leaderboard data.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchLeaderboard();
    }, [timeframe, token]);
    
    const top3 = leaderboard.slice(0, 3);
    const rest = leaderboard.slice(3);

    return (
        <div className="pb-8">
            <div className="text-center pt-4 pb-8 fade-in-up">
                <h1 className="text-3xl md:text-4xl font-bold text-theme-primary">Leaderboard</h1>
            </div>

            <div className="px-4 mb-8 fade-in-up" style={{animationDelay: '100ms'}}>
                <div className="flex justify-center bg-card p-1 rounded-full border border-theme max-w-md mx-auto">
                    {(['daily', 'weekly', 'monthly'] as Timeframe[]).map((tf) => (
                        <button
                            key={tf}
                            onClick={() => setTimeframe(tf)}
                            className={`w-full py-2 px-4 rounded-full text-sm font-semibold transition-colors ${
                                timeframe === tf ? 'bg-accent-primary text-black' : 'text-theme-secondary'
                            }`}
                        >
                            {tf.charAt(0).toUpperCase() + tf.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <Spinner className="w-10 h-10 text-accent-primary" />
                </div>
            ) : error ? (
                <p className="text-center text-red-400">{error}</p>
            ) : leaderboard.length === 0 ? (
                <div className="text-center py-16 fade-in-up">
                    <p className="text-theme-secondary text-lg font-semibold">The Leaderboard is Empty</p>
                    <p className="text-theme-secondary mt-1">Check back later to see the top players!</p>
                </div>
            ) : (
                <>
                    {/* Top 3 Players */}
                    <div className="flex justify-center items-end space-x-2 md:space-x-4 px-4 mb-8 h-48 md:h-56 fade-in-up" style={{animationDelay: '200ms'}}>
                         {/* 2nd Place */}
                        <TopPlayerCard player={top3[1]} rank={2} size="medium" />
                         {/* 1st Place */}
                        <TopPlayerCard player={top3[0]} rank={1} size="large" />
                         {/* 3rd Place */}
                        <TopPlayerCard player={top3[2]} rank={3} size="medium" />
                    </div>

                    {/* Rest of the players */}
                    <div className="px-4 space-y-2 stagger-children max-w-2xl mx-auto">
                        {rest.map((player, index) => (
                           <PlayerRow 
                            key={player.id} 
                            player={player} 
                            rank={index + 4} 
                            style={{'--stagger-delay': `${300 + index * 50}ms`} as React.CSSProperties}
                           />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

const TopPlayerCard: React.FC<{player?: LeaderboardEntry, rank: number, size: 'large' | 'medium'}> = ({player, rank, size}) => {
    if(!player) return <div className={`w-1/3 ${size === 'large' ? 'h-44 md:h-52' : 'h-36 md:h-44'}`}></div>;
    
    const sizeClasses = {
        large: {
            card: 'h-44 md:h-52',
            avatar: 'w-20 h-20 md:w-24 md:h-24',
            name: 'text-lg',
            crown: 'w-8 h-8 -top-5'
        },
        medium: {
            card: 'h-36 md:h-44',
            avatar: 'w-16 h-16 md:w-20 md:h-20',
            name: 'text-base',
            crown: ''
        }
    }
    const s = sizeClasses[size];
    const rankColors = ['#FFD700', '#C0C0C0', '#CD7F32'];
    const glowClasses = ['glow-gold', 'glow-silver', 'glow-bronze'];


    return (
        <div className={`w-1/3 flex flex-col items-center justify-end ${s.card} `}>
            <div 
                className={`relative flex flex-col items-center p-3 pt-8 bg-card rounded-t-xl w-full border-t-4 ${glowClasses[rank-1]}`} 
                style={{borderColor: rankColors[rank -1]}}
            >
                {rank === 1 && <CrownIcon className="absolute text-yellow-400 w-8 h-8 -top-5" />}
                <div className="relative">
                    <img src={player.avatar} alt={player.name} className={`${s.avatar} rounded-full object-cover border-2`} style={{borderColor: rankColors[rank-1]}} />
                     <span className="absolute -bottom-2 -right-2 bg-gray-800 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-card">{rank}</span>
                </div>
                <h3 className={`font-bold mt-2 truncate w-full text-center text-theme-primary ${s.name}`}>{player.name}</h3>
                <p className="text-sm font-bold text-accent-primary">{player.coins_won.toLocaleString()}</p>
            </div>
        </div>
    );
}

const PlayerRow: React.FC<{player: LeaderboardEntry, rank: number, style?: React.CSSProperties}> = ({player, rank, style}) => {
    return (
        <div className="flex items-center bg-card p-3 rounded-lg border border-theme fade-in-up" style={style}>
            <span className="w-8 text-center text-theme-secondary font-semibold">{rank}</span>
            <img src={player.avatar} alt={player.name} className="w-10 h-10 rounded-full object-cover ml-2"/>
            <p className="ml-4 font-semibold flex-grow truncate text-theme-primary">{player.name}</p>
            <div className="flex items-center space-x-2">
                <p className="font-bold text-accent-primary">{player.coins_won.toLocaleString()}</p>
                 {/* <ArrowUpIcon className="text-green-500"/> */}
            </div>
        </div>
    )
}

export default LeaderboardScreen;