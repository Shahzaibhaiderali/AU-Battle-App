import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { EyeIcon, EyeOffIcon, MailIcon, LockIcon } from '../../constants';
import AuthLayout from './AuthLayout';

const LoginScreen: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const { login, isLoading } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const result = await login(email, password);
        if (result.success) {
            navigate('/dashboard/play');
        } else {
            setError(result.error || 'Invalid credentials');
        }
    };

    return (
        <AuthLayout title="Login" subtitle="Please sign in to continue.">
            <div>
                {error && <p className="bg-red-500/20 text-red-400 text-sm text-center p-3 rounded-md mb-4">{error}</p>}
                
                <form onSubmit={handleSubmit} className="space-y-5">
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
                            className="pl-12"
                        />
                    </div>

                    <div className="relative">
                         <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                            <LockIcon className="h-5 w-5 text-theme-secondary" />
                        </div>
                        <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="pl-12 pr-12"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 flex items-center pr-4 text-theme-secondary hover:text-theme-primary"
                        >
                            {showPassword ? <EyeOffIcon className="h-5 w-5"/> : <EyeIcon className="h-5 w-5"/>}
                        </button>
                    </div>
                    
                    <div className="text-right -mt-2">
                        <Link to="/forgot-password" className="text-sm text-accent-primary hover:text-accent-hover">
                            Forgot Password?
                        </Link>
                    </div>

                    <div className="pt-2">
                        <Button type="submit" fullWidth disabled={isLoading}>
                            {isLoading ? 'Signing In...' : 'Login'}
                        </Button>
                    </div>
                </form>

                <p className="text-center text-theme-secondary mt-8">
                    Don't have an account?{' '}
                    <Link to="/signup" className="font-semibold text-accent-primary hover:text-accent-hover">
                        Sign up
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
};

export default LoginScreen;