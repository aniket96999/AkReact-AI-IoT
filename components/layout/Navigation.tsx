
import React from 'react';
import { LayoutDashboard, BrainCircuit, BookOpen, History, ScanLine, Sprout, UserCircle, Bell } from 'lucide-react';
import { AppModule } from '../../types';
import { useApp } from '../../context/AppContext';

interface NavigationProps {
  currentModule: AppModule;
  setModule: (m: AppModule) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentModule, setModule }) => {
  const { unreadAlertCount } = useApp();

  const navItems = [
    { id: AppModule.DASHBOARD, label: 'Monitor', icon: LayoutDashboard },
    { id: AppModule.ANALYTICS, label: 'AI Analytics', icon: BrainCircuit },
    { id: AppModule.DISEASE, label: 'Disease Doctor', icon: ScanLine },
    { id: AppModule.KNOWLEDGE, label: 'Knowledge Base', icon: BookOpen },
    { id: AppModule.HISTORY, label: 'History & Logs', icon: History },
    { id: AppModule.ALERTS, label: 'Alerts', icon: Bell, badge: unreadAlertCount },
    { id: AppModule.PROFILE, label: 'My Profile', icon: UserCircle },
  ];

  return (
    <aside className="w-20 lg:w-64 bg-slate-800 border-r border-slate-700 flex flex-col h-screen fixed left-0 top-0 z-50">
      <div className="h-16 flex items-center justify-center lg:justify-start lg:px-6 border-b border-slate-700 bg-slate-900">
        <Sprout className="w-8 h-8 text-green-400" />
        <span className="hidden lg:block ml-3 font-bold text-xl text-green-50 tracking-wide">NEEV</span>
      </div>
      
      <nav className="flex-1 py-6 flex flex-col gap-2 px-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = currentModule === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setModule(item.id)}
              className={`
                relative flex items-center p-3 rounded-lg transition-all duration-200 group
                ${isActive 
                  ? 'bg-green-600/20 text-green-400 border border-green-600/30' 
                  : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'}
              `}
            >
              <item.icon className={`w-6 h-6 shrink-0 ${isActive ? 'text-green-400' : ''}`} />
              <span className="hidden lg:block ml-3 font-medium text-sm">{item.label}</span>
              
              {/* Badge for Alerts */}
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute top-2 right-2 lg:top-auto lg:bottom-auto lg:right-3 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700 bg-slate-900">
        <div className="rounded-lg p-3 text-xs text-slate-500 hidden lg:block bg-slate-800/50 border border-slate-700">
          <p className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            System Online
          </p>
          <p className="mt-1 opacity-70">NodeMCU_cluster_01</p>
        </div>
      </div>
    </aside>
  );
};

export default Navigation;
