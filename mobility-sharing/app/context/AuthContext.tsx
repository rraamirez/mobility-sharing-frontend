import { createContext, useContext, useEffect, useState } from "react";
import {
  login as loginService,
  logout as logoutService,
  getToken,
  register as registerService,
} from "../services/authService";

interface AuthContextType {
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (
    name: string,
    email: string,
    username: string,
    password: string
  ) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const loadToken = async () => {
      const savedToken = await getToken();
      if (savedToken) {
        setToken(savedToken);
      }
    };
    loadToken();
  }, []);

  const login = async (username: string, password: string) => {
    const newToken = await loginService(username, password);
    setToken(newToken);
  };

  const logout = () => {
    logoutService();
    setToken(null);
  };

  const register = async (
    name: string,
    email: string,
    username: string,
    password: string
  ) => {
    try {
      await registerService(name, email, username, password);
      return { success: true, message: "Registration successful!" };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Error during registration",
      };
    }
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
