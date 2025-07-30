
import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import WelcomeScreen from './components/auth/WelcomeScreen';
import LoginScreen from './components/auth/LoginScreen';
import SignupScreen from './components/auth/SignupScreen';
import ForgotPasswordScreen from './components/auth/ForgotPasswordScreen';
import ResetPasswordScreen from './components/auth/ResetPasswordScreen';
import DashboardLayout from './components/dashboard/DashboardLayout';
import GameScreen from './components/dashboard/GameScreen';
import SupportScreen from './components/dashboard/SupportScreen';
import LeaderboardScreen from './components/dashboard/LeaderboardScreen';
import ProfileScreen from './components/dashboard/ProfileScreen';
import UpdatesScreen from './components/dashboard/UpdatesScreen';
import SettingsScreen from './components/dashboard/SettingsScreen';
import { ThemeProvider } from './hooks/useTheme';
import { Logo, Spinner } from './constants';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
};

const AppContent: React.FC = () => {
    const { isAuthenticated, isLoading } = useAuth();
    const [isSplashVisible, setSplashVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setSplashVisible(false);
        }, 3000); 

        return () => clearTimeout(timer);
    }, []);

    if (isSplashVisible || isLoading) {
        return <SplashScreen />;
    }

    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={!isAuthenticated ? <WelcomeScreen /> : <Navigate to="/dashboard/play" />} />
                <Route path="/login" element={!isAuthenticated ? <LoginScreen /> : <Navigate to="/dashboard/play" />} />
                <Route path="/signup" element={!isAuthenticated ? <SignupScreen /> : <Navigate to="/dashboard/play" />} />
                <Route path="/forgot-password" element={!isAuthenticated ? <ForgotPasswordScreen /> : <Navigate to="/dashboard/play" />} />
                <Route path="/reset-password" element={!isAuthenticated ? <ResetPasswordScreen /> : <Navigate to="/dashboard/play" />} />
                
                <Route path="/dashboard/*" element={isAuthenticated ? <DashboardLayout /> : <Navigate to="/" />} >
                    <Route path="play" element={<GameScreen />} />
                    <Route path="leaderboard" element={<LeaderboardScreen />} />
                    <Route path="support" element={<SupportScreen />} />
                    <Route path="me" element={<ProfileScreen />} />
                    <Route path="updates" element={<UpdatesScreen />} />
                    <Route path="settings" element={<SettingsScreen />} />
                </Route>

                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </HashRouter>
    );
};

const SplashScreen: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-screen bg-[#0c0a3a]">
        <Logo size="lg" className="mb-6" />
        <Spinner className="w-10 h-10 text-accent-primary" />
    </div>
);


export default App;