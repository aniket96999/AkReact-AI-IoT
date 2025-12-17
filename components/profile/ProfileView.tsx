
import React, { useState } from 'react';
import { UserProfile, UserProfile as IUserProfile } from '../../types';
import UserProfileTab from './UserProfile';
import DeviceManager from './DeviceManager';
import PlantManager from './PlantManager';
import { User, Cpu, Sprout } from 'lucide-react';

const ProfileView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'user' | 'devices' | 'plants'>('user');
  
  // Lifted state for UserProfile to share if needed, or just keep it here
  const [userProfile, setUserProfile] = useState<IUserProfile>({
    name: 'Rishabh Gupta',
    role: 'Lead Agriculturist',
    farmName: 'Rishabh Farms',
    location: 'Punjab, India',
    email: 'rishabh@neev-agri.com',
    phone: '+91 98765 43210',
    image: '',
    language: 'English',
    accountType: 'Farmer',
    preferences: {
      notifications: true,
      units: 'metric',
      theme: 'dark',
      twoFactorEnabled: false
    }
  });

  return (
    <div className="min-h-full pb-10">
      {/* Profile Header Block */}
      <div className="bg-slate-800 border-b border-slate-700 px-6 py-6 mb-6 -mx-4 lg:-mx-8 lg:-mt-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center text-2xl font-bold text-white shadow-lg border-4 border-slate-700">
             RG
          </div>
          <div className="text-center md:text-left flex-1">
             <h1 className="text-2xl font-bold text-white">{userProfile.name}</h1>
             <p className="text-slate-400">{userProfile.farmName} • {userProfile.location}</p>
             <div className="flex flex-wrap gap-2 mt-2 justify-center md:justify-start">
               <span className="px-2 py-0.5 rounded text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30 font-medium">
                 {userProfile.accountType} Account
               </span>
               <span className="px-2 py-0.5 rounded text-xs bg-slate-700 text-slate-300 border border-slate-600">
                 {userProfile.language}
               </span>
             </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 mb-6 border-b border-slate-700 pb-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('user')}
          className={`px-4 py-2 rounded-t-lg font-medium text-sm flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'user' 
              ? 'bg-slate-800 text-green-400 border-t border-x border-slate-700' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <User className="w-4 h-4" /> User Profile
        </button>
        <button
          onClick={() => setActiveTab('plants')}
          className={`px-4 py-2 rounded-t-lg font-medium text-sm flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'plants' 
              ? 'bg-slate-800 text-green-400 border-t border-x border-slate-700' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Sprout className="w-4 h-4" /> My Farm & Analytics
        </button>
        <button
          onClick={() => setActiveTab('devices')}
          className={`px-4 py-2 rounded-t-lg font-medium text-sm flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'devices' 
              ? 'bg-slate-800 text-green-400 border-t border-x border-slate-700' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Cpu className="w-4 h-4" /> Device Manager
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-transparent min-h-[400px]">
        {activeTab === 'user' && (
          <UserProfileTab profile={userProfile} onUpdate={setUserProfile} />
        )}
        {activeTab === 'plants' && (
          <PlantManager />
        )}
        {activeTab === 'devices' && (
          <DeviceManager />
        )}
      </div>
    </div>
  );
};

export default ProfileView;
