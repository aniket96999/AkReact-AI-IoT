
import { GoogleGenAI } from "@google/genai";
import { DiseaseAnalysis, PlantGuide, SensorData, GrowthPrediction, HistoryInsight, PlantProfile, PlantHealthInsight, TargetConditions } from "../types";

const apiKey = process.env.VITE_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to get Base64 from file
export const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const safeParseJSON = <T>(text: string): T => {
  try {
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanText) as T;
  } catch (error) {
    console.error("Failed to parse AI response as JSON:", text);
    throw new Error("AI response was not valid JSON");
  }
};

/**
 * MODULE 5: Disease Detection (Vision + Context)
 * Now accepts sensor data to rule out environmental stress vs actual pathogens.
 */
export const detectDisease = async (base64Image: string, mimeType: string, sensorContext?: SensorData): Promise<DiseaseAnalysis> => {
  const contextStr = sensorContext ? `
    Current Environmental Context:
    - Temp: ${sensorContext.envTemp}°C
    - Humidity: ${sensorContext.airHumidity}%
    - Moisture: ${sensorContext.soilMoisture}%
    - Light: ${sensorContext.lightIntensity} Lux
    Consider this context when diagnosing. (e.g., High humidity -> Fungal risk).
  ` : '';

  const prompt = `
    Analyze this plant image for diseases. 
    ${contextStr}
    Return a strictly valid JSON object. Do not include markdown.
    Structure:
    {
      "diseaseName": "string",
      "affectedPart": "leaf" | "stem" | "fruit" | "root",
      "severityScore": number (0-100),
      "confidenceScore": number (0-100),
      "stage": "Early" | "Moderate" | "Severe",
      "isRecoverable": boolean,
      "organicSolutions": ["string"],
      "chemicalSolutions": ["string"],
      "preventiveMeasures": ["string"],
      "safetyWarnings": ["string"],
      "next7DaysPlan": ["string"]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { inlineData: { mimeType, data: base64Image } },
          { text: prompt }
        ]
      },
      config: { responseMimeType: 'application/json' }
    });

    if (!response.text) throw new Error("No response from AI");
    return safeParseJSON<DiseaseAnalysis>(response.text);
  } catch (error) {
    console.error("Disease Detection Error:", error);
    throw error;
  }
};

/**
 * MODULE 3: Knowledge AI
 * Generates environment recipe
 */
export const getPlantGuide = async (userQuery: string): Promise<PlantGuide> => {
  const prompt = `
    Create a detailed growing guide for: "${userQuery}".
    Return strictly valid JSON.
    Structure:
    {
      "plantName": "string",
      "idealEnvironment": { "tempRange": "string (e.g. 20-25)", "humidity": "string (e.g. 50-60)", "light": "string", "soil": "string" },
      "parsedTargets": { 
          "tempRange": [min, max], 
          "humidityRange": [min, max], 
          "moistureRange": [min, max],
          "lightRange": [min, max]
       },
      "fertilizerSchedule": ["string"],
      "dailyCare": ["string"],
      "stages": [{ "stage": "string", "description": "string" }],
      "companionPlants": ["string"]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });

    if (!response.text) throw new Error("No response from AI");
    return safeParseJSON<PlantGuide>(response.text);
  } catch (error) {
    console.error("Knowledge AI Error:", error);
    throw error;
  }
};

/**
 * MODULE 2: Analytics
 */
export const analyzeSensorData = async (data: SensorData, history: SensorData[]): Promise<GrowthPrediction> => {
  // Sample history to keep payload small
  const historySample = history.slice(-5); 
  
  const prompt = `
    Analyze this sensor data.
    Current: ${JSON.stringify(data)}
    Recent Trend (Last 5 hrs): ${JSON.stringify(historySample)}
    
    Provide health scores.
    Return strictly valid JSON.
    Structure:
    {
      "currentHealthScore": number (0-100),
      "predictedGrowthRate": "string (Slow, Optimal, Fast)",
      "stressFactors": ["string"],
      "nutrientDeficiencies": ["string"],
      "summary": "string"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });

    if (!response.text) throw new Error("No response from AI");
    return safeParseJSON<GrowthPrediction>(response.text);
  } catch (error) {
    console.error("Analytics Error:", error);
    throw error;
  }
};

/**
 * MODULE 4: History
 */
export const analyzeHistoricalTrends = async (history: SensorData[]): Promise<HistoryInsight> => {
  const sampledData = history.filter((_, i) => i % Math.ceil(history.length / 20) === 0);

  const prompt = `
    Analyze historical data.
    Data: ${JSON.stringify(sampledData)}
    Structure JSON:
    {
      "summary": "Simple sentence summary.",
      "temperature": { "trend": "string", "meaning": "string", "concerns": "string", "recommendation": "string" },
      "humidity": { "trend": "string", "meaning": "string", "concerns": "string", "recommendation": "string" }
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });
    return safeParseJSON<HistoryInsight>(response.text || "{}");
  } catch (error) {
    return {
      summary: "Analysis unavailable.",
      temperature: { trend: "N/A", meaning: "N/A", concerns: "N/A", recommendation: "N/A" },
      humidity: { trend: "N/A", meaning: "N/A", concerns: "N/A", recommendation: "N/A" }
    };
  }
};

/**
 * MODULE 6: Plant Profile
 */
export const analyzePlantHealth = async (plant: PlantProfile, recentData: SensorData): Promise<PlantHealthInsight> => {
  const prompt = `
    Analyze plant health: ${plant.name} (${plant.growthStage}).
    Environment: Moisture ${recentData.soilMoisture}%, Temp ${recentData.envTemp}C.
    Structure JSON:
    {
      "wateringAdvice": "string",
      "fertilizerAdvice": "string",
      "sunlightAdvice": "string",
      "growthStageAdvice": "string",
      "stressWarnings": ["string"],
      "careSummary": "string"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });
    return safeParseJSON<PlantHealthInsight>(response.text || "{}");
  } catch (error) {
    throw error;
  }
}
