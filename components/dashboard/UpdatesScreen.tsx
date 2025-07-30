import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getUpdates } from '../../services/authService';
import { Update } from '../../types';
import { Spinner, BackArrowIcon, ChevronRightIcon } from '../../constants';

const UpdatesScreen: React.FC = () => {
    const [updates, setUpdates] = useState<Update[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [openUpdateId, setOpenUpdateId] = useState<number | null>(null);
    const [readUpdateIds, setReadUpdateIds] = useState<Set<number>>(() => {
        const stored = localStorage.getItem('readUpdateIds');
        return stored ? new Set(JSON.parse(stored)) : new Set();
    });

    const { token } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUpdates = async () => {
            if (!token) return;
            setIsLoading(true);
            try {
                const data = await getUpdates(token);
                setUpdates(data);
            } catch (err: any) {
                setError(err.message || 'Failed to fetch updates.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchUpdates();
    }, [token]);

    const handleToggleUpdate = (id: number) => {
        setOpenUpdateId(prevId => (prevId === id ? null : id));
        if (!readUpdateIds.has(id)) {
            const newReadIds = new Set(readUpdateIds);
            newReadIds.add(id);
            setReadUpdateIds(newReadIds);
            localStorage.setItem('readUpdateIds', JSON.stringify(Array.from(newReadIds)));
        }
    };

    return (
        <div>
            <header className="flex items-center p-4 fade-in-up">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2">
                    <BackArrowIcon className="w-6 h-6 text-theme-primary" />
                </button>
                <h1 className="text-xl font-bold text-theme-primary mx-auto pr-8">Important Updates</h1>
            </header>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <Spinner className="w-10 h-10 text-accent-primary" />
                </div>
            ) : error ? (
                <p className="text-center text-red-400">{error}</p>
            ) : (
                <div className="space-y-3 px-4 stagger-children">
                    {updates.map((update, index) => (
                        <div 
                            key={update.id} 
                            className="bg-card border border-theme rounded-lg overflow-hidden fade-in-up"
                            style={{'--stagger-delay': `${100 + index * 50}ms`} as React.CSSProperties}
                        >
                            <button
                                onClick={() => handleToggleUpdate(update.id)}
                                className="w-full flex items-center justify-between p-4 text-left"
                                aria-expanded={openUpdateId === update.id}
                            >
                                <div className="flex items-center">
                                    {!readUpdateIds.has(update.id) && <div className="w-2.5 h-2.5 bg-red-500 rounded-full mr-3 flex-shrink-0"></div>}
                                    {readUpdateIds.has(update.id) && <div className="w-2.5 h-2.5 bg-gray-600 rounded-full mr-3 flex-shrink-0"></div>}
                                    <span className="font-semibold text-theme-primary">{update.heading}</span>
                                </div>
                                <ChevronRightIcon className={`w-5 h-5 text-theme-secondary transition-transform ${openUpdateId === update.id ? 'rotate-90' : ''}`} />
                            </button>
                            {openUpdateId === update.id && (
                                <div className="px-4 pb-4 border-t border-theme">
                                    <p className="text-theme-secondary mt-2 text-sm">{update.description || update.content}</p>
                                    <p className="text-xs text-gray-500 mt-3 text-right">{new Date(update.created_at).toLocaleDateString()}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UpdatesScreen;