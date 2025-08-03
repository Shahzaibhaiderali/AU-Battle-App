

import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { changePassword } from '../../services/authService';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import Swal from 'sweetalert2';
import { ChangePasswordData } from '../../types';

interface ChangePasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose }) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { token } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (newPassword !== confirmPassword) {
            setError('New passwords do not match.');
            return;
        }

        if (newPassword.length < 8) {
            setError('New password must be at least 8 characters long.');
            return;
        }

        if (!token) {
            setError('Authentication error. Please log in again.');
            return;
        }

        setIsLoading(true);
        try {
            const response = await changePassword({ oldPassword, newPassword, newPassword_confirmation: confirmPassword }, token);
            Swal.fire({
                title: 'Success!',
                text: response.message,
                icon: 'success',
                background: '#161c29',
                color: '#ffffff',
                confirmButtonColor: 'var(--accent-primary)',
            });
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to change password.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 fade-in-up"
            onClick={onClose}
        >
            <div
                className="bg-card border border-theme rounded-2xl p-6 w-full max-w-sm"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-bold text-theme-primary text-center mb-6">Change Password</h2>
                {error && <p className="bg-red-500/20 text-red-400 text-sm text-center p-3 rounded-md mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        type="password"
                        placeholder="Old Password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                    />
                    <Input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                    <Input
                        type="password"
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <div className="pt-2 flex gap-4">
                        <Button type="button" variant="secondary" onClick={onClose} fullWidth>Cancel</Button>
                        <Button type="submit" isLoading={isLoading} fullWidth>Update</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePasswordModal;