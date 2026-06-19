import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { User } from '../types';
import {
  mockLogin,
  mockSignup,
  mockGoogleLogin,
  mockTelegramLogin,
  selectUserRole,
  updateUserProfile as updateProfile,
  getCurrentUser,
  logoutUser,
  fetchFreshUser,
} from '../services/authService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<User>;
  loginWithTelegram: () => Promise<User>;
  logout: () => void;
  selectRole: (role: 'client' | 'usta_pending') => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  setUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
      fetchFreshUser()
        .then((freshUser) => {
          setUser(freshUser);
        })
        .catch((err) => {
          console.warn('Session verification failed, logging out:', err);
          logoutUser();
          setUser(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const u = await mockLogin(email, password);
      setUser(u);
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const u = await mockSignup(name, email, password);
      setUser(u);
    } finally {
      setLoading(false);
    }
  }, []);

  const loginWithGoogle = useCallback(async () => {
    setLoading(true);
    try {
      const u = await mockGoogleLogin();
      setUser(u);
      return u;
    } finally {
      setLoading(false);
    }
  }, []);

  const loginWithTelegram = useCallback(async () => {
    setLoading(true);
    try {
      const u = await mockTelegramLogin();
      setUser(u);
      return u;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    logoutUser();
    setUser(null);
  }, []);

  const selectRole = useCallback(async (role: 'client' | 'usta_pending') => {
    if (!user) return;
    const updated = await selectUserRole(user.id, role);
    setUser(updated);
  }, [user]);

  const updateUser = useCallback(async (updates: Partial<User>) => {
    if (!user) return;
    const updated = await updateProfile(user.id, updates);
    setUser(updated);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, loginWithGoogle, loginWithTelegram, logout, selectRole, updateUser, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
