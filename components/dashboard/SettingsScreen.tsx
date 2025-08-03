


import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BackArrowIcon } from '../../constants';
import ChangePasswordModal from '../modals/ChangePasswordModal';

const SettingsScreen: React.FC = () => {
    const navigate = useNavigate();
    const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);

    return (
        <div className="fade-in-up">
            <ChangePasswordModal 
                isOpen={isPasswordModalOpen}
                onClose={() => setPasswordModalOpen(false)}
            />
            <header className="flex items-center p-4 border-b border-theme lg:border-none lg:mb-4">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 lg:hidden">
                    <BackArrowIcon className="w-6 h-6 text-theme-primary" />
                </button>
                <h1 className="text-xl md:text-2xl font-bold text-theme-primary lg:text-3xl lg:p-0">Settings</h1>
            </header>

            <div className="p-4 pt-0 lg:p-0 space-y-6">
                <div className="bg-card p-6 rounded-lg border border-theme">
                    <h2 className="text-lg font-semibold text-theme-primary mb-4">Manage Account</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <p className="text-theme-secondary">Change Password</p>
                            <button onClick={() => setPasswordModalOpen(true)} className="text-sm font-semibold text-accent-primary hover:text-accent-hover transition-colors">Manage</button>
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="text-theme-secondary">Manage Subscription</p>
                             <button className="text-sm font-semibold text-accent-primary hover:text-accent-hover transition-colors">View Plan</button>
                        </div>
                    </div>
                </div>

                <div className="bg-card p-6 rounded-lg border border-theme">
                    <h2 className="text-lg font-semibold text-theme-primary mb-4">Preferences</h2>
                     <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <p className="text-theme-secondary">Push Notifications</p>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-primary"></div>
                            </label>
                        </div>
                         <div className="flex justify-between items-center">
                            <p className="text-theme-secondary">Email Newsletter</p>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" value="" className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-primary"></div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsScreen;