import api from '@/lib/axios';

// ==================== Types ====================

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileInput {
  name?: string;
  avatar?: string;
  bio?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ==================== Users Service ====================

export const usersService = {
  // Get current user profile
  getProfile: async () => {
    const response = await api.get<UserProfile>('/users/profile');
    return response.data;
  },

  // Update profile
  updateProfile: async (data: UpdateProfileInput) => {
    const response = await api.put<UserProfile>('/users/profile', data);
    return response.data;
  },

  // Delete account
  deleteAccount: async () => {
    const response = await api.delete('/users/profile');
    return response.data;
  },

  // Get all users (admin only)
  getAllUsers: async () => {
    const response = await api.get<User[]>('/users');
    return response.data;
  },
};
