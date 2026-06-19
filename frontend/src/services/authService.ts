import type { User } from '../types';
import { apiRequest, setAccessToken, removeAccessToken } from './api.js';

const STORAGE_KEY = 'ustafind_user';

export async function mockLogin(email: string, password: string): Promise<User> {
  const data = await apiRequest('/auth/login', {
    method: 'POST',
    body: { email, password },
  });

  if (data.session?.access_token) {
    setAccessToken(data.session.access_token);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data.user));
  return data.user;
}

export async function mockSignup(name: string, email: string, password: string): Promise<User> {
  const data = await apiRequest('/auth/signup', {
    method: 'POST',
    body: { name, email, password },
  });

  if (data.session?.access_token) {
    setAccessToken(data.session.access_token);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data.user));
  return data.user;
}

// Keep mock OAuth flows for demo purposes if not fully configured on Supabase dashboard
export async function mockGoogleLogin(): Promise<User> {
  await new Promise(resolve => setTimeout(resolve, 700));
  const demoUser: User = {
    id: 'google-user-' + Math.random().toString(36).substr(2, 9),
    name: 'Google Foydalanuvchi',
    email: 'google.' + Math.floor(Math.random() * 1000) + '@gmail.com',
    role: 'client',
    registeredAt: new Date().toISOString().split('T')[0],
    isVerified: false,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(demoUser));
  return demoUser;
}

export async function mockTelegramLogin(): Promise<User> {
  await new Promise(resolve => setTimeout(resolve, 700));
  const demoUser: User = {
    id: 'tg-user-' + Math.random().toString(36).substr(2, 9),
    name: 'Telegram Foydalanuvchi',
    email: 'tg.' + Math.floor(Math.random() * 1000) + '@telegram.org',
    role: 'client',
    registeredAt: new Date().toISOString().split('T')[0],
    isVerified: false,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(demoUser));
  return demoUser;
}

export async function selectUserRole(_userId: string, role: 'client' | 'usta_pending'): Promise<User> {
  const data = await apiRequest('/auth/role-select', {
    method: 'POST',
    body: { role },
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data.user));
  return data.user;
}

export async function updateUserProfile(_userId: string, updates: Partial<User>): Promise<User> {
  const data = await apiRequest('/auth/profile', {
    method: 'PUT',
    body: updates,
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data.user));
  return data.user;
}

export async function approveUsta(userId: string): Promise<User> {
  const data = await apiRequest(`/ustalar/${userId}/approve`, {
    method: 'POST',
  });
  return data.user;
}

export async function rejectUsta(userId: string): Promise<User> {
  const data = await apiRequest(`/ustalar/${userId}/reject`, {
    method: 'POST',
  });
  return data.user;
}

export async function getAllUsers(): Promise<User[]> {
  return apiRequest('/auth/users');
}

export function getCurrentUser(): User | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function logoutUser(): void {
  removeAccessToken();
  localStorage.removeItem(STORAGE_KEY);
}

export { STORAGE_KEY };
