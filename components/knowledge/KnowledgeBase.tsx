
import React, { useState } from 'react';
import { Search, Book, Sun, Droplets, Thermometer, Sprout, Loader2, CheckCircle } from 'lucide-react';
import { getPlantGuide } from '../../services/geminiService';
import { PlantGuide, TargetConditions } from '../../types';
import { useApp } from '../../context/AppContext';

const KnowledgeBase: React.FC = () => {
  const [query, setQuery] = useState('');
  const [guide, setGuide] = useState<PlantGuide | null>(null);
  const [loading, setLoading] = useState(false);
  const { setTargetConditions } = useApp();
  const [applied, setApplied] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setGuide(null);
    setApplied(false);
    try {
      const result = await getPlantGuide(query);
      setGuide(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const applyConfiguration = () => {
    if (!guide) return;
    
    // Parse guide strings to ranges if AI didn't provide strictly (Mocking parsing logic for robustness)
    const targets: TargetConditions = guide.parsedTargets || {
      tempRange: [20, 30],
      humidityRange: [50, 70],
      moistureRange: [40, 80],
      lightRange: [5000, 20000]
    };
    
    setTargetConditions(targets);
    setApplied(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-3xl font-bold text-slate-100">Agricultural Knowledge Engine</h2>
        <p className="text-slate-400">Module 3: Generates environmental recipes for Module 1 & 8.</p>
      </div>

      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What do you want to grow today?"
          className="w-full bg-slate-800 text-slate-100 border border-slate-700 rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-green-500 outline-none"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
        <button 
          type="submit"
          disabled={loading}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-green-600 hover:bg-green-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
        >
          {loading ? 'Thinking...' : 'Generate Recipe'}
        </button>
      </form>

      {guide && !loading && (
        <div className="space-y-6 animate-fade-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-900/40 to-slate-800 border border-green-500/20 rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">{guide.plantName}</h3>
              <div className="flex flex-wrap gap-4 mt-2">
                <div className="flex items-center gap-2 bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-700">
                  <Thermometer className="w-4 h-4 text-orange-400" />
                  <span className="text-sm text-slate-300">{guide.idealEnvironment.tempRange}</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-700">
                  <Droplets className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-slate-300">{guide.idealEnvironment.humidity}</span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={applyConfiguration}
              disabled={applied}
              className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${
                applied 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/50 cursor-default' 
                  : 'bg-green-600 hover:bg-green-500 text-white shadow-lg hover:shadow-green-500/20'
              }`}
            >
              {applied ? <CheckCircle className="w-5 h-5" /> : <Sprout className="w-5 h-5" />}
              {applied ? 'Configuration Applied' : 'Apply to System'}
            </button>
          </div>
          
          {applied && (
             <p className="text-center text-sm text-green-400 animate-fade-in">
               ✓ Target ranges updated in Module 1. Automation (Module 8) will now attempt to maintain these conditions.
             </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <h4 className="font-semibold text-lg text-slate-200 mb-4 flex items-center gap-2">
                <Book className="w-5 h-5 text-blue-400" /> Daily Care & Fertilizer
              </h4>
               <div className="space-y-4">
                <div>
                  <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Daily Tasks</h5>
                  <ul className="list-disc list-inside space-y-1 text-sm text-slate-300">
                    {guide.dailyCare.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KnowledgeBase;
