
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { BackArrowIcon, CoinIcon, Spinner, PlusCircleIcon, MinusCircleIcon, HistoryIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from '../../constants';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { submitWithdrawal, getWithdrawalHistory } from '../../services/authService';
import { WithdrawalHistoryEntry, WithdrawalRequest } from '../../types';
import Swal from 'sweetalert2';

type View = 'hub' | 'withdraw' | 'history';

const WalletHubView: React.FC<{ onNavigate: (view: View) => void }> = ({ onNavigate }) => {
    const { user } = useAuth();
    const balance = user?.balance ?? 0;
    const usdValue = (balance / 100).toFixed(2);

    const actionItems = [
        {
            icon: PlusCircleIcon,
            title: 'Add Coins',
            description: 'Deposit funds to your wallet',
            action: () => Swal.fire({ title: 'Coming Soon!', text: 'This feature is not yet available.', icon: 'info', background: '#161c29', color: '#ffffff', confirmButtonColor: 'var(--accent-primary)' }),
            color: 'text-green-400',
        },
        {
            icon: MinusCircleIcon,
            title: 'Withdraw',
            description: 'Transfer coins to your account',
            action: () => onNavigate('withdraw'),
            color: 'text-red-400',
        },
        {
            icon: HistoryIcon,
            title: 'Transactions',
            description: 'View your payment history',
            action: () => onNavigate('history'),
            color: 'text-blue-400',
        },
    ];

    return (
        <div className="p-4 lg:p-0">
            <div className="bg-card text-center p-6 rounded-2xl border border-theme shadow-lg">
                <p className="text-sm font-semibold text-theme-secondary uppercase">Current Balance</p>
                <div className="my-2 flex items-center justify-center gap-2">
                     <CoinIcon className="w-10 h-10 text-yellow-400" />
                     <h2 className="text-5xl font-bold text-theme-primary">{balance.toLocaleString()}</h2>
                </div>
                <p className="text-base text-green-400 font-semibold">≈ ${usdValue} USD</p>
            </div>

            <div className="mt-8 space-y-4">
                {actionItems.map((item, index) => (
                    <button
                        key={index}
                        onClick={item.action}
                        className="w-full flex items-center gap-4 bg-card p-4 rounded-2xl border border-theme transform transition-transform hover:-translate-y-1 bg-hover"
                    >
                        <item.icon className={`w-12 h-12 flex-shrink-0 ${item.color}`} />
                        <div>
                            <h3 className="text-lg font-bold text-theme-primary text-left">{item.title}</h3>
                            <p className="text-sm text-theme-secondary text-left">{item.description}</p>
                        </div>
                    </button>
                ))}
            </div>

            <div className="mt-8 bg-card p-6 rounded-2xl border border-theme">
                <h3 className="text-xl font-bold text-theme-primary">Your Gaming Wallet</h3>
                <p className="text-theme-secondary mt-2">
                    Your journey to rewards begins here! Track your coins, manage transactions, and control your balance. Earn more, withdraw when needed, and dominate the game.
                </p>
            </div>
        </div>
    );
};

const WithdrawalView: React.FC = () => {
    const [formData, setFormData] = useState({
        amount: '',
        method: 'JazzCash' as 'JazzCash' | 'EasyPaisa',
        account_details: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { token } = useAuth();
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!token) {
            setError('Authentication error. Please log in again.');
            return;
        }

        setIsLoading(true);
        try {
            const payload: WithdrawalRequest = {
                amount: formData.amount,
                method: formData.method,
                account_details: formData.account_details,
            };
            const response = await submitWithdrawal(payload, token);
            Swal.fire({
                title: 'Request Submitted!',
                text: response.message,
                icon: 'success',
                background: '#161c29',
                color: '#ffffff',
                confirmButtonColor: 'var(--accent-primary)',
            });
            setFormData({ amount: '', method: 'JazzCash', account_details: '' });
        } catch (err: any) {
            setError(err.message || 'Failed to submit withdrawal request.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <div className="bg-card p-6 rounded-2xl border border-theme">
                <h2 className="text-lg font-semibold text-theme-primary mb-4 text-center">Enter Withdrawal Details</h2>
                {error && <p className="bg-red-500/20 text-red-400 text-sm text-center p-3 rounded-md mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-theme-secondary mb-1">Amount (PKR)</label>
                        <Input id="amount" name="amount" type="number" placeholder="e.g., 500" value={formData.amount} onChange={handleChange} required />
                    </div>
                    <div>
                        <label htmlFor="method" className="block text-sm font-medium text-theme-secondary mb-1">Payment Method</label>
                        <select
                            id="method"
                            name="method"
                            value={formData.method}
                            onChange={handleChange}
                            className="w-full bg-slate-800/80 border border-slate-700 text-theme-primary px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-accent-primary"
                        >
                            <option>JazzCash</option>
                            <option>EasyPaisa</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="account_details" className="block text-sm font-medium text-theme-secondary mb-1">Account Details (Name / Number)</label>
                        <Input id="account_details" name="account_details" type="text" placeholder="Ahad Raees / 03001234567" value={formData.account_details} onChange={handleChange} required />
                    </div>
                    <div className="pt-2">
                        <Button type="submit" fullWidth isLoading={isLoading}>Request Withdrawal</Button>
                    </div>
                </form>
            </div>
             <div className="mt-6 bg-card p-4 rounded-2xl border border-theme">
                <h3 className="text-base font-bold text-theme-primary mb-2">Withdrawal Information</h3>
                 <ul className="text-sm text-theme-secondary list-disc list-inside space-y-1">
                    <li>Minimum withdrawal: 500 PKR</li>
                    <li>Processing time: 24-48 hours</li>
                 </ul>
            </div>
        </div>
    );
};

const HistoryView: React.FC = () => {
    const [history, setHistory] = useState<WithdrawalHistoryEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const { token } = useAuth();
    
    useEffect(() => {
        const fetchHistory = async () => {
            if (!token) return;
            setIsLoading(true);
            try {
                const data = await getWithdrawalHistory(token);
                setHistory(data);
            } catch (err: any) {
                setError(err.message || 'Failed to fetch withdrawal history.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchHistory();
    }, [token]);

    const getStatusInfo = (status: string) => {
        switch(status.toLowerCase()) {
            case 'approved': return {
                className: 'text-green-400',
                Icon: CheckCircleIcon,
                text: 'Approved'
            };
            case 'rejected': return {
                className: 'text-red-400',
                Icon: XCircleIcon,
                text: 'Rejected'
            };
            default: return {
                className: 'text-yellow-400',
                Icon: ClockIcon,
                text: 'Pending'
            };
        }
    }

    if (isLoading) return <div className="flex justify-center py-10"><Spinner className="w-8 h-8 text-accent-primary" /></div>;
    if (error) return <p className="text-center text-red-400 p-8">{error}</p>;
    if (history.length === 0) return <p className="text-center text-theme-secondary py-16">No withdrawal history found.</p>;

    return (
        <div className="max-w-4xl mx-auto bg-card rounded-2xl border border-theme overflow-x-auto">
            <div className="min-w-full">
                <div className="grid grid-cols-4 text-xs font-bold text-theme-secondary uppercase p-4 border-b border-theme">
                    <div className="col-span-1">Amount</div>
                    <div className="col-span-1">Method</div>
                    <div className="col-span-1">Status</div>
                    <div className="col-span-1 text-right">Date</div>
                </div>
                <div className="divide-y divide-theme">
                    {history.map((item, index) => {
                        const statusInfo = getStatusInfo(item.status);
                        return (
                            <div key={index} className="grid grid-cols-4 items-center p-4">
                                <div className="col-span-1 font-bold text-theme-primary">{item.amount.toLocaleString()} Coins</div>
                                <div className="col-span-1 text-sm text-theme-secondary">{item.method}</div>
                                <div className="col-span-1">
                                    <div className={`flex items-center gap-2 text-sm font-semibold ${statusInfo.className}`}>
                                        <statusInfo.Icon className="w-5 h-5" />
                                        <span>{statusInfo.text}</span>
                                    </div>
                                </div>
                                <div className="col-span-1 text-sm text-theme-secondary text-right">{new Date(item.created_at).toLocaleDateString()}</div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};

const WalletScreen: React.FC = () => {
    const [view, setView] = useState<View>('hub');
    const navigate = useNavigate();

    const getTitle = () => {
        switch (view) {
            case 'withdraw': return 'Withdraw Coins';
            case 'history': return 'Transactions';
            case 'hub':
            default: return 'Coin Wallet';
        }
    };

    return (
        <div className="fade-in-up">
            <header className="flex items-center py-4 px-4 lg:px-0 mb-4 relative">
                <button 
                    onClick={() => view === 'hub' ? navigate(-1) : setView('hub')} 
                    className="p-2 -ml-2 absolute left-4 lg:left-0"
                    aria-label="Go back"
                >
                    <BackArrowIcon className="w-6 h-6 text-theme-primary" />
                </button>
                <h1 className="text-xl md:text-2xl font-bold text-theme-primary text-center w-full">{getTitle()}</h1>
            </header>

            {view === 'hub' && <WalletHubView onNavigate={setView} />}
            {view === 'withdraw' && <WithdrawalView />}
            {view === 'history' && <HistoryView />}
        </div>
    );
};


export default WalletScreen;