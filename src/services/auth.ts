import api from '@/lib/axios';

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
  role?: string;
}

export interface BackendResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}

export interface RegisterData {
  userId: string;
}

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

export interface VerifyEmailInput {
  email: string;
  otp: string;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface ResetPasswordInput {
  email: string;
  otp: string;
  password: string;
}

export interface ResendOtpInput {
  email: string;
}

export interface ResendOtpData {
  userId: string;
}

export interface Session {
  id: string;
  createdAt: string;
  lastActiveAt: string;
}

export interface SessionsData {
  sessions: Session[];
}

export const authService = {
  register: async (data: RegisterInput) => {
    const payload: RegisterInput = { ...data, role: data.role ?? 'USER' };
    const response = await api.post<BackendResponse<RegisterData>>('/v1/users/auth/register', payload);
    return response.data.data;
  },

  login: async (data: LoginInput) => {
    const response = await api.post<BackendResponse<LoginData>>('/v1/users/auth/login', data);
    return response.data.data;
  },

  verifyEmail: async (data: VerifyEmailInput) => {
    const response = await api.post<BackendResponse<undefined>>('/v1/users/auth/verify-email', data);
    return response.data.data;
  },

  refresh: async (refreshToken: string) => {
    const response = await api.post<BackendResponse<LoginData>>('/v1/users/auth/refresh', { refreshToken });
    return response.data.data;
  },

  forgotPassword: async (data: ForgotPasswordInput) => {
    const response = await api.post<BackendResponse<undefined>>('/v1/users/auth/forgot-password', data);
    return response.data.data;
  },

  resetPassword: async (data: ResetPasswordInput) => {
    const response = await api.post<BackendResponse<undefined>>('/v1/users/auth/reset-password', data);
    return response.data.data;
  },

  resendOtp: async (data: ResendOtpInput) => {
    const response = await api.post<BackendResponse<ResendOtpData>>('/v1/users/auth/resend-otp', data);
    return response.data.data;
  },

  getSessions: async () => {
    const response = await api.get<BackendResponse<SessionsData>>('/v1/users/auth/sessions');
    return response.data.data;
  },

  revokeAllSessions: async () => {
    const response = await api.delete<BackendResponse<undefined>>('/v1/users/auth/sessions');
    return response.data.data;
  },

  revokeSession: async (tokenId: string) => {
    const response = await api.delete<BackendResponse<undefined>>(`/v1/users/auth/sessions/${tokenId}`);
    return response.data.data;
  },

  logout: async () => {
    try {
      await api.post<BackendResponse<undefined>>('/v1/users/auth/logout');
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  },
};
