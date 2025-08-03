


import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { UserIcon, IdCardIcon, PhoneIcon, MailIcon, LockIcon, EyeIcon, EyeOffIcon } from '../../constants';
import { SignupData } from '../../types';
import AuthLayout from './AuthLayout';
import Swal from 'sweetalert2';

const SignupScreen: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        ff_name: '',
        phone_num: '',
        email: '',
        password: '',
        password_confirmation: '',
    });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { signup, isLoading } = useAuth();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        if (formData.password !== formData.password_confirmation) {
            setError('Passwords do not match.');
            return;
        }

        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address.');
            return;
        }

        if (!/^\d{10,11}$/.test(formData.phone_num)) {
            setError('Please enter a valid 10 or 11-digit phone number.');
            return;
        }
        
        const signupPayload: SignupData = {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            password_confirmation: formData.password_confirmation,
            phone_num: formData.phone_num,
            ff_name: formData.ff_name
        };

        const result = await signup(signupPayload);
        if (result.success) {
            Swal.fire({
                title: 'Registration Successful!',
                text: 'Welcome to AU Battle. Get ready for action!',
                icon: 'success',
                timer: 2500,
                timerProgressBar: true,
                showConfirmButton: false,
                background: '#161c29',
                color: '#ffffff',
                customClass: {
                    timerProgressBar: 'bg-accent-primary',
                }
            });
             // The declarative route in App.tsx now handles navigation reliably.
        } else {
            setError(result.error || 'Signup failed. Please try again.');
        }
    };

    return (
        <AuthLayout title="Create Account" subtitle="Please fill the input below here.">
            <div>
                {error && <p className="bg-red-500/20 text-red-400 text-sm text-center p-3 rounded-md mb-4">{error}</p>}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                            <UserIcon className="h-5 w-5 text-theme-secondary"/>
                        </div>
                        <Input className="pl-12" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                            <IdCardIcon className="h-5 w-5 text-theme-secondary"/>
                        </div>
                        <Input className="pl-12" name="ff_name" placeholder="Free Fire ID" value={formData.ff_name} onChange={handleChange} required />
                    </div>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                            <PhoneIcon className="h-5 w-5 text-theme-secondary"/>
                        </div>
                        <Input className="pl-12" name="phone_num" type="tel" placeholder="Phone Number (03xxxxxxxxx)" value={formData.phone_num} onChange={handleChange} required />
                    </div>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                            <MailIcon className="h-5 w-5 text-theme-secondary"/>
                        </div>
                        <Input className="pl-12" name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                            <LockIcon className="h-5 w-5 text-theme-secondary"/>
                        </div>
                        <Input className="pl-12 pr-12" name="password" type={showPassword ? "text" : "password"} placeholder="Password (min 8 characters)" value={formData.password} onChange={handleChange} required />
                         <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 flex items-center pr-4 text-theme-secondary hover:text-theme-primary"
                        >
                            {showPassword ? <EyeOffIcon className="h-5 w-5"/> : <EyeIcon className="h-5 w-5"/>}
                        </button>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                            <LockIcon className="h-5 w-5 text-theme-secondary"/>
                        </div>
                        <Input className="pl-12 pr-12" name="password_confirmation" type={showConfirmPassword ? "text" : "password"} placeholder="Confirm Password" value={formData.password_confirmation} onChange={handleChange} required />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 flex items-center pr-4 text-theme-secondary hover:text-theme-primary"
                        >
                            {showConfirmPassword ? <EyeOffIcon className="h-5 w-5"/> : <EyeIcon className="h-5 w-5"/>}
                        </button>
                    </div>
                    
                    <div className="pt-4">
                        <Button type="submit" fullWidth isLoading={isLoading}>
                            Sign Up
                        </Button>
                    </div>
                </form>

                <p className="text-center text-theme-secondary mt-8">
                    Already have an account?{' '}
                    <Link to="/login" className="font-semibold text-accent-primary hover:text-accent-hover">
                        Sign in
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
};

export default SignupScreen;