import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<User | null>;
  register: (data: { name: string; email: string; password: string; phone?: string; role?: string }) => Promise<{ pendingApproval?: boolean }>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  resendVerification: (email: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const response = await api.getMe();
      if (response.success && response.data?.user) {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const storedUser = api.getStoredUser();
    const token = api.getStoredToken();
    
    if (storedUser && token) {
      setUser(storedUser);
      refreshUser();
    } else {
      setIsLoading(false);
    }
  }, [refreshUser]);

  const login = async (email: string, password: string, rememberMe?: boolean) => {
    const response = await api.login({ email, password, rememberMe });
    if (response.success && response.data?.user) {
      setUser(response.data.user);
      return response.data.user;
    }
    return null;
  };

  const register = async (data: { name: string; email: string; password: string; phone?: string; role?: string }) => {
    const response = await api.register(data);
    if (response.success && response.data?.user && response.data?.accessToken) {
      setUser(response.data.user);
    }
    return { pendingApproval: Boolean(response.data?.pendingApproval) };
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
  };

  const forgotPassword = async (email: string) => {
    await api.forgotPassword(email);
  };

  const resetPassword = async (token: string, password: string) => {
    await api.resetPassword(token, password);
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    await api.changePassword(currentPassword, newPassword);
  };

  const verifyEmail = async (token: string) => {
    await api.verifyEmail(token);
  };

  const resendVerification = async (email: string) => {
    await api.resendVerification(email);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        changePassword,
        verifyEmail,
        resendVerification,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}