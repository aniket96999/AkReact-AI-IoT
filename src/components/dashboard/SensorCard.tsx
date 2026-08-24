import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SensorCardProps {
  label: string;
  value: number;
  unit: string;
  icon: LucideIcon;
  color: 'green' | 'blue' | 'yellow' | 'red' | 'orange';
  trend?: 'up' | 'down' | 'stable';
}

const SensorCard: React.FC<SensorCardProps> = ({ label, value, unit, icon: Icon, color }) => {
  const colorMap = {
    green: 'bg-green-500/10 text-green-400 border-green-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    yellow: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    red: 'bg-red-500/10 text-red-400 border-red-500/20',
    orange: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  };

  return (
    <div className={`rounded-xl border p-4 ${colorMap[color]} backdrop-blur-sm transition-transform hover:scale-[1.02]`}>
      <div className="flex justify-between items-start mb-2">
        <div className="p-2 rounded-lg bg-slate-900/40">
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-xs font-semibold uppercase tracking-wider opacity-70">{label}</span>
      </div>
      <div className="flex items-end items-baseline">
        <span className="text-3xl font-bold">{value}</span>
        <span className="ml-1 text-sm font-medium opacity-70">{unit}</span>
      </div>
    </div>
  );
};

export default SensorCard;