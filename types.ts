

export interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  isLoading: boolean;
  login: (email: string, password:string) => Promise<{success: boolean; error?: string}>;
  signup: (userData: SignupData) => Promise<{success: boolean; error?: string}>;
  logout: () => void;
  updateUserContext: (updatedData: Partial<User>) => void;
}

export interface User {
  id: number;
  role: 'user' | 'admin';
  name: string;
  email: string;
  ff_name: string;
  balance: number;
  phone_num: string;
  avatar_url: string | null;
}

export interface SignupData {
  name: string;
  ff_name: string;
  phone_num: string;
  email: string;
  password: string;
  password_confirmation: string;
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
}

export interface UserProfileResponse {
    id: number;
    name: string;
    email: string;
    ff_name: string;
    phone_num: string;
    avatar_url: string | null;
    balance: string;
    role: 'user' | 'admin';
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
    avatar: string; 
    avatar_url?: string | null;
}

export interface Update {
    id: number;
    heading: string;
    description: string;
    content: string;
    created_at: string;
}

export interface Banner {
  id: number;
  image_url: string;
  link?: string;
}

export interface UserStats {
    matches_played: number;
    kills: number;
    wins: number;
    win_rate: number;
}

export interface AIMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export interface AIContextType {
  messages: AIMessage[];
  isResponding: boolean;
  sendMessage: (prompt: string) => Promise<void>;
}

export interface WithdrawalRequest {
    amount: string;
    method: 'JazzCash' | 'EasyPaisa';
    account_details: string;
}

export interface WithdrawalHistoryEntry {
    amount: number;
    method: string;
    status: 'approved' | 'rejected' | 'pending';
    created_at: string;
}

export interface ChangePasswordData {
    oldPassword: string;
    newPassword: string;
    newPassword_confirmation: string;
}

export interface ResetPasswordData {
    email: string;
    token: string;
    password: string;
    password_confirmation: string;
}

export interface UpdateProfileData {
    name?: string;
    email?: string;
    phone_num?: string;
}