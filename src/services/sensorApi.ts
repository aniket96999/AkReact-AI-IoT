import { SensorData } from '../types';

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:4000/api/v1';

const request = async <T>(path: string): Promise<T> => {
  const response = await fetch(`${apiBaseUrl}${path}`);
  if (!response.ok) throw new Error(`Sensor API request failed: ${response.status}`);
  return response.json() as Promise<T>;
};

export const getLatestSensorData = (): Promise<SensorData> => request<SensorData>('/sensors/latest');
export const getSensorHistory = (): Promise<SensorData[]> => request<SensorData[]>('/sensors/history');
