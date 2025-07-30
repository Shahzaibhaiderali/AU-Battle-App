
export interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{success: boolean; error?: string}>;
  signup: (userData: SignupData) => Promise<{success: boolean; error?: string}>;
  logout: () => void;
}

export interface User {
  id: number;
  role: 'user' | 'admin';
  name: string;
  email: string;
  ff_name: string;
  balance: number;
}

export interface SignupData {
  name: string;
  ff_name: string;
  phone_num: string;
  email: string;
  password: string;
}

export interface LoginResponse {
    message: string;
    token: string;
    user_id: number;
    role: 'user' | 'admin';
}

export interface SignupResponse {
    message: string;
    token: string;
    user_id?: number;
    role?: 'user' | 'admin';
}

export interface UserProfileResponse {
    id: number;
    name: string;
    email: string;
    ff_name: string;
    balance: string;
    role: 'user' | 'admin';
}

export interface ResetPasswordData {
    email: string;
    token: string;
    password: string;
    password_confirmation: string;
}

export enum Theme {
    Dark = 'dark',
    Light = 'light',
    Tidal = 'tidal',
}

export interface LeaderboardEntry {
    id: number;
    name: string;
    coins_won: number;
    avatar: string; // Added for UI
}

export interface Update {
    id: number;
    heading: string;
    description: string;
    content: string;
    created_at: string;
}