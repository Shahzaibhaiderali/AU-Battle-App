
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon, IdCardIcon } from '../../constants';
import { resetPassword } from '../../services/authService';
import { ResetPasswordData } from '../../types';
import AuthLayout from './AuthLayout';

const ResetPasswordScreen: React.FC = () => {
    const [formData, setFormData] = useState({
        email: '',
        token: '',
        password: '',
        password_confirmation: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (formData.password !== formData.password_confirmation) {
            setError('Passwords do not match.');
            return;
        }

        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }
        
        setIsLoading(true);

        try {
            const payload: ResetPasswordData = { ...formData };
            const response = await resetPassword(payload);
            setMessage(response.message || 'Your password has been reset successfully! Redirecting to login...');
            setTimeout(() => navigate('/login'), 3000);
        } catch (err: any) {
            setError(err.message || 'Failed to reset password. Please check your details and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout title="Reset Password" subtitle="Enter your token and a new password.">
            <div>
                {error && <p className="bg-red-500/20 text-red-400 text-sm text-center p-3 rounded-md mb-4">{error}</p>}
                {message && <p className="bg-green-500/20 text-green-400 text-sm text-center p-3 rounded-md mb-4">{message}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                         <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                            <MailIcon className="h-5 w-5 text-theme-secondary" />
                        </div>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="user@gmail.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            disabled={isLoading || !!message}
                            className="pl-12"
                        />
                    </div>

                    <div className="relative">
                         <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                            <IdCardIcon className="h-5 w-5 text-theme-secondary" />
                        </div>
                        <Input
                            id="token"
                            name="token"
                            type="text"
                            placeholder="Reset Token"
                            value={formData.token}
                            onChange={handleChange}
                            required
                            disabled={isLoading || !!message}
                            className="pl-12"
                        />
                    </div>

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                            <LockIcon className="h-5 w-5 text-theme-secondary"/>
                        </div>
                        <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="New Password (min 8 chars)"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            disabled={isLoading || !!message}
                            className="pl-12 pr-12"
                        />
                         <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 flex items-center pr-4 text-theme-secondary hover:text-theme-primary"
                            disabled={isLoading || !!message}
                        >
                            {showPassword ? <EyeOffIcon className="h-5 w-5"/> : <EyeIcon className="h-5 w-5"/>}
                        </button>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                            <LockIcon className="h-5 w-5 text-theme-secondary"/>
                        </div>
                        <Input
                            id="password_confirmation"
                            name="password_confirmation"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm New Password"
                            value={formData.password_confirmation}
                            onChange={handleChange}
                            required
                            disabled={isLoading || !!message}
                            className="pl-12 pr-12"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 flex items-center pr-4 text-theme-secondary hover:text-theme-primary"
                            disabled={isLoading || !!message}
                        >
                            {showConfirmPassword ? <EyeOffIcon className="h-5 w-5"/> : <EyeIcon className="h-5 w-5"/>}
                        </button>
                    </div>
                    
                    <div className="pt-2">
                        <Button type="submit" fullWidth disabled={isLoading || !!message}>
                            {isLoading ? 'Resetting...' : 'Reset Password'}
                        </Button>
                    </div>
                </form>

                <p className="text-center text-theme-secondary mt-8">
                    Remembered your password?{' '}
                    <Link to="/login" className="font-semibold text-accent-primary hover:text-accent-hover">
                        Login
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
};

export default ResetPasswordScreen;