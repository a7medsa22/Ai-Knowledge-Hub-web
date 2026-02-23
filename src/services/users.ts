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
    const response = await api.get<UserProfile>('/v1/users/profile');
    return response.data;
  },

  // Update profile
  updateProfile: async (data: UpdateProfileInput) => {
    const response = await api.put<UserProfile>('/v1/users/profile', data);
    return response.data;
  },

  // Delete account
  deleteAccount: async () => {
    const response = await api.delete('/v1/users/profile');
    return response.data;
  },

  // Get all users (admin only)
  getAllUsers: async () => {
    const response = await api.get<User[]>('/v1/users');
    return response.data;
  },
};
