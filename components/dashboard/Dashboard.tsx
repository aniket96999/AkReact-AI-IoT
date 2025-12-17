
import React from 'react';
import { useMQTT } from '../hooks/useMQTT';
import { Droplets, Thermometer, Sun, Wind, Leaf, Activity, Zap, Power } from 'lucide-react';
import SensorCard from './SensorCard';
import { useApp } from '../../context/AppContext';


const devices = [
  { key: 'waterPump', label: 'Water Pump', icon: Droplets, color: 'text-blue-400', mqttId: 'D1' },
  { key: 'fan', label: 'Exhaust Fan', icon: Wind, color: 'text-slate-400', mqttId: 'D2' },
  { key: 'growLight', label: 'Grow Lights', icon: Sun, color: 'text-yellow-400', mqttId: 'D3' },
  { key: 'heater', label: 'Heater', icon: Thermometer, color: 'text-red-400', mqttId: 'D4' },
];



const Dashboard: React.FC = () => {

  const { publish, connected } = useMQTT(); // add MQTT hook

  const { currentData, automation, toggleAutomation, targetConditions } = useApp();
  
  const handleToggle = (key: string, mqttId: string) => {
    toggleAutomation(key as keyof typeof automation);

    // Send MQTT command
    const newState = !automation[key as keyof typeof automation];
    const msg = `${mqttId}_${newState ? "1" : "0"}`;
    publish(msg);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Module 1: Live Monitoring */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SensorCard
          label="Soil Moisture"
          value={currentData.soilMoisture}
          unit="%"
          icon={Droplets}
          color={targetConditions && (currentData.soilMoisture < targetConditions.moistureRange[0] || currentData.soilMoisture > targetConditions.moistureRange[1]) ? 'red' : 'blue'}
        />
        <SensorCard
          label="Sunlight"
          value={currentData.lightIntensity}
          unit="Lux"
          icon={Sun}
          color={targetConditions && currentData.lightIntensity < targetConditions.lightRange[0] ? 'yellow' : 'yellow'}
        />
        <SensorCard
          label="Air Temp"
          value={currentData.envTemp}
          unit="°C"
          icon={Thermometer}
          color={targetConditions && (currentData.envTemp > targetConditions.tempRange[1]) ? 'red' : 'orange'}
        />
        <SensorCard
          label="Humidity"
          value={currentData.airHumidity}
          unit="%"
          icon={Wind}
          color="blue"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Module 8: Automation Control */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              Automation
            </h3>
            <span className="text-xs text-slate-500">Control your Nodes</span>
          </div>

          <div className="space-y-3">
            {devices.map(item => (
              <div key={item.key} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-700/50">
                <div className="flex items-center gap-3">
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                  <span className="text-sm font-medium text-slate-200">{item.label}</span>
                </div>
                <button
                  onClick={() => handleToggle(item.key, item.mqttId)}
                  className={`w-10 h-5 rounded-full relative transition-colors ${automation[item.key as keyof typeof automation] ? 'bg-green-500' : 'bg-slate-600'}`}
                >
                  <span className={`absolute top-1 left-1 bg-white w-3 h-3 rounded-full transition-transform ${automation[item.key as keyof typeof automation] ? 'translate-x-5' : ''}`}></span>
                </button>
              </div>
            ))}

          
        </div>
      </div>

      {/* Soil Nutrients (NPK) */}
      <div className="lg:col-span-2 bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
          <Leaf className="w-5 h-5 text-green-400" />
          Soil Nutrient Composition (NPK)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full items-center">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Nitrogen (N)</span>
              <span className="text-green-400 font-bold">{currentData.nitrogen} mg/kg</span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 transition-all duration-1000" style={{ width: `${(currentData.nitrogen / 200) * 100}%` }}></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Phosphorus (P)</span>
              <span className="text-blue-400 font-bold">{currentData.phosphorus} mg/kg</span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${(currentData.phosphorus / 100) * 100}%` }}></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Potassium (K)</span>
              <span className="text-orange-400 font-bold">{currentData.potassium} mg/kg</span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-orange-500 transition-all duration-1000" style={{ width: `${(currentData.potassium / 300) * 100}%` }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div >
  );
};

export default Dashboard;
