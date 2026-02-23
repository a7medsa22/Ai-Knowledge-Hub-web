import api from '@/lib/axios';

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
  role?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string | string[];
  data?: T;
}

export interface RegisterData {
  userId: string;
}

export type RegisterResponse = ApiResponse<RegisterData>;

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginUserPayload {
  sub: string;
  email: string;
  name: string;
  role: string;
  status: string;
}

export interface LoginData {
  user: LoginUserPayload;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export type LoginResponse = ApiResponse<LoginData>;

export interface VerifyEmailInput {
  email: string;
  otp: string;
}

export type VerifyEmailResponse = ApiResponse<undefined>;

export interface ForgotPasswordInput {
  email: string;
}

export type ForgotPasswordResponse = ApiResponse<undefined>;

export interface ResetPasswordInput {
  email: string;
  otp: string;
  password: string;
}

export type ResetPasswordResponse = ApiResponse<undefined>;

export interface ResendOtpInput {
  email: string;
}

export interface ResendOtpData {
  userId: string;
}

export type ResendOtpResponse = ApiResponse<ResendOtpData>;

export interface Session {
  id: string;
  createdAt: string;
  lastActiveAt: string;
}

export interface SessionsData {
  sessions: Session[];
}

export type SessionsResponse = ApiResponse<SessionsData>;

export const authService = {
  register: async (data: RegisterInput) => {
    const payload: RegisterInput = { ...data, role: data.role ?? 'USER' };
    const response = await api.post<RegisterResponse>('/v1/users/auth/register', payload);
    return response.data;
  },

  login: async (data: LoginInput) => {
    const response = await api.post<LoginResponse>('/v1/users/auth/login', data);
    return response.data;
  },

  verifyEmail: async (data: VerifyEmailInput) => {
    const response = await api.post<VerifyEmailResponse>('/v1/users/auth/verify-email', data);
    return response.data;
  },

  refresh: async (refreshToken: string) => {
    const response = await api.post<LoginResponse>('/v1/users/auth/refresh', { refreshToken });
    return response.data;
  },

  forgotPassword: async (data: ForgotPasswordInput) => {
    const response = await api.post<ForgotPasswordResponse>('/v1/users/auth/forgot-password', data);
    return response.data;
  },

  resetPassword: async (data: ResetPasswordInput) => {
    const response = await api.post<ResetPasswordResponse>('/v1/users/auth/reset-password', data);
    return response.data;
  },

  resendOtp: async (data: ResendOtpInput) => {
    const response = await api.post<ResendOtpResponse>('/v1/users/auth/resend-otp', data);
    return response.data;
  },

  getSessions: async () => {
    const response = await api.get<SessionsResponse>('/v1/users/auth/sessions');
    return response.data;
  },

  revokeAllSessions: async () => {
    const response = await api.delete<ApiResponse<undefined>>('/v1/users/auth/sessions');
    return response.data;
  },

  revokeSession: async (tokenId: string) => {
    const response = await api.delete<ApiResponse<undefined>>(`/v1/users/auth/sessions/${tokenId}`);
    return response.data;
  },

  logout: async () => {
    try {
      await api.post<ApiResponse<undefined>>('/v1/users/auth/logout');
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  },
};
