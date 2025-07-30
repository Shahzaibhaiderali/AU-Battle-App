import { SignupData, LoginResponse, SignupResponse, UserProfileResponse, ResetPasswordData, LeaderboardEntry, Update } from '../types';

const API_BASE_URL = 'https://admin.aubattle.com/api/auth';
const USER_API_URL = 'https://admin.aubattle.com/api/user';


const handleResponse = async (response: Response) => {
    const responseText = await response.text();

    if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
            const errorJson = JSON.parse(responseText);
            errorMessage = errorJson.message || JSON.stringify(errorJson);
        } catch (e) {
            errorMessage = `${errorMessage}. Response: ${responseText.substring(0, 200)}`;
        }
        throw new Error(errorMessage);
    }

    try {
        if (responseText.trim() === '') return {};
        return JSON.parse(responseText);
    } catch (e) {
        throw new Error('An unexpected error occurred. The server response was not valid JSON.');
    }
};

export const loginUser = async (credentials: {email: string, password: string}): Promise<LoginResponse> => {
    const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(credentials),
    });
    return handleResponse(response);
};

export const signupUser = async (userData: SignupData): Promise<SignupResponse> => {
    const response = await fetch(`${API_BASE_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(userData),
    });
    return handleResponse(response);
};

export const forgotPassword = async (email: string): Promise<{message: string}> => {
    const response = await fetch(`${API_BASE_URL}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email }),
    });
    return handleResponse(response);
};

export const resetPassword = async (data: ResetPasswordData): Promise<{message: string}> => {
    const response = await fetch(`${API_BASE_URL}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data),
    });
    return handleResponse(response);
};

export const getUserProfile = async (userId: number, token: string): Promise<UserProfileResponse> => {
    const response = await fetch(`${USER_API_URL}/${userId}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
    return handleResponse(response);
};

export const getCoinBalance = async (userId: number, token: string): Promise<{coins: number}> => {
    const response = await fetch(`https://admin.aubattle.com/api/coins/balance/${userId}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
    return handleResponse(response);
};

export const getLeaderboard = async (timeframe: 'daily' | 'weekly' | 'monthly', token: string): Promise<LeaderboardEntry[]> => {
    // Fetch more users to demonstrate responsiveness
    const response = await fetch(`https://admin.aubattle.com/api/admin/leaderboard/${timeframe}?limit=20`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
    const data = await handleResponse(response);
    // The API response is an array of users, we need to add an avatar for the UI
    return data.map((user: Omit<LeaderboardEntry, 'avatar'>) => ({
        ...user,
        avatar: `https://i.pravatar.cc/150?u=${user.id}`
    }));
}

export const getUpdates = async (token: string): Promise<Update[]> => {
    const response = await fetch(`https://admin.aubattle.com/api/updates`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
    return handleResponse(response);
}