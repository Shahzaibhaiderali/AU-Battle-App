
import React, { useState, useRef, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ASSETS, Spinner, UserIcon, WalletIcon, LogOutIcon, ChevronRightIcon, PaintBrushIcon, SettingsIcon, CameraIcon, HeadsetIcon } from '../../constants';
import ThemeSwitcherModal from '../ui/ThemeSwitcherModal';
import { uploadAvatar } from '../../services/authService';
import Swal from 'sweetalert2';

const ProfileScreen: React.FC = () => {
    const { logout, user, token, updateUserContext } = useAuth();
    const navigate = useNavigate();
    const [isThemeModalOpen, setThemeModalOpen] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);

            if (!token) {
                Swal.fire('Error', 'Authentication session has expired.', 'error');
                return;
            }

            setIsUploading(true);
            try {
                const response = await uploadAvatar(file, token);
                updateUserContext({ avatar_url: response.avatar_url });
                Swal.fire('Success!', 'Your profile picture has been updated.', 'success');
            } catch (error: any) {
                Swal.fire('Upload Failed', error.message || 'Could not upload new picture.', 'error');
                setAvatarPreview(null); // Revert preview on failure
            } finally {
                setIsUploading(false);
            }
        }
    };

    const menuItems = [
        { name: 'Personal Info', icon: UserIcon, action: () => navigate('/dashboard/personal-info') },
        { name: 'My Wallet', icon: WalletIcon, action: () => navigate('/dashboard/wallet') },
        { name: 'Settings', icon: SettingsIcon, action: () => navigate('/dashboard/settings') },
        { name: 'Help & Legal', icon: HeadsetIcon, action: () => navigate('/dashboard/legal-menu') },
    ];

    if (!user) {
        return (
            <div className="flex flex-col h-full w-full items-center justify-center">
                <Spinner className="w-10 h-10 text-accent-primary" />
                <p className="mt-4 text-theme-secondary">Loading Profile...</p>
            </div>
        );
    }

    const currentAvatar = avatarPreview || user.avatar_url || ASSETS.PROFILE_AVATAR;

    return (
        <div className="w-full h-full relative">
            <ThemeSwitcherModal isOpen={isThemeModalOpen} onClose={() => setThemeModalOpen(false)} />
            
            <div className="lg:pt-0">
                <h1 className="text-2xl font-bold text-theme-primary mb-6 lg:hidden text-center">My Profile</h1>
                <div className="lg:flex lg:items-start lg:space-x-8 max-w-4xl mx-auto">
                    {/* Left Column: User Info */}
                    <div className="flex flex-col items-center text-center fade-in-up lg:w-1/3 lg:sticky lg:top-8">
                        <div className="relative w-28 h-28 mb-4 group">
                            <img 
                                src={currentAvatar}
                                alt="Profile" 
                                className="w-full h-full rounded-full object-cover border-4 border-theme"
                            />
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleAvatarChange}
                                className="hidden"
                                accept="image/png, image/jpeg"
                                disabled={isUploading}
                            />
                             <button
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                aria-label="Change profile picture"
                                disabled={isUploading}
                            >
                                {isUploading ? <Spinner className="w-8 h-8"/> : <CameraIcon className="w-8 h-8" />}
                            </button>
                            <div className="absolute inset-0 rounded-full border-2 border-accent-primary animate-ping-slow opacity-75 pointer-events-none"></div>
                        </div>
                        <h2 className="text-2xl font-bold text-theme-primary">{user.name}</h2>
                        <p className="text-sm text-theme-secondary mt-1">FF ID: {user.ff_name}</p>
                        
                        <div className="flex flex-col items-center space-y-1 w-full text-sm text-theme-secondary mt-4">
                            <span>Joined: Mar 18th 2024</span>
                            <span>Rating: 8.7/10</span>
                            <span>Rank: Pro V</span>
                        </div>
                    </div>

                    {/* Right Column: Menu */}
                    <div className="mt-8 lg:mt-0 w-full lg:w-2/3 bg-card p-2 rounded-2xl stagger-children">
                        <ul className="divide-y divide-theme">
                            {menuItems.map((item, index) => (
                                <li 
                                    key={item.name} 
                                    onClick={item.action} 
                                    className="flex justify-between items-center p-4 text-theme-primary bg-hover transition-colors cursor-pointer rounded-lg fade-in-up"
                                    style={{'--stagger-delay': `${100 + index * 100}ms`} as React.CSSProperties}
                                >
                                    <div className="flex items-center space-x-4">
                                        <item.icon className="w-6 h-6 text-accent-primary" />
                                        <span>{item.name}</span>
                                    </div>
                                    <ChevronRightIcon className="w-5 h-5 text-theme-secondary" />
                                </li>
                            ))}
                             <li 
                                onClick={() => setThemeModalOpen(true)}
                                className="flex justify-between items-center p-4 text-theme-primary bg-hover transition-colors cursor-pointer rounded-lg fade-in-up"
                                style={{'--stagger-delay': `${100 + menuItems.length * 100}ms`} as React.CSSProperties}
                            >
                                <div className="flex items-center space-x-4">
                                    <PaintBrushIcon className="w-6 h-6 text-accent-primary" />
                                    <span>Change Theme</span>
                                </div>
                                <ChevronRightIcon className="w-5 h-5 text-theme-secondary" />
                            </li>
                            <li 
                                onClick={logout} 
                                className="flex justify-between items-center p-4 text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer rounded-lg fade-in-up"
                                style={{'--stagger-delay': `${100 + (menuItems.length + 1) * 100}ms`} as React.CSSProperties}
                            >
                                <div className="flex items-center space-x-4">
                                    <LogOutIcon className="w-6 h-6" />
                                    <span>Logout</span>
                                </div>
                                <ChevronRightIcon className="w-5 h-5" />
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileScreen;