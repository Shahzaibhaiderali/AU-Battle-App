
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { MailIcon } from '../../constants';
import { forgotPassword } from '../../services/authService';
import AuthLayout from './AuthLayout';

const ForgotPasswordScreen: React.FC = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        setError('');
        
        try {
            const response = await forgotPassword(email);
            setMessage(response.message || 'If an account with that email exists, you will receive a password reset token.');
        } catch (err: any) {
            setError(err.message || 'Failed to send reset link. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout title="Forgot Password" subtitle="Enter your email to receive a password reset token.">
            <div>
                {message && <p className="bg-green-500/20 text-green-400 text-sm text-center p-3 rounded-md mb-4">{message}</p>}
                {error && <p className="bg-red-500/20 text-red-400 text-sm text-center p-3 rounded-md mb-4">{error}</p>}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                            <MailIcon className="h-5 w-5 text-theme-secondary" />
                        </div>
                        <Input
                            id="email"
                            type="email"
                            placeholder="user@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isLoading || !!message}
                            className="pl-12"
                        />
                    </div>
                    <Button type="submit" fullWidth disabled={isLoading || !!message}>
                        {isLoading ? 'Sending...' : 'Send Reset Link'}
                    </Button>
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

export default ForgotPasswordScreen;