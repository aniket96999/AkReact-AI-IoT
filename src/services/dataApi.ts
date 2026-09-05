import { apiRequest } from './apiClient';
import { Alert, PlantProfile, UserProfile } from '../types';

export const getAlerts = (): Promise<Alert[]> => apiRequest<Alert[]>('/data/alerts');
export const createAlert = (alert: Omit<Alert, 'id' | 'timestamp' | 'isRead'>): Promise<Alert> => apiRequest<Alert>('/data/alerts', { method: 'POST', body: JSON.stringify(alert) });
export const markAlertReadApi = (id: string): Promise<void> => apiRequest<void>(`/data/alerts/${id}/read`, { method: 'PATCH' });
export const getPlants = (): Promise<PlantProfile[]> => apiRequest<PlantProfile[]>('/data/plants');
export const createPlant = (plant: Omit<PlantProfile, 'id'>): Promise<PlantProfile> => apiRequest<PlantProfile>('/data/plants', { method: 'POST', body: JSON.stringify(plant) });
export const updatePlant = (id: string, plant: Partial<PlantProfile>): Promise<PlantProfile> => apiRequest<PlantProfile>(`/data/plants/${id}`, { method: 'PATCH', body: JSON.stringify(plant) });
export const getProfile = (): Promise<UserProfile & { id: string }> => apiRequest<UserProfile & { id: string }>('/data/profile');
export const updateProfile = (profile: Partial<UserProfile>): Promise<UserProfile> => apiRequest<UserProfile>('/data/profile', { method: 'PATCH', body: JSON.stringify(profile) });
