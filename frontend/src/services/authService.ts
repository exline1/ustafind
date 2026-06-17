import type { User } from '../types';
import { ADMIN_EMAILS } from './mockData';

// ==========================================
// Auth Service — Mock implementatsiya
// Kelajakda real API chaqiruvlari bilan almashtiriladi
// ==========================================

const STORAGE_KEY = 'ustafind_user';
const USERS_KEY = 'ustafind_users';

function generateId(): string {
  return 'user-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

function determineRole(email: string): User['role'] {
  if (ADMIN_EMAILS.includes(email.toLowerCase())) {
    return 'admin';
  }
  return 'client';
}

function getAllUsers(): User[] {
  try {
    const stored = localStorage.getItem(USERS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveUser(user: User): void {
  const users = getAllUsers();
  const existingIndex = users.findIndex(u => u.id === user.id);
  if (existingIndex >= 0) {
    users[existingIndex] = user;
  } else {
    users.push(user);
  }
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export async function mockLogin(email: string, _password: string): Promise<User> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const users = getAllUsers();
  const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (existingUser) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existingUser));
    return existingUser;
  }

  // Auto-create user for demo purposes
  const user: User = {
    id: generateId(),
    name: email.split('@')[0],
    email: email.toLowerCase(),
    role: determineRole(email),
    registeredAt: new Date().toISOString().split('T')[0],
    isVerified: false,
  };

  saveUser(user);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  return user;
}

export async function mockSignup(name: string, email: string, _password: string): Promise<User> {
  await new Promise(resolve => setTimeout(resolve, 500));

  const users = getAllUsers();
  const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    throw new Error('Bu email allaqachon ro\'yxatdan o\'tgan');
  }

  const user: User = {
    id: generateId(),
    name,
    email: email.toLowerCase(),
    role: determineRole(email),
    registeredAt: new Date().toISOString().split('T')[0],
    isVerified: false,
  };

  saveUser(user);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  return user;
}

export async function mockGoogleLogin(): Promise<User> {
  await new Promise(resolve => setTimeout(resolve, 700));

  // Simulate Google OAuth — returns a "needs role selection" user
  const user: User = {
    id: generateId(),
    name: 'Google Foydalanuvchi',
    email: 'user' + Math.floor(Math.random() * 1000) + '@gmail.com',
    role: 'client', // Will be updated after role selection
    registeredAt: new Date().toISOString().split('T')[0],
    avatarUrl: '',
    isVerified: false,
  };

  saveUser(user);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  return user;
}

export async function mockTelegramLogin(): Promise<User> {
  await new Promise(resolve => setTimeout(resolve, 700));

  const user: User = {
    id: generateId(),
    name: 'Telegram Foydalanuvchi',
    email: 'tg_user' + Math.floor(Math.random() * 1000) + '@telegram.org',
    role: 'client',
    registeredAt: new Date().toISOString().split('T')[0],
    isVerified: false,
  };

  saveUser(user);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  return user;
}

export async function selectUserRole(userId: string, role: 'client' | 'usta_pending'): Promise<User> {
  await new Promise(resolve => setTimeout(resolve, 300));

  const users = getAllUsers();
  const user = users.find(u => u.id === userId);

  if (!user) throw new Error('Foydalanuvchi topilmadi');

  user.role = role;
  saveUser(user);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  return user;
}

export async function updateUserProfile(userId: string, updates: Partial<User>): Promise<User> {
  await new Promise(resolve => setTimeout(resolve, 300));

  const users = getAllUsers();
  const user = users.find(u => u.id === userId);

  if (!user) throw new Error('Foydalanuvchi topilmadi');

  const updatedUser = { ...user, ...updates, id: user.id, email: user.email };
  saveUser(updatedUser);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
  return updatedUser;
}

export async function approveUsta(userId: string): Promise<User> {
  await new Promise(resolve => setTimeout(resolve, 300));

  const users = getAllUsers();
  const user = users.find(u => u.id === userId);

  if (!user) throw new Error('Foydalanuvchi topilmadi');

  user.role = 'usta_approved';
  user.isVerified = true;
  saveUser(user);
  return user;
}

export async function rejectUsta(userId: string): Promise<User> {
  await new Promise(resolve => setTimeout(resolve, 300));

  const users = getAllUsers();
  const user = users.find(u => u.id === userId);

  if (!user) throw new Error('Foydalanuvchi topilmadi');

  user.role = 'client';
  saveUser(user);
  return user;
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
  localStorage.removeItem(STORAGE_KEY);
}

export { getAllUsers, STORAGE_KEY, USERS_KEY };
