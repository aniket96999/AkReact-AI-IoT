
import React, { useState, useRef } from 'react';
import { Camera, AlertTriangle, CheckCircle, XCircle, Beaker, Loader2 } from 'lucide-react';
import { DiseaseAnalysis } from '../../types';
import { detectDisease, fileToGenerativePart } from '../../services/geminiService';
import { useApp } from '../../context/AppContext';

const DiseaseDetector: React.FC = () => {
  const { currentData } = useApp(); // Access Module 1 data
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<DiseaseAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setAnalysis(null);
    setError(null);
    setLoading(true);

    try {
      const base64Data = await fileToGenerativePart(file);
      // Passing current sensor context to AI (Module 1 -> Module 5 connection)
      const result = await detectDisease(base64Data, file.type, currentData);
      setAnalysis(result);
    } catch (err) {
      setError("Failed to analyze image..");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-1/3 space-y-4">
        <h2 className="text-2xl font-bold text-slate-100">Disease Doctor</h2>
        <p className="text-slate-400 text-sm">Upload a photo. We use your current environmental sensors to improve diagnosis accuracy.</p>
        
        <div className="bg-slate-800 border-2 border-dashed border-slate-600 rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors hover:border-green-500/50 hover:bg-slate-800/50">
          {imagePreview ? (
            <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-4">
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              <button 
                onClick={() => { setImagePreview(null); setAnalysis(null); }}
                className="absolute top-2 right-2 bg-slate-900/80 p-1 rounded-full text-white hover:bg-red-500 transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="space-y-4">
               <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <Camera className="w-8 h-8" />
              </div>
              <div>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg font-medium transition-all"
                >
                  Upload Photo
                </button>
              </div>
            </div>
          )}
          <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" className="hidden" />
        </div>

        {loading && (
          <div className="bg-slate-800 rounded-xl p-6 text-center animate-pulse border border-slate-700">
            <Loader2 className="w-8 h-8 text-green-400 mx-auto animate-spin mb-3" />
            <h3 className="text-slate-200 font-medium">Analyzing with Context...</h3>
            <p className="text-xs text-slate-500 mt-1">Correlating visual data with sensors (Temp: {currentData.envTemp}°C, Humidity: {currentData.airHumidity}%)</p>
          </div>
        )}
      </div>

      <div className="w-full lg:w-2/3">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg flex items-center gap-3">
            <AlertTriangle className="w-5 h-5" />
            {error}
          </div>
        )}

        {analysis && !loading && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="text-sm text-slate-400 uppercase tracking-wide">Diagnosis Result</h3>
                <h1 className="text-3xl font-bold text-white mt-1">{analysis.diseaseName}</h1>
                <div className="flex items-center gap-2 mt-2">
                   <span className={`px-2 py-0.5 rounded text-xs font-bold border 
                      ${analysis.severityScore > 70 ? 'bg-red-500/20 text-red-400 border-red-500/30' : 
                        analysis.severityScore > 40 ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : 
                        'bg-green-500/20 text-green-400 border-green-500/30'}`}>
                      Severity: {analysis.severityScore}%
                   </span>
                   <span className="text-xs text-slate-500">Confidence: {analysis.confidenceScore}%</span>
                </div>
              </div>
              <div className="text-right">
                <span className={`inline-block px-4 py-1 rounded-full text-sm font-semibold 
                  ${analysis.isRecoverable ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {analysis.isRecoverable ? 'Recoverable' : 'Critical Condition'}
                </span>
                <p className="text-xs text-slate-400 mt-1">Stage: {analysis.stage}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                <h3 className="font-semibold text-lg text-green-400 mb-4 flex items-center gap-2">
                  <Beaker className="w-5 h-5" /> Recommended Treatment
                </h3>
                
                <div className="mb-4">
                  <h4 className="text-sm font-bold text-slate-300 mb-2">Organic Solutions</h4>
                  <ul className="space-y-1">
                    {analysis.organicSolutions.map((sol, idx) => (
                      <li key={idx} className="text-sm text-slate-400 flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                        {sol}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                 <h3 className="font-semibold text-lg text-blue-400 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" /> 7-Day Action Plan
                </h3>
                <div className="space-y-3">
                  {analysis.next7DaysPlan.map((step, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 border border-slate-600">
                          {idx + 1}
                        </div>
                        {idx !== analysis.next7DaysPlan.length - 1 && <div className="w-0.5 h-full bg-slate-700 my-1"></div>}
                      </div>
                      <p className="text-sm text-slate-300 py-0.5">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiseaseDetector;
