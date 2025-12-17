import { SensorData } from '../types';

/**
 * In a real-world scenario, this service would connect to an MQTT broker
 * or a WebSocket server to receive real-time ESP8266 data.
 * 
 * For this architecture, we simulate the hardware stream.
 */

// Helper to generate random variance for demo purposes
const vary = (base: number, variance: number) => {
  return parseFloat((base + (Math.random() * variance * 2 - variance)).toFixed(1));
};

export const generateMockSensorData = (): SensorData => {
  return {
    timestamp: new Date().toISOString(),
    nitrogen: vary(140, 10),
    phosphorus: vary(45, 5),
    potassium: vary(200, 15),
    soilMoisture: vary(65, 5),
    airHumidity: vary(55, 3),
    soilTemp: vary(22, 1),
    envTemp: vary(24, 2),
    lightIntensity: Math.floor(vary(12000, 500)),
  };
};

export const getHistoricalData = (days: number): SensorData[] => {
  const history: SensorData[] = [];
  const now = new Date();
  for (let i = 0; i < days * 24; i++) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000); // Hourly data
    history.push({
      ...generateMockSensorData(),
      timestamp: time.toISOString(),
    });
  }
  return history.reverse();
};