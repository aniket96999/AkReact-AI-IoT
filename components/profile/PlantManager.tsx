
import React, { useState } from 'react';
import { PlantProfile, GrowthStage, PlantHealthInsight, SensorData } from '../../types';
import { Sprout, Droplets, Sun, Thermometer, Info, Activity, AlertTriangle, ChevronRight, Wind } from 'lucide-react';
import { generateMockSensorData, getHistoricalData } from '../../services/mockHardwareService';
import { analyzePlantHealth } from '../../services/geminiService';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const MOCK_PLANTS: PlantProfile[] = [
  {
    id: 'p1',
    name: 'Roma Tomato',
    category: 'Vegetable',
    plantationDate: '2023-11-15',
    soilType: 'Loamy',
    wateringPreference: 'Morning',
    sunlightRequirement: 'High (6-8 hrs)',
    fertilizerUsed: 'NPK 10-10-10',
    growthStage: 'Fruiting'
  },
  {
    id: 'p2',
    name: 'Sweet Basil',
    category: 'Herb',
    plantationDate: '2024-01-10',
    soilType: 'Potting Mix',
    wateringPreference: 'When dry',
    sunlightRequirement: 'Moderate',
    fertilizerUsed: 'Organic Compost',
    growthStage: 'Vegetative'
  }
];

