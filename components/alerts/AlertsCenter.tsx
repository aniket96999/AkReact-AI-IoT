
import React from 'react';
import { useApp } from '../../context/AppContext';
import { AlertTriangle, CheckCircle, Info, Bell, Trash2 } from 'lucide-react';

const AlertsCenter: React.FC = () => {
  const { alerts, markAlertRead } = useApp();

  const getIcon = (type: string) => {
    switch(type) {
      case 'critical': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBg = (type: string) => {
    switch(type) {
      case 'critical': return 'bg-red-500/10 border-red-500/20';
      case 'warning': return 'bg-yellow-500/10 border-yellow-500/20';
      case 'success': return 'bg-green-500/10 border-green-500/20';
      default: return 'bg-slate-800 border-slate-700';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6">
         <div>
           <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
             <Bell className="w-6 h-6 text-slate-400" /> System Alerts (Module 7)
           </h2>
           <p className="text-slate-400 text-sm">Central notification hub collecting triggers from all modules.</p>
         </div>
      </div>

      <div className="space-y-4">
        {alerts.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>All systems nominal. No active alerts.</p>
          </div>
        ) : (
          alerts.map(alert => (
            <div 
              key={alert.id} 
              className={`flex gap-4 p-4 rounded-xl border ${getBg(alert.type)} relative transition-all`}
              onClick={() => markAlertRead(alert.id)}
            >
               <div className="mt-1">{getIcon(alert.type)}</div>
               <div className="flex-1">
                 <div className="flex justify-between items-start">
                   <h4 className={`font-bold text-sm uppercase mb-1 ${alert.isRead ? 'text-slate-500' : 'text-slate-200'}`}>
                     {alert.type} • {alert.module}
                   </h4>
                   <span className="text-xs text-slate-500">
                     {new Date(alert.timestamp).toLocaleTimeString()}
                   </span>
                 </div>
                 <p className={`text-sm ${alert.isRead ? 'text-slate-500' : 'text-slate-300'}`}>
                   {alert.message}
                 </p>
               </div>
               {!alert.isRead && (
                 <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
               )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AlertsCenter;
