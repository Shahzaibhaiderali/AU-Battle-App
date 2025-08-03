
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getLeaderboard } from '../../services/authService';
import { LeaderboardEntry } from '../../types';
import { CrownIcon, TrophyIcon, BackArrowIcon, CoinIcon, ArrowUpIcon } from '../../constants';

type Timeframe = 'daily' | 'weekly' | 'monthly';

const LeaderboardSkeleton: React.FC = () => (
    <div className="max-w-3xl mx-auto px-4 space-y-4 animate-pulse">
        <div className="h-40 w-full bg-slate-700/50 rounded-2xl"></div>
        <div className="h-8 w-full bg-slate-700/50 rounded-md mt-8"></div>
        {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center bg-card/50 p-3 rounded-lg h-[60px]">
                <div className="w-1/6 flex items-center justify-center">
                    <div className="w-6 h-6 bg-slate-700/50 rounded-md"></div>
                </div>
                <div className="w-3/6 flex items-center">
                    <div className="w-10 h-10 rounded-full bg-slate-700/50 ml-4"></div>
                    <div className="h-4 bg-slate-700/50 rounded w-1/2 ml-4"></div>
                </div>
                <div className="w-2/6 flex items-center justify-end gap-2">
                    <div className="h-6 w-16 bg-slate-700/50 rounded"></div>
                    <div className="w-5 h-5 bg-slate-700/50 rounded-full"></div>
                </div>
            </div>
        ))}
    </div>
);

const TopPlayerCard: React.FC<{ player: LeaderboardEntry; rank: number }> = ({ player, rank }) => {
    const isFirst = rank === 1;
    const size = isFirst ? 'w-28 h-28' : 'w-24 h-24';
    const nameSize = isFirst ? 'text-lg' : 'text-base';
    const pointsSize = isFirst ? 'text-2xl' : 'text-xl';
    const elevation = isFirst ? '-translate-y-8' : 'translate-y-0';
    const rankColor = rank === 1 ? 'border-yellow-400 glow-gold' : rank === 2 ? 'border-gray-300 glow-silver' : 'border-orange-400 glow-bronze';

    return (
        <div className={`flex flex-col items-center transition-transform duration-300 ${elevation}`}>
            {isFirst && <CrownIcon className="w-8 h-8 text-yellow-400 mb-2" />}
            <div className="relative">
                <img src={player.avatar} alt={player.name} className={`${size} rounded-full object-cover border-4 ${rankColor}`} />
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-card border-2 border-theme rounded-full h-8 w-8 flex items-center justify-center font-bold text-sm text-theme-primary">{rank}</div>
            </div>
            <h3 className={`mt-4 font-bold text-theme-primary ${nameSize} truncate max-w-[100px]`}>{player.name}</h3>
            <p className={`font-bold text-accent-primary ${pointsSize}`}>{player.coins_won.toLocaleString()}</p>
        </div>
    );
};

const PlayerListItem: React.FC<{player: LeaderboardEntry; rank: number}> = ({player, rank}) => (
    <div className="flex items-center bg-hover p-3 rounded-lg">
        <div className="w-1/6 text-center font-bold text-lg text-theme-secondary">{rank}</div>
        <div className="w-3/6 flex items-center">
            <img src={player.avatar} alt={player.name} className="w-10 h-10 rounded-full object-cover border-2 border-theme" />
            <div className="ml-3">
                 <p className="font-semibold text-theme-primary truncate">{player.name}</p>
                 <p className="text-xs text-theme-secondary">@{player.name.toLowerCase().replace(/\s/g, '')}</p>
            </div>
        </div>
        <div className="w-2/6 flex items-center justify-end gap-2 text-right">
            <span className="font-bold text-base text-theme-primary">
                {player.coins_won.toLocaleString()}
            </span>
            <ArrowUpIcon className="w-4 h-4 text-green-500" />
        </div>
    </div>
);


const LeaderboardScreen: React.FC = () => {
    const [timeframe, setTimeframe] = useState<Timeframe>('weekly');
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const { token } = useAuth();
    const navigate = useNavigate();

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

    const topThree = leaderboard.slice(0, 3);
    const restOfLeaderboard = leaderboard.slice(3);


    return (
        <div className="pb-8">
            <header className="flex items-center p-4 lg:justify-center fade-in-up relative">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 lg:hidden absolute left-4">
                    <BackArrowIcon className="w-6 h-6 text-theme-primary" />
                </button>
                <div className="flex items-center gap-2 mx-auto">
                    <TrophyIcon className="w-7 h-7 text-accent-primary" />
                    <h1 className="text-2xl md:text-3xl font-bold text-theme-primary">Leaderboard</h1>
                </div>
            </header>

            <div className="px-4 my-6 fade-in-up" style={{ animationDelay: '100ms' }}>
                <div className="flex justify-center bg-card p-1 rounded-full border border-theme max-w-sm mx-auto">
                    {(['daily', 'weekly', 'monthly'] as Timeframe[]).map((tf) => (
                        <button
                            key={tf}
                            onClick={() => setTimeframe(tf)}
                            className={`w-full py-2 px-4 rounded-full text-sm font-semibold transition-colors duration-300 ${
                                timeframe === tf ? 'bg-accent-primary text-black' : 'text-theme-secondary hover:bg-hover'
                            }`}
                        >
                            {tf.charAt(0).toUpperCase() + tf.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {isLoading ? (
                <LeaderboardSkeleton />
            ) : error ? (
                <p className="text-center text-red-400 p-8">{error}</p>
            ) : leaderboard.length === 0 ? (
                <div className="text-center py-16 fade-in-up">
                    <p className="text-theme-secondary text-lg font-semibold">The Leaderboard is Empty</p>
                    <p className="text-theme-secondary mt-1">Check back later to see the top players!</p>
                </div>
            ) : (
                <div className="max-w-3xl mx-auto px-4 space-y-8">
                     <div className="flex justify-around items-end pt-10 px-4 min-h-[220px] bg-card/70 border border-theme rounded-2xl fade-in-up" style={{ animationDelay: '200ms' }}>
                        {topThree[1] && <TopPlayerCard player={topThree[1]} rank={2} />}
                        {topThree[0] && <TopPlayerCard player={topThree[0]} rank={1} />}
                        {topThree[2] && <TopPlayerCard player={topThree[2]} rank={3} />}
                     </div>
                    {restOfLeaderboard.length > 0 && (
                        <div className="bg-card p-2 rounded-2xl border border-theme stagger-children fade-in-up" style={{ animationDelay: '300ms' }}>
                            <div className="space-y-2">
                                {restOfLeaderboard.map((player, index) => (
                                    <PlayerListItem
                                        key={player.id}
                                        player={player}
                                        rank={index + 4}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default LeaderboardScreen;