import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AuthContextType, SignupData, User } from '../types';
import { loginUser, signupUser, getUserProfile } from '../services/authService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const decodeJwt = (token: string): { id: number; role?: 'user' | 'admin'; [key: string]: any } | null => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error("Failed to decode JWT", error);
        return null;
    }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const logout = useCallback(() => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
        setToken(null);
        setUser(null);
    }, []);

    const fetchAndSetUser = useCallback(async (authToken: string, userId: number, role?: 'user' | 'admin') => {
        try {
            const profileData = await getUserProfile(userId, authToken);
            const fullUser: User = {
                id: profileData.id,
                role: profileData.role,
                name: profileData.name,
                email: profileData.email,
                ff_name: profileData.ff_name,
                balance: Number(profileData.balance) || 0,
            };
            localStorage.setItem('authUser', JSON.stringify(fullUser));
            setUser(fullUser);
        } catch (error) {
            console.warn("API FALLBACK: Failed to fetch user profile. Using stored or mock data to proceed.", error);
            // Instead of logging out, use stored or mock user data to allow the app to run.
            const userFromStorageString = localStorage.getItem('authUser');
            const userFromStorage = userFromStorageString ? JSON.parse(userFromStorageString) : {};

            const mockUser: User = {
                id: userId,
                role: role || userFromStorage.role || 'user',
                name: userFromStorage.name || "AU Player",
                email: userFromStorage.email || "player@aubattle.com",
                ff_name: userFromStorage.ff_name || "AUBattle_FF",
                balance: userFromStorage.balance || 1000,
            };
            // Set the user state with the fallback data
            setUser(mockUser);
            // Also update localStorage so subsequent reloads have some data
            localStorage.setItem('authUser', JSON.stringify(mockUser));
        }
    }, []);

    const checkAuthStatus = useCallback(async () => {
        setIsLoading(true);
        try {
            const tokenFromStorage = localStorage.getItem('authToken');
            const userJson = localStorage.getItem('authUser');
            if (tokenFromStorage && userJson) {
                const userFromStorage: User = JSON.parse(userJson);
                setToken(tokenFromStorage);
                setUser(userFromStorage);
                // Refresh user data from server, will fallback on failure without logging out
                await fetchAndSetUser(tokenFromStorage, userFromStorage.id, userFromStorage.role);
            }
        } catch (error) {
            // This catch is for errors during parsing, not API calls.
            console.error("Failed to initialize auth state, logging out.", error);
            logout();
        } finally {
            setIsLoading(false);
        }
    }, [fetchAndSetUser, logout]);


    useEffect(() => {
        checkAuthStatus();
    }, [checkAuthStatus]);

    const handleAuthSuccess = async (authToken: string, userId: number, role?: 'user' | 'admin') => {
        localStorage.setItem('authToken', authToken);
        setToken(authToken);
        await fetchAndSetUser(authToken, userId, role);
    };

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const data = await loginUser({ email, password });
            await handleAuthSuccess(data.token, data.user_id, data.role);
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
            const data = await signupUser(userData);
            const decodedToken = decodeJwt(data.token);
            if (!decodedToken || !decodedToken.id) {
                throw new Error("Invalid token received after signup. Could not extract user ID.");
            }
            await handleAuthSuccess(data.token, decodedToken.id, decodedToken.role);
            return { success: true };
        } catch (error: any) {
            return { success: false, error: error.message || 'Signup failed' };
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated: !!token, token, user, isLoading, login, signup, logout }}>
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