import { apiRequest, setAccessToken } from './apiClient';

export interface AuthUser { id: string; name: string; email: string; role?: string; }
interface AuthResponse { user: AuthUser; accessToken: string; }

export const signup = async (name: string, email: string, password: string): Promise<AuthUser> => { const result = await apiRequest<AuthResponse>('/auth/signup', { method: 'POST', body: JSON.stringify({ name, email, password }) }, false); setAccessToken(result.accessToken); return result.user; };
export const login = async (email: string, password: string): Promise<AuthUser> => { const result = await apiRequest<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }, false); setAccessToken(result.accessToken); return result.user; };
export const getCurrentUser = (): Promise<AuthUser> => apiRequest<AuthUser>('/auth/me');
export const logout = async (): Promise<void> => {
	try {
		await apiRequest<void>('/auth/logout', { method: 'POST' }, false);
	} finally {
		setAccessToken(null);
	}
};
