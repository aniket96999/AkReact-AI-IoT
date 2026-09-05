import { apiRequest } from './apiClient';
import { DiseaseAnalysis, PlantGuide, SensorData, GrowthPrediction, HistoryInsight, PlantProfile, PlantHealthInsight } from '../types';

export const fileToGenerativePart = async (file: File): Promise<string> => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
  reader.onerror = reject;
  reader.readAsDataURL(file);
});

const analyze = <T>(operation: string, payload: unknown): Promise<T> => apiRequest<T>(`/ai/${operation}`, { method: 'POST', body: JSON.stringify({ payload }) });

export const detectDisease = (base64Image: string, mimeType: string, sensorContext?: SensorData): Promise<DiseaseAnalysis> => analyze<DiseaseAnalysis>('disease', { base64Image, mimeType, sensorContext });
export const getPlantGuide = (userQuery: string): Promise<PlantGuide> => analyze<PlantGuide>('guide', userQuery);
export const analyzeSensorData = (data: SensorData, history: SensorData[]): Promise<GrowthPrediction> => analyze<GrowthPrediction>('sensor', { data, history: history.slice(-5) });
export const analyzeHistoricalTrends = (history: SensorData[]): Promise<HistoryInsight> => analyze<HistoryInsight>('history', history);
export const analyzePlantHealth = (plant: PlantProfile, recentData: SensorData): Promise<PlantHealthInsight> => analyze<PlantHealthInsight>('plant-health', { plant, recentData });
