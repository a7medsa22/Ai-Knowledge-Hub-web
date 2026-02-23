import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { authService } from "@/services/auth";
import { usersService } from "@/services/users";
import { type User } from "@/services/users";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkSession = useCallback(async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      setLoading(false);
      return;
    }

    try {
      const profile = await usersService.getProfile();
      if (profile) {
        const authUser: User = {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          avatar: profile.avatar,
        };
        setUser(authUser);
        localStorage.setItem("auth_user", JSON.stringify(authUser));
      }
    } catch (error) {
      console.error("Session verification failed:", error);
      // axios interceptor will handle the 401 and redirect if needed
      // so we just clear local state here if it fails
      setUser(null);
      localStorage.removeItem("auth_user");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const data = await authService.login({ email, password });
      if (!data) {
        throw new Error("Login failed");
      }
      const { user: payloadUser, accessToken, refreshToken } = data;
      const authUser: User = {
        id: payloadUser.sub,
        name: payloadUser.name,
        email: payloadUser.email,
        avatar: undefined, // Add placeholder or handle if available
      };
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      setUser(authUser);
      localStorage.setItem("auth_user", JSON.stringify(authUser));
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      await authService.register({ name, email, password });
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw err;
      }
      throw new Error("Signup failed");
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
    localStorage.removeItem("auth_user");
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
