// ==========================================
// UstaFind.uz — Central API Client
// ==========================================

// During development, you can use http://localhost:5000/api
// When deployed, replace this with your Render backend URL (e.g., https://ustafind.onrender.com/api)
export const API_BASE_URL = 'https://ustafind.onrender.com/api';

const TOKEN_KEY = 'ustafind_access_token';

export function getAccessToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAccessToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeAccessToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

interface RequestOptions extends RequestInit {
  body?: any;
}

/**
 * Custom fetch wrapper that automatically handles JSON serialization,
 * injects the Authorization bearer token, and throws user-friendly errors.
 */
export async function apiRequest<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const token = getAccessToken();
  
  const headers = new Headers(options.headers || {});
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  if (options.body && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
    options.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = data?.error || `So'rov bajarilmadi (Status: ${response.status})`;
    throw new Error(errorMsg);
  }

  return data as T;
}
