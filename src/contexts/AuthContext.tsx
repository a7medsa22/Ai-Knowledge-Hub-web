import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { authService } from "@/services/auth";
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
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("auth_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await authService.login({ email, password });
      if (!result.success || !result.data) {
        throw new Error("Login failed");
      }
      const { user: payloadUser, accessToken, refreshToken } = result.data;
      const authUser: User = {
        id: payloadUser.sub,
        name: payloadUser.name,
        email: payloadUser.email,
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
      const result = await authService.register({ name, email, password });
      if (!result.success) {
        const msg = Array.isArray(result.message) ? result.message.join(", ") : result.message;
        throw new Error(msg || "Signup failed");
      }
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
