const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:4000/api/v1';
let accessToken: string | null = sessionStorage.getItem('neev_access_token');

export const setAccessToken = (token: string | null): void => { accessToken = token; if (token) sessionStorage.setItem('neev_access_token', token); else sessionStorage.removeItem('neev_access_token'); };

export const apiRequest = async <T>(path: string, options: RequestInit = {}, retry = true): Promise<T> => {
  const headers = new Headers(options.headers);
  if (options.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);
  const response = await fetch(`${apiBaseUrl}${path}`, { ...options, headers, credentials: 'include' });
  if (response.status === 401 && retry && path !== '/auth/refresh') { try { await refreshSession(); return apiRequest<T>(path, options, false); } catch { setAccessToken(null); } }
  if (!response.ok) { const body = await response.json().catch(() => null) as { error?: string } | null; throw new Error(body?.error ?? `API request failed: ${response.status}`); }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
};

export const refreshSession = async (): Promise<string> => { const result = await apiRequest<{ accessToken: string }>('/auth/refresh', { method: 'POST' }, false); setAccessToken(result.accessToken); return result.accessToken; };
export const getApiBaseUrl = (): string => apiBaseUrl;
