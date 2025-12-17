
// --- Core Domain Types ---

export enum AppModule {
  DASHBOARD = 'DASHBOARD',
  ANALYTICS = 'ANALYTICS',
  KNOWLEDGE = 'KNOWLEDGE',
  HISTORY = 'HISTORY',
  DISEASE = 'DISEASE',
  PROFILE = 'PROFILE',
  ALERTS = 'ALERTS'
}

// --- Hardware/Sensor Types (Module 1) ---
export interface SensorData {
  timestamp: string;
  nitrogen: number; // mg/kg
  phosphorus: number; // mg/kg
  potassium: number; // mg/kg
  soilMoisture: number; // %
  airHumidity: number; // %
  soilTemp: number; // Celsius
  envTemp: number; // Celsius
  lightIntensity: number; // Lux
}

// --- Automation & Control Types (Module 8) ---
export interface AutomationState {
  waterPump: boolean;
  fan: boolean;
  humidifier: boolean;
  growLight: boolean;
  heater: boolean;
}

export interface TargetConditions {
  tempRange: [number, number]; // Min, Max
  humidityRange: [number, number];
  moistureRange: [number, number];
  lightRange: [number, number];
}

// --- Alerts & Notifications (Module 7) ---
export type AlertSeverity = 'critical' | 'warning' | 'info' | 'success';

export interface Alert {
  id: string;
  type: AlertSeverity;
  module: AppModule;
  message: string;
  timestamp: string;
  isRead: boolean;
}

// --- Disease Detection Types (Module 5) ---
export interface DiseaseAnalysis {
  diseaseName: string;
  affectedPart: string;
  severityScore: number; // 0-100
  confidenceScore: number; // 0-100
  stage: 'Early' | 'Moderate' | 'Severe';
  isRecoverable: boolean;
  organicSolutions: string[];
  chemicalSolutions?: string[];
  preventiveMeasures: string[];
  safetyWarnings: string[];
  next7DaysPlan: string[];
}

// --- Knowledge AI Types (Module 3) ---
export interface PlantGuide {
  plantName: string;
  idealEnvironment: {
    tempRange: string; // "20-25"
    humidity: string; // "50-60"
    light: string;
    soil: string;
  };
  parsedTargets?: TargetConditions; // Parsed numerical ranges for automation
  fertilizerSchedule: string[];
  dailyCare: string[];
  stages: {
    stage: string;
    description: string;
  }[];
  companionPlants: string[];
}

// --- Analytics Types (Module 2) ---
export interface GrowthPrediction {
  currentHealthScore: number; // 0-100
  predictedGrowthRate: string;
  stressFactors: string[];
  nutrientDeficiencies: string[];
  summary: string;
}

// --- History & Logs Types (Module 4) ---
export interface TrendAnalysis {
  trend: string;
  meaning: string;
  concerns: string;
  recommendation: string;
}

export interface HistoryInsight {
  summary: string;
  temperature: TrendAnalysis;
  humidity: TrendAnalysis;
}

// --- Profile Types (Module 6) ---

export type Language = 'English' | 'Hindi' | 'Marathi';
export type AccountType = 'Farmer' | 'Agriculture Officer' | 'Admin';
export type PlantCategory = 'Flower' | 'Vegetable' | 'Fruit' | 'Herb' | 'Crop';
export type GrowthStage = 'Seedling' | 'Vegetative' | 'Flowering' | 'Fruiting';

export interface UserProfile {
  name: string;
  role: string;
  farmName: string;
  location: string;
  email: string;
  phone: string;
  image?: string;
  language: Language;
  accountType: AccountType;
  preferences: {
    notifications: boolean;
    units: 'metric' | 'imperial';
    theme: 'dark' | 'light';
    twoFactorEnabled: boolean;
  };
}

export interface DeviceProfile {
  id: string;
  name: string;
  deviceId: string;
  firmwareVersion: string;
  batteryStatus: number;
  lastSyncTime: string;
  networkStatus: 'Online' | 'Offline' | 'Weak';
  sensors: {
    type: string;
    status: 'Active' | 'Calibrating' | 'Error';
    lastValue: string;
  }[];
}

export interface PlantProfile {
  id: string;
  name: string;
  category: PlantCategory;
  plantationDate: string;
  soilType: string;
  wateringPreference: string;
  sunlightRequirement: string;
  fertilizerUsed: string;
  growthStage: GrowthStage;
  image?: string;
  // Link Module 3 data to Module 6
  targetConditions?: TargetConditions; 
}

export interface PlantHealthInsight {
  wateringAdvice: string;
  fertilizerAdvice: string;
  sunlightAdvice: string;
  growthStageAdvice: string;
  stressWarnings: string[];
  careSummary: string;
}
