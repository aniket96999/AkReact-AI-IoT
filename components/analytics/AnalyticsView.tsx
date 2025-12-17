
import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area } from 'recharts';
import { analyzeSensorData } from '../../services/geminiService';
import { GrowthPrediction } from '../../types';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const AnalyticsView: React.FC = () => {
  const { history, currentData } = useApp(); // Module 4 & 1
  const [prediction, setPrediction] = useState<GrowthPrediction | null>(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (history.length > 0) {
      setLoading(true);
      // Analyze current data + recent history (Module 2)
      analyzeSensorData(currentData, history)
        .then(setPrediction)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [history.length]); // Re-run when history updates (every few min in real app, simulated fast here)

  // Chart Data: Take last 20 points
  const chartData = history.slice(-20).map(d => ({
    time: new Date(d.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second: '2-digit'}),
    moisture: d.soilMoisture,
    temp: d.envTemp,
    humidity: d.airHumidity
  }));

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-900/40 to-slate-800 border border-indigo-500/20 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          NEEV Growth Predictor (Module 2)
        </h2>
        {prediction && !loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            <div className="space-y-1">
              <span className="text-sm text-slate-400">Health Score</span>
              <div className="text-4xl font-bold text-green-400">{prediction.currentHealthScore}/100</div>
            </div>
            <div className="space-y-1">
              <span className="text-sm text-slate-400">Predicted Rate</span>
              <div className="text-xl font-semibold text-white">{prediction.predictedGrowthRate}</div>
            </div>
            <div className="space-y-1">
               <span className="text-sm text-slate-400">AI Summary</span>
               <p className="text-sm text-slate-300 leading-snug">{prediction.summary}</p>
            </div>
          </div>
        ) : (
          <p className="text-slate-400 animate-pulse mt-4">Analyzing real-time telemetry stream...</p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 h-80">
          <h3 className="text-slate-300 font-semibold mb-4">Real-time Soil Moisture</h3>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorMoisture" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickMargin={10} />
              <YAxis stroke="#64748b" fontSize={10} domain={[0, 100]} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f1f5f9' }} />
              <Area type="monotone" dataKey="moisture" stroke="#3b82f6" fillOpacity={1} fill="url(#colorMoisture)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 h-80">
           <h3 className="text-slate-300 font-semibold mb-4">Micro-Climate (Temp vs Humidity)</h3>
           <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickMargin={10} />
              <YAxis yAxisId="left" stroke="#f97316" fontSize={10} />
              <YAxis yAxisId="right" orientation="right" stroke="#06b6d4" fontSize={10} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f1f5f9' }} />
              <Line yAxisId="left" type="monotone" dataKey="temp" stroke="#f97316" dot={false} strokeWidth={2} />
              <Line yAxisId="right" type="monotone" dataKey="humidity" stroke="#06b6d4" dot={false} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