const PlantManager: React.FC = () => {
  const [plants] = useState<PlantProfile[]>(MOCK_PLANTS);
  const [selectedPlant, setSelectedPlant] = useState<PlantProfile | null>(null);
  const [insight, setInsight] = useState<PlantHealthInsight | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);

  // Generate some local mock history for the graphs
  const historyData = getHistoricalData(3); // 3 days
  const chartData = historyData.filter((_, i) => i % 6 === 0).map(d => ({
    time: new Date(d.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
    ...d
  }));

  const handleSelectPlant = async (plant: PlantProfile) => {
    setSelectedPlant(plant);
    setInsight(null);
    setLoadingInsight(true);
    
    // Simulate getting recent data
    const recentData = generateMockSensorData();
    try {
      const result = await analyzePlantHealth(plant, recentData);
      setInsight(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingInsight(false);
    }
  };

  if (selectedPlant) {
    return (
      <div className="space-y-6 animate-fade-in">
        <button onClick={() => setSelectedPlant(null)} className="text-slate-400 hover:text-white flex items-center gap-1 text-sm mb-2">
           ← Back to Plant List
        </button>
        
        {/* Plant Header */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 flex flex-col md:flex-row justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-white">{selectedPlant.name}</h2>
              <span className="px-2 py-0.5 bg-green-500/20 text-green-400 border border-green-500/30 rounded text-xs font-bold uppercase">
                {selectedPlant.category}
              </span>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-slate-400">
               <span className="flex items-center gap-1"><Sprout className="w-4 h-4 text-green-500"/> {selectedPlant.growthStage} Stage</span>
               <span>Plantation: {selectedPlant.plantationDate}</span>
               <span>Soil: {selectedPlant.soilType}</span>
            </div>
          </div>
          <div className="flex gap-2">
             <div className="text-right">
                <span className="block text-xs text-slate-500 uppercase font-bold">Health Status</span>
                <span className="text-green-400 font-bold flex items-center justify-end gap-1">
                  <Activity className="w-4 h-4" /> Good
                </span>
             </div>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="bg-gradient-to-r from-indigo-900/40 to-slate-800 border border-indigo-500/20 rounded-xl p-6 relative overflow-hidden">
           <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
             <Info className="w-5 h-5 text-indigo-400" /> AI Care Recommendations
           </h3>
           
           {loadingInsight ? (
             <div className="flex items-center gap-2 text-slate-400 animate-pulse py-4">
               <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
               Analyzing {selectedPlant.name} profile and environment...
             </div>
           ) : insight ? (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-4">
                  <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                    <h4 className="text-xs font-bold text-blue-400 uppercase mb-1">Watering</h4>
                    <p className="text-sm text-slate-300">{insight.wateringAdvice}</p>
                  </div>
                   <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                    <h4 className="text-xs font-bold text-orange-400 uppercase mb-1">Fertilizer</h4>
                    <p className="text-sm text-slate-300">{insight.fertilizerAdvice}</p>
                  </div>
               </div>
               <div className="space-y-4">
                   <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                    <h4 className="text-xs font-bold text-yellow-400 uppercase mb-1">Sunlight</h4>
                    <p className="text-sm text-slate-300">{insight.sunlightAdvice}</p>
                  </div>
                   <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                    <h4 className="text-xs font-bold text-green-400 uppercase mb-1">Growth Stage Tips</h4>
                    <p className="text-sm text-slate-300">{insight.growthStageAdvice}</p>
                  </div>
               </div>
               {insight.stressWarnings.length > 0 && (
                 <div className="md:col-span-2 bg-red-500/10 border border-red-500/20 p-3 rounded-lg flex items-start gap-3">
                   <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                   <div>
                     <h4 className="text-sm font-bold text-red-400">Stress Warnings Detected</h4>
                     <ul className="list-disc list-inside text-xs text-red-300 mt-1">
                       {insight.stressWarnings.map((w, i) => <li key={i}>{w}</li>)}
                     </ul>
                   </div>
                 </div>
               )}
             </div>
           ) : (
             <p className="text-slate-400 text-sm">Select 'Refresh Analysis' to generate new insights.</p>
           )}
        </div>

        {/* Analytics Summary - Graphs */}
        <div>
           <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
             <Activity className="w-5 h-5 text-green-400" /> Analytics Summary
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Temp Graph */}
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
                 <h4 className="text-xs font-bold text-orange-400 mb-2 flex items-center gap-1"><Thermometer className="w-3 h-3"/> Temperature (°C)</h4>
                 <div className="h-40">
                   <ResponsiveContainer width="100%" height="100%">
                     <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="time" hide />
                        <YAxis stroke="#64748b" fontSize={10} width={25} />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', color: '#fff', fontSize: '12px' }} />
                        <Line type="monotone" dataKey="envTemp" stroke="#f97316" strokeWidth={2} dot={false} />
                     </LineChart>
                   </ResponsiveContainer>
                 </div>
                 <p className="text-xs text-slate-500 mt-2">Pattern: Stable with minor PM peaks.</p>
              </div>

               {/* Humidity Graph */}
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
                 <h4 className="text-xs font-bold text-blue-400 mb-2 flex items-center gap-1"><Wind className="w-3 h-3"/> Humidity (%)</h4>
                 <div className="h-40">
                   <ResponsiveContainer width="100%" height="100%">
                     <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="time" hide />
                        <YAxis stroke="#64748b" fontSize={10} width={25} />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', color: '#fff', fontSize: '12px' }} />
                        <Line type="monotone" dataKey="airHumidity" stroke="#3b82f6" strokeWidth={2} dot={false} />
                     </LineChart>
                   </ResponsiveContainer>
                 </div>
                 <p className="text-xs text-slate-500 mt-2">Pattern: High morning moisture levels.</p>
              </div>

              {/* Moisture Graph */}
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
                 <h4 className="text-xs font-bold text-cyan-400 mb-2 flex items-center gap-1"><Droplets className="w-3 h-3"/> Soil Moisture (%)</h4>
                 <div className="h-40">
                   <ResponsiveContainer width="100%" height="100%">
                     <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="time" hide />
                        <YAxis stroke="#64748b" fontSize={10} width={25} />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', color: '#fff', fontSize: '12px' }} />
                        <Line type="monotone" dataKey="soilMoisture" stroke="#22d3ee" strokeWidth={2} dot={false} />
                     </LineChart>
                   </ResponsiveContainer>
                 </div>
                 <p className="text-xs text-slate-500 mt-2">Recommendation: Irrigate tomorrow.</p>
              </div>

               {/* Sunlight Graph */}
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
                 <h4 className="text-xs font-bold text-yellow-400 mb-2 flex items-center gap-1"><Sun className="w-3 h-3"/> Sunlight (Lux)</h4>
                 <div className="h-40">
                   <ResponsiveContainer width="100%" height="100%">
                     <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="time" hide />
                        <YAxis stroke="#64748b" fontSize={10} width={35} />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', color: '#fff', fontSize: '12px' }} />
                        <Line type="monotone" dataKey="lightIntensity" stroke="#eab308" strokeWidth={2} dot={false} />
                     </LineChart>
                   </ResponsiveContainer>
                 </div>
                 <p className="text-xs text-slate-500 mt-2">Exposure: Optimal for vegetative growth.</p>
              </div>

           </div>
        </div>

      </div>
    );
  }

  // Plant List View
  return (
    <div className="space-y-6 animate-fade-in">
       <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Sprout className="w-5 h-5 text-green-400" /> My Plants
        </h3>
        <button className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium text-sm">
          + Add Crop
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plants.map(plant => (
          <div 
            key={plant.id} 
            onClick={() => handleSelectPlant(plant)}
            className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-green-500/50 cursor-pointer transition-all hover:-translate-y-1 group"
          >
             <div className="flex justify-between items-start mb-4">
               <div>
                 <h4 className="font-bold text-lg text-white group-hover:text-green-400 transition-colors">{plant.name}</h4>
                 <p className="text-sm text-slate-500">{plant.category}</p>
               </div>
               <span className="p-2 bg-slate-900 rounded-lg text-slate-400">
                 <ChevronRight className="w-4 h-4" />
               </span>
             </div>
             <div className="space-y-2 text-sm text-slate-400">
               <div className="flex justify-between">
                 <span>Stage:</span>
                 <span className="text-slate-200">{plant.growthStage}</span>
               </div>
               <div className="flex justify-between">
                 <span>Planted:</span>
                 <span className="text-slate-200">{plant.plantationDate}</span>
               </div>
             </div>
             <div className="mt-4 pt-4 border-t border-slate-700 flex justify-between items-center">
                <span className="text-xs text-green-400 font-medium bg-green-900/20 px-2 py-1 rounded">Active Monitor</span>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlantManager;
