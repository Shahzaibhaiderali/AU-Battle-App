




import React, { useState, useEffect } from 'react';
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
import LegalScreen from './components/dashboard/LegalScreen';
import { ThemeProvider } from './hooks/useTheme';
import { AIProvider } from './hooks/useAI';
import { Logo, Spinner } from './constants';
import WalletScreen from './components/dashboard/WalletScreen';
import FaqScreen from './components/dashboard/FaqScreen';
import LegalMenuScreen from './components/dashboard/LegalMenuScreen';
import PersonalInfoScreen from './components/dashboard/PersonalInfoScreen';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AIProvider>
            <AppContent />
        </AIProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

const AppContent: React.FC = () => {
    const { isAuthenticated, isLoading } = useAuth();
    const [isSplashVisible, setSplashVisible] = useState(true);

    useEffect(() => {
        // This is just for the initial branding splash
        const timer = setTimeout(() => {
            setSplashVisible(false);
        }, 3000); 

        return () => clearTimeout(timer);
    }, []);

    // Show a splash/loading screen while the app initializes or auth state is changing.
    if (isSplashVisible || isLoading) {
        return <SplashScreen />;
    }

    // After loading, render the main router with the correct set of routes.
    // This structure prevents the router from being unmounted during state changes.
    return (
        <HashRouter>
            <Routes>
                {isAuthenticated ? (
                    // --- AUTHENTICATED ROUTES ---
                    <>
                        <Route path="/dashboard/*" element={<DashboardLayout />}>
                            <Route index element={<Navigate to="play" />} />
                            <Route path="play" element={<GameScreen />} />
                            <Route path="leaderboard" element={<LeaderboardScreen />} />
                            <Route path="support" element={<SupportScreen />} />
                            <Route path="me" element={<ProfileScreen />} />
                            <Route path="updates" element={<UpdatesScreen />} />
                            <Route path="settings" element={<SettingsScreen />} />
                            <Route path="legal/:policyType" element={<LegalScreen />} />
                            <Route path="wallet" element={<WalletScreen />} />
                            <Route path="faq" element={<FaqScreen />} />
                            <Route path="legal-menu" element={<LegalMenuScreen />} />
                            <Route path="personal-info" element={<PersonalInfoScreen />} />
                        </Route>
                        {/* Any other path redirects to the dashboard */}
                        <Route path="*" element={<Navigate to="/dashboard/play" />} />
                    </>
                ) : (
                    // --- PUBLIC ROUTES ---
                    <>
                        <Route path="/" element={<WelcomeScreen />} />
                        <Route path="/login" element={<LoginScreen />} />
                        <Route path="/signup" element={<SignupScreen />} />
                        <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
                        <Route path="/reset-password" element={<ResetPasswordScreen />} />
                        {/* Any other path redirects to the welcome screen */}
                        <Route path="*" element={<Navigate to="/" />} />
                    </>
                )}
            </Routes>
        </HashRouter>
    );
};

const SplashScreen: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-screen bg-[#0c0a3a] text-white">
        <div className="flex-grow flex flex-col items-center justify-center">
            <Logo size="lg" className="mb-6" />
            <Spinner className="w-10 h-10 text-accent-primary" />
        </div>
        <div className="text-center mb-12">
            <p className="text-base font-light text-slate-300 mb-1">Powered By</p>
            <h2 className="text-4xl font-bold text-white uppercase">
                AU<span className="text-accent-primary">Battle</span>
            </h2>
        </div>
    </div>
);


export default App;