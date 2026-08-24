
import React, { useState } from 'react';
import { UserProfile, Language, AccountType } from '../../types';
import { Save, User, MapPin, Mail, Phone, Globe, Shield, Lock, LogOut } from 'lucide-react';

interface UserProfileProps {
  profile: UserProfile;
  onUpdate: (p: UserProfile) => void;
}

const UserProfileTab: React.FC<UserProfileProps> = ({ profile, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState<UserProfile>(profile);

  const handleSave = () => {
    onUpdate(tempProfile);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <User className="w-5 h-5 text-green-400" /> My Profile
        </h3>
        <button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm ${
            isEditing 
            ? 'bg-green-600 hover:bg-green-500 text-white' 
            : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
          }`}
        >
          {isEditing ? <Save className="w-4 h-4" /> : null}
          {isEditing ? 'Save Changes' : 'Edit Details'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Details */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-4">
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-4 border-b border-slate-700 pb-2">
            Personal Information
          </h4>
          
          <div className="space-y-2">
            <label className="text-xs text-slate-500 font-bold">Full Name</label>
            <input
              type="text"
              disabled={!isEditing}
              value={tempProfile.name}
              onChange={(e) => setTempProfile({...tempProfile, name: e.target.value})}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:border-green-500 outline-none disabled:opacity-50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs text-slate-500 font-bold">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  disabled={!isEditing}
                  value={tempProfile.email}
                  onChange={(e) => setTempProfile({...tempProfile, email: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-slate-200 focus:border-green-500 outline-none disabled:opacity-50"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs text-slate-500 font-bold">Mobile</label>
               <div className="relative">
                <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="tel"
                  disabled={!isEditing}
                  value={tempProfile.phone}
                  onChange={(e) => setTempProfile({...tempProfile, phone: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-slate-200 focus:border-green-500 outline-none disabled:opacity-50"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-slate-500 font-bold">Address / Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                disabled={!isEditing}
                value={tempProfile.location}
                onChange={(e) => setTempProfile({...tempProfile, location: e.target.value})}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-slate-200 focus:border-green-500 outline-none disabled:opacity-50"
              />
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-4">
           <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-4 border-b border-slate-700 pb-2">
            Account Settings
          </h4>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs text-slate-500 font-bold">Language</label>
              <div className="relative">
                <Globe className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <select
                  disabled={!isEditing}
                  value={tempProfile.language}
                  onChange={(e) => setTempProfile({...tempProfile, language: e.target.value as Language})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-slate-200 focus:border-green-500 outline-none disabled:opacity-50 appearance-none"
                >
                  <option>English</option>
                  <option>Hindi</option>
                  <option>Marathi</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs text-slate-500 font-bold">Account Type</label>
              <select
                disabled={!isEditing}
                value={tempProfile.accountType}
                onChange={(e) => setTempProfile({...tempProfile, accountType: e.target.value as AccountType})}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:border-green-500 outline-none disabled:opacity-50"
              >
                <option>Farmer</option>
                <option>Agriculture Officer</option>
                <option>Admin</option>
              </select>
            </div>
          </div>

           <div className="pt-4 mt-4 border-t border-slate-700 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-slate-200 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-400" /> Two-Factor Authentication
                  </span>
                  <span className="text-xs text-slate-500">Secure your account with 2FA</span>
                </div>
                <button
                   onClick={() => isEditing && setTempProfile({...tempProfile, preferences: {...tempProfile.preferences, twoFactorEnabled: !tempProfile.preferences.twoFactorEnabled}})}
                   disabled={!isEditing}
                   className={`relative w-11 h-6 rounded-full transition-colors ${tempProfile.preferences.twoFactorEnabled ? 'bg-green-600' : 'bg-slate-600'}`}
                >
                  <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${tempProfile.preferences.twoFactorEnabled ? 'translate-x-5' : ''}`}></span>
                </button>
              </div>

               <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-slate-200 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-blue-400" /> Change Password
                  </span>
                  <span className="text-xs text-slate-500">Last changed: 30 days ago</span>
                </div>
                <button disabled={!isEditing} className="text-xs bg-slate-700 hover:bg-slate-600 text-white px-3 py-1 rounded disabled:opacity-50">
                  Update
                </button>
              </div>
           </div>
        </div>
      </div>
      
      <div className="flex justify-end pt-4">
        <button className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm font-medium transition-colors">
          <LogOut className="w-4 h-4" /> Sign Out from All Devices
        </button>
      </div>
    </div>
  );
};

export default UserProfileTab;
