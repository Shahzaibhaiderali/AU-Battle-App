
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AuthContextType, SignupData, User, LoginResponse, SignupResponse, UserProfileResponse } from '../types';
import { loginUser, signupUser, getCoinBalance, getUserProfile } from '../services/authService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const logout = useCallback(() => {
        localStorage.removeItem('authToken');
        setToken(null);
        setUser(null);
    }, []);

    const updateUserContext = (updatedData: Partial<User>) => {
        setUser(currentUser => currentUser ? { ...currentUser, ...updatedData } : null);
    };
    
    const loadUserSession = useCallback(async (authToken: string): Promise<void> => {
        // Fetch the full user profile instead of relying on token decoding.
        const profileData: UserProfileResponse = await getUserProfile(authToken);

        // Fetch the remaining data like balance
        const balanceData = await getCoinBalance(profileData.id, authToken);
        
        const fullUser: User = {
            id: profileData.id,
            role: profileData.role,
            name: profileData.name,
            email: profileData.email,
            ff_name: profileData.ff_name,
            phone_num: profileData.phone_num,
            avatar_url: profileData.avatar_url,
            balance: balanceData.coins || 0,
        };

        setUser(fullUser);
        setToken(authToken);
        localStorage.setItem('authToken', authToken);

    }, []);
    
    const checkAuthStatus = useCallback(async () => {
        setIsLoading(true);
        try {
            const tokenFromStorage = localStorage.getItem('authToken');
            if (tokenFromStorage) {
                await loadUserSession(tokenFromStorage);
            }
        } catch (error) {
           console.error("Session restore failed:", error);
           logout();
        } finally {
            setIsLoading(false);
        }
    }, [loadUserSession, logout]);

    useEffect(() => {
        checkAuthStatus();
    }, [checkAuthStatus]);

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const data: LoginResponse = await loginUser({ email, password });
            await loadUserSession(data.token);
            return { success: true };
        } catch (error: any) {
            return { success: false, error: error.message || 'Login failed' };
        } finally {
            setIsLoading(false);
        }
    };

    const signup = async (userData: SignupData) => {
        setIsLoading(true);
        try {
            // Note: The signup endpoint in the docs doesn't return user data, only a token.
            // We immediately call loadUserSession to fetch the full profile.
            const data: SignupResponse = await signupUser(userData);
            await loadUserSession(data.token);
            return { success: true };
        } catch (error: any) {
            return { success: false, error: error.message || 'Signup failed' };
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated: !!token, token, user, isLoading, login, signup, logout, updateUserContext }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};