
import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from 'recharts';
import { analyzeHistoricalTrends } from '../../services/geminiService';
import { HistoryInsight } from '../../types';
import { Calendar, Thermometer, Droplets, BrainCircuit, TrendingUp } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const HistoryView: React.FC = () => {
  const { history } = useApp(); // Uses global history (Module 4)
  const [insight, setInsight] = useState<HistoryInsight | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (history.length > 5) {
      setLoading(true);
      analyzeHistoricalTrends(history)
        .then(setInsight)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [history.length]);

  const chartData = history.map(d => ({
    time: new Date(d.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    envTemp: d.envTemp,
    humidity: d.airHumidity
  }));

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-green-400" />
            History & Logs (Module 4)
          </h2>
          <p className="text-slate-400 text-sm">Long-term storage visualized.</p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-emerald-900/50 to-slate-800 border-l-4 border-emerald-500 rounded-r-xl p-4 flex items-start gap-4 shadow-lg">
        <BrainCircuit className="w-6 h-6 text-emerald-400 mt-1" />
        <div>
          <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wide mb-1">AI Daily Summary</h3>
          {loading || !insight ? (
            <div className="h-5 w-64 bg-slate-700/50 rounded animate-pulse"></div>
          ) : (
            <p className="text-slate-200 font-medium italic">"{insight.summary}"</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 h-80">
          <h3 className="text-slate-200 font-bold mb-4">Temperature Trend</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="time" stroke="#64748b" fontSize={10} />
              <YAxis stroke="#64748b" fontSize={10} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b' }} />
              <Line type="monotone" dataKey="envTemp" stroke="#fb923c" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 h-80">
          <h3 className="text-slate-200 font-bold mb-4">Humidity Trend</h3>
          <ResponsiveContainer width="100%" height="100%">
             <AreaChart data={chartData}>
               <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
               <XAxis dataKey="time" stroke="#64748b" fontSize={10} />
               <YAxis stroke="#64748b" fontSize={10} />
               <Tooltip contentStyle={{ backgroundColor: '#1e293b' }} />
               <Area type="monotone" dataKey="humidity" stroke="#3b82f6" fillOpacity={0.3} />
             </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default HistoryView;
