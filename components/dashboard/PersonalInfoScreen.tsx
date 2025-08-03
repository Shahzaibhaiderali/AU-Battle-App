
import React, { useState, useRef, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ASSETS, BackArrowIcon, Spinner, CameraIcon, UserIcon, MailIcon, PhoneIcon } from '../../constants';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { uploadAvatar, updateProfile } from '../../services/authService';
import { UpdateProfileData } from '../../types';
import Swal from 'sweetalert2';

interface EditableFieldProps {
    label: string;
    value: string;
    fieldName: keyof UpdateProfileData;
    icon: React.FC<{ className?: string }>;
    inputType?: string;
}

const EditableField: React.FC<EditableFieldProps> = ({ label, value, fieldName, icon: Icon, inputType = 'text' }) => {
    const { user, token, updateUserContext } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [currentValue, setCurrentValue] = useState(value);
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
        if (currentValue === value) {
            setIsEditing(false);
            return;
        }
        
        if (!token) {
            Swal.fire('Error', 'Authentication session has expired.', 'error');
            return;
        }
        
        if (!user) {
            Swal.fire('Error', 'User data is not available. Please try again.', 'error');
            return;
        }

        setIsLoading(true);
        try {
            const payload: UpdateProfileData = { [fieldName]: currentValue };
            const updatedUserResponse = await updateProfile(payload, token);
            const newBalance = parseFloat(updatedUserResponse.balance);
            updateUserContext({
                ...updatedUserResponse,
                balance: !isNaN(newBalance) ? newBalance : user.balance,
            });
            Swal.fire('Success', `${label} has been updated.`, 'success');
            setIsEditing(false);
        } catch (error: any) {
            Swal.fire('Update Failed', error.message || `Could not update ${label}.`, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-between py-4 border-b border-theme last:border-b-0">
            <div className="flex items-center gap-4">
                <Icon className="w-6 h-6 text-theme-secondary" />
                <div>
                    <p className="text-sm text-theme-secondary">{label}</p>
                    {!isEditing ? (
                        <p className="text-base font-semibold text-theme-primary">{value}</p>
                    ) : (
                        <Input
                            type={inputType}
                            value={currentValue}
                            onChange={(e) => setCurrentValue(e.target.value)}
                            className="text-base !p-1 !bg-transparent border-accent-primary"
                        />
                    )}
                </div>
            </div>
            {!isEditing ? (
                <button onClick={() => setIsEditing(true)} className="text-sm font-semibold text-accent-primary hover:text-accent-hover">Edit</button>
            ) : (
                <div className="flex gap-2">
                    <Button onClick={handleSave} isLoading={isLoading} className="!py-1 !px-3 !text-sm">Save</Button>
                    <Button onClick={() => { setIsEditing(false); setCurrentValue(value); }} variant="secondary" className="!py-1 !px-3 !text-sm">Cancel</Button>
                </div>
            )}
        </div>
    );
};

const PersonalInfoScreen: React.FC = () => {
    const { user, token, updateUserContext } = useAuth();
    const navigate = useNavigate();
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
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
            } finally {
                setIsUploading(false);
            }
        }
    };

    if (!user) {
        return <div className="flex justify-center py-10"><Spinner className="w-8 h-8 text-accent-primary" /></div>;
    }

    return (
        <div className="fade-in-up">
             <header className="flex items-center p-4 lg:p-0 mb-4 relative">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 absolute left-4 lg:left-0" aria-label="Go back">
                    <BackArrowIcon className="w-6 h-6 text-theme-primary" />
                </button>
                <h1 className="text-xl md:text-2xl font-bold text-theme-primary text-center w-full">Personal Information</h1>
            </header>
            
            <div className="max-w-2xl mx-auto space-y-6 px-4 lg:px-0">
                <div className="bg-card border border-theme rounded-2xl p-6 flex flex-col items-center">
                     <img 
                        src={user.avatar_url || ASSETS.PROFILE_AVATAR}
                        alt="Profile" 
                        className="w-24 h-24 rounded-full object-cover border-4 border-theme mb-4"
                    />
                     <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleAvatarChange}
                        className="hidden"
                        accept="image/png, image/jpeg"
                        disabled={isUploading}
                    />
                    <Button 
                        onClick={() => fileInputRef.current?.click()} 
                        isLoading={isUploading}
                        className="flex items-center gap-2"
                    >
                       {!isUploading && <CameraIcon className="w-5 h-5" />}
                       Change Picture
                    </Button>
                </div>
                
                <div className="bg-card border border-theme rounded-2xl p-6">
                    <EditableField label="Full Name" value={user.name} fieldName="name" icon={UserIcon} />
                    <EditableField label="Email Address" value={user.email} fieldName="email" icon={MailIcon} inputType="email" />
                    <EditableField label="Phone Number" value={user.phone_num} fieldName="phone_num" icon={PhoneIcon} inputType="tel" />
                </div>
            </div>
        </div>
    );
};

export default PersonalInfoScreen;