
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { SensorData, Alert, AutomationState, TargetConditions, AppModule, PlantProfile, UserProfile } from '../types';
import { generateMockSensorData } from '../services/mockHardwareService';
import { getLatestSensorData, getSensorHistory } from '../services/sensorApi';
import { createAlert, getAlerts, markAlertReadApi } from '../services/dataApi';
import { getProfile, updateProfile } from '../services/dataApi';

interface AppContextType {
  // Module 1 & 4: Data
  currentData: SensorData;
  history: SensorData[];
  
  // Module 7: Alerts
  alerts: Alert[];
  unreadAlertCount: number;
  addAlert: (alert: Omit<Alert, 'id' | 'timestamp' | 'isRead'>) => void;
  markAlertRead: (id: string) => void;
  
  // Module 8: Automation
  automation: AutomationState;
  toggleAutomation: (key: keyof AutomationState) => void;
  
  // Module 3 & 6: Configuration
  targetConditions: TargetConditions | null;
  setTargetConditions: (conditions: TargetConditions) => void;
  activePlant: PlantProfile | null;
  setActivePlant: (plant: PlantProfile | null) => void;
  userProfile: UserProfile;
  updateUserProfile: (profile: UserProfile) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // State
  const [currentData, setCurrentData] = useState<SensorData>(generateMockSensorData());
  const [history, setHistory] = useState<SensorData[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [automation, setAutomation] = useState<AutomationState>({
    waterPump: false, fan: false, humidifier: false, growLight: true, heater: false
  });
  const [targetConditions, setTargetConditions] = useState<TargetConditions | null>(null);
  const [activePlant, setActivePlant] = useState<PlantProfile | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'User', role: 'Lead Agriculturist', farmName: 'My Farm', location: '', email: '', phone: '',
    language: 'English', accountType: 'Farmer',
    preferences: { notifications: true, units: 'metric', theme: 'dark', twoFactorEnabled: false }
  });

  useEffect(() => { void getAlerts().then(setAlerts).catch(error => console.warn('Alerts unavailable:', error)); }, []);
  useEffect(() => { void getProfile().then(setUserProfile).catch(error => console.warn('Profile unavailable:', error)); }, []);

  const updateUserProfile = async (profile: UserProfile) => {
    const savedProfile = await updateProfile(profile);
    setUserProfile(savedProfile);
  };

  // The backend owns simulation and history; the frontend only subscribes by polling.
  useEffect(() => {
    let mounted = true;

    const syncSensorData = async () => {
      try {
        const [newData, historyData] = await Promise.all([getLatestSensorData(), getSensorHistory()]);
        if (!mounted) return;
        setCurrentData(newData);
        setHistory(historyData);
        if (targetConditions) checkAutomationRules(newData, targetConditions);
        checkThresholds(newData);
      } catch (error) {
        console.warn('Sensor API unavailable; waiting for the backend:', error);
      }
    };

    void syncSensorData();
    const interval = setInterval(() => void syncSensorData(), 3000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [targetConditions]);

  const checkAutomationRules = (data: SensorData, targets: TargetConditions) => {
    setAutomation(prev => ({
      ...prev,
      fan: data.envTemp > targets.tempRange[1],
      heater: data.envTemp < targets.tempRange[0],
      waterPump: data.soilMoisture < targets.moistureRange[0],
      humidifier: data.airHumidity < targets.humidityRange[0],
      growLight: data.lightIntensity < targets.lightRange[0]
    }));
  };

  const checkThresholds = (data: SensorData) => {
    // Example threshold check
    if (data.soilMoisture < 30) {
      addAlert({ type: 'warning', module: AppModule.DASHBOARD, message: 'Soil moisture critical (<30%)' });
    }
    if (data.envTemp > 35) {
      addAlert({ type: 'critical', module: AppModule.DASHBOARD, message: 'High Temp Alert! Check cooling.' });
    }
  };

  const addAlert = (alert: Omit<Alert, 'id' | 'timestamp' | 'isRead'>) => {
    // Avoid duplicate spam
    setAlerts(prev => {
      const isDuplicate = prev.some(a => a.message === alert.message && Date.now() - new Date(a.timestamp).getTime() < 60000);
      if (isDuplicate) return prev;
      
      const created = {
        ...alert,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        isRead: false
      };
      void createAlert(alert).catch(error => console.warn('Could not persist alert:', error));
      return [created, ...prev];
    });
  };

  const markAlertRead = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, isRead: true } : a));
    void markAlertReadApi(id).catch(error => console.warn('Could not persist alert state:', error));
  };

  const toggleAutomation = (key: keyof AutomationState) => {
    setAutomation(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <AppContext.Provider value={{
      currentData, history, alerts, unreadAlertCount: alerts.filter(a => !a.isRead).length,
      addAlert, markAlertRead, automation, toggleAutomation,
      targetConditions, setTargetConditions, activePlant, setActivePlant, userProfile, updateUserProfile
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
