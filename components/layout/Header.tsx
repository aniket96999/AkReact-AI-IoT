
import React from 'react';
import { AppModule } from '../../types';
import { useApp } from '../../context/AppContext';
import { Bell } from 'lucide-react';

interface HeaderProps {
  currentModule: AppModule;
  setModule: (m: AppModule) => void;
}

const Header: React.FC<HeaderProps> = ({ currentModule, setModule }) => {
  const { unreadAlertCount } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-700 px-4 lg:px-8 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold capitalize text-slate-200 flex items-center gap-2">
        {currentModule.toLowerCase().replace('_', ' ')}
      </h1>
      
      <div className="flex items-center gap-6">
        {/* Notification Bell */}
        <button 
          onClick={() => setModule(AppModule.ALERTS)}
          className="relative text-slate-400 hover:text-white transition-colors"
        >
          <Bell className="w-6 h-6" />
          {unreadAlertCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
              {unreadAlertCount}
            </span>
          )}
        </button>

        {/* User Profile Snippet */}
        <div className="flex items-center gap-4 border-l border-slate-700 pl-6">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-slate-200">Rishabh Gupta</p>
            <p className="text-xs text-slate-500">Rishabh Farms</p>
          </div>
          <div 
            className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center text-white font-bold cursor-pointer hover:opacity-90 transition-opacity border-2 border-slate-800"
            onClick={() => setModule(AppModule.PROFILE)}
          >
            RG
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
