
import { SignupData, LoginResponse, SignupResponse, LeaderboardEntry, Update, UserProfileResponse, WithdrawalRequest, WithdrawalHistoryEntry, ChangePasswordData, ResetPasswordData, Banner, UpdateProfileData } from '../types';

const API_BASE_URL = 'https://admin.aubattle.com/api';


const handleResponse = async (response: Response) => {
    if (response.status === 204) {
        return {}; // Handle No Content success case
    }

    const text = await response.text();

    if (!response.ok) {
        // --- ERROR PATH ---
        console.error(`API Error: Status ${response.status}`, text);
        let errorMessage = `Request failed with status: ${response.status}`; // Default error

        // Try to parse the error text as JSON
        try {
            const errorJson = JSON.parse(text);

            // Intelligently extract a string message from the JSON object
            if (errorJson) {
                // Check for Laravel-style validation errors first.
                const errorFields = (typeof errorJson.errors === 'object' && errorJson.errors !== null) ? Object.keys(errorJson.errors) : [];
                
                if (errorFields.length > 0) {
                    const firstErrorList = errorJson.errors[errorFields[0]];
                    if (Array.isArray(firstErrorList) && firstErrorList.length > 0) {
                        errorMessage = firstErrorList[0];
                    }
                // If no field-specific errors, check for a simple "error" property.
                } else if (typeof errorJson.error === 'string' && errorJson.error) {
                    errorMessage = errorJson.error;
                // Finally, check for a simple "message" property.
                } else if (typeof errorJson.message === 'string' && errorJson.message) {
                    errorMessage = errorJson.message;
                }
            }
        } catch (e) {
            // Parsing failed, it's likely an HTML error page. We should not display raw HTML.
            if (text && !text.trim().startsWith('<')) {
                errorMessage = text;
            } else {
                 errorMessage = 'The server returned an unexpected response. Please try again.';
            }
            console.error("The server returned a non-JSON error response.");
        }

        throw new Error(errorMessage);
    }

    // --- SUCCESS PATH ---
    try {
        // Handle cases where a successful response might be empty
        return text ? JSON.parse(text) : {};
    } catch (e) {
        console.error("Invalid JSON in successful response:", text);
        throw new Error("Received an invalid response from the server.");
    }
};

export const loginUser = async (credentials: {email: string, password: string}): Promise<LoginResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(credentials),
    });
    return handleResponse(response);
};

export const signupUser = async (userData: SignupData): Promise<SignupResponse> => {
    // The API requires password_confirmation for validation, so we send the full payload.
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(userData),
    });
    return handleResponse(response);
};

export const forgotPassword = async (email: string): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email }),
    });
    return handleResponse(response);
};

export const resetPassword = async (data: ResetPasswordData): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data),
    });
    return handleResponse(response);
};

export const getUserProfile = async (token: string): Promise<UserProfileResponse> => {
    const response = await fetch(`${API_BASE_URL}/profile`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
    return handleResponse(response);
};

export const updateProfile = async (data: UpdateProfileData, token: string): Promise<UserProfileResponse> => {
    const response = await fetch(`${API_BASE_URL}/profile`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    });
    return handleResponse(response);
};

export const uploadAvatar = async (avatar: File, token: string): Promise<{ avatar_url: string }> => {
    const formData = new FormData();
    formData.append('avatar', avatar);

    const response = await fetch(`${API_BASE_URL}/profile/avatar`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: formData
    });
    return handleResponse(response);
};


export const getCoinBalance = async (userId: number, token: string): Promise<{coins: number}> => {
    const response = await fetch(`${API_BASE_URL}/coins/balance/${userId}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
    return handleResponse(response);
};

export const getLeaderboard = async (timeframe: 'daily' | 'weekly' | 'monthly', token: string): Promise<LeaderboardEntry[]> => {
    const response = await fetch(`${API_BASE_URL}/admin/leaderboard/${timeframe}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
    const data = await handleResponse(response);
    // API returns users; add a consistent, name-based avatar for the UI
    return data.map((user: LeaderboardEntry) => ({
        ...user,
        avatar: user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=00eafa&color=0c0a3a&rounded=true&bold=true`
    }));
}

export const getUpdates = async (token: string): Promise<Update[]> => {
    const response = await fetch(`${API_BASE_URL}/updates`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
    return handleResponse(response);
}

export const submitWithdrawal = async (data: WithdrawalRequest, token: string): Promise<{ message: string }> => {
    // This endpoint uses a different base URL as per the documentation.
    const response = await fetch(`https://backend.aubattle.com/api/withdraw`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
    return handleResponse(response);
};

export const getWithdrawalHistory = async (token: string): Promise<WithdrawalHistoryEntry[]> => {
    const response = await fetch(`${API_BASE_URL}/withdraw-history`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });
    return handleResponse(response);
};

export const changePassword = async (data: ChangePasswordData, token: string): Promise<{ message: string }> => {
    const payload = {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
    };
    const response = await fetch(`${API_BASE_URL}/profile/change-password`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });
    return handleResponse(response);
};
